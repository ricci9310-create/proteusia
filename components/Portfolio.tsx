'use client';

const projects = [
  {
    title: 'Asistente de Voz IA',
    industry: 'Servicios para el Hogar',
    location: 'Atlanta, GA',
    description:
      'Agente de voz IA que contesta la línea principal de la empresa 24/7, captura leads, califica clientes y agenda citas automáticamente.',
    metrics: ['24/7 activo', 'Captura automática', 'Agenda integrada'],
    tags: ['Voice AI', 'VAPI', 'Twilio'],
    color: 'from-green-500/20 to-emerald-500/10',
    icon: '🎙️',
  },
  {
    title: 'CRM Empresarial Completo',
    industry: 'Servicios para el Hogar',
    location: 'Atlanta, GA',
    description:
      'CRM con 30+ módulos, facturación Stripe, sincronización QuickBooks, gestión de equipos, calendario drag-and-drop, portal de clientes y chat interno.',
    metrics: ['30+ módulos', '155+ endpoints', 'Portal clientes'],
    tags: ['Next.js', 'Prisma', 'Stripe', 'QuickBooks'],
    color: 'from-blue-500/20 to-cyan-500/10',
    icon: '📊',
  },
  {
    title: 'Agente IA por WhatsApp',
    industry: 'Centro de Recuperación',
    location: 'Estados Unidos',
    description:
      'Asistente virtual que atiende consultas, agenda citas y captura leads automáticamente vía WhatsApp Business 24/7.',
    metrics: ['Respuesta 24/7', 'Captura leads', 'Agenda integrada'],
    tags: ['WhatsApp API', 'IA Conversacional'],
    color: 'from-emerald-500/20 to-green-500/10',
    icon: '💬',
  },
  {
    title: 'Plataforma de Seguridad + Admin',
    industry: 'Conjunto Residencial',
    location: 'Colombia',
    description:
      'Botón de pánico con geolocalización para residentes y CRM administrativo para propiedad horizontal, mantenimiento y comunicados.',
    metrics: ['Alerta en tiempo real', 'GPS integrado', 'Portal admin'],
    tags: ['Next.js', 'Geolocation', 'Monorepo'],
    color: 'from-red-500/20 to-orange-500/10',
    icon: '🛡️',
  },
  {
    title: 'Calendario Tributario SaaS',
    industry: 'Firma Contable',
    location: 'Colombia',
    description:
      'Plataforma SaaS que calcula automáticamente fechas de vencimiento de obligaciones tributarias según el NIT, con notificaciones por email.',
    metrics: ['100% automatizado', 'Multi-cliente', 'Alertas email'],
    tags: ['Next.js', 'Prisma', 'DIAN'],
    color: 'from-violet-500/20 to-purple-500/10',
    icon: '📅',
  },
  {
    title: 'E-commerce + CRM WhatsApp',
    industry: 'Marca de Moda',
    location: 'Colombia',
    description:
      'Tienda online con captura automática de clientes vía WhatsApp, extracción inteligente de datos de venta y dashboard administrativo.',
    metrics: ['Captura automática', 'Dashboard ventas', 'WhatsApp CRM'],
    tags: ['Next.js', 'WhatsApp', 'E-commerce', 'IA'],
    color: 'from-pink-500/20 to-rose-500/10',
    icon: '🛍️',
  },
];

interface Props {
  onBack: () => void;
}

export default function Portfolio({ onBack }: Props) {
  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4 chat-message-enter">
      {/* Header */}
      <div className="text-center mb-12">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-[#1A1A2E]/55 hover:text-[#A8862F] transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a Proteus
        </button>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A2E] mb-3">
          Nuestras <span className="gradient-text">transformaciones</span>
        </h2>
        <p className="text-[#1A1A2E]/55 text-sm max-w-lg mx-auto">
          Cada proyecto empezó como una idea. Proteus le dio forma.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project, i) => (
          <div
            key={i}
            className="portfolio-card p-6 group cursor-pointer"
          >
            {/* Gradient top accent */}
            <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${project.color} opacity-0 group-hover:opacity-100 transition-opacity`} />

            <div className="text-2xl mb-3">{project.icon}</div>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase tracking-wider text-[#A8862F] font-mono">
                {project.industry}
              </span>
              <span className="text-[#1A1A2E]/20">·</span>
              <span className="text-[10px] text-[#1A1A2E]/45">{project.location}</span>
            </div>

            <h3 className="text-lg font-semibold text-[#1A1A2E] mb-2">{project.title}</h3>

            <p className="text-xs text-[#1A1A2E]/65 leading-relaxed mb-4">
              {project.description}
            </p>

            {/* Metrics */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.metrics.map((metric, j) => (
                <span
                  key={j}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-[#1A1A2E]/[0.04] border border-[#1A1A2E]/[0.08] text-[#1A1A2E]/65"
                >
                  {metric}
                </span>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag, j) => (
                <span
                  key={j}
                  className="text-[9px] px-2 py-0.5 rounded bg-[#C5A55A]/12 text-[#A8862F] font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#1A1A2E] border border-[#A8862F]/40 text-sm text-white hover:bg-[#0F3460] hover:shadow-[0_12px_36px_rgba(197,165,90,0.32)] transition-all"
        >
          Quiero algo así — hablar con Proteus
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
