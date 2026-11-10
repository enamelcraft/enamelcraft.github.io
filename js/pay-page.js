/**
 * Payment page (/pay/) — amounts and links from ec-payment-config.js
 */
(function () {
  "use strict";

  var config = window.EC_PAYMENT || {};

  function waScreenshotUrl() {
    var number = (config.whatsappNumber || "917666297468").replace(/\D/g, "");
    var amount = config.amountDisplay || "₹299";
    var msg = [
      "Hello, I have paid " + amount + " for my online consultation at Enamel Craft.",
      "Please find my payment screenshot attached. Kindly confirm my video consultation slot.",
    ].join("\n");
    return "https://wa.me/" + number + "?text=" + encodeURIComponent(msg);
  }

  function init() {
    var amount = config.amountDisplay || "₹299";
    var product = config.productName || "Online dental consultation";
    var clinic = config.clinicName || "Enamel Craft Dental Studio";

    var amountEl = document.getElementById("ec-pay-amount");
    var amountInline = document.getElementById("ec-pay-amount-inline");
    var productEl = document.getElementById("ec-pay-product");
    var merchantEl = document.getElementById("ec-pay-merchant");
    var waBtn = document.getElementById("ec-pay-wa");
    var rzBtn = document.getElementById("ec-pay-razorpay");
    var qrImg = document.getElementById("ec-pay-qr-img");

    if (amountEl) amountEl.textContent = amount;
    if (amountInline) amountInline.textContent = amount;
    if (productEl) productEl.textContent = product;
    if (merchantEl) merchantEl.textContent = clinic + " · Baner, Pune";
    if (waBtn) waBtn.href = waScreenshotUrl();

    var razorpay = (config.paymentPageUrl || "").trim();
    if (rzBtn && razorpay) rzBtn.href = razorpay;
    else if (rzBtn && !razorpay) rzBtn.hidden = true;

    var qrPath = (config.qrImagePath || "img/EC-Payment.png").trim();
    var qrSrc = qrPath;

    if (qrPath) {
      if (/^https?:/i.test(qrPath) || qrPath.indexOf("/") === 0) {
        qrSrc = qrPath;
      } else if (/\/pay\/?$/i.test(window.location.pathname)) {
        qrSrc = "../" + qrPath.replace(/^\.\.\//, "");
      }
    }

    if (qrImg && qrSrc) {
      qrImg.src = qrSrc;
    }

    var downloadBtn = document.getElementById("ec-pay-qr-download");
    var downloadName = (config.qrDownloadFilename || "enamelcraft-upi-qr.png").trim();

    function bindQrDownload(url) {
      if (!downloadBtn || !url) return;
      downloadBtn.href = url;
      downloadBtn.setAttribute("download", downloadName);
      downloadBtn.addEventListener("click", function (event) {
        if (!window.fetch) return;
        event.preventDefault();
        fetch(url)
          .then(function (response) {
            if (!response.ok) throw new Error("download failed");
            return response.blob();
          })
          .then(function (blob) {
            var objectUrl = URL.createObjectURL(blob);
            var link = document.createElement("a");
            link.href = objectUrl;
            link.download = downloadName;
            link.rel = "noopener";
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.setTimeout(function () {
              URL.revokeObjectURL(objectUrl);
            }, 2000);
          })
          .catch(function () {
            window.location.href = url;
          });
      });
    }

    if (qrSrc) {
      bindQrDownload(qrSrc);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
