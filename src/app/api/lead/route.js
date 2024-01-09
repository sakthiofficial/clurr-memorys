import Joi from "joi";
import handler from "../../lib/handler";
import config from "../../../lib/config";
// import { LpLead } from "../../../models/lplead";
import {
  ApiResponse,
  RESPONSE_MESSAGE,
  RESPONSE_STATUS,
} from "../../../appConstants";

export default handler({ checkAuthenticated: true }).post(async (req, res) => {
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
    userName: Joi.string().required(),
    email: Joi.string().required(),
    phoneNo: Joi.string().required(),
    source: Joi.string().required(),
    subSource: Joi.string().required(),
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

  //   try {
  //     await new LpLead({
  //       FirstName: userName,
  //       EmailAddress: email,
  //       Phone: phoneNo,
  //       Source: source,
  //       SourceMedium: medium,
  //       SourceCampaign: campaign,
  //       SourceContent: content,
  //     }).save();
  //   } catch (err) {
  //     console.log("Error saving to db");
  //   }

  const { accessKey, secretKey } = config.lsqConfig[value?.project];

  res.sendPromise(promise);
});
