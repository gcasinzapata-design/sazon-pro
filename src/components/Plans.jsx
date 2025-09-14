import { waLink } from '../utils'
import MercadoPagoButton from './MercadoPagoButton'

const PLANS = [
  { code:'BASICO',  name: 'Básico', price: '$350 /mes', features: [
    'Auditoría inicial & diagnóstico',
    'Gestión de apps',
    'Campañas: Meta y Google',
    'Tech & analítica (dashboard básico)',
    'Sugerencias de optimización de carta.'
  ]},
  { code:'PRO', name: 'Pro', price: '$600 /mes', features: [
    'Todo lo del Básico',
    'Gestión de apps y canal directo',
    'Optimización de tiempos (cocina & entrega)',
    'Campañas: Meta, Google y Delivery Apps',
    'Reporte analítico mensual'
  ]},
  { code:'PLUS', name: 'Plus', price: '$950 /mes', features: [
    'Todo lo del Pro',
    'PR con micro-influencers',
    'Producción de contenido mensual',
    'eCommerce + última milla (setup adicional)'
  ]},
  { code:'PREMIUM', name: 'Premium', price: 'A medida', features: [
    'Gestión integral de apps y canal propio',
    'Contenido + influencers medianos/grandes',
    'Integración completa eCommerce + última milla',
    'Dashboards personalizados en tiempo real',
    'Equipo dedicado'
  ]},
]

export default function Plans(){
  const number = import.meta.env.VITE_WHATSAPP_NUMBER || '51978978905'
  const msg = (plan) => `Hola! Estoy listo para darle sazón a mi marca con el Plan ${plan}!`

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
      <h2 className="text-2xl md:text-4xl font-bold">Planes</h2>
      <p className="text-sm text-neutral-600 mt-2">Nuestros planes son <strong>trimestrales</strong> (suscripción de 3 meses).</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {PLANS.map((p)=> {
          const payLink = import.meta.env[`VITE_PAYLINK_${p.code}`] // Link de pago
          const mpPref  = import.meta.env[`VITE_MP_PREF_${p.code}`] // Preference ID (opcional)
          const href    = payLink && payLink.length > 0 ? payLink : waLink(number, msg(p.name))

          return (
            <div key={p.name} className="group rounded-2xl border border-neutral-200 p-6 bg-white hover:shadow-soft hover:border-primary transition h-full flex flex-col">
              <div className="flex items-baseline justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold group-hover:text-primary transition">{p.name}</h3>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">Trimestral</span>
                </div>
                <span className="text-sm text-neutral-500">{p.price}</span>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                {p.features.map((f,i)=>(<li key={i}>• {f}</li>))}
              </ul>

              <div className="mt-auto pt-4">
                {mpPref ? (
                  <MercadoPagoButton preferenceId={mpPref} />
                ) : (
                  <a href={href} target="_blank" rel="noreferrer"
                    className="w-full inline-block px-4 py-2 rounded-xl bg-primary text-white font-semibold text-center">
                    {payLink ? 'Pagar ahora' : 'Quiero este plan'}
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <p className="text-xs text-neutral-500 mt-4">* La inversión publicitaria no está incluida.</p>
      <p className="text-xs text-neutral-500 mt-1">* Planes trimestrales (suscripción de 3 meses).</p>
    </div>
  )
}
