# Future things

Ideas and features parked for later — not implemented yet.

---

## Instant WhatsApp alert to doctor (CallMeBot)

**Status:** Parked  
**Why:** Free personal alerts when a patient submits the online consultation form (in addition to email via FormSubmit / Google Apps Script).

### Cost

- **CallMeBot:** Free for messages to **your own** WhatsApp number only ([CallMeBot WhatsApp API](https://www.callmebot.com/blog/free-api-whatsapp-messages/)).
- Expect modest rate limits (personal use; not for bulk marketing).
- Official WhatsApp Business / Twilio is paid — only needed if messaging patients at scale.

### One-time setup (when ready)

1. Install WhatsApp on the doctor/clinic phone (+91-7666297468 or whichever number should receive alerts).
2. Follow CallMeBot activation (add their contact, send *“I allow callmebot to send me messages”*, save the **API key** they reply with).
3. Add to `js/ec-payment-config.js` (fields to add when implementing):

   ```javascript
   callmebotPhone: "+917666297468",  // E.164, must match activated number
   callmebotApiKey: "YOUR_KEY",       // keep private; do not commit real key to public repo if sensitive
   ```

### Implementation sketch (when unparking)

- In `js/online-consultation.js`, after `notifyDoctor()` email path succeeds (or in parallel), `GET`:

  `https://api.callmebot.com/whatsapp.php?phone=...&text=...&apikey=...`

- Message text: patient name, phone, preferred date/time, concern (URL-encoded).
- Fire-and-forget; do not block redirect to `online-consultation-thank-you.html` if CallMeBot fails.
- Optional: extend `scripts/consult-notify-apps-script.gs` to send WhatsApp from server instead (keeps API key off the public site) — more setup, slightly better security.

### References

- FAQ: https://www.callmebot.com/faq/
- Current live flow: book form → email doctor → thank-you page → Razorpay → patient WhatsApp with payment screenshot.

---

## Other notes

_Add future items below as needed._

### Cleaner case study photos (optional)

For the strongest “Our work” presentation, export from your imaging software when possible:

- **RVG / X-ray:** PNG or JPG without patient name bar, or use “export for presentation” mode; disable large on-image watermarks on post-op films if the software allows.
- **Clinical photos:** separate before and after files (not one combined collage), good lighting, crop to the tooth area.
- Case study and treatment photos live in `img/our-work/` (canonical filenames). Re-run `scripts/organize-our-work-images.py` only when adding new WhatsApp uploads—update its `COPY_MAP` first.
