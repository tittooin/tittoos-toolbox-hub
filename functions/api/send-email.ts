export const onRequestPost = async ({ request, env }: any) => {
  try {
    const data = await request.json();
    const { type, name, email, subject, message, rating } = data || {};

    if (!type || !message || (!email && type === 'query')) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const safeName = String(name || 'Anonymous').slice(0, 200);
    const safeEmail = String(email || '').slice(0, 200);
    const safeSubject = String(subject || (type === 'feedback' ? 'New Feedback' : 'New Query')).slice(0, 200);
    const safeMessage = String(message || '').slice(0, 5000);
    const safeRating = typeof rating === 'number' ? Math.max(1, Math.min(5, rating)) : undefined;

    const html = `
      <div style="font-family: Arial, sans-serif;">
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Name:</strong> ${safeName}</p>
        ${safeEmail ? `<p><strong>Email:</strong> ${safeEmail}</p>` : ''}
        ${safeRating ? `<p><strong>Rating:</strong> ${safeRating}/5</p>` : ''}
        <p><strong>Message:</strong></p>
        <div style="white-space: pre-wrap;">${escapeHtml(safeMessage)}</div>
      </div>
    `;

    const apiKey = env?.RESEND_API_KEY;
    const from = env?.RESEND_FROM || 'onboarding@resend.dev';
    if (!apiKey) {
      console.error('RESEND_API_KEY is missing');
      return new Response(JSON.stringify({ error: 'Email service not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: ['admin@axevora.com'],
        subject: safeSubject,
        html,
        reply_to: safeEmail || undefined,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error('Resend error:', text);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 502, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    console.error('send-email error:', err?.message || err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}