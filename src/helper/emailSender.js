import sgMail from "@sendgrid/mail";

export default async function sendMail(mailOptions) {
  try {
    sgMail.setApiKey(
      "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",
    );
    const result = await sgMail.send(mailOptions);
    console.log(result);
    return result;
  } catch (error) {
    return error;
  }
}
