import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!resendClient) {
    resendClient = new Resend(key);
  }
  return resendClient;
}

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailInput): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.info(`[email:skipped, RESEND_API_KEY not set] to=${to} subject="${subject}"`);
    return;
  }

  const from = process.env.EMAIL_FROM ?? "Shaka Fishing Charters <onboarding@resend.dev>";

  try {
    await resend.emails.send({ from, to, subject, html });
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}
