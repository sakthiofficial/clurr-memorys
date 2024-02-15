import bcrypt from "bcrypt";
import {
  ApiResponse,
  RESPONSE_MESSAGE,
  RESPONSE_STATUS,
  projectNames,
} from "../appConstants";
import { CpAppProject } from "../../models/AppProject";
import {
  basicRolePermission,
  isPriorityUser,
  userDataObj,
} from "../../shared/roleManagement";
import { CpAppCompany } from "../../models/AppCompany";
// dont remove this schema
import { CpAppUser } from "../../models/AppUser";
import initDb from "../lib/db";
import { permissionKeyNames, roleNames } from "../../shared/cpNamings";
import sendMail from "../helper/emailSender";
import { CpAppRole } from "../../models/AppRole";
import CPUserSrv from "./cpUserSrv";
import {
  cpMailOption,
  superAdminMailOptions,
} from "../helper/email/mailOptions";
import ActivitySrv from "./activitySrv";
import { activityActionTypes } from "@/helper/serviceConstants";

class CpManagementSrv {
  constructor() {
    this.createCpCompany = async (cpCampanyData, providedUser) => {
      //   validation project & parentInd
      const errorMsg = {
        userExist: "user already exist",
        inValidProject: "invalid project deatils",
        userNotExist: "user not found",
      };
      const userSrv = new CPUserSrv();
      const parentUser = await userSrv.getUserById(
        cpCampanyData[userDataObj?.parentId],
      );

      if (!parentUser) {
        throw errorMsg?.userNotExist;
      }
      const projects = await CpAppProject.find({
        name: { $in: parentUser[userDataObj?.projects] },
      });
      const projectIds = projects.map((project) => project?._id);
      cpCampanyData[userDataObj?.projects] = projectIds;
      if (projects.length !== parentUser[userDataObj?.projects].length) {
        throw errorMsg?.inValidProject;
      }
      const cpCompanyDb = await CpAppCompany.findOne({
        name: cpCampanyData?.name,
      });
      if (cpCompanyDb) {
        throw errorMsg?.userExist;
      }
      const cpCompanySch = new CpAppCompany(cpCampanyData);
      const cpCompanyResult = await cpCompanySch.save();
      // const activitySrv = new ActivitySrv();
      // await activitySrv.createActivity(
      //   activityActionTypes?.cpAdded,
      //   cpCompanyResult._id,
      //   providedUser?._id,
      // );
      return cpCompanyResult._id;
    };
    this.validateCp = (parent, newUser) => {
      const result = (newUser[userDataObj?.projects] || []).filter(
        (userProject) => {
          return parent[userDataObj?.projects].includes(userProject);
        },
      );
      return result.length === newUser[userDataObj?.projects].length;
    };
    this.createCpBranchHead = async (user, parentId, providedUser, cpCode) => {
      const userSrv = new CPUserSrv();
      const parentUser = await userSrv.getUserById(parentId);
      if (!parentUser) {
        return false;
      }
      const userSch = new CpAppUser(user);
      const result = await userSch.save();
      const activityService = new ActivitySrv();

      await activityService.createActivity(
        activityActionTypes?.cpAdded,

        providedUser[userDataObj?.name],

        providedUser?._id,
        user[userDataObj?.name],
        result._id,
      );
      const mailOptions = cpMailOption(
        user[userDataObj?.name],
        providedUser[userDataObj?.name],
        user[userDataObj?.email],
        roleNames?.cpBranchHead,
        projectNames?.balanagar,
        cpCode,
      );
      const adminMaliOption = superAdminMailOptions(
        providedUser[userDataObj?.name],
        user[userDataObj?.name],

        roleNames?.cpBranchHead,

        basicRolePermission(roleNames?.cpBranchHead),
        projectNames?.balanagar,
      );
      sendMail(mailOptions)
        .then(async () => {
          await sendMail(adminMaliOption);
          console.log("Emails as been successfully");
        })
        .catch((error) => console.log(error.message));
      return result;
    };
    this.genrateCompanyCode = async (code) => {
      if (code) {
        code = String(code);
        const companyCode = "URHCP";

        let cpCode = `${companyCode}${code.padStart(5, "0")}`;
        const codeCheck = await CpAppCompany.findOne({ cpCode });
        console.log("codeCheck", codeCheck);
        if (codeCheck) {
          cpCode = await this.genrateCompanyCode(
            typeof code === "number" ? code + 1 : +code + 1,
          );
        }
        return cpCode;
      }
      let lastCode = await CpAppCompany.findOne(
        {},
        { cpCode: 1 },
        { sort: { _id: -1 } },
      ).lean();
      if (!lastCode) {
        return "URHCP00001";
      }

      lastCode = lastCode.cpCode;

      const lastNumber = parseInt(lastCode.replace(/\D/g, ""), 10);
      const result = await this.genrateCompanyCode(lastNumber);
      return result;
    };
    this.retriveBranchHead = async (providedUser) => {
      if (
        !providedUser[userDataObj?.permissions].includes(
          permissionKeyNames?.leadManagement,
        )
      ) {
        return new ApiResponse(
          RESPONSE_STATUS?.UNAUTHORIZED,
          RESPONSE_MESSAGE?.UNAUTHORIZED,
          null,
        );
      }
      const companies = await CpAppCompany.find().populate("branchHeadId");
      const cpCompanyBranchHead = (companies || [])
        .map((company) => {
          const { branchHeadId } = company;
          if (branchHeadId) {
            return {
              name: `${company[userDataObj?.name]} - ${
                company?.branchHeadId[userDataObj?.name]
              } `,
              id: company._id,
            };
          }
          return null;
        })
        .filter(Boolean);
      return new ApiResponse(
        RESPONSE_STATUS?.OK,
        RESPONSE_MESSAGE?.OK,
        cpCompanyBranchHead,
      );
    };
    this.validateCpAccounts = async (company, branchHead, cpExecute) => {
      try {
        const errorDetails = {
          cpCompany: null,
          cpBranchHead: null,
          cpExecute: null,
        };

        const cpCompany = await CpAppCompany.findOne({ name: company?.name });

        const cpBranchHeadData = await CpAppUser.findOne({
          $or: [
            { name: branchHead[userDataObj?.name] },
            { email: branchHead[userDataObj?.email] },
            { phone: branchHead[userDataObj?.phone] },
          ],
        });

        const cpExecuteData = await CpAppUser.findOne({
          $or: [
            { name: cpExecute ? cpExecute[userDataObj?.name] : null },
            { email: cpExecute ? cpExecute[userDataObj?.email] : null },
            { phone: cpExecute ? cpExecute[userDataObj?.phone] : null },
          ],
        });

        console.log(cpCompany, cpBranchHeadData, cpExecuteData);

        if (cpCompany) {
          errorDetails.cpCompany = { name: !!cpCompany.name };
        }
        if (cpBranchHeadData) {
          errorDetails.cpBranchHead = {
            name: cpBranchHeadData.name === branchHead[userDataObj?.name],
            email: cpBranchHeadData.email === branchHead[userDataObj?.email],
            phone: cpBranchHeadData.phone === branchHead[userDataObj?.phone],
          };
        }
        if (cpExecuteData) {
          errorDetails.cpExecute = {
            name: cpExecuteData.name === cpExecute[userDataObj?.name],
            email: cpExecuteData.email === cpExecute[userDataObj?.email],
            phone: cpExecuteData.phone === cpExecute[userDataObj?.phone],
          };
        }

        return errorDetails;
      } catch (error) {
        console.error("Error checking data existence:", error);
        return { error: true };
      }
    };
  }

