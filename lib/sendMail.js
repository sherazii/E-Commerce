import nodemailer from "nodemailer";

export const sendMail = async (subject, receiver, body) => {
  const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    secure: process.env.NODEMAILER_PORT == 465, // true if 465
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD, // must be app password
    },
  });

  try {
    await transporter.verify(); // check connection

    await transporter.sendMail({
      from: `"Sheraz Hashmi" <${process.env.NODEMAILER_EMAIL}>`,
      to: receiver,
      subject,
      html: body,
    });

    return { success: true };
  } catch (error) {
    console.error("Email sending failed:", error.message);
    return { success: false, message: error.message };
  }
};
