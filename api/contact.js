// Vercel serverless function: receives the website contact form and emails it
// to Eleven B Site Sense through Resend, then sends the customer a short
// confirmation. Same pattern as skkuglobal.com/api/contact.
//
// Vercel environment variables:
//   RESEND_API_KEY  (required)  Resend API key
//   CONTACT_TO      (optional)  where enquiries go; default ganiyutaiwo2020@gmail.com
//   CONTACT_FROM    (optional)  verified sender, e.g. "Eleven B Site Sense <enquiries@elevenbsitesense.com>"
//   AUTOREPLY       (optional)  set to "0" to turn off the customer confirmation email

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const line = (s, n) => String(s ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, n);
const block = (s, n) => String(s ?? "").trim().slice(0, n);
const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const debug = process.env.VERCEL_ENV === "preview" || process.env.VERCEL_ENV === "development";
const fail = (res, code, reason) => res.status(code).json({ ok: false, ...(debug && reason ? { reason } : {}) });

function okOrigin(o) {
  if (!o) return true;
  try {
    const h = new URL(o).hostname;
    return h === "elevenbsitesense.com" || h === "www.elevenbsitesense.com" || h === "localhost" || h.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

async function mail(key, payload) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (r.ok) return { ok: true };
  let message = "";
  try {
    message = (await r.json()).message || "";
  } catch {}
  console.error("resend", r.status, message);
  return { ok: false, status: r.status, message };
}

const firstName = (n) => (/^[\p{L}\p{M}][\p{L}\p{M}' .-]{0,59}$/u.test(n) ? n.split(" ")[0] : "there");

const replyHtml = (first, service) =>
  `<!doctype html><html><body style="margin:0;background:#F7F5F0;font-family:Arial,Helvetica,sans-serif;color:#14202B">` +
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">` +
  `<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">` +
  `<tr><td style="font-size:18px;font-weight:bold;letter-spacing:1px;padding-bottom:24px">ELEVEN B SITE SENSE</td></tr>` +
  `<tr><td style="font-size:28px;line-height:1.15;font-weight:bold;padding-bottom:16px">We've received your enquiry.</td></tr>` +
  `<tr><td style="font-size:16px;line-height:1.6;padding-bottom:16px">Hi ${esc(first)},<br><br>Thank you for contacting Eleven B Site Sense. Your project details have reached our team and we will get back to you shortly.</td></tr>` +
  `<tr><td style="font-size:15px;line-height:1.6;padding:16px;background:#ECE8DF">Service: <b>${esc(service)}</b></td></tr>` +
  `<tr><td style="font-size:15px;line-height:1.6;padding-top:16px;color:#5B6670">Want to add photos or more details? Just reply to this email.</td></tr>` +
  `<tr><td style="font-size:13px;color:#7A848C;padding-top:32px">ELEVEN B SITE-SENSE NIGERIA LIMITED &middot; elevenbsitesense.com</td></tr>` +
  `</table></td></tr></table></body></html>`;

const replyText = (first, service) =>
  `Hi ${first},\n\nThank you for contacting Eleven B Site Sense. Your project details have reached our team and we will get back to you shortly.\n\nService: ${service}\n\nWant to add photos or more details? Just reply to this email.\n\nELEVEN B SITE-SENSE NIGERIA LIMITED\nhttps://elevenbsitesense.com\n`;

export default async function handler(req, res) {
  if (req.method !== "POST") return fail(res, 405, "method");
  if (!okOrigin(req.headers.origin)) return fail(res, 403, "origin " + req.headers.origin);

  const b = req.body && typeof req.body === "object" ? req.body : {};
  if (b.company_website) return res.status(200).json({ ok: true }); // spam trap

  const name = line(b.name, 100);
  const email = line(b.email, 150);
  const phone = line(b.phone, 40);
  const service = line(b.serviceTitle || b.service, 120) || "Not specified";
  const message = block(b.message, 3000);
  if (!name || !isEmail(email) || message.length < 10) return fail(res, 400, "validation");

  const key = process.env.RESEND_API_KEY;
  if (!key) return fail(res, 500, "RESEND_API_KEY is not set for this deployment");
  const to = process.env.CONTACT_TO || "ganiyutaiwo2020@gmail.com";
  const from = process.env.CONTACT_FROM || "Eleven B Site Sense <onboarding@resend.dev>";

  const html =
    `<h2>New website enquiry</h2>` +
    `<p><b>Service:</b> ${esc(service)}</p>` +
    `<p><b>Name:</b> ${esc(name)}<br><b>Email:</b> ${esc(email)}<br><b>Phone:</b> ${esc(phone || "-")}</p>` +
    `<p><b>Message:</b><br>${esc(message).replace(/\n/g, "<br>")}</p>` +
    `<p style="color:#888">Reply to this email to answer the customer directly.</p>`;

  const sent = await mail(key, {
    from,
    to: [to],
    subject: `New enquiry: ${service} - ${name}`,
    html,
    reply_to: email,
  });
  if (!sent.ok) return fail(res, 502, `resend ${sent.status}: ${sent.message}`);

  if (process.env.AUTOREPLY !== "0") {
    const first = firstName(name);
    await mail(key, {
      from,
      to: [email],
      reply_to: to,
      subject: "We received your enquiry - Eleven B Site Sense",
      html: replyHtml(first, service),
      text: replyText(first, service),
      headers: { "Auto-Submitted": "auto-replied", "X-Auto-Response-Suppress": "All" },
    });
  }
  return res.status(200).json({ ok: true });
}