  createCpAccount = async (
    providedUser,
    {
      cpCompany,
      cpBranchHead,
      cpExecute,
      parentId,
      cpEnteredCode,
      cpCompanyId,
    },
  ) => {
    // add parent account count validation // check cp ececute act count
    await initDb();
    if ((cpCompany, cpBranchHead)) {
      const validateResult = await this.validateCpAccounts(
        cpCompany,
        cpBranchHead,
        cpExecute,
      );
      console.log(validateResult);

      if (
        validateResult?.cpBranchHead ||
        validateResult?.cpExecute ||
        validateResult?.cpCompany
      ) {
        return new ApiResponse(
          RESPONSE_STATUS?.ERROR,
          RESPONSE_MESSAGE?.INVALID,
          validateResult,
        );
      }
    }

    const cpGenratedCode = await this.genrateCompanyCode(cpEnteredCode);

    const userSrv = new CPUserSrv();
    let parentUser = await userSrv.getUserById(parentId);
    let branchHeadId = null;
    let companyId = cpCompanyId;
    if (!parentUser) {
      return new ApiResponse(
        RESPONSE_STATUS?.NOTFOUND,
        RESPONSE_MESSAGE?.NOTFOUND,
        null,
      );
    }

    try {
      if (isPriorityUser(providedUser[userDataObj?.role])) {
        if (cpBranchHead) {
          const userName = cpBranchHead[userDataObj?.name];
          const parentName = "Urbanrise Team";
          const userEmail = cpBranchHead[userDataObj?.email];
          const role = cpBranchHead[userDataObj?.role];
          const projects = cpBranchHead[userDataObj?.projects].join("/n");
          const cpCode = cpBranchHead[userDataObj?.cpCode] || cpGenratedCode;
          const validateCpCom = this.validateCp(parentUser, cpBranchHead);
          if (!validateCpCom) {
            return new ApiResponse(
              RESPONSE_STATUS?.NOTFOUND,
              RESPONSE_MESSAGE?.INVALID,
              null,
            );
          }
          cpBranchHead[userDataObj?.parentId] = parentId;
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(
            cpBranchHead[userDataObj?.password],
            saltRounds,
          );
          cpBranchHead[userDataObj?.password] = hashedPassword;
          cpBranchHead[userDataObj?.role] = roleNames?.cpBranchHead;
          cpBranchHead[userDataObj?.permissions] = basicRolePermission(
            cpBranchHead[userDataObj?.role],
          );
          const branchUser = await userSrv.createSaveUser(cpBranchHead);
          const cpBranchResult = await this.createCpBranchHead(
            branchUser,
            parentId,
            providedUser,
            cpGenratedCode,
          );
          parentUser = cpBranchResult;
          branchHeadId = cpBranchResult._id;
          // Trigering email to user and admin

          const mailOptions = cpMailOption(
            userName,
            parentName,
            userEmail,
            role,
            projects,
            cpCode,
          );

          sendMail(mailOptions)
            .then(async () => {
              console.log("Cpbranch Emails as been successfully");
            })
            .catch((error) => console.log(error.message));
        }
        if (cpCompany) {
          const cpCode = cpCompany[userDataObj?.cpCode] || cpGenratedCode;
          cpCompany[userDataObj?.cpCode] = cpCode;
          cpCompany.branchHeadId = cpCompany?.branchHeadId || branchHeadId;
          cpCompany[userDataObj?.parentId] =
            cpCompany[userDataObj?.parentId] || parentId;

          companyId = await this.createCpCompany(cpCompany, providedUser);
        }
        if (!cpExecute) {
          return new ApiResponse(
            RESPONSE_STATUS?.OK,
            RESPONSE_MESSAGE?.OK,
            null,
          );
        }
        const userName = cpExecute[userDataObj?.name];
        const parentName = "Urbanrise Team";
        const userEmail = cpExecute[userDataObj?.email];
        const role = cpExecute[userDataObj?.role];
        const projects = cpExecute[userDataObj?.projects].join("/n");
        const permission = basicRolePermission(cpExecute[userDataObj?.role]);
        cpExecute[userDataObj?.parentId] =
          cpExecute[userDataObj?.parentId] || parentId;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(
          cpExecute[userDataObj?.password],
          saltRounds,
        );
        cpExecute[userDataObj?.password] = hashedPassword;
        cpExecute[userDataObj?.role] = roleNames?.cpExecute;
        cpExecute[userDataObj?.permissions] = permission;
        const cpExecuteUser = await userSrv.createSaveUser(cpExecute);
        const userSch = new CpAppUser(cpExecuteUser);

        const userResult = await userSch.save();
        const activityService = new ActivitySrv();

        await activityService.createActivity(
          activityActionTypes?.cpAdded,

          providedUser[userDataObj?.name],

          providedUser?._id,
          cpExecute[userDataObj?.name],

          userResult._id,
        );
        if (userResult._id && companyId) {
          await CpAppCompany.updateOne(
            { _id: companyId },
            { $addToSet: { executeIds: userSch._id } },
          );
        }
        const mailOptions = cpMailOption(
          userName,
          parentName,
          userEmail,
          role,
          projects,
          cpGenratedCode,
        );
        const adminMaliOption = superAdminMailOptions(
          providedUser[userDataObj?.name],
          userName,
          role,
          permission,
          projects,
        );
        sendMail(mailOptions)
          .then(async () => {
            await sendMail(adminMaliOption);
            console.log("cpExecute Emails as been successfully");
          })
          .catch((error) => console.log(error.message));
        return new ApiResponse(RESPONSE_STATUS?.OK, RESPONSE_MESSAGE?.OK, null);
      }

      return new ApiResponse(
        RESPONSE_STATUS?.UNAUTHORIZED,
        RESPONSE_MESSAGE?.UNAUTHORIZED,
        null,
      );
    } catch (error) {
      console.log("Error While Adding Cp", error);
      return new ApiResponse(
        RESPONSE_STATUS?.ERROR,
        RESPONSE_MESSAGE?.ERROR,
        error,
      );
    }
  };

