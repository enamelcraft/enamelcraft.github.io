(function () {
  "use strict";

  var STORAGE_KEY = "ecOnlineConsultBooking";
  var NOTIFY_STATUS_KEY = "ecConsultNotifyStatus";
  var config = window.EC_PAYMENT || {};

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function getFormData(form) {
    return {
      name: (form.querySelector('[name="name"]') || {}).value || "",
      phone: (form.querySelector('[name="phone"]') || {}).value || "",
      email: (form.querySelector('[name="email"]') || {}).value || "",
      preferredDate: (form.querySelector('[name="preferredDate"]') || {}).value || "",
      preferredTime: (form.querySelector('[name="preferredTime"]') || {}).value || "",
      concern: (form.querySelector('[name="concern"]') || {}).value || "",
      createdAt: new Date().toISOString(),
    };
  }

  function saveBooking(data) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      /* ignore quota errors */
    }
  }

  function saveNotifyStatus(status) {
    try {
      sessionStorage.setItem(NOTIFY_STATUS_KEY, status);
    } catch (e) {
      /* ignore quota errors */
    }
  }

  function loadBooking() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function loadNotifyStatus() {
    try {
      return sessionStorage.getItem(NOTIFY_STATUS_KEY) || "";
    } catch (e) {
      return "";
    }
  }

  function getPaymentPageUrl() {
    return (config.paymentPageUrl || config.paymentLinkUrl || "").trim();
  }

  function isNotifyEnabled() {
    return config.notifyDoctor !== false;
  }

  function formatDoctorEmailBody(data) {
    return [
      "A new online consultation has been requested on enamelcraft.in",
      "",
      "Patient name: " + data.name,
      "Phone: " + data.phone,
      "Email: " + (data.email || "Not provided"),
      "Preferred date: " + data.preferredDate,
      "Preferred time: " + data.preferredTime,
      "Concern: " + data.concern,
      "Requested at: " + (data.createdAt || new Date().toISOString()),
      "",
      "Next step: patient pays Rs 299 on Razorpay and shares payment screenshot on WhatsApp.",
    ].join("\n");
  }

  function notifyDoctorViaAppsScript(data) {
    var notifyUrl = (config.notifyUrl || "").trim();
    if (!notifyUrl) {
      return Promise.reject(new Error("No notify URL"));
    }

    return fetch(notifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "online_consultation",
        subject: "New online consultation request – " + data.name,
        message: formatDoctorEmailBody(data),
        booking: data,
      }),
    }).then(function (response) {
      if (!response.ok) {
        throw new Error("Notify request failed");
      }
      return response.json().catch(function () {
        return { ok: true };
      });
    });
  }

  function notifyDoctorViaFormSubmit(data) {
    var clinicEmail = (config.clinicEmail || "").trim();
    if (!clinicEmail) {
      return Promise.reject(new Error("No clinic email"));
    }

    return fetch("https://formsubmit.co/ajax/" + encodeURIComponent(clinicEmail), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: "New online consultation request – " + data.name,
        _template: "table",
        _captcha: "false",
        name: data.name,
        phone: data.phone,
        patient_email: data.email || "Not provided",
        preferred_date: data.preferredDate,
        preferred_time: data.preferredTime,
        concern: data.concern,
        requested_at: data.createdAt || new Date().toISOString(),
        message: formatDoctorEmailBody(data),
      }),
    }).then(function (response) {
      if (!response.ok) {
        throw new Error("Email notify failed");
      }
      return response.json();
    });
  }

  function notifyDoctor(data) {
    if (!isNotifyEnabled()) {
      saveNotifyStatus("skipped");
      return Promise.resolve("skipped");
    }

    var notifyUrl = (config.notifyUrl || "").trim();
    var send = notifyUrl ? notifyDoctorViaAppsScript(data) : notifyDoctorViaFormSubmit(data);

    return send
      .then(function () {
        saveNotifyStatus("sent");
        return "sent";
      })
      .catch(function () {
        saveNotifyStatus("failed");
        return "failed";
      });
  }

  function buildWhatsAppScreenshotMessage(booking) {
    var number = config.whatsappNumber || "917666297468";
    var msg = [
      "Hello, I have booked an online consultation slot and paid " + (config.amountDisplay || "₹299") + ".",
      "Name: " + booking.name,
      "Phone: " + booking.phone,
      booking.email ? "Email: " + booking.email : "",
      booking.preferredDate ? "Preferred date: " + booking.preferredDate : "",
      booking.preferredTime ? "Preferred time: " + booking.preferredTime : "",
      booking.concern ? "Concern: " + booking.concern : "",
      "Payment screenshot is attached. Please confirm my video consultation slot.",
    ]
      .filter(Boolean)
      .join("\n");

    return "https://wa.me/" + number + "?text=" + encodeURIComponent(msg);
  }

  function initBookingForm() {
    var form = document.getElementById("ec-consult-form");
    if (!form) return;

    var dateInput = form.querySelector('[name="preferredDate"]');
    if (dateInput) {
      var today = new Date();
      dateInput.min = today.toISOString().slice(0, 10);
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var data = getFormData(form);
      var submitBtn = form.querySelector('[type="submit"]');
      var thankYouPath = (config.thankYouPath || "online-consultation-thank-you.html").trim();
      var defaultLabel = submitBtn ? submitBtn.innerHTML : "";

      saveBooking(data);

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending request…';
      }

      notifyDoctor(data).finally(function () {
        window.location.href = thankYouPath;
      });

      window.setTimeout(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = defaultLabel;
        }
      }, 12000);
    });
  }

  function initThankYouPage() {
    var root = document.getElementById("ec-consult-thank-you");
    if (!root) return;

    var booking = loadBooking();
    var summary = document.getElementById("ec-consult-summary");
    var payBtn = document.getElementById("ec-consult-pay");
    var waBtn = document.getElementById("ec-consult-wa-confirm");
    var notifyStatus = document.getElementById("ec-consult-notify-status");
    var paymentUrl = getPaymentPageUrl();
    var status = loadNotifyStatus();

    if (notifyStatus && status === "sent") {
      notifyStatus.hidden = false;
    }

    if (payBtn && paymentUrl) {
      payBtn.href = paymentUrl;
      payBtn.hidden = false;
    }

    if (booking && summary) {
      var items = [
        booking.name ? "<strong>" + escapeHtml(booking.name) + "</strong>" : "",
        booking.phone ? "Phone: " + escapeHtml(booking.phone) : "",
        booking.email ? "Email: " + escapeHtml(booking.email) : "",
        booking.preferredDate ? "Preferred date: " + escapeHtml(booking.preferredDate) : "",
        booking.preferredTime ? "Preferred time: " + escapeHtml(booking.preferredTime) : "",
        booking.concern ? "Concern: " + escapeHtml(booking.concern) : "",
      ].filter(Boolean);

      summary.innerHTML = items.map(function (line) {
        return "<p class=\"mb-1\">" + line + "</p>";
      }).join("");
    }

    if (waBtn && booking) {
      waBtn.href = buildWhatsAppScreenshotMessage(booking);
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  onReady(function () {
    initBookingForm();
    initThankYouPage();
  });
})();
