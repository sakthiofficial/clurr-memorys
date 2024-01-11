import { cookies } from "next/headers";
import Joi from "joi";
import {
  RESPONSE_MESSAGE_DETAILS,
  RESPONSE_STATUS,
  ApiResponse,
  TOKEN_VARIABLES,
  RESPONSE_MESSAGE,
} from "../../../appConstants";
import ProjectSrv from "../../../services/projectSrv";
import getUserByToken from "../../../helper/getUserByToken";

export async function POST(req) {
  try {
    const providedUser = await getUserByToken(req);
    const validateQuery = Joi.object({
      name: Joi.string().required(),
      accessLevel: Joi.string().required(),
      secretKey: Joi.string().required(),
      accessKey: Joi.string().required(),
    });
    const bodyData = await req.json();
    const { error, value } = validateQuery.validate(bodyData);

    if (error) {
      return new Response(
        JSON.stringify(
          new ApiResponse(
            RESPONSE_STATUS?.ERROR,
            RESPONSE_MESSAGE?.INVALID,
            null,
          ),
        ),
      );
    }

    const project = new ProjectSrv();
    const srvResponse = await project.createProject(providedUser, value);
    return new Response(JSON.stringify(srvResponse));
  } catch (error) {
    console.log("Error While Send Project Response", error);
    return new Response(error);
  }
}