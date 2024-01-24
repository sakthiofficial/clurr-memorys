import bcrypt from "bcrypt";
import {
  ApiResponse,
  RESPONSE_MESSAGE,
  RESPONSE_STATUS,
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

class CpManagementSrv {
  constructor() {
    this.createCpCompany = async (cpCampanyData) => {
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
      return cpCompanyResult._id;
    };
    this.validateCp = (parent, newUser) => {
      const result = (newUser[userDataObj?.projects] || []).filter(
        (userProject) => parent[userDataObj?.projects].includes(userProject),
      );
      return result.length === newUser[userDataObj?.projects].length;
    };
    this.createCpBranchHead = async (user, parentId) => {
      const userSrv = new CPUserSrv();
      const parentUser = await userSrv.getUserById(parentId);
      if (!parentUser) {
        return false;
      }
      const userSch = new CpAppUser(user);
      const result = await userSch.save();
      return result;
    };
    this.genrateCompanyCode = async () => {
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
      const newNumber = lastNumber + 1;

      return `URBCHP${String(newNumber).padStart(5, "0")}`;
    };
    this.getCpCompanysBH = async (providedUser) => {
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
        const errormsg = {
          companyFound: "Company  Already Register",
          cpBranchHeadFound: "Branch Head Already Register",
          cpExecuteFound: "CP Execute Already Register",
        };
        const cpCompany = await CpAppCompany.findOne({ name: company?.name });
        let cpBranchRoleId = await CpAppRole.findOne({
          name: roleNames?.cpBranchHead,
        });
        cpBranchRoleId = cpBranchRoleId?._id;
        let cpExecuteRoleId = await CpAppRole.findOne({
          name: roleNames?.cpExecute,
        });
        cpExecuteRoleId = cpExecuteRoleId?._id;
        const cpBranchHeadData = await CpAppUser.findOne({
          role: { $in: [cpBranchRoleId] },
          $or: [
            { name: branchHead[userDataObj?.name] },
            { email: branchHead[userDataObj?.email] },
            { phone: branchHead[userDataObj?.phone] },
          ],
        });

        const cpExecuteData = await CpAppUser.findOne({
          role: { $in: [cpExecuteRoleId] },

          $or: [
            { name: cpExecute ? cpExecute[userDataObj?.name] : null },
            { email: cpExecute ? cpExecute[userDataObj?.email] : null },
            { phone: cpExecute ? cpExecute[userDataObj?.phone] : null },
          ],
        });

        if (cpCompany) {
          return errormsg?.companyFound;
        }
        if (cpBranchHeadData) {
          return errormsg?.cpBranchHeadFound;
        }
        if (cpExecuteData) {
          return errormsg?.cpExecuteFound;
        }
        console.log(cpCompany, cpBranchHeadData, cpExecuteData);
        return null;
      } catch (error) {
        console.error("Error checking data existence:", error);
        return false;
      }
    };
  }

  createCpAccount = async (
    providedUser,
    { cpCompany, cpBranchHead, cpExecute, parentId },
  ) => {
    // add parent account count validation // check cp ececute act count

    await initDb();
    if ((cpCompany, cpBranchHead)) {
      const validateResult = await this.validateCpAccounts(
        cpCompany,
        cpBranchHead,
        cpExecute,
      );
      if (validateResult) {
        return new ApiResponse(
          RESPONSE_STATUS?.ERROR,
          RESPONSE_MESSAGE?.INVALID,
          validateResult,
        );
      }
    }
    const cpGenratedCode = await this.genrateCompanyCode();
    const userSrv = new CPUserSrv();
    let parentUser = await userSrv.getUserById(parentId);
    let branchHeadId = null;
    if (!parentUser) {
      return new ApiResponse(
        RESPONSE_STATUS?.NOTFOUND,
        RESPONSE_MESSAGE?.INVALID,
        null,
      );
    }
    try {
      if (isPriorityUser(providedUser[userDataObj?.role])) {
        if (cpBranchHead) {
          const cpCode = cpBranchHead[userDataObj?.cpCode] || cpGenratedCode;
          cpBranchHead[userDataObj?.cpCode] = cpCode;
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
          );
          parentUser = cpBranchResult;
          branchHeadId = cpBranchResult._id;
        }
        if (cpCompany) {
          const cpCode = cpCompany[userDataObj?.cpCode] || cpGenratedCode;
          cpCompany[userDataObj?.cpCode] = cpCode;
          cpCompany.branchHeadId = cpCompany?.branchHeadId || branchHeadId;
          cpCompany[userDataObj?.parentId] =
            cpCompany[userDataObj?.parentId] || parentId;

          await this.createCpCompany(cpCompany);
        }
        if (!cpExecute) {
          return new ApiResponse(
            RESPONSE_STATUS?.OK,
            RESPONSE_MESSAGE?.OK,
            null,
          );
        }
        cpExecute[userDataObj?.parentId] =
          cpExecute[userDataObj?.parentId] || branchHeadId;
        cpExecute[userDataObj?.cpCode] = cpGenratedCode;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(
          cpExecute[userDataObj?.password],
          saltRounds,
        );
        cpExecute[userDataObj?.password] = hashedPassword;
        cpExecute[userDataObj?.role] = roleNames?.cpExecute;
        cpExecute[userDataObj?.permissions] = basicRolePermission(
          cpExecute[userDataObj?.role],
        );
        const cpExecuteUser = await userSrv.createSaveUser(cpExecute);
        const userSch = new CpAppUser(cpExecuteUser);
        await userSch.save();
        const userName = cpExecute[userDataObj?.name];
        const parentName = "Urbanrise Team";
        const userEmail = cpExecute[userDataObj?.email];
        const role = cpExecute[userDataObj?.role];
        const projects = cpExecute[userDataObj?.projects].join("/n");
        sendMail(userName, parentName, userEmail, role, projects)
          .then((result) => console.log("Email sent...", result))
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
        RESPONSE_MESSAGE?.INVALID,
      );
    }
    const cpCompanys = await CpAppCompany.find().populate("projects");

    const companiesWithUsers = await Promise.all(
      cpCompanys.map(async (company) => {
        const parentUser = await userSrv.getUserById(company.parentId);

        let allCompanyUsers = await CpAppUser.find({
          cpCode: company.cpCode,
        })
          .populate({
            path: "role",
            populate: [
              { path: "permissions", model: "CpAppPermission" },
              { path: "subordinateRoles", model: "CpAppRole" },
            ],
          })

          .populate({
            path: "projects",
            model: "CpAppProject",
          })

          .lean();
        allCompanyUsers = allCompanyUsers.map((user) => {
          const userPermissions = [
            ...new Set(
              user.role.flatMap((role) =>
                role.permissions.map((permission) => permission.name),
              ),
            ),
          ];
          const userSubordinateRoles = [
            ...new Set(
              user.role.flatMap((role) =>
                role.subordinateRoles.map((subordinate) => subordinate.name),
              ),
            ),
          ];
          user[userDataObj?.permissions] = userPermissions;
          user[userDataObj?.subordinateRoles] = userSubordinateRoles;
          user[userDataObj?.role] = (user?.role || []).map(
            (role) => role?.name,
          );
          user[userDataObj?.projects] = (user[userDataObj?.projects] || []).map(
            (project) => project.name,
          );
          return user;
        });
        const cpBranchHead =
          allCompanyUsers.find((user) =>
            user[userDataObj?.role].includes(roleNames?.cpBranchHead),
          ) || null;
        const cpExecutes = allCompanyUsers.filter((user) =>
          user[userDataObj?.role].includes(roleNames?.cpExecute),
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
        cpUsers.push(
          `${cpCompany[userDataObj?.name]} - ${
            cpBranchHead[userDataObj?.name]
          }`,
        );
        (companyData.cpExecutes || []).map((cpExecute) => {
          cpUsers.push(
            `${cpCompany[userDataObj?.name]} - ${cpExecute[userDataObj?.name]}`,
          );
          return null;
        });
        return null;
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
    const cpsResult = await CpAppUser.deleteMany({ cpCode: CpCompanyCode });

    return new ApiResponse(RESPONSE_STATUS?.OK, RESPONSE_MESSAGE?.OK, {
      cpsDeleteResult: cpsResult,
      companyDeleteResult: companyResult,
    });
  };
}
export default CpManagementSrv;
