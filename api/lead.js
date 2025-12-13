export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const leadData = req.body;
    console.log('Nuevo lead:', leadData);

    const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK;
    
    if (SLACK_WEBHOOK) {
      await fetch(SLACK_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `🍅 *Nuevo lead en aitomeiton*\n\n*Nombre:* ${leadData.nombre || 'No indicado'}\n*Empresa:* ${leadData.empresa || 'No indicado'}\n*Contacto:* ${leadData.contacto || 'No indicado'}\n*Necesidad:* ${leadData.necesidad || 'No indicado'}\n*Calidad:* ${leadData.calidad || 'No indicado'}`
        })
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Error guardando lead' });
  }
}
