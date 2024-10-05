const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`

    const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; margin: 20px;">
        <h2 style="color: #333;">Potwierdź swój email</h2>
        <p>
          Kliknij <a href="${confirmLink}" style="color: #0070f3; text-decoration: none;">tutaj</a> by zweryfikować email.
        </p>
        <p>
          Dziękujemy, że dołączyłeś do nas!
        </p>
      </body>
    </html>
    `;

    await transporter.sendMail({
        from: "info@akademiawilka.pl",
        to: email,
        subject: "Potwierdź swój email",
        html: htmlContent
    })
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${domain}/auth/new-password?token=${token}`

    await transporter.sendMail({
        from: "info@akademiawilka.pl",
        to: email,
        subject: "Zresetuj swoje hasło",
        html: `<p>Kliknij <a href="${resetLink}">tutaj</a> by zresetować hasło.</p>`
    })
}