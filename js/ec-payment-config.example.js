/**
 * Copy to js/ec-payment-config.js and verify settings.
 *
 * Doctor notification (automatic email on booking):
 * - By default, bookings email enamelcraft.dental@gmail.com via FormSubmit (https://formsubmit.co).
 * - REQUIRED: open enamelcraft.dental@gmail.com and find FormSubmit's "Activate Form" email
 *   (search for "FormSubmit" / "Activate Form"). Until you click it, no booking emails are delivered.
 * - Prefer reliable mail: deploy scripts/consult-notify-apps-script.gs and set notifyUrl to the web app URL.
 * - WhatsApp is always the patient-facing backup on the thank-you page.
 */
window.EC_PAYMENT = {
  paymentPageUrl: "https://pages.razorpay.com/enamelcraft",
  qrPayPageUrl: "pay.html",
  qrImagePath: "img/EC-Payment.png",
  qrDownloadFilename: "enamelcraft-upi-qr.png",
  amountPaise: 29900,
  amountDisplay: "₹299",
  productName: "Online Dental Consultation",
  clinicName: "Enamel Craft Dental Studio",
  clinicEmail: "enamelcraft.dental@gmail.com",
  clinicPhone: "+917666297468",
  whatsappNumber: "917666297468",
  thankYouPath: "online-consultation-thank-you.html",
  notifyDoctor: true,
  notifyUrl: "",
};
