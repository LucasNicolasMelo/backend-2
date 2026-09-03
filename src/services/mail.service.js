import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: Number(process.env.MAIL_PORT) === 465,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

export async function sendConfirmationEmail({
    email,
    reservationCode,
    eventTitle,
    quantity
}) {
    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: email,
        subject: "Confirmación de inscripción",
        html: `
            <h2>Inscripción confirmada</h2>

            <p>Tu inscripción fue realizada correctamente.</p>

            <p><strong>Evento:</strong> ${eventTitle}</p>
            <p><strong>Cantidad:</strong> ${quantity}</p>
            <p><strong>Código de reserva:</strong> ${reservationCode}</p>

            <p>¡Gracias por tu inscripción!</p>
        `
    });
}