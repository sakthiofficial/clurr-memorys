import Joi from "joi";
import CPUserSrv from "../../../services/cpUserSrv";
import {
  RESPONSE_STATUS,
  ApiResponse,
  RESPONSE_MESSAGE,
} from "../../../appConstants";
import { checkProjectValidation } from "../../../../shared/roleManagement";
import getUserByToken from "../../../helper/getUserByToken";
import { roleNames } from "../../../../shared/cpNamings";

export async function GET(req) {
  const providedUser = await getUserByToken(req);
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
  const userSrv = new CPUserSrv();
  const srvResponse = await userSrv.retriveUser(providedUser);
  return new Response(JSON.stringify(srvResponse));
}
export async function PUT(request) {
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
      id: Joi.string().required(),
      name: Joi.string().required(),
      email: Joi.string().required(),
      role: Joi.string().required(),
      projects: checkProjectValidation(bodyData?.role)
        ? Joi.array().length(1)
        : Joi.array(),
      phone: Joi.string().required(),
      parentId:
        roleNames?.superAdmin === bodyData?.role
          ? Joi.string().allow("")
          : Joi.string().required(),
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

    const user = new CPUserSrv();
    const srvResponse = await user.updateUser(providedUser, value);

    return new Response(JSON.stringify(srvResponse));
  } catch (error) {
    return new Response(
      JSON.stringify(RESPONSE_STATUS?.ERROR, RESPONSE_MESSAGE?.ERROR, error),
    );
  }
}
export async function POST(req) {
  try {
    const providedUser = await getUserByToken(req);
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
    const bodyData = await req.json();
    const validateQuery = Joi.object({
      name: Joi.string().required(),
      password: Joi.string().required(),
      phone: Joi.string().required().min(10),

      email: Joi.string().required(),
      role: Joi.array().required(),
      projects: checkProjectValidation(bodyData?.role)
        ? Joi.array().min(1)
        : Joi.array(),
      parentId:
        roleNames?.superAdmin === bodyData?.role
          ? Joi.string().allow("")
          : Joi.string().required(),
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

    const user = new CPUserSrv();
    const srvResponse = await user.createUser(providedUser, value);

    return new Response(JSON.stringify(srvResponse));
  } catch (error) {
    return new Response(
      JSON.stringify(
        new ApiResponse(RESPONSE_STATUS?.ERROR, RESPONSE_MESSAGE?.ERROR, error),
      ),
    );
  }
}
export async function DELETE(request) {
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
    const userId = request.nextUrl.searchParams.get("id");
    if (!userId) {
      return new Response(
        JSON.stringify(
          new ApiResponse(
            RESPONSE_STATUS?.NOTFOUND,
            RESPONSE_MESSAGE?.INVALID,
            null,
          ),
        ),
      );
    }
    const userSrv = new CPUserSrv();
    const srvResponse = await userSrv.removeUser(providedUser, userId);

    return new Response(JSON.stringify(srvResponse));
  } catch (error) {
    return new Response(
      JSON.stringify(
        new ApiResponse(RESPONSE_STATUS?.ERROR, RESPONSE_MESSAGE?.ERROR, error),
      ),
    );
  }
}
