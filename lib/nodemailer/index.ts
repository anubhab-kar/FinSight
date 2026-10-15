import nodemailer from 'nodemailer';
import {WELCOME_EMAIL_TEMPLATE, NEWS_SUMMARY_EMAIL_TEMPLATE} from "@/lib/nodemailer/templates";

const senderEmail = process.env.NODEMAILER_EMAIL;
const senderPassword = process.env.NODEMAILER_PASSWORD;

if (!senderEmail) {
    throw new Error('NODEMAILER_EMAIL is not configured');
}

if (!senderPassword) {
    throw new Error('NODEMAILER_PASSWORD is not configured');
}

const allowInsecureTls =
    process.env.NODE_ENV !== 'production' &&
    process.env.NODEMAILER_ALLOW_INSECURE_TLS === 'true';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: senderEmail,
        pass: senderPassword,
    },
    tls: {
        rejectUnauthorized: !allowInsecureTls,
    }
})

export const sendWelcomeEmail = async ({ email, name, intro }: WelcomeEmailData) => {
    const htmlTemplate = WELCOME_EMAIL_TEMPLATE
        .replace('{{name}}', name)
        .replace('{{intro}}', intro);

    const mailOptions = {
        from: `"FinSight" <${senderEmail}>`,
        to: email,
        subject: `Welcome to FinSight - your stock market toolkit is ready!`,
        text: 'Thanks for joining FinSight',
        html: htmlTemplate,
    }

    await transporter.sendMail(mailOptions);
}

export const sendNewsSummaryEmail = async (
    { email, date, newsContent }: { email: string; date: string; newsContent: string }
): Promise<void> => {
    const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE
        .replace('{{date}}', date)
        .replace('{{newsContent}}', newsContent);

    const mailOptions = {
        from: `"FinSight News" <${senderEmail}>`,
        to: email,
        subject: `📈 Market News Summary Today - ${date}`,
        text: `Today's market news summary from FinSight`,
        html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
};
