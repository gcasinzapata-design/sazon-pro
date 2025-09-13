import { waLink } from '../utils'

export default function WhatsAppBubble(){
  const number = import.meta.env.VITE_WHATSAPP_NUMBER || '51978978905'
  return (
    <a
      href={waLink(number, '¡Hola! Quiero más info sobre Sazón Growth Partner!')}
      target="_blank" rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full bg-green-500 text-white grid place-items-center shadow-soft hover:opacity-90"
      aria-label="WhatsApp"
    >
      <span style={{fontSize:22}}>🟢</span>
    </a>
  )
}
