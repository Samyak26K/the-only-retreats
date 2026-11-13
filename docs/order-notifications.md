# Order notifications

After an order is saved, `/api/razorpay/verify` schedules `notifyNewOrder()`
(`lib/services/order-notifications.ts`) with `after()`. That runs once the
customer already has their response. Each channel has an 8-second timeout, and
any failure is logged with the prefix `[order-notify]`. A failure here can never
block or undo an order.

Each channel is skipped when its env vars are not set.

## 1. Google Sheet

1. Create a Google Sheet, then open **Extensions → Apps Script**.
2. Paste this script, then save:

```js
const HEADERS = [
  "Received",
  "Order",
  "Created",
  "Customer",
  "Email",
  "Phone",
  "Items",
  "Subtotal",
  "Discount",
  "Coupon",
  "Total",
  "Currency",
  "Payment ID",
  "Address",
];

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  const o = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(),
    o.orderNumber,
    o.createdAt,
    o.customerName,
    o.email,
    "'" + o.phone,
    o.itemsText,
    o.subtotal,
    o.discount,
    o.couponCode,
    o.total,
    o.currency,
    o.paymentId,
    o.address,
  ]);
  return ContentService.createTextOutput("ok");
}
```

3. Click **Deploy → New deployment**, choose the type **Web app**, set
   _Execute as_ to **Me** and _Who has access_ to **Anyone**, then deploy.
4. Copy the `https://script.google.com/macros/s/.../exec` URL into
   `ORDERS_SHEET_WEBHOOK_URL` in Vercel (Production).

If you edit the script later, deploy a **new version** of the same
deployment. Otherwise the URL keeps serving the old code.

## 2. WhatsApp via CallMeBot

1. From the admin's WhatsApp, send `I allow callmebot to send me messages` to
   the CallMeBot number listed at https://www.callmebot.com/blog/free-api-whatsapp-messages/.
2. CallMeBot replies with your API key.
3. In Vercel, set `CALLMEBOT_PHONE` (with country code, e.g. `919876543210`)
   and `CALLMEBOT_APIKEY`.

Each message contains the order number, customer, phone, items, total and
address.

## Checking that it works

Place an order, then look in the Vercel logs for the
`/api/razorpay/verify` request. If you see no `[order-notify]` error lines,
both channels succeeded.
