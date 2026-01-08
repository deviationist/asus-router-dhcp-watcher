export default async function syncDevices() {

  const authString = Buffer.from(`${process.env.ROUTER_USERNAME}:${process.env.ROUTER_PASSWORD}`).toString('base64');
  console.log('authString', authString);
  const authRequest = await fetch(`${process.env.ROUTER_URL}login.cgi`, {
    method: 'POST',
    referrer: `${process.env.ROUTER_URL}Main_Login.asp`,
    body: `login_authorization=${authString}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  });

  const setCookie = authRequest.headers.getSetCookie();
  const asusTokenCookieString = setCookie.find(e => e.includes(`asus_s_token=`));
  const matches = asusTokenCookieString?.match(/^asus_s_token=(.+?(?=;));/);
  const asusToken = matches?.[1];
  console.log('asusToken', asusToken);

  const indexRequest = await fetch(`${process.env.ROUTER_URL}index.asp`, {
    method: 'GET',
    referrer: `${process.env.ROUTER_URL}login.cgi`,
    headers: {
      'Cookie': `clickedItem_tab=0; asus_s_token=${asusToken}`,
      'User-Agent': process.env.USER_AGENT,
    }
  });
  console.log('indexRequest', await indexRequest.text());

  /*
  //const asusToken = 'ZSGuvTYu2Ts8RU1RimkuNOUzoA22u29';

  /*
  const dhcpRequest = await fetch(`${process.env.ROUTER_URL}update_clients.asp?_=${new Date().getTime()}`, {
    method: 'GET',
    referrer: `${process.env.ROUTER_URL}index.asp`,
    headers: {
      'Cookie': `clickedItem_tab=0; asus_s_token=${asusToken}`,
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    }
  })
  console.log(await dhcpRequest.text()); // Log the response data
  */
  
  /*
  const authString = Buffer.from(`${process.env.ROUTER_USERNAME}:${process.env.ROUTER_PASSWORD}`).toString('base64');
  const cookieKey = 'asus_s_token';
  const response = await fetch(`${process.env.ROUTER_URL}login.cgi`, {
    method: 'POST',
    referrer: `${process.env.ROUTER_URL}Main_Login.asp`,
    body: `login_authorization=${authString}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  });

  const setCookie = response.headers.getSetCookie();
  const asusTokenCookieString = setCookie.find(e => e.includes(`${cookieKey}=`));
  const matches = asusTokenCookieString?.match(/^asus_s_token=(.+?(?=;));/);
  const asusToken = 'weJqvgUZfTvLj2AAOOJrGBDbUrODCxh';//matches?.[1];

  const dhcpRequestUrl = `${process.env.ROUTER_URL}update_clients.asp?_=${new Date().getTime()}`;
  console.log('dhcpRequestUrl', dhcpRequestUrl);

  const dhcpRequest = await fetch(dhcpRequestUrl, {
    method: 'GET',
    headers: {
      'cookie': 'dhcp_sortcol=1; dhcp_sortmet=1; clickedItem_tab=0; asus_s_token=yc88Ddi8CMXk7lPVqaurQynVyMxP5vf',
      'referer': 'https://router.ichiva.no/',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    }
  });

  console.log('dhcpRequest', await dhcpRequest.text());

  console.log('Looking for devices')
  */
}