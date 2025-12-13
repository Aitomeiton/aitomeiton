// api/lead.js - Webhook para capturar leads
// Guarda leads y puede enviarlos a tu CRM/email

export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const leadData = req.body;
    
    console.log('📧 Nuevo lead recibido:', leadData);

    // Validar datos mínimos
    if (!leadData.nombre || !leadData.contacto) {
      return res.status(400).json({ error: 'Faltan datos del lead' });
    }

    // Añadir timestamp
    leadData.timestamp = new Date().toISOString();
    leadData.source = 'aitomaitos-web';

    // ============================================
    // OPCIÓN 1: Enviar a Google Sheets (via webhook)
    // ============================================
    // Crear un Google Apps Script que reciba los datos
    // const GOOGLE_SHEETS_WEBHOOK = process.env.GOOGLE_SHEETS_WEBHOOK;
    // if (GOOGLE_SHEETS_WEBHOOK) {
    //   await fetch(GOOGLE_SHEETS_WEBHOOK, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(leadData)
    //   });
    // }

    // ============================================
    // OPCIÓN 2: Enviar email con Resend
    // ============================================
    // const RESEND_API_KEY = process.env.RESEND_API_KEY;
    // if (RESEND_API_KEY) {
    //   await fetch('https://api.resend.com/emails', {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${RESEND_API_KEY}`,
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //       from: 'Meiton <meiton@aitomaitos.com>',
    //       to: 'tu-email@empresa.com',
    //       subject: `🍅 Nuevo lead: ${leadData.empresa}`,
    //       html: `
    //         <h2>Nuevo lead desde aitomaitos.com</h2>
    //         <p><strong>Nombre:</strong> ${leadData.nombre}</p>
    //         <p><strong>Empresa:</strong> ${leadData.empresa}</p>
    //         <p><strong>Contacto:</strong> ${leadData.contacto}</p>
    //         <p><strong>Necesidad:</strong> ${leadData.necesidad}</p>
    //         <p><strong>Calidad:</strong> ${leadData.calidad}</p>
    //         <p><strong>Fecha:</strong> ${leadData.timestamp}</p>
    //       `
    //     })
    //   });
    // }

    // ============================================
    // OPCIÓN 3: Enviar a Notion
    // ============================================
    // const NOTION_API_KEY = process.env.NOTION_API_KEY;
    // const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
    // if (NOTION_API_KEY && NOTION_DATABASE_ID) {
    //   await fetch('https://api.notion.com/v1/pages', {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${NOTION_API_KEY}`,
    //       'Content-Type': 'application/json',
    //       'Notion-Version': '2022-06-28'
    //     },
    //     body: JSON.stringify({
    //       parent: { database_id: NOTION_DATABASE_ID },
    //       properties: {
    //         'Nombre': { title: [{ text: { content: leadData.nombre } }] },
    //         'Empresa': { rich_text: [{ text: { content: leadData.empresa } }] },
    //         'Contacto': { email: leadData.contacto },
    //         'Necesidad': { rich_text: [{ text: { content: leadData.necesidad } }] },
    //         'Calidad': { select: { name: leadData.calidad } },
    //         'Fecha': { date: { start: leadData.timestamp } }
    //       }
    //     })
    //   });
    // }

    // ============================================
    // OPCIÓN 4: Enviar a Slack
    // ============================================
    const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK;
    if (SLACK_WEBHOOK) {
      await fetch(SLACK_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `🍅 *Nuevo lead en aitomaitos*`,
          blocks: [
            {
              type: 'header',
              text: { type: 'plain_text', text: '🍅 Nuevo lead capturado' }
            },
            {
              type: 'section',
              fields: [
                { type: 'mrkdwn', text: `*Nombre:*\n${leadData.nombre}` },
                { type: 'mrkdwn', text: `*Empresa:*\n${leadData.empresa}` },
                { type: 'mrkdwn', text: `*Contacto:*\n${leadData.contacto}` },
                { type: 'mrkdwn', text: `*Calidad:*\n${leadData.calidad}` }
              ]
            },
            {
              type: 'section',
              text: { type: 'mrkdwn', text: `*Necesidad:*\n${leadData.necesidad}` }
            }
          ]
        })
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Lead guardado correctamente',
      lead: leadData 
    });

  } catch (error) {
    console.error('Error guardando lead:', error);
    return res.status(500).json({ error: 'Error guardando lead' });
  }
}