  retriveCpCompanys = async (providedUser) => {
    const userSrv = new CPUserSrv();

    const checkRole =
      isPriorityUser(providedUser[userDataObj?.role]) &&
      providedUser[userDataObj?.permissions].includes(
        permissionKeyNames?.cpManagement,
      );
    if (!checkRole) {
      return new ApiResponse(
        RESPONSE_STATUS?.UNAUTHORIZED,
        RESPONSE_MESSAGE?.UNAUTHORIZED,
      );
    }
    const cpCompanys = await CpAppCompany.find().populate("projects");

    const companiesWithUsers = await Promise.all(
      cpCompanys.map(async (company) => {
        const appUserData = await userSrv.getUserById([
          company.parentId,
          company.branchHeadId,
          ...company.executeIds,
        ]);

        const cpBranchHead =
          appUserData.find((user) =>
            user[userDataObj?.role].includes(roleNames?.cpBranchHead),
          ) || null;
        const cpExecutes = appUserData.filter((user) =>
          user[userDataObj?.role].includes(roleNames?.cpExecute),
        );
        const parentUser = appUserData.find((user) =>
          company.parentId.equals(user._id),
        );

        company = company.toObject();
        const companyProjects = company[userDataObj?.projects].map(
          (project) => project?.name,
        );
        company.projects = companyProjects;

        return {
          company,
          cpRm: parentUser,
          cpBranchHead,
          cpExecutes,
        };
      }),
    );

    return new ApiResponse(
      RESPONSE_STATUS?.OK,
      RESPONSE_MESSAGE?.OK,
      companiesWithUsers,
    );
  };

