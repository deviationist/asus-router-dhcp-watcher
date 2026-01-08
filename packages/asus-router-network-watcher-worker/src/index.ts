
import * as dotenv from 'dotenv';
dotenv.config({ path: process.env.INIT_CWD + '/.env' });
import syncDevices from '@worker/actions/syncDevices';
import '@worker/events/handler';
import cron from 'node-cron';
import { logStep } from './helpers';

(async () => {
  await syncDevices();
})()

cron.schedule('* * * * *', async () => {
  logStep('Running cron job every minute');
  //await syncDevices();
});