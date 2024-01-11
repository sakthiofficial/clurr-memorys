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
      console.log(cpCampanyData);
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
      console.log(cpCompanySch);
      const cpCompanyResult = await cpCompanySch.save();
      return cpCompanyResult._id;
    };
    this.validateCp = async (cps) => {
      // return parent id
      //  Check Cp
      const cpNames = cps.map((cp) => cp?.name);
      const names = cpNames.flat();
      const cpData = await CpUser.find({ name: { $in: names } });
      if (cpData.length > 0) {
        console.log("Cp found", cpData);

        return false;
      }

      // validate projects
      const cpProjects = cps.map((cp) => cp?.projects);
      const projects = cpProjects.flat();
      const projectData = await CpProject.find({ name: { $in: projects } });
      if (projectData.length !== projects.length) {
        console.log("Project not found", projects);
        return false;
      }
      return true;
    };
    this.genrateCompanyCode = async () => {
      let lastCode = await CpCompany.findOne(
        {},
        { cpCode: 1 },
        { sort: { _id: -1 } },
      ).lean();
      if (!lastCode) {
        return "USERCP001";
      }

      lastCode = lastCode.cpCode;

      const lastNumber = parseInt(lastCode.replace(/\D/g, ""), 10);
      const newNumber = lastNumber + 1;

      return `USER${String(newNumber).padStart(3, "0")}`;
    };
  }

  createCpAccount = async (providedUser, cp) => {
    // add parent account count validation // check cp ececute act count
    await initDb();
    const companyCode = await this.genrateCompanyCode();
    try {
      if (isPriorityUser(providedUser[userDataObj?.role])) {
        let { parentId } = cp.cpExecutes[0];
        if (cp?.cpCompany) {
          cp.cpCompany[userDataObj?.cpCode] = companyCode;
          const cpComId = await this.createCpCompany(cp?.cpCompany);
          parentId = cpComId;
        }
        const checkValidCps = await this.validateCp(cp?.cpExecutes);
        if (!checkValidCps) {
          return new ApiResponse(
            RESPONSE_STATUS?.NOTFOUND,
            RESPONSE_MESSAGE?.INVALID,
            null,
          );
        }
        const cpExecutesDataPromise = Promise.all(
          cp?.cpExecutes.map(async (cpExecuteData) => {
            const saltRounds = 10;

            const hashedPassword = await bcrypt.hash(
              cpExecuteData[userDataObj?.password],
              saltRounds,
            );
            cpExecuteData[userDataObj?.password] = hashedPassword;
            cpExecuteData[userDataObj?.parentId] = parentId;
            cpExecuteData[userDataObj?.cpCode] = companyCode;

            return {
              insertOne: {
                document: cpExecuteData,
              },
            };
          }),
        );
        const cpExecutesData = await cpExecutesDataPromise;
        const cpExecuteResult = await CpUser.bulkWrite(cpExecutesData);
        if (cpExecuteResult?.insertedCount > 0) {
          const result = await CpCompany.updateOne(
            { _id: parentId },
            { $inc: { account: cpExecuteResult.insertedCount } },
          );
        }
        return new ApiResponse(
          RESPONSE_STATUS?.OK,
          RESPONSE_MESSAGE?.OK,
          cpExecuteResult,
        );
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
