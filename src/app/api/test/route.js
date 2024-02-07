import CpManagementSrv from "@/services/cpManagementSrv";
import getUserByToken from "@/helper/getUserByToken";
import { CpAppUser } from "../../../../models/AppUser";

export async function POST(req) {
  const providedUser = await getUserByToken(req);
  // const result = await CpAppUser.deleteMany({
  //   role: { $in: ["65a8c1178ab82c8e89168216"] },
  // });
  // console.log(result);
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
