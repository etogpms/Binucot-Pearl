import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")
const TO_EMAIL = Deno.env.get("NOTIFICATION_EMAIL") || "binucotpearl.ph@gmail.com"

serve(async (req) => {
  // Only allow POST requests (database webhooks send POST)
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    const payload = await req.json()
    console.log("Received webhook payload:", payload)

    // Check if it is an INSERT on the bookings table
    if (payload.type !== 'INSERT' || payload.table !== 'bookings') {
      return new Response('Ignored event', { status: 200 })
    }

    const booking = payload.record
    if (!booking) {
      return new Response('No record found in payload', { status: 400 })
    }

    // Format the email content beautifully
    const subject = `New Reservation Request: ${booking.guest_name} (${booking.room_name})`
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #0f4d56; border-bottom: 2px solid #0f4d56; padding-bottom: 10px; margin-top: 0;">New Reservation Request</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 180px;">Guest Name:</td>
            <td style="padding: 8px 0;">${booking.guest_name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:${booking.email}">${booking.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
            <td style="padding: 8px 0;"><a href="tel:${booking.phone}">${booking.phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Room Selected:</td>
            <td style="padding: 8px 0;">${booking.room_name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Check-in:</td>
            <td style="padding: 8px 0;">${booking.check_in}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Check-out:</td>
            <td style="padding: 8px 0;">${booking.check_out}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Number of Guests:</td>
            <td style="padding: 8px 0;">${booking.guests} guest${booking.guests > 1 ? 's' : ''}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Estimated Arrival:</td>
            <td style="padding: 8px 0;">${booking.arrival_time || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Airport Transfer:</td>
            <td style="padding: 8px 0;">${booking.needs_transfer ? 'Yes' : 'No'}</td>
          </tr>
        </table>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #0f4d56; border-radius: 3px;">
          <p style="margin-top: 0; font-weight: bold; color: #333;">Special Requests / Dietary Requirements:</p>
          <p style="margin-bottom: 0; white-space: pre-wrap; color: #555;">${booking.special_requests || 'None'}</p>
        </div>
        
        <div style="margin-top: 30px; font-size: 11px; color: #888; text-align: center; border-top: 1px solid #e0e0e0; padding-top: 15px;">
          This notification was automatically sent by your Supabase Database Webhook.<br/>
          <strong>Binucot Pearl Boutique Resort</strong>
        </div>
      </div>
    `

    if (!RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY environment variable.")
    }

    // Send the email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: "Binucot Pearl <onboarding@resend.dev>", // onboarding@resend.dev is the default sandbox sender
        to: [TO_EMAIL],
        subject: subject,
        html: htmlContent
      })
    })

    const resData = await res.json()
    if (!res.ok) {
      console.error("Resend API error:", resData)
      return new Response(JSON.stringify({ error: resData }), { status: 500 })
    }

    console.log("Email sent successfully:", resData)
    return new Response(JSON.stringify({ message: "Email sent successfully", data: resData }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    console.error("Internal error:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
})
