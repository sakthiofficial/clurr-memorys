export function superAdminMailOptions(
  adduser,
  createdUser,
  role,
  permissions,
  projects,
) {
  return {
    from: "CP PORTAL HYDERABAD <sakthivel.g@alliancezone.in>",
    to: "	mohammedidris@alliancein.com",
    subject: "New User Added in CP Portal",
    html: `
        <html>
          <head>
            <style>
              body {
                font-family: 'Arial', sans-serif;
                margin: 20px;
                padding: 20px;
                background-color: #f4f4f4;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              h1 {
                color: #000; /* Primary color */
              }
              p {
                color: #555;
                line-height: 1.5;
              }
              strong {
                color: #F9B800; /* Secondary color */
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>New User Created in CP Portal</h1>
    
              <p>Dear Idris,</p>
    
              <p>The user ${adduser} has created a new user ${createdUser} with the role ${role}. Permissions granted include: <strong>${permissions}</strong>.</p>
    
              <p>Assigned projects: ${projects}</p>
    
              <p>Thank you.</p>
            </div>
          </body>
        </html>
      `,
  };
}
export function userMailOption(
  userName,
  parentName,
  userEmail,
  role,
  projects,
) {
  return {
    from: "CP PORTAL HYDERABAD <sakthivel.g@alliancezone.in>",
    to: userEmail,
    subject: "Message from Urbanrise",
    html: `
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
          
              background-color: #f4f4f4;
            }
            .container {
              max-width: 600px;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #000;
            }
            p {
              color: #555;
              line-height: 1.5;
            }
            a {
              color: #F9B800; /* Secondary color */
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Dear ${userName},</h1>

           <p>Your account is successfully created in Urbanrise Hyderabad CP Portal.</p>
            <p>Your current role is ${role} for the following Urbanrise Hydrabad projects ${projects}.</p>
  
            <p>Please contact the Urbanrise team to obtain your credentials.</p>
  
            <p>Login to our portal at: <a href="https://cph.urbanriseprojects.in" style="color: #F9B800;">https://cph.urbanriseprojects.in</a></p>
  
            <p>Best regards,<br>${parentName}</p>
          </div>
        </body>
      </html>
    `,
  };
}
export function cpMailOption(
  userName,
  parentName,
  userEmail,
  role,
  projects,
  companyCode,
) {
  return {
    from: "CP PORTAL HYDERABAD <sakthivel.g@alliancezone.in>",
    to: userEmail,
    subject: "Message from Urbanrise",
    html: `
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f4f4f4;
            }
            .container {
              max-width: 600px;
              background-color: #ffffff;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              margin: 20px auto;
            }
            h1 {
              color: #000;
            }
            p {
              color: #555;
              line-height: 1.5;
              margin-bottom: 15px;
            }
            a {
              color: #F9B800; /* Secondary color */
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Dear ${userName},</h1>
            <p>Your account is successfully created in Urbanrise Hyderabad CP Portal.</p>
  
            <p>Your current role is ${role} for the following Urbanrise Hyderabad projects: ${projects}.</p>
  
            <p>Your company code is: ${companyCode}</p>

            <p>Please contact the Urbanrise team to obtain your credentials.</p>
  
            <p>Login to our portal at: <a href="https://cph.urbanriseprojects.in" style="color: #F9B800;">https://cph.urbanriseprojects.in</a></p>
  
            <p>Best regards,<br>${parentName}</p>
          </div>
        </body>
      </html>
    `,
  };
}
