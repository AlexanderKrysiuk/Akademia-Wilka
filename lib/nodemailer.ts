const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "maestro.atthost24.pl",
    port: "465",
    secure: true,
    auth: {
        user: "info@akademiawilka.pl",
        pass: "Nd6t@hhObHA@f"
    }
})

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`

    await transporter.sendMail({
        from: "info@akademiawilka.pl",
        to: email,
        subject: "Potwierdź swój email",
        html: `<p>Kliknij <a href="${confirmLink}">tutaj</a> by zweryfikować email.</p>`
    })
}