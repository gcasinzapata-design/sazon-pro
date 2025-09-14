import { useEffect, useRef } from 'react'

export default function MercadoPagoButton({ preferenceId }){
  const containerRef = useRef(null)

  useEffect(()=>{
    if(!preferenceId || !containerRef.current) return
    containerRef.current.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://www.mercadopago.com.pe/integrations/v1/web-payment-checkout.js'
    script.setAttribute('data-preference-id', preferenceId)
    script.setAttribute('data-source', 'button')
    containerRef.current.appendChild(script)
  }, [preferenceId])

  return <div ref={containerRef} className="w-full" />
}
