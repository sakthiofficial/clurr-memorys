import crypto from "crypto";
import bcrypt from "bcrypt";
import { Session } from "../../models/session";
import {
  isPriorityUser,
  parentRole,
  userDataObj,
} from "../../shared/roleManagement";
import {
  ApiResponse,
  RESPONSE_MESSAGE,
  RESPONSE_STATUS,
  userValidationErrors,
} from "../appConstants";
import { permissionKeyNames, roleNames } from "../../shared/cpNamings";
import { CpAppProject } from "../../models/AppProject";
import sendMail from "../helper/emailSender";
import { CpAppRole } from "../../models/AppRole";
import { CpAppPermission } from "../../models/Permission";

const { default: initDb } = require("../lib/db");
const { CpAppUser } = require("../../models/AppUser");

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
      // permission validation
      if (
        !providedUser[userDataObj?.permissions].includes(
          permissionKeyNames?.userManagement,
        )
      ) {
        throw userValidationErrors?.IvalidPermission;
      }
      // Subordinate Validation+
      const subordinateValidation =
        (providedUser?.subordinateRoles || []).includes(newUser?.role) &&
        (providedUser?.permissions || []).includes(
          permissionKeyNames?.userManagement,
        ) &&
        (parentData?.subordinateRoles || []).includes(newUser?.role);
      if (!subordinateValidation) {
        console.log(
          "parent or provider does not have permission to the user",
          parentData,
          providedUser,
        );
        throw userValidationErrors?.HighLevelAccess;
      }
      // Project Validation
      const checkParentProject =
        !isPriorityUser(newUser?.role) &&
        !newUser?.role.includes(roleNames?.cpTl);
      const checkParentValidation =
        !newUser?.role.includes(roleNames?.mis) &&
        !newUser?.role.includes(roleNames?.admin);
      const checkProject = !isPriorityUser(newUser?.role);
      if (checkParentValidation) {
        for (let i = 0; i < newUser[userDataObj?.role].length; i += 1) {
          if (
            !parentData[userDataObj?.role].includes(
              parentRole(newUser[userDataObj?.role][0]),
            )
          ) {
            throw userValidationErrors?.ParentRoleLimitation;
          }
        }
      }
      if (checkParentProject) {
        for (let i = 0; i < newUser?.projects.length; i = 1 + i) {
          if (!parentData?.projects.includes(newUser?.projects[i])) {
            console.log(
              parentData?.projects,
              "Given Parent user donesnot have Project permission",
            );
            throw userValidationErrors?.InvalidParentProject;
          }
        }
      }

      if (checkProject) {
        const projectNames = newUser?.projects || [];

        // Fetch all projects in a single query
        const existingProjects = await CpAppProject.find({
          name: { $in: projectNames },
        }).lean();
        if (
          existingProjects.length !== newUser?.projects.length ||
          newUser?.projects.length < 1
        ) {
          throw userValidationErrors?.InvalidProject;
        }
      }
      // Parent validation Validation

      return null;
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
    this.getUserByRole = async (providedUser, role) => {
      try {
        await initDb();

        const checkUserRole =
          isPriorityUser(providedUser[userDataObj?.role]) &&
          providedUser[userDataObj?.permissions].includes(
            permissionKeyNames?.userManagement,
          );
        if (!checkUserRole) {
          return new ApiResponse(
            RESPONSE_STATUS?.NOTFOUND,
            RESPONSE_MESSAGE?.INVALID,
            null,
          );
        }
        let roleId = await CpAppRole.findOne({ name: role });
        roleId = roleId?._id;

        const fields = "name _id projects";
        let roleUsers = await CpAppUser.find({
          role: { $in: [roleId] },
        })
          .populate({
            path: "projects",
            select: "name", // Select only the 'name' field from the projects
          })
          .select(fields);
        roleUsers = roleUsers.map((user) => {
          user = user.toObject();
          user.projects = user[userDataObj?.projects].map(
            (project) => project.name,
          );

          return user;
        });
        return new ApiResponse(
          RESPONSE_STATUS?.OK,
          RESPONSE_MESSAGE?.OK,
          roleUsers,
        );
      } catch (error) {
        console.log("While Performing Retriving user by role Error", error);
        return new ApiResponse(
          RESPONSE_STATUS?.ERROR,
          RESPONSE_MESSAGE?.ERROR,
          error,
        );
      }
    };
    this.getUserById = async (id) => {
      const user = await CpAppUser.findOne({
        _id: id,
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
      if (!user) {
        return null;
      }
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
      user[userDataObj?.projects] = user[userDataObj?.projects].map(
        (project) => project.name,
      );
      user[userDataObj?.permissions] = userPermissions;
      user[userDataObj?.subordinateRoles] = userSubordinateRoles;
      user[userDataObj?.role] = (user?.role || []).map((role) => role?.name);
      return user;
    };
    this.createSaveUser = async (user) => {
      let roleIds = await CpAppRole.find({ name: user[userDataObj?.role] });
      roleIds = roleIds.map((role) => role._id);
      let projectIds = await CpAppProject.find({
        name: user[userDataObj?.projects],
      });
      projectIds = projectIds.map((project) => project._id);
      let permmissionIds = await CpAppPermission.find({
        name: user[userDataObj?.permissions],
      });
      permmissionIds = permmissionIds.map((permission) => permission._id);
      user[userDataObj?.role] = roleIds;
      user[userDataObj?.projects] = projectIds;
      user[userDataObj?.permissions] = permmissionIds;

      return user;
    };
  }

  authenticateUser = async ({ name, password }, authenticteToken) => {
    try {
      await this.db();
      const user = await CpAppUser.findOne({
        $or: [{ name }, { email: name }, { phone: name }],
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

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return new ApiResponse(
          RESPONSE_STATUS?.UNAUTHORIZED,
          RESPONSE_MESSAGE?.UNAUTHORIZED,
          null,
        );
      }
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
      user[userDataObj?.role] = (user?.role || []).map((role) => role?.name);
      const { projects } = user;
      const { permissions, subordinateRoles, _id, role } = user;

      const sessionToken = this.genrateTokan();
      const sessionData = new Session({
        token: sessionToken,
        userId: user._id,
      });
      sessionData.save();
      const isPriorityProvider =
        role === roleNames?.superAdmin || role === roleNames?.cpBusinessHead;
      // fetching projects details
      const projectDatas = await CpAppProject.find(
        isPriorityProvider ? {} : { name: projects },
        { _id: 0, accessKey: 0, secretKey: 0 },
      );

      return new ApiResponse(RESPONSE_STATUS?.OK, RESPONSE_MESSAGE?.OK, {
        token: sessionToken,

        userData: {
          projects,
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
        const validationToUser = await this.checkValidUserToAdd(
          providedUser,
          newUser,
          parentUserData,
        );
        const checkUserRole = isPriorityUser(providedUser[userDataObj?.role]);
        const checkNewUserRole = isPriorityUser(newUser[userDataObj?.role]);
        if (checkNewUserRole) {
          newUser[userDataObj?.projects] = [];
        }
        console.log(validationToUser);
        if (
          !validationToUser ||
          newUser?.role === roleNames?.cpExecute ||
          !checkUserRole
        ) {
          return new ApiResponse(
            RESPONSE_STATUS?.NOTFOUND,
            RESPONSE_MESSAGE?.INVALID,
            null,
          );
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newUser?.password, saltRounds);

        const parentId = newUser?.parentId === "" ? null : newUser?.parentId;
        const roleId = await CpAppRole.find({ name: { $in: newUser?.role } });
        const projectIds = await CpAppProject.find({
          name: { $in: newUser?.projects },
        });
        newUser.projects = projectIds.map((project) => project._id);
        newUser.role = roleId.map((role) => role._id);
        newUser.parentId = parentId;
        newUser.password = hashedPassword;
      }
      const userSch = new CpAppUser(newUser);
      await userSch.save();
      const userName = newUser[userDataObj?.name];
      const parentName = "Urbanrise Team";
      const userEmail = newUser[userDataObj?.email];
      const role = newUser[userDataObj?.role];
      const projects = newUser[userDataObj?.projects].join("/n");
      sendMail(userName, parentName, userEmail, role, projects)
        .then((result) => console.log("Email sent...", result))
        .catch((error) => console.log(error.message));
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
    if (
      !providedUser[userDataObj?.permissions].includes(
        permissionKeyNames?.userManagement,
      )
    ) {
      return new ApiResponse(
        RESPONSE_STATUS?.NOTFOUND,
        RESPONSE_MESSAGE?.INVALID,
        null,
      );
    }
    try {
      await this.db();

      let users = await CpAppUser.find(
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

  retriveParentUsers = async (providedUser, { role, projects }) => {
    try {
      await this.db();
      const isPriorityRole = isPriorityUser(role);
      const roleData = await CpAppRole.findOne({ name: parentRole(role) });
      const projectData = await CpAppProject.find({ name: projects });
      const projectIds = projectData.map((project) => project?._id);
      if (!providedUser[userDataObj?.subordinateRoles].includes(role)) {
        return new ApiResponse(
          RESPONSE_STATUS?.UNAUTHORIZED,
          RESPONSE_MESSAGE?.INVALID,
          null,
        );
      }

      const query = {
        role: roleData?._id,
        projects:
          projects.length > 1 ? { $all: projectIds } : { $in: projectIds },
      };

      const isProjectValidationNeed =
        isPriorityRole || role === roleNames?.cpTl;

      const users = await CpUser.find(
        isProjectValidationNeed ? { role: parentRole(role) } : query,
        projection,
      );
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

  retriveUserById = async (providedUser, userId) => {
    const userById = await this.getUserById(userId);
    if (!userById) {
      return new ApiResponse(
        RESPONSE_STATUS?.NOTFOUND,
        RESPONSE_MESSAGE?.NOTFOUND,
        null,
      );
    }

    const result = (userById[userDataObj?.role] || []).filter((role) =>
      providedUser[userDataObj?.subordinateRoles].includes(role),
    );

    if (result.length !== userById[userDataObj?.role]?.length) {
      return new ApiResponse(
        RESPONSE_STATUS?.UNAUTHORIZED,
        RESPONSE_MESSAGE?.INVALID,
        null,
      );
    }
    return new ApiResponse(RESPONSE_STATUS?.OK, RESPONSE_MESSAGE?.OK, userById);
  };

  removeUser = async (providedUser, removeUserId) => {
    this.db();
    const removeUserData = await CpAppUser.findOne({
      _id: removeUserId,
    })
      .populate({
        path: "role",
        populate: [{ path: "subordinateRoles", model: "CpAppRole" }],
      })
      .lean();
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
      const updateUserDbData = await CpAppUser.findOne({
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
        const updateUserParentData = await CpAppUser.findOne({
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
        await CpAppUser.findOneAndUpdate(filter, update, options);
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
