export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const leadData = req.body;
    console.log('Nuevo lead:', leadData);

    const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK;
    
    if (SLACK_WEBHOOK) {
      // Formatear la conversación para Slack
      const conversacion = leadData.conversacion || 'Sin conversación';
      
      await fetch(SLACK_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: '🍅 Nuevo lead en aitomeiton',
                emoji: true
              }
            },
            {
              type: 'section',
              fields: [
                {
                  type: 'mrkdwn',
                  text: `*Contacto:*\n${leadData.contacto || 'No proporcionado'}`
                },
                {
                  type: 'mrkdwn',
                  text: `*Fecha:*\n${leadData.fecha || new Date().toLocaleString('es-ES')}`
                }
              ]
            },
            {
              type: 'divider'
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Conversación:*\n\`\`\`${conversacion.substring(0, 2500)}\`\`\``
              }
            }
          ]
        })
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Error guardando lead' });
  }
}
