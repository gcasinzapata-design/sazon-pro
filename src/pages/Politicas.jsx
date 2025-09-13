export default function Politicas(){
  return (
    <main className="pt-24 max-w-3xl mx-auto px-4 md:px-6">
      <h1 className="text-3xl md:text-4xl font-bold">Políticas</h1>
      <p className="mt-2 text-neutral-600">Última actualización: 01/09/2025</p>

      <section id="privacidad" className="prose max-w-none mt-6">
        <h2>Políticas de Privacidad</h2>
        <p>Describe aquí cómo recopilas, usas y proteges los datos...</p>
      </section>

      <section id="terminos" className="prose max-w-none mt-10">
        <h2>Términos & Condiciones</h2>
        <p>Condiciones de uso, responsabilidades y limitaciones...</p>
      </section>

      <section id="cookies" className="prose max-w-none mt-10">
        <h2>Políticas de Cookies</h2>
        <p>Tipos de cookies, finalidades y cómo gestionarlas...</p>
      </section>

      <div className="h-16"/>
    </main>
  )
}
