import Joi from "joi";
import {
  ApiResponse,
  RESPONSE_MESSAGE,
  RESPONSE_STATUS,
} from "../../../../appConstants";
import getUserByToken from "../../../../helper/getUserByToken";
import CPUserSrv from "../../../../services/cpUserSrv";

export async function POST(request, res) {
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
    role: Joi.string().required(),
    projects: Joi.array().length(1),
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
  const userSrv = new CPUserSrv();
  const srvResponse = await userSrv.retriveParentUsers(providedUser, value);
  return new Response(JSON.stringify(srvResponse));
}
