import crypto from "crypto";
import bcrypt from "bcrypt";
import { Session } from "../../models/session";
import {
  basicRolePermission,
  checkProjectValidation,
  checkValidParent,
  roleSubordinates,
  userDataObj,
} from "../../shared/roleManagement";
import {
  ApiResponse,
  RESPONSE_MESSAGE,
  RESPONSE_STATUS,
} from "../appConstants";
import { permissionKeyNames, roleNames } from "../../shared/cpNamings";
import { CpProject } from "../../models/cpProject";

const { default: initDb } = require("../lib/db");
const { CpUser } = require("../../models/cpUser");

class CPUserSrv {
  constructor() {
    this.genrateTokan = () => {
      const tokenLength = 32;
      const randomBytes = crypto.randomBytes(Math.ceil(tokenLength / 2));
      const token = randomBytes.toString("hex").slice(0, tokenLength);
      return token;
    };

    this.db = initDb;

    this.checkValidUserToAdd = async (providedUser, newUser, parentData) => {
      // Subordinate Validation+
      const subordinateValidation =
        (providedUser?.subordinateRoles || []).includes(newUser?.role) &&
        (providedUser?.permissions || []).includes(
          permissionKeyNames?.userManagement,
        );
      if (!subordinateValidation) {
        console.log("Providing  user donesnot have role permission");
        return false;
      }
      // Project Validation
      const checkProjectValidationNeed = checkProjectValidation(newUser?.role);
      const checkParentValidation =
        newUser?.role !== roleNames?.mis &&
        newUser?.role !== roleNames?.admin &&
        newUser?.role !== roleNames?.cpHead;
      const checkProjectNameValidation = newUser?.role === roleNames?.cpHead;
      if (checkProjectValidationNeed) {
        if (checkParentValidation) {
          for (let i = 0; i < newUser?.projects.length; i = 1 + i) {
            if (!parentData?.projects.includes(newUser?.projects[i])) {
              console.log("Given Parent user donesnot have Project permission");

              return false;
            }
          }
        }
      }

      if (!checkProjectNameValidation) {
        for (let i = 0; i < newUser?.projects.length; i = 1 + i) {
          const project = await CpProject.findOne({
            name: newUser?.projects[i],
          }).lean();

          if (!project) {
            console.log("Given Project Not Founds");
            return false;
          }
        }
      }
      // Parent validation Validation

      if (
        !checkValidParent(newUser?.role, parentData?.role || providedUser?.role)
      ) {
        return false;
      }

      return true;
    };
    this.cpTokenValidation = async (token) => {
      try {
        const tokenUser = await Session.findOne({ token })
          .populate("userId")
          .lean();
        if (tokenUser) {
          return tokenUser?.userId;
        }
        return null;
      } catch (error) {
        console.log("Error While validating token", error);
        return null;
      }
    };
  }

