import bcrypt from "bcrypt";
import {
  ApiResponse,
  RESPONSE_MESSAGE,
  RESPONSE_STATUS,
} from "../appConstants";

import { CpProject } from "../../models/cpProject";
import { isPriorityUser, userDataObj } from "../../shared/roleManagement";
import { CpCompany } from "../../models/cpCompany";
// dont remove this schema
import { CpUser } from "../../models/cpUser";
import initDb from "../lib/db";

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
        return "URBHCP00001";
      }

      lastCode = lastCode.cpCode;

      const lastNumber = parseInt(lastCode.replace(/\D/g, ""), 10);
      const newNumber = lastNumber + 1;

      return `USER${String(newNumber).padStart(3, "0")}`;
    };
  }

  createCpAccount = async (
    providedUser,
    { cpCompany, cpBranchHead, cpExecute, parentId },
  ) => {
    // add parent account count validation // check cp ececute act count

    await initDb();
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

        const userSch = new CpUser(cpExecute);
        await userSch.save();
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
    return new ApiResponse(
      RESPONSE_STATUS?.OK,
      RESPONSE_MESSAGE?.OK,
      cpCompanys,
    );
  };
}
export default CpManagementSrv;
