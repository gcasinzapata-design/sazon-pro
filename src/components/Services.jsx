import { motion } from 'framer-motion'

const services = [
  { title: 'Estrategia & Growth', desc: 'Diagnóstico, roadmap y aceleración de resultados.' },
  { title: 'Paid Media', desc: 'Campañas de rendimiento y creatividad que venden.' },
  { title: 'Branding & Contenido', desc: 'Marca, guiones, producción y social.' },
  { title: 'Automatización & IA', desc: 'Flujos, personalización y data-driven marketing.' },
]

export default function Services(){
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
      <h2 className="text-2xl md:text-4xl font-bold">Servicios clave</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {services.map((s, i)=> (
          <motion.div key={i} initial={{opacity:0, y:14}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:i*0.05}}
            className="p-6 rounded-2xl border border-neutral-200 hover:shadow-soft bg-white">
            <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
            <p className="text-sm text-neutral-600">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