  authenticateUser = async ({ name, password }, authenticteToken) => {
    try {
      await this.db();
      const user = await CpUser.findOne({ name }).lean();

      if (authenticteToken) {
        await Session.deleteOne({
          token: authenticteToken,
        });
      }

      if (!user) {
        return new ApiResponse(
          RESPONSE_STATUS?.UNAUTHORIZED,
          RESPONSE_MESSAGE?.UNAUTHORIZED,
          null,
        );
      }
      const { projects, permissions, subordinateRoles, _id, role } = user;

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return new ApiResponse(
          RESPONSE_STATUS?.UNAUTHORIZED,
          RESPONSE_MESSAGE?.UNAUTHORIZED,
          null,
        );
      }
      const sessionToken = this.genrateTokan();
      const sessionData = new Session({
        token: sessionToken,
        userId: user._id,
      });
      sessionData.save();
      const isSuperAdmin = role === roleNames?.superAdmin;
      const projectDatas = await CpProject.find(
        isSuperAdmin ? {} : { name: projects },
        { _id: 0, accessKey: 0, secretKey: 0 },
      );

      return new ApiResponse(RESPONSE_STATUS?.OK, RESPONSE_MESSAGE?.OK, {
        token: sessionToken,

        userData: {
          projects: projectDatas,
          permissions,
          subordinateRoles,
          _id,
          name,
          role,
        },
      });
    } catch (error) {
      console.log("While Performing Authentiction Error", error);
      return new ApiResponse(
        RESPONSE_STATUS?.ERROR,
        RESPONSE_MESSAGE?.ERROR,
        error,
      );
    }
  };

  createUser = async (providedUser, newUser) => {
    // add user activity // send mail to super admin
    await this.db();
    try {
      if (newUser) {
        // Role Acess Vallidation
        const parentUserData = await CpUser.findOne({
          _id: newUser?.parentId || null,
        }).lean();

        if (
          !(await this.checkValidUserToAdd(
            providedUser,
            newUser,
            parentUserData,
          ))
        ) {
          return new ApiResponse(
            RESPONSE_STATUS?.NOTFOUND,
            RESPONSE_MESSAGE?.INVALID,
            null,
          );
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newUser?.password, saltRounds);
        const permissions = basicRolePermission(newUser?.role);
        const subordinateRoles = roleSubordinates(newUser?.role);
        const parentId = newUser?.parentId === "" ? null : newUser?.parentId;
        // const projects = [];
        // Role hierrachy parent validation

        // switch (key) {
        //   case value:
        //     break;

        //   default:
        //     break;
        // }
        newUser.parentId = parentId;
        newUser.password = hashedPassword;
        newUser.permissions = permissions;
        newUser.subordinateRoles = subordinateRoles;
      }
      const userSch = new CpUser(newUser);
      await userSch.save();
      return new ApiResponse(RESPONSE_STATUS?.OK, RESPONSE_MESSAGE?.OK, null);
    } catch (err) {
      console.log("Error While Adding User", err);
      return new ApiResponse(
        RESPONSE_STATUS?.ERROR,
        RESPONSE_MESSAGE?.ERROR,
        err,
      );
    }
  };

  retriveUser = async (providedUser) => {
    try {
      await this.db();

      let users = await CpUser.find(
        { role: { $in: providedUser[userDataObj?.subordinateRoles] } },
        { password: 0 },
      );
      if (
        providedUser[userDataObj?.role] !== roleNames?.superAdmin &&
        providedUser[userDataObj?.role] !== roleNames?.cpBusinessHead
      ) {
        users = users.map((user) => {
          for (let i = 0; i < user[userDataObj?.projects].length; i += 1) {
            if (
              providedUser[userDataObj?.projects].includes(
                user[userDataObj?.projects][i],
              )
            ) {
              return user;
            }
          }
        });
      }
      return new ApiResponse(RESPONSE_STATUS?.OK, RESPONSE_MESSAGE?.OK, users);
    } catch (error) {
      console.log("Error While Adding User", error);
      return new ApiResponse(
        RESPONSE_STATUS?.ERROR,
        RESPONSE_MESSAGE?.ERROR,
        error,
      );
    }
  };

  removeUser = async (providedUser, removeUserId) => {
    this.db();

    const removeUserData = await CpUser.findOne({ _id: removeUserId }).lean();
    if (!removeUserData) {
      return new ApiResponse(
        RESPONSE_STATUS?.NOTFOUND,
        RESPONSE_MESSAGE?.INVALID,
        null,
      );
    }
    if (
      (providedUser[userDataObj?.subordinateRoles] || []).includes(
        removeUserData[userDataObj?.role],
      )
    ) {
      const { deletedCount } = await CpUser.deleteOne({
        _id: removeUserData._id,
      }).lean();
      if (deletedCount > 0) {
        return new ApiResponse(RESPONSE_STATUS?.OK, RESPONSE_MESSAGE?.OK, null);
      }
    }
    return new ApiResponse(
      RESPONSE_STATUS?.NOTFOUND,
      RESPONSE_MESSAGE?.NOTFOUND,
      null,
    );
  };

  updateUser = async (providedUser, updateUser) => {
    try {
      const updateUserDbData = await CpUser.findOne({
        _id: updateUser.id,
      }).lean();
      if (!updateUserDbData) {
        return new ApiResponse(
          RESPONSE_STATUS?.NOTFOUND,
          RESPONSE_MESSAGE?.INVALID,
          null,
        );
      }
      let parentUser = providedUser;
      if (
        updateUser?.role !== roleNames?.superAdmin &&
        updateUser?.role !== roleNames?.cpHead &&
        updateUser?.role !== roleNames?.admin &&
        updateUser?.role !== roleNames?.mis
      ) {
        // add populate
        const updateUserParentData = await CpUser.findOne({
          _id: updateUser?.parentId,
        }).lean();

        if (!updateUserParentData) {
          return new ApiResponse(
            RESPONSE_STATUS?.NOTFOUND,
            RESPONSE_MESSAGE?.INVALID,
            null,
          );
        }
        parentUser = updateUserParentData;
      }
      const validProvider = await this.checkValidUserToAdd(
        providedUser,
        updateUser,
        parentUser,
      );
      if (validProvider) {
        const filter = { _id: updateUser.id };
        const update = { $set: updateUser };
        const options = { new: true, useFindAndModify: false };
        await CpUser.findOneAndUpdate(filter, update, options);
        return new ApiResponse(RESPONSE_STATUS?.OK, RESPONSE_MESSAGE?.OK, null);
      }
      return new ApiResponse(
        RESPONSE_STATUS?.NOTFOUND,
        RESPONSE_MESSAGE?.INVALID,
        null,
      );
    } catch (error) {
      console.log("Error while updating user", error);
      return new ApiResponse(
        RESPONSE_STATUS?.ERROR,
        RESPONSE_MESSAGE?.ERROR,
        error,
      );
    }
  };
}
export default CPUserSrv;
