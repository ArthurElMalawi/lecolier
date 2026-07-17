import { NextResponse } from "next/server";
import { Resend } from "resend";

// Adresse de réception (surchargée par variable d'environnement si besoin)
const CONTACT_TO = process.env.CONTACT_TO || "arthur@avantis-france.com";
// Expéditeur : un domaine vérifié dans Resend, ou l'adresse de test onboarding@resend.dev
const CONTACT_FROM = process.env.CONTACT_FROM || "L'écolier <onboarding@resend.dev>";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Le service d'envoi n'est pas configuré." },
      { status: 500 }
    );
  }

  let body: { email?: unknown; subject?: unknown; message?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!email || !subject || !message) {
    return NextResponse.json(
      { error: "Tous les champs sont requis." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Adresse e-mail invalide." },
      { status: 400 }
    );
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      replyTo: email,
      subject: `[Contact site] ${subject}`,
      text: `De : ${email}\nObjet : ${subject}\n\n${message}`,
      html: `<p><strong>De :</strong> ${escapeHtml(email)}</p>
<p><strong>Objet :</strong> ${escapeHtml(subject)}</p>
<hr />
<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    });

    if (error) {
      return NextResponse.json({ error: "Envoi impossible." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Envoi impossible." }, { status: 502 });
  }
}
