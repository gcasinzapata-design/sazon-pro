import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Politicas(){
  return (
    <>
      <Navbar/>
      <main className="pt-28 max-w-3xl mx-auto px-4 md:px-6">
        <h1 className="text-3xl md:text-4xl font-bold">Políticas</h1>
        <p className="mt-2 text-neutral-600">Última actualización: 13/09/2025</p>

        <section id="privacidad" className="prose max-w-none mt-8">
          <h2>Política de Privacidad</h2>
          <p>En <strong>Sazón Growth Partner</strong> (“Sazón”, “nosotros”) protegemos la privacidad de nuestros clientes, prospectos y visitantes. Esta Política explica qué datos recopilamos, con qué finalidad, por cuánto tiempo y cuáles son tus derechos.</p>
          <h3>1. Responsable del tratamiento</h3>
          <p>Sazón Growth Partner. Contacto: <a href="mailto:comercial@sazonpartner.com">comercial@sazonpartner.com</a> | Tel: <a href="tel:+51978978905">+51 978 978 905</a>.</p>
          <h3>2. Datos que recopilamos</h3>
          <ul>
            <li><em>Datos de contacto</em>: nombre, marca, teléfono, email, país; y el mensaje que envías a través de formularios.</li>
            <li><em>Datos de navegación</em>: direcciones IP, cookies, identificadores, páginas vistas y métricas de uso.</li>
            <li><em>Comunicaciones</em>: conversaciones por WhatsApp, email u otros canales que habilitemos.</li>
          </ul>
          <h3>3. Finalidades</h3>
          <ul>
            <li>Responder consultas, brindar cotizaciones y prestar nuestros servicios.</li>
            <li>Gestión comercial y de relaciones con clientes.</li>
            <li>Mejorar el sitio, medir desempeño y seguridad.</li>
            <li>Cumplir obligaciones legales o requerimientos de autoridad.</li>
          </ul>
          <h3>4. Base legal</h3>
          <p>Tu consentimiento, la ejecución de un contrato/precontrato, el interés legítimo (mejoras y seguridad) y/o el cumplimiento de obligaciones legales, según corresponda.</p>
          <h3>5. Conservación</h3>
          <p>Conservamos los datos por el tiempo necesario para las finalidades indicadas y mientras existan obligaciones legales o posibles responsabilidades.</p>
          <h3>6. Encargados y transferencias</h3>
          <p>Podemos usar proveedores (hosting, analítica, mensajería) que tratan datos por nuestra cuenta, bajo contratos y medidas de seguridad. Si transferimos datos a otros países, aplicaremos salvaguardas adecuadas.</p>
          <h3>7. Derechos</h3>
          <p>Puedes solicitar acceso, rectificación, actualización, oposición, portabilidad o supresión cuando corresponda, escribiendo a <a href="mailto:comercial@sazonpartner.com">comercial@sazonpartner.com</a>. También puedes retirar tu consentimiento cuando la base sea el consentimiento.</p>
          <h3>8. Menores</h3>
          <p>Nuestros servicios están dirigidos a empresas. Si consideras que hemos tratado datos de menores sin autorización, contáctanos.</p>
          <h3>9. Actualizaciones</h3>
          <p>Podemos modificar esta Política. La fecha de última actualización figura al inicio.</p>
        </section>

        <section id="cookies" className="prose max-w-none mt-12">
          <h2>Política de Cookies</h2>
          <p>Este sitio utiliza cookies y tecnologías similares para su funcionamiento, medición y, de ser aplicable, para publicidad.</p>
          <h3>1. ¿Qué son las cookies?</h3>
          <p>Pequeños archivos que se almacenan en tu navegador para recordar información y reconocer tu dispositivo.</p>
          <h3>2. Tipos de cookies que usamos</h3>
          <ul>
            <li><strong>Esenciales</strong>: necesarias para navegar y usar funciones básicas.</li>
            <li><strong>Analítica</strong>: para entender uso, mejorar rendimiento y detectar errores.</li>
            <li><strong>Publicidad</strong> (si se activan): para mostrar anuncios relevantes.</li>
          </ul>
          <h3>3. Gestión de cookies</h3>
          <p>Puedes configurar tu navegador para rechazar o eliminar cookies. Si desactivas algunas, el sitio podría no funcionar correctamente.</p>
        </section>

        <section id="terminos" className="prose max-w-none mt-12">
          <h2>Términos & Condiciones</h2>
          <h3>1. Objeto</h3>
          <p>Estos Términos regulan el uso del sitio web de Sazón y la contratación de nuestros servicios.</p>
          <h3>2. Uso del sitio</h3>
          <p>Te comprometes a usar el sitio de forma lícita, sin vulnerar derechos de terceros ni la normativa aplicable.</p>
          <h3>3. Servicios</h3>
          <p>Las descripciones y precios publicados son referenciales. Las propuestas comerciales formales se enviarán por escrito y pueden variar según alcance. <em>La inversión publicitaria no está incluida</em> salvo indicación expresa.</p>
          <h3>4. Propiedad intelectual</h3>
          <p>Los contenidos del sitio (marcas, textos, imágenes, código) pertenecen a Sazón o a sus titulares y no pueden usarse sin autorización.</p>
          <h3>5. Responsabilidad</h3>
          <p>El sitio se ofrece “tal cual”. No garantizamos disponibilidad ininterrumpida. No respondemos por daños indirectos o por el uso de sitios de terceros enlazados.</p>
          <h3>6. Datos personales</h3>
          <p>El tratamiento se rige por nuestra Política de Privacidad.</p>
          <h3>7. Contacto y vigencia</h3>
          <p>Para consultas legales, escribe a <a href="mailto:comercial@sazonpartner.com">comercial@sazonpartner.com</a>. Estos T&C rigen desde su publicación y podrán ser actualizados.</p>
          <p className="text-xs text-neutral-500">Este texto es informativo y no constituye asesoría legal.</p>
        </section>

        <div className="h-16"/>
      </main>
      <Footer/>
    </>
  )
}
