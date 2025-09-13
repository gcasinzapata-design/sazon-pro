import { useState } from 'react'

const items = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Planes', href: '#planes' },
  { label: '¿Por qué Sazón?', href: '#porque' },
  { label: 'Contacto', href: '#contacto' },
]

export default function Navbar(){
  const [active, setActive] = useState('#inicio')
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b border-neutral-200">
      <nav className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <a href="#inicio" className="flex items-center gap-2" onClick={()=>setActive('#inicio')}>
          <img src="/sazon-logo.svg" alt="Sazón" className="h-8 w-auto" />
        </a>
        <button className="md:hidden" onClick={()=>setOpen(!open)} aria-label="Menú">☰</button>
        <ul className={`md:flex items-center gap-6 text-sm font-medium ${open ? 'block mt-3' : 'hidden md:flex'}`}>
          {items.map(i => (
            <li key={i.href}>
              <a
                href={i.href}
                onClick={()=>{setActive(i.href); setOpen(false)}}
                className={`hover:text-primary transition-colors ${active===i.href ? 'text-primary' : 'text-neutral-900'}`}
              >{i.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