  retriveCpUser = async (providedUser) => {
    const cpCompanyresult = await this.retriveCpCompanys(providedUser);
    const cpCompanyData = cpCompanyresult?.result;
    const cpUsers = [];
    if (cpCompanyData) {
      cpCompanyData.map((companyData) => {
        const cpCompany = companyData?.company;
        const cpBranchHead = companyData?.cpBranchHead;
        const companyCode = companyData?.company?.cpCode;
        if (!cpCompany || !cpBranchHead || !companyCode) {
          return;
        }
        cpUsers.push({
          name: `${cpCompany[userDataObj?.name]} - ${
            cpBranchHead[userDataObj?.name]
          }`,
          id: cpBranchHead?._id,
          companyCode,
        });
        (companyData.cpExecutes || []).map((cpExecute) => {
          cpUsers.push({
            name: `${cpCompany[userDataObj?.name]} - ${
              cpExecute[userDataObj?.name]
            }`,
            id: cpExecute?._id,
            companyCode,
          });
          return null;
        });
      });
      return new ApiResponse(
        RESPONSE_STATUS?.OK,
        RESPONSE_MESSAGE?.OK,
        cpUsers,
      );
    }

    return cpCompanyresult;
  };

  removeCpByCode = async (providedUser, CpCompanyCode) => {
    if (
      !providedUser[userDataObj?.permissions].includes(
        permissionKeyNames?.cpManagement,
      )
    ) {
      return new ApiResponse(
        RESPONSE_STATUS?.UNAUTHORIZED,
        RESPONSE_MESSAGE?.UNAUTHORIZED,
        null,
      );
    }
    const company = await CpAppCompany.findOne({
      cpCode: CpCompanyCode,
    });
    if (!company) {
      return new ApiResponse(
        RESPONSE_STATUS?.NOTFOUND,
        RESPONSE_MESSAGE?.NOTFOUND,
        null,
      );
    }
    const companyResult = await CpAppCompany.deleteOne({ _id: company._id });
    const cpsResult = await CpAppUser.deleteMany({
      _id: [company.branchHeadId, ...company.executeIds],
    });

    return new ApiResponse(RESPONSE_STATUS?.OK, RESPONSE_MESSAGE?.OK, {
      cpsDeleteResult: cpsResult,
      companyDeleteResult: companyResult,
    });
  };

