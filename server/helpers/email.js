import * as config from "../config.js";

const style = `
background: #eee;
padding:20px;
border-radius:20px;`

export const emailTemplate =(email, content ,replyto, subject) =>{
    return {
        Source: config.EMAIL_FROM,
        Destination: {
          ToAddresses: [email],
        },
        Message: {
          Subject: {
            Charset: "UTF-8",
            Data: subject,
          },
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: `<html>
                <h1 style="{style}">Welcome to Realist App.</h1>
                ${content}
                <p>&copy;${new Date().getFullYear()}</p>
              </html>`,
            },
          },
        },
    }
}