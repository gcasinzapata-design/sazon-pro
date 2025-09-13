import { waLink } from '../utils'

export default function Contact(){
  const number = import.meta.env.VITE_WHATSAPP_NUMBER || '51978978905'
  const calendly = import.meta.env.VITE_CALENDLY_URL || 'https://calendly.com/sazon-growth-partner'

  return (
    <>
      <div className="border-t border-neutral-200"/>
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-16">
        <h2 className="text-2xl md:text-4xl font-bold text-center">Hablemos de tu crecimiento</h2>
        <p className="text-center text-neutral-600 mt-2">Cuéntanos sobre tu marca y objetivos.</p>

        <div className="mt-8 bg-white border border-neutral-200 rounded-2xl p-6 shadow-soft border-t-4 border-t-primary/30">
          <form name="contacto-sazon" method="POST" data-netlify="true" netlify-honeypot="bot-field" className="grid gap-4">
            <input type="hidden" name="form-name" value="contacto-sazon" />
            <p className="hidden">
              <label>No llenar: <input name="bot-field" /></label>
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <input className="input" name="Nombre" placeholder="Nombre" required />
              <input className="input" name="Marca" placeholder="Marca" required />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <input className="input" name="Telefono" placeholder="Teléfono" />
              <input className="input" type="email" name="Email" placeholder="Email" required />
              <input className="input" name="Pais" placeholder="País" />
            </div>
            <textarea className="input min-h-[120px]" name="Mensaje" placeholder="Mensaje" />

            <div className="flex flex-col sm:flex-row gap-3 sm:justify-center mt-2">
              <a href={waLink(number, '¡Hola! Quiero más info sobre Sazón Growth Partner!')} target="_blank" rel="noreferrer"
                className="px-5 py-3 rounded-xl bg-primary text-white text-center font-semibold">WhatsApp</a>
              <a href={calendly} target="_blank" rel="noreferrer"
                className="px-5 py-3 rounded-xl border border-neutral-300 text-center font-semibold hover:border-primary">Agenda tu cita</a>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
