import bcrypt from "bcrypt";
import {
  ApiResponse,
  RESPONSE_MESSAGE,
  RESPONSE_STATUS,
} from "../appConstants";

import { CpProject } from "../../models/cpProject";
import {
  basicRolePermission,
  isPriorityUser,
  userDataObj,
} from "../../shared/roleManagement";
import { CpCompany } from "../../models/cpCompany";
// dont remove this schema
import { CpUser } from "../../models/cpUser";
import initDb from "../lib/db";
import { permissionKeyNames, roleNames } from "../../shared/cpNamings";
import sendMail from "@/helper/emailSender";

class CpManagementSrv {
  constructor() {
    this.createCpCompany = async (cpCampanyData) => {
      //   validation project & parentInd
      const errorMsg = {
        userExist: "user already exist",
        inValidProject: "invalid project deatils",
        userNotExist: "user not found",
      };

      const parentUser = await CpUser.findOne({
        _id: cpCampanyData[userDataObj?.parentId],
      });
      if (!parentUser) {
        throw errorMsg?.userNotExist;
      }
      const projects = await CpProject.find({
        name: { $in: parentUser[userDataObj?.projects] },
      });
      if (projects.length !== parentUser[userDataObj?.projects].length) {
        throw errorMsg?.inValidProject;
      }
      const cpCompanyDb = await CpCompany.findOne({
        name: cpCampanyData?.name,
      });
      if (cpCompanyDb) {
        throw errorMsg?.userExist;
      }
      const cpCompanySch = new CpCompany(cpCampanyData);
      const cpCompanyResult = await cpCompanySch.save();
      return cpCompanyResult._id;
    };
    this.validateCp = async (parent, newUser) => {
      (newUser[userDataObj?.projects] || []).map((userProject) => {
        const validateProject =
          parent[userDataObj?.projects].includes(userProject);
        if (!validateProject) {
          return false;
        }
      });

      return true;
    };
    this.createCpBranchHead = async (user, parentId) => {
      const parentUser = await CpUser.findOne({ _id: parentId });
      if (!parentUser) {
        return false;
      }
      const userSch = new CpUser(user);
      const result = await userSch.save();
      return result;
    };
    this.genrateCompanyCode = async () => {
      let lastCode = await CpCompany.findOne(
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
      const companies = await CpCompany.find().populate("branchHeadId");
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
        const cpCompany = await CpCompany.findOne({ name: company?.name });

        const cpBranchHeadData = await CpUser.findOne({
          role: roleNames?.cpBranchHead,
          $or: [
            { name: branchHead[userDataObj?.name] },
            { email: branchHead[userDataObj?.email] },
            { phone: branchHead[userDataObj?.phone] },
          ],
        });

        const cpExecuteData = await CpUser.findOne({
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
    let parentUser = await CpUser.findOne({ _id: parentId });
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
          const cpBranchResult = await this.createCpBranchHead(
            cpBranchHead,
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
        const userSch = new CpUser(cpExecute);
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
    const checkRole = isPriorityUser(providedUser[userDataObj?.role]);
    if (!checkRole) {
      return new ApiResponse(
        RESPONSE_STATUS?.UNAUTHORIZED,
        RESPONSE_MESSAGE?.INVALID,
      );
    }
    const cpCompanys = await CpCompany.find();
    const companiesWithUsers = await Promise.all(
      cpCompanys.map(async (company) => {
        const parentUser = await CpUser.findOne({ _id: company.parentId });

        const allCompanyUsers = await CpUser.find({
          cpCode: company.cpCode,
        });

        const cpBranchHead =
          allCompanyUsers.find((user) => user.isPrimary) || null;
        const cpExecutes = allCompanyUsers.filter((user) => !user.isPrimary);

        return {
          company: {
            ...company._doc,
          },
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
}
export default CpManagementSrv;