  retriveCpByCompanyId = async (providedUser, id) => {
    if (
      !providedUser[userDataObj?.permissions].includes(
        permissionKeyNames?.cpManagement,
      ) &&
      !providedUser[userDataObj?.role].includes(roleNames?.cpBranchHead)
    ) {
      return new ApiResponse(
        RESPONSE_STATUS?.UNAUTHORIZED,
        RESPONSE_MESSAGE?.UNAUTHORIZED,
        null,
      );
    }
    const companyData = await CpAppCompany.findOne({ _id: id }).populate(
      "projects",
    );
    if (!companyData) {
      return new ApiResponse(
        RESPONSE_STATUS?.NOTFOUND,
        RESPONSE_MESSAGE?.NOTFOUND,
        null,
      );
    }
    let company = companyData;
    const userSrv = new CPUserSrv();

    const appUserData = await userSrv.getUserById([
      company.parentId,
      company.branchHeadId,
      ...company.executeIds,
    ]);
    const cpBranchHead =
      appUserData.find((user) =>
        user[userDataObj?.role].includes(roleNames?.cpBranchHead),
      ) || null;
    const cpExecutes = appUserData.filter((user) =>
      user[userDataObj?.role].includes(roleNames?.cpExecute),
    );
    const parentUser = appUserData.find((user) =>
      company.parentId.equals(user._id),
    );

    company = company.toObject();
    const companyProjects = company[userDataObj?.projects].map(
      (project) => project?.name,
    );
    company.projects = companyProjects;

    return new ApiResponse(RESPONSE_STATUS?.OK, RESPONSE_MESSAGE?.OK, {
      company,
      cpRm: parentUser,
      cpBranchHead,
      cpExecutes,
    });
  };

