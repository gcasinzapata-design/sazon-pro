export default function Footer(){
  return (
    <footer className="bg-white text-neutral-900 mt-16 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 grid md:grid-cols-3 gap-8">
        <div>
          <img src="/sazon-logo.svg" alt="Sazón" className="h-12 md:h-14 w-auto" />
          <p className="text-sm text-neutral-600 mt-3">Impulsamos marcas con estrategia, creatividad y data.</p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold mb-3">Menú</h4>
            <ul className="space-y-2 text-sm text-neutral-700">
              <li><a href="/#inicio" className="hover:text-primary">Inicio</a></li>
              <li><a href="/#servicios" className="hover:text-primary">Servicios</a></li>
              <li><a href="/#planes" className="hover:text-primary">Planes</a></li>
              <li><a href="/#porque" className="hover:text-primary">¿Por qué Sazón?</a></li>
              <li><a href="/#contacto" className="hover:text-primary">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contacto</h4>
            <ul className="space-y-2 text-sm text-neutral-700">
              <li><a href="tel:+51978978905" className="hover:text-primary">+51 978 978 905</a></li>
              <li><a href="mailto:comercial@sazonpartner.com" className="hover:text-primary">comercial@sazonpartner.com</a></li>
            </ul>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm text-neutral-700">
            <li><a href="/politicas" className="hover:text-primary">Políticas de Privacidad</a></li>
            <li><a href="/politicas#terminos" className="hover:text-primary">Términos & Condiciones</a></li>
            <li><a href="/politicas#cookies" className="hover:text-primary">Políticas de Cookies</a></li>
          </ul>
          <div className="mt-4">
            <a href="/libro-de-reclamaciones" className="inline-flex items-center gap-2 text-sm text-neutral-700 hover:text-primary" aria-label="Libro de Reclamaciones">
              <img src="/partners/LDR_icon.png" alt="Libro de Reclamaciones" className="w-5 h-5"/>
              <span>Libro de Reclamaciones</span>
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-neutral-200 py-4 text-center text-xs text-neutral-500">© {new Date().getFullYear()} Sazón Growth Partner</div>
    </footer>
  )
}
