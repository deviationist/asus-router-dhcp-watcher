import { NOTIFICATION_TO_EMAIL, NOTIFICATION_FROM_EMAIL } from '@worker/constants';
import getClient from '@worker/lib/mail';

export default async function Notify({ subject, message }: { subject: undefined|null|string, message: string }) {
  const msg = {
    to: NOTIFICATION_TO_EMAIL,
    from: NOTIFICATION_FROM_EMAIL,
    subject: subject || 'Notification from Club Hustle',
    text: message,
  };
  try {
    return await getClient().send(msg);
  } catch (error: any) {
    console.log('mail error', error);
    //throw new error;
  }
}