  updateCpCompanyAndUsers = async (providedUser, cpDetails) => {
    if (
      !providedUser[userDataObj?.permissions].includes(
        permissionKeyNames?.cpManagement,
      ) &&
      providedUser[userDataObj?.role].includes(roleNames?.cpBranchHead)
    ) {
      return new ApiResponse(
        RESPONSE_STATUS?.UNAUTHORIZED,
        RESPONSE_MESSAGE?.UNAUTHORIZED,
        null,
      );
    }
    const { id, parentId, projects } = cpDetails;

    const companyDbData = await CpAppCompany.findOne({ _id: id }).populate({
      path: "parentId",
      populate: { path: "projects" },
    });
    const { projects: parentProjects } = companyDbData.parentId;
    const parentProjectNames = parentProjects.map((project) => project.name);
    const isNotValidParent = (projects || []).some((project) => {
      if (!parentProjectNames.includes(project)) {
        return true;
      }
      return false;
    });
    if (isNotValidParent) {
      return new ApiResponse(
        RESPONSE_STATUS?.ERROR,
        RESPONSE_MESSAGE?.INVALID,
        null,
      );
    }
    // Here we want to update cpcompany parent and project for user need to update projects
    const projectDbData = await CpAppProject.find({ name: projects });
    const projectIds = projectDbData.map((project) => project?._id);
    const companyUpdateResult = await CpAppCompany.updateOne(
      {
        _id: companyDbData?._id,
      },
      { $set: { parentId, projects: projectIds } },
    );
    const cpUserUpdateResult = await CpAppUser.updateMany(
      {
        _id: [companyDbData?.branchHeadId, ...companyDbData.executeIds],
      },
      { $set: { projects: projectIds } },
    );

    if (companyUpdateResult?.acknowledged && cpUserUpdateResult?.acknowledged) {
      const activityService = new ActivitySrv();

      await activityService.createActivity(
        activityActionTypes?.cpEdit,

        providedUser[userDataObj?.name],

        providedUser?._id,
        companyDbData?.name,

        companyDbData._id,
      );
      return new ApiResponse(RESPONSE_STATUS?.OK, RESPONSE_MESSAGE?.OK, {
        acknowledged:
          companyUpdateResult?.acknowledged && cpUserUpdateResult?.acknowledged,
        modifiedCount:
          companyUpdateResult.modifiedCount + cpUserUpdateResult.modifiedCount,
        upsertedId: null,
        upsertedCount:
          companyUpdateResult.upsertedCount + cpUserUpdateResult.upsertedCount,
        matchedCount:
          companyUpdateResult.matchedCount + cpUserUpdateResult.matchedCount,
      });
    }
    return new ApiResponse(
      RESPONSE_STATUS?.NOTFOUND,
      RESPONSE_MESSAGE?.INVALID,
      null,
    );
  };

  createCpExecute = async (providedUser, cpDetails) => {
    const { name, email, phone } = cpDetails;
    const existingUser = await CpAppUser.findOne({
      $or: [
        { phone },
        { email },
        { name: { $regex: new RegExp(`^${name}$`, "i") } },
      ],
    });

    const usedFields = {
      phone: false,
      email: false,
      name: false,
    };

    if (existingUser) {
      if (existingUser.phone === phone) {
        usedFields.phone = true;
      }

      if (existingUser.email === email) {
        usedFields.email = true;
      }

      if (existingUser.name.toLowerCase() === name.toLowerCase()) {
        usedFields.name = true;
      }
    }
    const isNotUniqUser = Object.values(usedFields).some(
      (value) => value === true,
    );
    if (isNotUniqUser) {
      return new ApiResponse(
        RESPONSE_STATUS?.ERROR,
        RESPONSE_MESSAGE?.USEREXIST,
        usedFields,
      );
    }
    const companyData = await CpAppCompany.find({ _id: cpDetails?.companyId });
    if (!companyData) {
      return new ApiResponse(
        RESPONSE_STATUS?.NOTFOUND,
        RESPONSE_MESSAGE?.INVALID,
        null,
      );
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(cpDetails?.password, saltRounds);

    cpDetails.password = hashedPassword;

    const userSrv = new CPUserSrv();
    const userObj = await userSrv.createSaveUser({
      ...cpDetails,
      role: [roleNames?.cpExecute],
    });
    const userSchema = new CpAppUser(userObj);
    const userResult = await userSchema.save();
    const companyResult = await CpAppCompany.updateOne(
      { _id: cpDetails?.companyId },
      { $addToSet: { executeIds: userResult?._id } },
    );
    const activityService = new ActivitySrv();

    await activityService.createActivity(
      activityActionTypes?.cpAdded,

      providedUser[userDataObj?.name],

      providedUser?._id,
      name,

      userResult?._id,
    );
    return new ApiResponse(
      RESPONSE_STATUS?.OK,
      RESPONSE_MESSAGE?.OK,
      companyResult,
    );
  };
}
export default CpManagementSrv;
