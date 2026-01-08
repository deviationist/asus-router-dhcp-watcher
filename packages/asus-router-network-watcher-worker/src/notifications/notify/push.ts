import { Pushover } from '@worker/lib/pushover';

export default async function Notify({ subject, message }: { subject: undefined|null|string, message: string }): Promise<any> {
  try {
    return await Pushover(subject || '', message);
  } catch (error: any) {
    console.log('push error', error);
    //throw new error;
  }
}