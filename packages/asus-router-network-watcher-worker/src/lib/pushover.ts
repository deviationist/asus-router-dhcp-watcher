export async function Pushover(title: string, message: string) {
  if (!process.env.PUSHOVER_TOKEN || !process.env.PUSHOVER_USER_KEY) {
    console.log('Pushover not configured');
    return;
  }
  try {
    let formData = new FormData();
    formData.append('title', title);
    formData.append('message', message);
    formData.append('token', process.env.PUSHOVER_TOKEN);
    formData.append('user', process.env.PUSHOVER_USER_KEY);
    const request = await fetch('https://api.pushover.net/1/messages.json', {
      method: 'POST',
      body: formData
    });
    return { 
      status: request.status, 
      ok: request.ok, 
      body: await request.json()
    };
  } catch (error: any) {
    console.log('error', error);
    //throw new error;
  }
}