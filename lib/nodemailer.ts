import { VerificationToken } from "@prisma/client";

import nodemailer from 'nodemailer';

// Ustawienia SMTP
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true, // czytanie bez SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const domain = process.env.NEXT_PUBLIC_APP_URL

export async function sendVerificationEmail(token:VerificationToken) {
  const htmlContent = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            text-align: center;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #333;
            font-size: 24px;
          }
          p {
            color: #555;
            font-size: 16px;
          }
          .button {
            display: inline-block;
            padding: 15px 30px;
            background-color: #126697; /* Kolor tła */
            color: white; /* Kolor tekstu */
            text-decoration: none;
            font-size: 18px;
            border-radius: 5px;
            text-align: center;
            font-weight: bold;
            margin-top: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .button:hover {
            background-color: #0f4e63; /* Ciemniejszy odcień przy najechaniu */
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="https://www.akademiawilka.pl/akademia-wilka-logo-banner.svg" alt="Akademia Wilka"/>
          <h1>Witaj w Akademii Wilka!</h1>
          <p>Jesteśmy podekscytowani, że dołączyłeś do naszej społeczności. Aby zakończyć proces rejestracji i rozpocząć korzystanie z kursów, kliknij przycisk poniżej, aby zweryfikować swoje konto i ustawić hasło:</p>
          <a href="${domain}/auth/verification?token=${token.id}" class="button">Zweryfikuj Konto</a>
        </div>
      </body>
    </html>
  `
  await transporter.sendMail({
    from: "info@akademiawilka.pl",
    to: token.email,
    subject: "Witaj w Akademii Wilka! Potwierdź swój adres e-mail",
    html: htmlContent
  })
}

export async function sendPasswordResetEmail(token: VerificationToken) {
  const htmlContent = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            text-align: center;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #333;
            font-size: 24px;
          }
          p {
            color: #555;
            font-size: 16px;
          }
          .button {
            display: inline-block;
            padding: 15px 30px;
            background-color: #126697;
            color: white;
            text-decoration: none;
            font-size: 18px;
            border-radius: 5px;
            text-align: center;
            font-weight: bold;
            margin-top: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .button:hover {
            background-color: #0f4e63;
          }
          .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #888;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="https://www.akademiawilka.pl/akademia-wilka-logo-banner.svg" alt="Akademia Wilka"/>
          <h1>Resetowanie hasła</h1>
          <p>Otrzymaliśmy prośbę o zresetowanie Twojego hasła. Jeśli to Ty wysłałeś/aś tę prośbę, kliknij poniższy przycisk, aby ustawić nowe hasło:</p>
          <a href="${domain}/auth/verification?token=${token.id}" class="button">Zresetuj hasło</a>
          <p>Jeśli nie prosiłeś/aś o zmianę hasła, zignoruj ten e-mail.</p>
          <p class="footer">© 2024 Akademia Wilka. Wszelkie prawa zastrzeżone.</p>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: "info@akademiawilka.pl",
    to: token.email,
    subject: "Resetowanie hasła w Akademii Wilka",
    html: htmlContent,
  });
}