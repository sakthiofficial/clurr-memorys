import CpManagementSrv from "@/services/cpManagementSrv";
import getUserByToken from "@/helper/getUserByToken";

export async function POST(req) {
  const providedUser = await getUserByToken(req);

  const bodyData = await req.json();

  bodyData.map(async (data) => {
    const value = data;

    const cpManagementSrv = new CpManagementSrv();
    const serviceRes = await cpManagementSrv.createCpAccount(
      providedUser,
      value,
    );
    console.log(serviceRes);
  });
}
