export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const lead = req.body;
    console.log('Nuevo lead:', lead);

    const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK;
    
    if (SLACK_WEBHOOK) {
      // Formatear datos - nunca mostrar vacíos
      const nombre = lead.nombre && lead.nombre.trim() ? lead.nombre : '⚠️ No proporcionado';
      const empresa = lead.empresa && lead.empresa.trim() ? lead.empresa : '⚠️ No proporcionado';
      const email = lead.email && lead.email.trim() ? lead.email : '⚠️ No proporcionado';
      const telefono = lead.telefono && lead.telefono.trim() ? lead.telefono : '⚠️ No proporcionado';
      const necesidad = lead.necesidad && lead.necesidad.trim() ? lead.necesidad : '⚠️ No especificada';
      const fecha = lead.fecha || new Date().toLocaleString('es-ES');

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
              type: 'divider'
            },
            {
              type: 'section',
              fields: [
                {
                  type: 'mrkdwn',
                  text: `*👤 Nombre:*\n${nombre}`
                },
                {
                  type: 'mrkdwn',
                  text: `*🏢 Empresa:*\n${empresa}`
                }
              ]
            },
            {
              type: 'section',
              fields: [
                {
                  type: 'mrkdwn',
                  text: `*📧 Email:*\n${email}`
                },
                {
                  type: 'mrkdwn',
                  text: `*📱 Teléfono:*\n${telefono}`
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
                text: `*💡 Necesidad:*\n${necesidad}`
              }
            },
            {
              type: 'context',
              elements: [
                {
                  type: 'mrkdwn',
                  text: `📅 ${fecha}`
                }
              ]
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
