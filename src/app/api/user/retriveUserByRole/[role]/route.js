import getUserByToken from "../../../../../helper/getUserByToken";
import initDb from "../../../../../lib/db";
import {
  ApiResponse,
  RESPONSE_MESSAGE,
  RESPONSE_STATUS,
} from "../../../../../appConstants";
import CPUserSrv from "../../../../../services/cpUserSrv";

export async function GET(request, { params }) {
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
    const { role } = params;
    const cpUserSrv = new CPUserSrv();
    const serviceRes = await cpUserSrv.getUserByRole(providedUser, role);
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
