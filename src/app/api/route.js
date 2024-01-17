import handler from "@/lib/handler";

// export async function GET(req, res) {
//   try {
//     const testUser = {
//       name: "cpheas",
//       role: roleNames?.cpBusinessHead,
//       email: "new2@gmail.com",
//       password: "sakthi",
//       permissions: ["test"],
//       parentId: "64b7e19edf96b601b9ee95e5",
//       activity: [],
//       subordinateRoles: [],
//       projects: [],
//     };
//     const user = new CPUserSrv();
//     const response = await user.createUser(null, testUser);
//     console.log(response);

//     return new Response(res);
//   } catch (error) {
//     console.log(error);
//     return new Response(error);
//   }
// }
export default handler().get(async (req, res) => {
  res.send({ message: "Request Comming" });
});
