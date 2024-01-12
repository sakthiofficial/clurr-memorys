const nodemailer = require('nodemailer');

export async function sendEmail(userName, parentName, userEmail, role, websiteLink) {
  // Create a transporter using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Replace with your email service provider
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password',
    },
  });

  // Email content
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: userEmail,
    subject: `Welcome, ${userName}!`,
    text: `Hey ${userName},\n\nYou have been created as a ${role}. Please contact Urbanrise team to get your credentials.\n\nLogin to ${websiteLink}.\n\nBest regards,\n${parentName}`,
  };

  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Example usage
const userName = 'John Doe';
const parentName = 'Urbanrise Team';
const userEmail = 'john.doe@example.com';
const role = 'User'; // Replace with the actual role
const websiteLink = 'https://example.com'; // Replace with the actual website link

sendEmail(userName, parentName, userEmail, role, websiteLink);
