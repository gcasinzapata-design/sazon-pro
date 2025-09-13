import { waLink } from '../utils'

const PLANS = [
  { name: 'Básico', price: 'S/ 1,490', features: ['Setup inicial','Optimización esencial','Soporte por WhatsApp'] },
  { name: 'Pro', price: 'S/ 2,990', features: ['Creatividad + Media','Automatizaciones clave','Reportes quincenales'] },
  { name: 'Plus', price: 'S/ 4,990', features: ['E2E crecimiento','Producción de contenido','AB tests continuos'] },
  { name: 'Premium', price: 'S/ 7,990', features: ['Equipo dedicado','Data avanzada','Estrategia full-funnel'] },
]

export default function Plans(){
  const number = import.meta.env.VITE_WHATSAPP_NUMBER || '51978978905'
  const msg = (plan) => `Hola! Estoy listo para darle sazón a mi marca con el Plan ${plan}!`

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
      <h2 className="text-2xl md:text-4xl font-bold">Planes</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {PLANS.map((p)=> (
          <a key={p.name} href={waLink(number, msg(p.name))} target="_blank" rel="noreferrer"
            className="group block rounded-2xl border border-neutral-200 p-6 bg-white hover:shadow-soft hover:border-primary transition">
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-semibold group-hover:text-primary transition">{p.name}</h3>
              <span className="text-sm text-neutral-500">{p.price}</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-neutral-700">
              {p.features.map((f,i)=>(<li key={i}>• {f}</li>))}
            </ul>
            <button className="mt-6 w-full px-4 py-2 rounded-xl bg-primary text-white font-semibold">Quiero este plan</button>
          </a>
        ))}
      </div>
    </div>
  )
}
