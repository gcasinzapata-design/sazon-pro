import { useState, useEffect } from 'react'

function MenuIcon(){
  return (
    <svg viewBox="0 0 24 24" className="w-7 h-7" aria-hidden="true">
      <path d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z" fill="currentColor"/>
    </svg>
  )
}

const centerItems = [
  { label: 'Inicio', href: '/#inicio' },
  { label: 'Servicios', href: '/#servicios' },
  { label: 'Planes', href: '/#planes' },
  { label: '¿Por qué Sazón?', href: '/#porque' },
]

export default function Navbar(){
  const [active, setActive] = useState('/#inicio')
  const [open, setOpen] = useState(false)

  useEffect(()=>{
    const handler = () => {
      const sections = ['/#inicio','/#servicios','/#planes','/#porque','/#contacto']
      let current = '/#inicio'
      sections.forEach(id=>{
        const el = document.querySelector(id.replace('/',''))
        if(el && window.scrollY + 90 >= el.offsetTop) current = id
      })
      setActive(current)
    }
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return ()=>window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 border-b border-neutral-200">
      <nav className="max-w-7xl mx-auto px-4 md:px-6 py-3 grid grid-cols-[auto,1fr,auto] items-center">
        <a href="/#inicio" className="flex items-center gap-2" onClick={()=>{setActive('/#inicio'); setOpen(false)}}>
          <img src="/sazon-logo.png" alt="Sazón" className="h-16 md:h-20 w-auto shrink-0" />
        </a>
        <ul className="hidden md:flex items-center justify-center gap-6 text-sm font-medium">
          {centerItems.map(i => (
            <li key={i.href}>
              <a
                href={i.href}
                onClick={()=>{setActive(i.href)}}
                className={`hover:text-primary transition-colors ${active===i.href ? 'text-primary' : 'text-neutral-900'}`}
              >{i.label}</a>
            </li>
          ))}
        </ul>
        <div className="hidden md:flex justify-end">
          <a href="/#contacto" onClick={()=>setActive('/#contacto')}
             className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold shadow-soft hover:opacity-90 transition">
            Contacto
          </a>
        </div>
        <button className="md:hidden col-start-3 justify-self-end w-11 h-11 rounded-xl border border-neutral-200 bg-white grid place-items-center shadow-soft active:scale-95 transition" onClick={()=>setOpen(!open)} aria-label="Menú" aria-expanded={open}>
          <MenuIcon/>
        </button>
        {open && (
          <div className="col-span-3 md:hidden mt-3 rounded-2xl border border-neutral-200 bg-white p-3 shadow-soft">
            <ul className="flex flex-col gap-2 text-sm font-medium">
              {[...centerItems, { label: 'Contacto', href: '/#contacto', cta:true }].map(i => (
                <li key={i.href}>
                  <a
                    href={i.href}
                    onClick={()=>{setActive(i.href); setOpen(false)}}
                    className={`${i.cta ? 'bg-primary text-white px-3 py-2 rounded-lg block text-center' : ''}
                      ${active===i.href && !i.cta ? 'text-primary' : 'text-neutral-900'} hover:text-primary`}
                  >{i.label}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}
