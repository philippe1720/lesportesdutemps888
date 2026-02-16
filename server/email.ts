// Gmail integration via Replit connector
import { google } from 'googleapis';

const NOTIFY_EMAIL = "loulouniard17@gmail.com";

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-mail',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Gmail not connected');
  }
  return accessToken;
}

async function getUncachableGmailClient() {
  const accessToken = await getAccessToken();
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.gmail({ version: 'v1', auth: oauth2Client });
}

interface BookingNotificationData {
  clientName: string;
  clientEmail: string;
  serviceName: string;
  servicePrice: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
}

export async function sendBookingNotification(data: BookingNotificationData): Promise<void> {
  const formattedDate = formatFrenchDate(data.bookingDate);

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #e0e0e0; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #2d1b69, #1a1a2e); padding: 30px; text-align: center; border-bottom: 2px solid #d4a853;">
        <h1 style="color: #d4a853; margin: 0; font-size: 24px;">Les Portes du Temps 888</h1>
        <p style="color: #a0a0c0; margin: 8px 0 0 0; font-size: 14px;">Nouvelle reservation</p>
      </div>
      <div style="padding: 30px;">
        <h2 style="color: #d4a853; font-size: 18px; margin-top: 0;">Un nouveau rendez-vous a ete reserve !</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 10px; color: #a0a0c0; border-bottom: 1px solid #333;">Client</td>
            <td style="padding: 10px; color: #ffffff; border-bottom: 1px solid #333; font-weight: bold;">${data.clientName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; color: #a0a0c0; border-bottom: 1px solid #333;">Email</td>
            <td style="padding: 10px; color: #ffffff; border-bottom: 1px solid #333;"><a href="mailto:${data.clientEmail}" style="color: #d4a853;">${data.clientEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; color: #a0a0c0; border-bottom: 1px solid #333;">Service</td>
            <td style="padding: 10px; color: #ffffff; border-bottom: 1px solid #333;">${data.serviceName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; color: #a0a0c0; border-bottom: 1px solid #333;">Tarif</td>
            <td style="padding: 10px; color: #ffffff; border-bottom: 1px solid #333;">${data.servicePrice}</td>
          </tr>
          <tr>
            <td style="padding: 10px; color: #a0a0c0; border-bottom: 1px solid #333;">Date</td>
            <td style="padding: 10px; color: #ffffff; border-bottom: 1px solid #333;">${formattedDate}</td>
          </tr>
          <tr>
            <td style="padding: 10px; color: #a0a0c0;">Horaire</td>
            <td style="padding: 10px; color: #ffffff; font-weight: bold;">${data.startTime} - ${data.endTime}</td>
          </tr>
        </table>
      </div>
      <div style="padding: 20px 30px; background: #15152a; text-align: center; color: #666; font-size: 12px;">
        <p>Les Portes du Temps 888 — Philippe Niard</p>
      </div>
    </div>
  `;

  const subject = `Nouvelle reservation : ${data.clientName} — ${data.serviceName} le ${formattedDate}`;

  const rawMessage = createRawEmail(NOTIFY_EMAIL, subject, htmlContent);

  try {
    const gmail = await getUncachableGmailClient();
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: rawMessage,
      },
    });
    console.log(`Email notification sent for booking: ${data.clientName} on ${formattedDate}`);
  } catch (error) {
    console.error("Failed to send booking notification email:", error);
  }
}

function createRawEmail(to: string, subject: string, htmlBody: string): string {
  const messageParts = [
    `To: ${to}`,
    `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(htmlBody).toString('base64'),
  ];
  const message = messageParts.join('\r\n');
  return Buffer.from(message).toString('base64url');
}

function formatFrenchDate(dateStr: string): string {
  const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const months = ["janvier", "fevrier", "mars", "avril", "mai", "juin", "juillet", "aout", "septembre", "octobre", "novembre", "decembre"];
  const date = new Date(dateStr + "T00:00:00");
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
