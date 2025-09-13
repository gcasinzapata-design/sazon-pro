import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function LibroReclamaciones(){
  return (
    <>
      <Navbar/>
      <main className="pt-28 max-w-3xl mx-auto px-4 md:px-6">
        <h1 className="text-3xl md:text-4xl font-bold">Libro de Reclamaciones</h1>
        <p className="mt-2 text-neutral-600">Presenta aquí tu queja o reclamo según la normativa aplicable.</p>

        <form name="libro-reclamaciones" method="POST" data-netlify="true" netlify-honeypot="bot-field" className="mt-6 grid gap-4 bg-white border border-neutral-200 rounded-2xl p-6">
          <input type="hidden" name="form-name" value="libro-reclamaciones" />
          <p className="hidden">
            <label>No llenar: <input name="bot-field" /></label>
          </p>
          <input className="input" name="Nombre" placeholder="Nombre" required />
          <input className="input" name="Documento" placeholder="DNI / CE" required />
          <input className="input" name="Email" type="email" placeholder="Email" required />
          <input className="input" name="Telefono" placeholder="Teléfono" />
          <textarea className="input min-h-[140px]" name="Detalle" placeholder="Detalle del reclamo" required />
          <button className="px-5 py-3 rounded-xl bg-primary text-white font-semibold justify-self-start">Enviar</button>
        </form>

        <div className="h-16"/>
      </main>
      <Footer/>
    </>
  )
}
