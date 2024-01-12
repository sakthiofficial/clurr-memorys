const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const CLIENT_ID =
  "328651052743-5cnsm90ijd4ostvd6i9i7e61ql9o7u69.apps.googleusercontent.com";
const CLEINT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
  "1//04pt0d0AFzD5BCgYIARAAGAQSNwF-L9Iro77czt8RAe4c7E075mz8YFpU_jxYRg9SwYhAtYK9hKw2NLk_Rp6Nx3-1VgCTrWx0Y24";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export default async function sendMail(
  userName,
  parentName,
  userEmail,
  role,
  projects
) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "sakthivel.g@alliancezone.in",
        clientId: CLIENT_ID,
        clientSecret: CLEINT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    const mailOptions = {
      from: "CP PORTAL HYDRABAD <sakthivel.g@alliancezone.in>",
      to: userEmail,
      subject: "Message from Urbanrise",
      text: `Hey ${userName},\n\nYou have been designated as a${role} for the projects ${projects}.\nPlease contact Urbanrise team to get your credentials.\n\nLogin to  https://cph.urbanriseprojects.in .\n\nBest regards,\n${parentName}`,
    };
    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}
