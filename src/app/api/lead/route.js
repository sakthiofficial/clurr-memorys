import Joi from "joi";
import {
  ApiResponse,
  RESPONSE_MESSAGE,
  RESPONSE_STATUS,
} from "../../../appConstants";
import getUserByToken from "../../../helper/getUserByToken";
import LSQLeadSrv from "../../../services/lsqLeadSrv";

export async function POST(req) {
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
    id: Joi.string().required(),
    userName: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    notes: Joi.string(),
    project: Joi.string().required(),
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
  const leadSrv = new LSQLeadSrv();
  const serviceRes = await leadSrv.createLead(providedUser, value);
  return new Response(JSON.stringify(serviceRes));
}
export async function GET(request) {
  const project = request.nextUrl.searchParams.get("project");

  const providedUser = await getUserByToken(request);
  if (!providedUser || !project) {
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
  const leadSrv = new LSQLeadSrv();
  const serviceRes = await leadSrv.retriveLead(providedUser, project);
  return new Response(JSON.stringify(serviceRes));
}
