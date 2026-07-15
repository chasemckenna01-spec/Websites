import { NextRequest, NextResponse } from "next/server";
import { contactRequestSchema } from "@/lib/validation";
import { sendEmail } from "@/lib/email";
import { business } from "@/lib/site-data";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = contactRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, email, phone, message } = parsed.data;

  await sendEmail({
    to: business.contact.email,
    subject: `New inquiry from ${name}`,
    html: `<p><strong>${name}</strong> (${email}${phone ? `, ${phone}` : ""}) sent a message:</p>
           <p>${message.replace(/\n/g, "<br/>")}</p>`,
  });

  return NextResponse.json({ ok: true });
}
