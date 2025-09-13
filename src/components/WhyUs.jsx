import { motion } from 'framer-motion'

const items = [
  { title: 'Data-driven', desc: 'Decisiones informadas con analítica y experimentación.' },
  { title: 'Expertos en Food-tech', desc: 'Know-how en marcas de comida y delivery.' },
  { title: 'Resultados Medibles', desc: 'KPIs claros, enfoque en conversión y LTV.' },
  { title: 'Equipo consolidado', desc: 'Especialistas en crecimiento, creatividad y tecnología.' },
]

export default function WhyUs(){
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
      <h2 className="text-2xl md:text-4xl font-bold">¿Por qué Sazón?</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {items.map((it, i)=> (
          <motion.div key={i} initial={{opacity:0, y:10}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:i*0.05}}
            className="p-6 rounded-2xl border border-neutral-200 bg-white hover:shadow-soft">
            <h3 className="font-semibold text-lg mb-2">{it.title}</h3>
            <p className="text-sm text-neutral-600">{it.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
