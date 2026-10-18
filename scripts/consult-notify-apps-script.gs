/**
 * Google Apps Script — optional doctor email notifications for online consultations.
 *
 * Setup:
 * 1. Open https://script.google.com while signed in to enamelcraft.dental@gmail.com
 * 2. New project → paste this file → save
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the web app URL into js/ec-payment-config.js as notifyUrl
 */

var DOCTOR_EMAIL = "enamelcraft.dental@gmail.com";

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var booking = payload.booking || {};
    var subject = payload.subject || "New online consultation request";
    var body = payload.message || formatBody(booking);

    MailApp.sendEmail({
      to: DOCTOR_EMAIL,
      subject: subject,
      body: body,
    });

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function doGet() {
  return jsonResponse({ ok: true, service: "Enamel Craft consult notify" });
}

function formatBody(booking) {
  return [
    "New online consultation request on enamelcraft.in",
    "",
    "Patient name: " + (booking.name || ""),
    "Phone: " + (booking.phone || ""),
    "Email: " + (booking.email || "Not provided"),
    "Preferred date: " + (booking.preferredDate || ""),
    "Preferred time: " + (booking.preferredTime || ""),
    "Concern: " + (booking.concern || ""),
    "Requested at: " + (booking.createdAt || new Date().toISOString()),
  ].join("\n");
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
