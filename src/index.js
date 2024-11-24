#!/usr/bin/env node

// 1. Get auth token from SQLite database
// 2. Attempt to fetch connected client from Asus router
// 3. If redirected to login page, attempt to login and fetch the auth token, store it in the database
// 4. Attempt to fetch connected client from Asus router
// 5. Check if any new clients are connected, if so, update the database

/*
curl 'https://router.ichiva.no/update_clients.asp?_=1732450605302' \
  -H 'cookie: dhcp_sortcol=1; dhcp_sortmet=1; clickedItem_tab=0; asus_s_token=big-nope' \
  -H 'referer: https://router.ichiva.no/' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
*/