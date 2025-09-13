import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { waLink } from '../utils'

const bubbles = [
  'Estrategia de crecimiento',
  'Paid Media que convierte',
  'Branding que enamora',
  'Automatización con IA'
]

export default function Hero(){
  const [idx, setIdx] = useState(0)
  const number = import.meta.env.VITE_WHATSAPP_NUMBER || '51978978905'
  useEffect(()=>{
    const t = setInterval(()=> setIdx(i => (i+1)%bubbles.length), 2200)
    return ()=>clearInterval(t)
  },[])

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-b from-neutral-900 to-neutral-800">
      <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline>
        <source src="/hero.mp4" type="video/mp4" />
        {/* Fallback remoto (stock) por si no existe /hero.mp4 */}
        <source src="https://cdn.coverr.co/videos/coverr-coworkers-in-a-meeting-1565/1080p.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/55"/>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white pt-28 md:pt-32">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">Sazón Growth Partner</h1>
        <p className="mt-4 text-base md:text-lg opacity-95">Impulsamos marcas food-tech con estrategia, data y creatividad.</p>

        <div className="mt-6 h-10 md:h-12 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={idx}
              initial={{opacity:0, y:10}}
              animate={{opacity:1, y:0}}
              exit={{opacity:0, y:-10}}
              transition={{duration:0.35}}
              className="inline-block px-4 py-2 rounded-full bg-white/15 border border-white/30 text-sm md:text-base backdrop-blur shadow-soft"
            >{bubbles[idx]}</motion.span>
          </AnimatePresence>
        </div>

        <div className="mt-8">
          <a href={waLink(number, '¡Hola! Quiero saber más sobre Sazón Growth Partner.')} target="_blank" rel="noreferrer"
             className="inline-block px-6 py-3 rounded-xl bg-primary text-white font-semibold shadow-soft hover:opacity-90 transition">
            Hablemos por WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
