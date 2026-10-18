/**
 * Copy to js/ec-payment-config.js and verify settings.
 *
 * Doctor notification (automatic email on booking):
 * - By default, bookings email enamelcraft.dental@gmail.com via FormSubmit.
 * - On first booking, FormSubmit sends a one-time confirmation link to that inbox — click it to activate.
 * - Optional: deploy scripts/consult-notify-apps-script.gs and set notifyUrl to the web app URL.
 */
window.EC_PAYMENT = {
  paymentPageUrl: "https://pages.razorpay.com/enamelcraft",
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
