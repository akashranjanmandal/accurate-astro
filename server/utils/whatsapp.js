// server/utils/whatsapp.js
// Uses CallMeBot free API to send WhatsApp notifications.
// One-time setup: The target number (+91 83358 49855) must send
// "I allow callmebot to send me messages" to +34 644 08 13 76 on WhatsApp.
// CallMeBot will reply with your API key — add it as CALLMEBOT_API_KEY in .env

const https = require('https')

/**
 * Send a WhatsApp message via CallMeBot API.
 * Fails silently — never breaks the main request flow.
 * @param {string} message - Plain text message to send
 */
const sendWhatsAppNotification = async (message) => {
  try {
    const phone = process.env.WHATSAPP_NOTIFY_NUMBER   // e.g. 918335849855
    const apiKey = process.env.CALLMEBOT_API_KEY        // from CallMeBot setup

    if (!phone || !apiKey) {
      console.warn('⚠️  WhatsApp: WHATSAPP_NOTIFY_NUMBER or CALLMEBOT_API_KEY not set. Skipping.')
      return
    }

    const encodedMsg = encodeURIComponent(message)
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodedMsg}&apikey=${apiKey}`

    await new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = ''
        res.on('data', chunk => { data += chunk })
        res.on('end', () => {
          if (res.statusCode === 200) {
            console.log('✅ WhatsApp notification sent')
          } else {
            console.warn(`⚠️  WhatsApp API responded with status ${res.statusCode}: ${data}`)
          }
          resolve()
        })
      }).on('error', (err) => {
        console.warn('⚠️  WhatsApp notification failed:', err.message)
        resolve() // resolve, never reject — keep booking flow intact
      })
    })
  } catch (err) {
    console.warn('⚠️  WhatsApp notification error:', err.message)
    // swallow — never break the main booking flow
  }
}

module.exports = { sendWhatsAppNotification }
