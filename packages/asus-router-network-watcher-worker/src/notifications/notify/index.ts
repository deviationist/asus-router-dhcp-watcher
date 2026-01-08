import { NOTIFICATION_CHANNELS } from '@worker/constants';
import Mail from './mail';
import Push from './push';

export default async function Notify({ subject, message }: { subject: undefined|null|string, message: string }) {
  if (NOTIFICATION_CHANNELS.includes('email')) {
    await Mail({ subject, message });
  }
  if (NOTIFICATION_CHANNELS.includes('push')) {
    await Push({ subject, message });
  }
}