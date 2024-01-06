const nodemailer = require("nodemailer");
const ejs = require("ejs");
const fs = require("fs");

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sakthivel.g@alliancezone.in",
    pass: "Pass@2k23",
  },
});

// Function to send the email
async function sendRoleAddedEmail(managerEmail, userName, userEmail, userRole) {
  try {
    // Render the HTML template with dynamic data

    // Define the email options
    const mailOptions = {
      from: "sakthiroky123@gmail.com",
      to: managerEmail,
      subject: "New User Role Added",
      text: "User as been created",
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example usage
const managerEmail = "manager@example.com";
const newUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  role: "New Role",
};

sendRoleAddedEmail(managerEmail, newUser.name, newUser.email, newUser.role);
