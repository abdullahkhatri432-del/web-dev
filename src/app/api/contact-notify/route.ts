export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = String(body?.name ?? "").trim()
    const email = String(body?.email ?? "").trim()
    const phone = body?.phone ? String(body.phone).trim() : null
    const subject = body?.subject ? String(body.subject).trim() : null
    const message = String(body?.message ?? "").trim()

    if (!name || !email || !message) {
      return Response.json({ ok: false, error: "Missing required fields" }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    const from = process.env.RESEND_FROM || "Khatri Builds <onboarding@resend.dev>"
    const to = process.env.CONTACT_NOTIFY_TO

    if (!apiKey || !to) {
      return Response.json({ ok: false, error: "Email notifications not configured" }, { status: 500 })
    }

    const subjectLine = subject ? `New message: ${subject}` : "New contact form message"
    const html = [
      "<div style=\"font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#18181b\">",
      "<h2 style=\"margin:0 0 4px\">New contact form message</h2>",
      "<p style=\"margin:0 0 20px;color:#71717a\">Sent from the Khatri Builds contact page</p>",
      "<table cellpadding=\"8\" style=\"border-collapse:collapse;width:100%;font-size:14px\">",
      `<tr><td style="border-bottom:1px solid #e4e4e7"><strong>Name</strong></td><td style="border-bottom:1px solid #e4e4e7">${escapeHtml(name)}</td></tr>`,
      `<tr><td style="border-bottom:1px solid #e4e4e7"><strong>Email</strong></td><td style="border-bottom:1px solid #e4e4e7"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>`,
      phone ? `<tr><td style="border-bottom:1px solid #e4e4e7"><strong>Phone</strong></td><td style="border-bottom:1px solid #e4e4e7"><a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></td></tr>` : "",
      subject ? `<tr><td style="border-bottom:1px solid #e4e4e7"><strong>Subject</strong></td><td style="border-bottom:1px solid #e4e4e7">${escapeHtml(subject)}</td></tr>` : "",
      "</table>",
      "<p style=\"margin:20px 0 6px;font-size:13px;color:#71717a\"><strong style=\"color:#18181b\">Message</strong></p>",
      `<div style="background:#f4f4f5;border-radius:12px;padding:16px;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(message)}</div>`,
      "<p style=\"margin-top:24px;font-size:12px;color:#a1a1aa\">You can also view this in the admin dashboard at khatri-builds.vercel.app/admin/messages</p>",
      "</div>",
    ].join("")

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        replyTo: [email],
        subject: subjectLine,
        html,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      return Response.json({ ok: false, error: data?.message ?? "Resend error" }, { status: 502 })
    }

    return Response.json({ ok: true, id: data?.id })
  } catch {
    return Response.json({ ok: false, error: "Invalid request" }, { status: 400 })
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!)
}