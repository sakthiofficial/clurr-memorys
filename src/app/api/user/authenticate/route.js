import Joi from "joi";
import { cookies } from "next/headers";

import CPUserSrv from "../../../../services/cpUserSrv";
import {
  ApiResponse,
  RESPONSE_MESSAGE,
  RESPONSE_STATUS,
  TOKEN_VARIABLES,
} from "../../../../appConstants";

export async function POST(req) {
  const validateQuery = Joi.object({
    name: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string(),
  });
  const bodyData = await req.json();
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
  try {
    const cookieStore = cookies();

    const userSession = cookieStore.get(TOKEN_VARIABLES?.TOKEN_NAME);
    let userToken = null;
    if (userSession) {
      const { value: tokenValue } = userSession;
      userToken = tokenValue;
      cookieStore.delete(TOKEN_VARIABLES?.TOKEN_NAME);
    }
    const user = new CPUserSrv();
    const srvResponse = await user.authenticateUser(value, userToken);
    if (srvResponse?.status === RESPONSE_STATUS?.OK) {
      const responseToken = srvResponse?.result?.token;
      cookies().set(TOKEN_VARIABLES?.TOKEN_NAME, responseToken);
      delete srvResponse?.result?.token;
    }
    return new Response(JSON.stringify(srvResponse));
  } catch (err) {
    console.log("error while requesting authentication", err);
    return new Response(
      JSON.stringify(
        new ApiResponse(RESPONSE_STATUS?.ERROR, RESPONSE_MESSAGE?.INVALID, err),
      ),
    );
  }
}
