import { headers } from "next/headers";
import Joi from "joi";
import getUserByToken from "../../../../../helper/getUserByToken";
import { ApiResponse, RESPONSE_MESSAGE, RESPONSE_STATUS } from "@/appConstants";
import CPUserSrv from "@/services/cpUserSrv";

export async function GET(request, { params }) {
  const providedUser = await getUserByToken(request);
  const headersList = headers();
  const { id } = headersList.get("id");

  if (!providedUser || !id) {
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
  console.log("Comming here", params, providedUser);
}
