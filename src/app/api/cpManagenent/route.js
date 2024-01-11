import Joi from "joi";
import {
  ApiResponse,
  RESPONSE_MESSAGE,
  RESPONSE_STATUS,
} from "../../../appConstants";
import getUserByToken from "../../../helper/getUserByToken";
import CpManagementSrv from "../../../services/cpManagementSrv";

export async function POST(request) {
  try {
    const providedUser = await getUserByToken(request);
    if (!providedUser) {
      return new Response(
        JSON.stringify(
          new ApiResponse(
            RESPONSE_STATUS?.UNAUTHORIZED,
            RESPONSE_MESSAGE?.UNAUTHORIZED,
            null,
          ),
        ),
      );
    }
    const bodyData = await request.json();

    const validateQuery = Joi.object({
      parentId: Joi.string().required(),

      cpCompany: Joi.object({
        name: Joi.string().required(),
        projects: Joi.array().items(Joi.string()).required(),
      }),
      cpBranchHead: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        role: Joi.string().required(),
        projects: Joi.array().items(Joi.string()).required(),
        isPrimary: Joi.boolean().required(),
        phone: Joi.string().required(),
        parentId: Joi.string(),
      }),
      cpExecute: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        role: Joi.string().required(),
        projects: Joi.array().items(Joi.string()).required(),
        isPrimary: Joi.boolean().required(),
        phone: Joi.string().required(),
        parentId: Joi.string(),
      }),
    });
    const { error, value } = validateQuery.validate(bodyData);

    if (error) {
      return new Response(
        JSON.stringify(
          new ApiResponse(
            RESPONSE_STATUS?.ERROR,
            RESPONSE_MESSAGE?.INVALID,
            error,
          ),
        ),
      );
    }
    const cpManagementSrv = new CpManagementSrv();
    const serviceRes = await cpManagementSrv.createCpAccount(
      providedUser,
      value,
    );
    return new Response(JSON.stringify(serviceRes));
  } catch (error) {
    return new Response(
      JSON.stringify(
        new ApiResponse(
          RESPONSE_STATUS?.ERROR,
          RESPONSE_MESSAGE?.INVALID,
          error,
        ),
      ),
    );
  }
}
export async function GET(request) {
  try {
    const providedUser = await getUserByToken(request);
    if (!providedUser) {
      return new Response(
        JSON.stringify(
          new ApiResponse(
            RESPONSE_STATUS?.UNAUTHORIZED,
            RESPONSE_MESSAGE?.UNAUTHORIZED,
            null,
          ),
        ),
      );
    }

    const cpManagementSrv = new CpManagementSrv();
    const serviceRes = await cpManagementSrv.retriveCpCompanys(providedUser);
    return new Response(JSON.stringify(serviceRes));
  } catch (error) {
    return new Response(
      JSON.stringify(
        new ApiResponse(
          RESPONSE_STATUS?.ERROR,
          RESPONSE_MESSAGE?.INVALID,
          error,
        ),
      ),
    );
  }
}
