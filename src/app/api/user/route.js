import { cookies } from "next/headers";
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

export async function POST(req) {
  try {
    const providedUser = await getUserByToken(req);

    const bodyData = await req.json();
    const validateQuery = Joi.object({
      name: Joi.string().required(),
      password: Joi.string().required(),
      email: Joi.string().required(),
      role: Joi.string().required(),
      projects: checkProjectValidation(bodyData?.role)
        ? Joi.array().length(1)
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
    if (srvResponse?.success === RESPONSE_MESSAGE?.INVALID) {
      console.log(srvResponse);

      return new Response(
        JSON.stringify(
          new ApiResponse(RESPONSE_STATUS.ERROR, RESPONSE_MESSAGE?.INVALID),
        ),
      );
    }
    return new Response(JSON.stringify(srvResponse));
  } catch (error) {
    return new Response(
      JSON.stringify(
        new ApiResponse(RESPONSE_STATUS?.ERROR, RESPONSE_MESSAGE?.ERROR, null),
      ),
    );
  }
}
export async function GET(req) {
  const providedUser = await getUserByToken(req);

  const userSrv = new CPUserSrv();
  const users = await userSrv.retriveUser(providedUser);
  return new Response(
    JSON.stringify(
      new ApiResponse(RESPONSE_STATUS?.OK, RESPONSE_MESSAGE?.OK, users?.result),
    ),
  );
}
export async function DELETE(request) {
  const providedUser = await getUserByToken(request);
  const userId = request.nextUrl.searchParams.get("id");
  if (!userId) {
    return new Response.Json(
      new ApiResponse(RESPONSE_STATUS?.NOTFOUND, RESPONSE_MESSAGE?.INVALID),
    );
  }
  const userSrv = new CPUserSrv();
  const srvResponse = await userSrv.removeUser(providedUser, userId);
  if (srvResponse?.success === RESPONSE_MESSAGE?.INVALID) {
    return new Response(
      JSON.stringify(
        new ApiResponse(
          RESPONSE_STATUS?.UNAUTHORIZED,
          RESPONSE_MESSAGE?.INVALID,
        ),
      ),
    );
  }
  if (srvResponse?.success === RESPONSE_MESSAGE?.NOTFOUND) {
    return new Response(
      JSON.stringify(
        new ApiResponse(RESPONSE_STATUS?.NOTFOUND, RESPONSE_MESSAGE?.NOTFOUND),
      ),
    );
  }

  return new Response(
    JSON.stringify(new ApiResponse(RESPONSE_STATUS?.OK, RESPONSE_MESSAGE?.OK)),
  );
}
export async function PUT(request) {
  const providedUser = await getUserByToken(request);
  const bodyData = await request.json();
  const validateQuery = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().required(),
    role: Joi.string().required(),
    projects: checkProjectValidation(bodyData?.role)
      ? Joi.array().length(1)
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
  const srvResponse = await user.updateUser(providedUser, value);
  if (srvResponse?.success === RESPONSE_MESSAGE?.INVALID) {
    return new Response(
      JSON.stringify(new ApiResponse(RESPONSE_STATUS?.UNAUTHORIZED)),
    );
  }
  if (srvResponse?.success === RESPONSE_MESSAGE?.ERROR) {
    return new Response(
      JSON.stringify(
        new ApiResponse(
          RESPONSE_STATUS?.ERROR,
          RESPONSE_MESSAGE?.ERROR,
          srvResponse?.result,
        ),
      ),
    );
  }
  return new Response(
    JSON.stringify(new ApiResponse(RESPONSE_STATUS?.OK, RESPONSE_MESSAGE?.OK)),
  );
}
