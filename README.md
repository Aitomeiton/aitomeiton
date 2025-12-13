# 🍅 aitomeiton - Landing con Chat IA

Landing page para aitomeiton con chatbot de cualificación de leads integrado.

## 📁 Estructura

```
aitomeiton-production/
├── index.html          # Landing principal con chat
├── servicios.html      # Página de servicios
├── api/
│   ├── chat.js         # Proxy para API de Anthropic
│   └── lead.js         # Webhook para captura de leads
├── vercel.json         # Configuración de Vercel
├── package.json
└── .env.example        # Variables de entorno de ejemplo
```

## 🚀 Despliegue en Vercel (Recomendado)

### Paso 1: Crear cuenta en Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Regístrate con tu cuenta de GitHub/GitLab/Bitbucket

### Paso 2: Subir el proyecto
**Opción A - Desde GitHub:**
1. Crea un repositorio en GitHub
2. Sube esta carpeta al repositorio
3. En Vercel, haz clic en "New Project"
4. Importa el repositorio

**Opción B - Desde CLI:**
```bash
npm install -g vercel
cd aitomeiton-production
vercel login
vercel
```

### Paso 3: Configurar variables de entorno
En el dashboard de Vercel > Tu proyecto > Settings > Environment Variables:

**OBLIGATORIO:**
- `ANTHROPIC_API_KEY` = tu API key de Anthropic (empieza por `sk-ant-`)

**OPCIONAL (para recibir leads):**
- `SLACK_WEBHOOK` = URL del webhook de Slack
- `RESEND_API_KEY` = API key de Resend para emails
- `NOTION_API_KEY` + `NOTION_DATABASE_ID` = Para guardar en Notion

### Paso 4: Desplegar
Vercel despliega automáticamente. Tu web estará en:
- `https://tu-proyecto.vercel.app`

### Paso 5: Dominio personalizado (opcional)
1. Compra tu dominio (Namecheap, GoDaddy, etc.)
2. En Vercel > Settings > Domains > Add
3. Sigue las instrucciones para configurar DNS

---

## 🔑 Obtener API Key de Anthropic

1. Ve a [console.anthropic.com](https://console.anthropic.com)
2. Regístrate o inicia sesión
3. Ve a API Keys
4. Crea una nueva key
5. Cópiala (solo se muestra una vez)

---

## 📬 Configurar recepción de leads

### Opción 1: Slack (más fácil)
1. Ve a [api.slack.com/apps](https://api.slack.com/apps)
2. Crea una app > "From scratch"
3. Activa "Incoming Webhooks"
4. Crea un webhook para tu canal
5. Copia la URL y ponla en `SLACK_WEBHOOK`

### Opción 2: Email con Resend
1. Regístrate en [resend.com](https://resend.com)
2. Verifica tu dominio
3. Copia tu API key
4. Descomenta el código de Resend en `api/lead.js`

### Opción 3: Google Sheets
1. Crea una hoja de cálculo
2. Ve a Extensiones > Apps Script
3. Crea un endpoint que reciba POST
4. Descomenta el código en `api/lead.js`

### Opción 4: Notion
1. Crea una integración en [notion.so/my-integrations](https://notion.so/my-integrations)
2. Crea una base de datos con las columnas: Nombre, Empresa, Contacto, Necesidad, Calidad, Fecha
3. Conecta la integración a la base de datos
4. Descomenta el código en `api/lead.js`

---

## 🧪 Probar en local

```bash
# Instalar Vercel CLI
npm install -g vercel

# Crear archivo de variables de entorno
cp .env.example .env.local
# Edita .env.local con tus keys

# Ejecutar en desarrollo
vercel dev
```

Abre http://localhost:3000

---

## 📊 Meiton - El bot de cualificación

Meiton (el chatbot) está entrenado para:

1. **Escuchar** - Entender qué quiere automatizar el usuario
2. **Cualificar** - Detectar si es un lead de calidad:
   - Volumen alto (+20 tareas/día)
   - Equipo de +3 personas
   - Dolor urgente
   - Es decisor
3. **Proponer** - Explicar la solución desde la experiencia
4. **Cerrar** - Pedir datos solo a leads buenos

Los leads fríos reciben información pero no se les piden datos.

---

## 🎨 Personalización

### Cambiar colores
En `index.html` y `servicios.html`, busca:
```javascript
colors: {
  tomato: { 500: '#E54D2E', 600: '#CD4527' },
  leaf: { 500: '#46A758' }
}
```

### Cambiar el prompt de Meiton
En `index.html`, busca `const SYSTEM_PROMPT` y edita el texto.

### Añadir más FAQs
En `servicios.html`, busca la sección `<!-- FAQ -->` y añade más `<details>`.

---

## ❓ Problemas comunes

**El chat no responde:**
- Verifica que `ANTHROPIC_API_KEY` está configurada en Vercel
- Mira los logs en Vercel > Deployments > Ver logs

**No recibo los leads:**
- Verifica que el webhook está configurado
- Mira los logs de la función `/api/lead`

**Error de CORS:**
- Verifica que `vercel.json` tiene los headers correctos
- Redespliega el proyecto

---

## 📞 Soporte

¿Dudas? Contacta en hola@aitomeiton.com
