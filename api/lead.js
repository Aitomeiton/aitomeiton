export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const lead = req.body;
    console.log('Nuevo lead:', lead);

    const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK;
    
    if (SLACK_WEBHOOK) {
      // Formatear datos
      const nombre = lead.nombre && lead.nombre.trim() && lead.nombre !== 'No proporcionado' ? lead.nombre : '⚠️ No proporcionado';
      const empresa = lead.empresa && lead.empresa.trim() && lead.empresa !== 'No proporcionada' ? lead.empresa : '⚠️ No proporcionada';
      const web = lead.web && lead.web.trim() && lead.web !== 'No proporcionada' ? lead.web : '⚠️ No proporcionada';
      const email = lead.email && lead.email.trim() && lead.email !== 'No proporcionado' ? lead.email : '⚠️ No proporcionado';
      const telefono = lead.telefono && lead.telefono.trim() && lead.telefono !== 'No proporcionado' ? lead.telefono : '⚠️ No proporcionado';
      const necesidad = lead.necesidad && lead.necesidad.trim() ? lead.necesidad : '⚠️ No especificada';
      const fecha = lead.fecha || new Date().toLocaleString('es-ES');
      
      // Conversación - truncar si es muy larga
      let conversacion = lead.conversacion || 'No disponible';
      if (conversacion.length > 2500) {
        conversacion = conversacion.substring(0, 2500) + '...\n\n(conversación truncada)';
      }

      // Enviar mensaje principal con datos del lead
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
                  text: `*🌐 Web:*\n${web}`
                },
                {
                  type: 'mrkdwn',
                  text: `*📅 Fecha:*\n${fecha}`
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
                text: `*💡 Necesidad inicial:*\n${necesidad}`
              }
            },
            {
              type: 'divider'
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*💬 Conversación completa:*`
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: conversacion
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
