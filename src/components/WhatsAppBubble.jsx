import { waLink } from '../utils'

function WhatsAppIcon(){
  return (
    <svg viewBox="0 0 32 32" className="w-6 h-6 fill-white" aria-hidden="true">
      <path d="M19.11 17.41c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.62.14-.18.27-.71.88-.87 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.18-1.33-.81-.72-1.36-1.61-1.52-1.88-.16-.27-.02-.42.12-.56.13-.13.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.62-1.5-.85-2.05-.22-.53-.45-.46-.62-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3 0 1.36.99 2.68 1.13 2.86.14.18 1.95 2.98 4.73 4.17.66.28 1.17.45 1.57.57.66.21 1.26.18 1.73.11.53-.08 1.6-.65 1.83-1.29.23-.64.23-1.18.16-1.29-.07-.11-.25-.18-.52-.32z"/><path d="M26.6 5.4C23.9 2.7 20.2 1.2 16.3 1.2 8.7 1.2 2.4 7.5 2.4 15.1c0 2.2.6 4.4 1.7 6.3L2 30.8l9.6-2.5c1.8 1 3.9 1.6 6 1.6 7.6 0 13.9-6.3 13.9-13.9 0-3.7-1.5-7.3-4.4-10zM16.3 27c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-5.7 1.5 1.5-5.5-.3-.4c-1.1-1.8-1.7-3.9-1.7-6 0-6.4 5.2-11.6 11.6-11.6 3.1 0 6 1.2 8.2 3.4 2.2 2.2 3.4 5.1 3.4 8.2 0 6.4-5.2 11.6-11.6 11.6z"/>
    </svg>
  )
}

export default function WhatsAppBubble(){
  const number = import.meta.env.VITE_WHATSAPP_NUMBER || '51978978905'
  return (
    <a
      href={waLink(number, '¡Hola! Quiero más info sobre Sazón Growth Partner!')}
      target="_blank" rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full bg-green-500 text-white grid place-items-center shadow-soft hover:opacity-90"
      aria-label="WhatsApp"
    >
      <WhatsAppIcon/>
    </a>
  )
}
