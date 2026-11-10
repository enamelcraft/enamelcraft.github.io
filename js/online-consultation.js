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

  function getQrPayPageUrl() {
    return (config.qrPayPageUrl || config.paymentQrPageUrl || "pay.html").trim();
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
      "Next step: patient pays Rs 299 via Razorpay or UPI QR (enamelcraft.in/pay.html) and shares payment screenshot on WhatsApp.",
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

  function formSubmitEndpoint(clinicEmail) {
    /* FormSubmit expects a literal address in the path — encoding @ as %40 breaks AJAX delivery. */
    return "https://formsubmit.co/ajax/" + clinicEmail.trim();
  }

  function notifyDoctorViaFormPost(data) {
    var clinicEmail = (config.clinicEmail || "").trim();
    if (!clinicEmail) {
      return Promise.reject(new Error("No clinic email"));
    }

    return new Promise(function (resolve, reject) {
      var iframeName = "ec-formsubmit-notify-frame";
      var iframe = document.getElementById(iframeName);
      if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.name = iframeName;
        iframe.id = iframeName;
        iframe.title = "FormSubmit";
        iframe.hidden = true;
        iframe.style.cssText = "display:none;width:0;height:0;border:0";
        document.body.appendChild(iframe);
      }

      var form = document.createElement("form");
      form.method = "POST";
      form.action = "https://formsubmit.co/" + clinicEmail;
      form.target = iframeName;
      form.style.display = "none";
      form.setAttribute("accept-charset", "UTF-8");

      function field(name, value) {
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value == null ? "" : String(value);
        form.appendChild(input);
      }

      field("_subject", "New online consultation request – " + data.name);
      field("_template", "table");
      field("_captcha", "false");
      field("Patient name", data.name);
      field("Phone", data.phone);
      field("Patient email", data.email || "Not provided");
      field("Preferred date", data.preferredDate);
      field("Preferred time", data.preferredTime);
      field("Concern", data.concern);
      field("Requested at", data.createdAt || new Date().toISOString());
      field("Summary", formatDoctorEmailBody(data));

      document.body.appendChild(form);
      form.submit();

      window.setTimeout(function () {
        form.remove();
        resolve({ ok: true, via: "form-post" });
      }, 1200);
    });
  }

  function notifyDoctorViaFormSubmit(data) {
    var clinicEmail = (config.clinicEmail || "").trim();
    if (!clinicEmail) {
      return Promise.reject(new Error("No clinic email"));
    }

    return fetch(formSubmitEndpoint(clinicEmail), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: "New online consultation request – " + data.name,
        _template: "table",
        _captcha: "false",
        "Patient name": data.name,
        Phone: data.phone,
        "Patient email": data.email || "Not provided",
        "Preferred date": data.preferredDate,
        "Preferred time": data.preferredTime,
        Concern: data.concern,
        "Requested at": data.createdAt || new Date().toISOString(),
        Summary: formatDoctorEmailBody(data),
      }),
    }).then(function (response) {
      if (!response.ok) {
        throw new Error("Email notify failed");
      }
      return response.json();
    }).then(function (body) {
      if (body && (body.success === false || body.success === "false")) {
        throw new Error((body && body.message) || "FormSubmit rejected the request");
      }
      return body;
    });
  }

  function notifyDoctor(data) {
    if (!isNotifyEnabled()) {
      saveNotifyStatus("skipped");
      return Promise.resolve("skipped");
    }

    var notifyUrl = (config.notifyUrl || "").trim();
    var send = notifyUrl
      ? notifyDoctorViaAppsScript(data)
      : notifyDoctorViaFormSubmit(data).catch(function () {
          return notifyDoctorViaFormPost(data);
        });

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

  function buildWhatsAppSlotRequestMessage(booking) {
    var number = config.whatsappNumber || "917666297468";
    var msg = [
      "Hello, I submitted an online consultation slot request on enamelcraft.in.",
      "Name: " + booking.name,
      "Phone: " + booking.phone,
      booking.email ? "Email: " + booking.email : "",
      booking.preferredDate ? "Preferred date: " + booking.preferredDate : "",
      booking.preferredTime ? "Preferred time: " + booking.preferredTime : "",
      booking.concern ? "Concern: " + booking.concern : "",
      "I will pay " + (config.amountDisplay || "₹299") + " on Razorpay next and share the payment screenshot here.",
    ]
      .filter(Boolean)
      .join("\n");

    return "https://wa.me/" + number + "?text=" + encodeURIComponent(msg);
  }

  function buildWhatsAppScreenshotMessage(booking) {
    var number = config.whatsappNumber || "917666297468";
    var msg = [
      "Hello, I have paid " + (config.amountDisplay || "₹299") + " for my online consultation.",
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
    var payQrBtn = document.getElementById("ec-consult-pay-qr");
    var waBtn = document.getElementById("ec-consult-wa-confirm");
    var notifyStatus = document.getElementById("ec-consult-notify-status");
    var notifyFailed = document.getElementById("ec-consult-notify-failed");
    var paymentUrl = getPaymentPageUrl();
    var qrPayUrl = getQrPayPageUrl();
    var status = loadNotifyStatus();

    if (notifyStatus && status === "sent") {
      notifyStatus.hidden = false;
    } else if (notifyFailed && status === "failed") {
      notifyFailed.hidden = false;
    }

    if (payBtn && paymentUrl) {
      payBtn.href = paymentUrl;
      payBtn.hidden = false;
    }

    if (payQrBtn && qrPayUrl) {
      payQrBtn.href = qrPayUrl;
      payQrBtn.hidden = false;
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
      waBtn.href = buildWhatsAppSlotRequestMessage(booking);
    }

    var waPayBtn = document.getElementById("ec-consult-wa-payment");
    if (waPayBtn && booking) {
      waPayBtn.href = buildWhatsAppScreenshotMessage(booking);
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
