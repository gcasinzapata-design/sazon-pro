const services = [
  { title: 'Estrategia & Growth', desc: 'Diagnóstico, roadmap y aceleración de resultados.', icon: StrategyIcon },
  { title: 'Paid Media', desc: 'Campañas de rendimiento y creatividad que venden.', icon: MegaphoneIcon },
  { title: 'Branding & Contenido', desc: 'Marca, guiones, producción y social.', icon: BrandingIcon },
  { title: 'Automatización & IA', desc: 'Flujos, personalización y data-driven marketing.', icon: AIDevIcon },
]

function StrategyIcon(){ return (
  <svg viewBox="0 0 24 24" className="h-10 w-10 text-primary" aria-hidden="true">
    <path fill="currentColor" d="M3 3h2v2H3zm16 0h2v2h-2zM3 19h2v2H3zm16 0h2v2h-2zM7 5h10v2H7zm0 12h10v2H7zM6 9h2v6H6zm10 0h2v6h-2z"/>
  </svg>
)}

function MegaphoneIcon(){ return (
  <svg viewBox="0 0 24 24" className="h-10 w-10 text-primary" aria-hidden="true">
    <path fill="currentColor" d="M3 10v4a2 2 0 0 0 2 2h1l5 3V7l-5 3H5a2 2 0 0 0-2 2zm13-3v10l5 3V4z"/>
  </svg>
)}

function BrandingIcon(){ return (
  <svg viewBox="0 0 24 24" className="h-10 w-10 text-primary" aria-hidden="true">
    <path fill="currentColor" d="M4 4h16v6H4zM4 14h7v6H4zm9 0h7v6h-7z"/>
  </svg>
)}

function AIDevIcon(){ return (
  <svg viewBox="0 0 24 24" className="h-10 w-10 text-primary" aria-hidden="true">
    <path fill="currentColor" d="M12 2l4 4-4 4-4-4 4-4zm-8 8l4 4-4 4-4-4 4-4zm16 0l4 4-4 4-4-4 4-4zM12 14l4 4-4 4-4-4 4-4z"/>
  </svg>
)}

export default function Services(){
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
      <h2 className="text-2xl md:text-4xl font-bold">Servicios clave</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {services.map((s, i)=> {
          const Icon = s.icon
          return (
            <div key={i} className="p-6 rounded-2xl border border-neutral-200 hover:shadow-soft bg-white">
              <div className="flex items-center gap-3">
                <Icon/>
                <h3 className="font-semibold text-lg">{s.title}</h3>
              </div>
              <p className="text-sm text-neutral-600 mt-3">{s.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
