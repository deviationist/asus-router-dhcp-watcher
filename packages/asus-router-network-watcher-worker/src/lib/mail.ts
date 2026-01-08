import sgMail, { MailService } from '@sendgrid/mail';

export default function getClient(): MailService {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  return sgMail;
}

