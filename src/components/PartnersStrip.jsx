export default function PartnersStrip(){
  const partners = [
    '/partners/rappi_logo.png',
    '/partners/peya_logo.png',
    '/partners/didi_logo.png',
    '/partners/justo_logo.png',
    '/partners/vtex_logo.png'
  ]
  return (
    <section className="py-10 bg-light">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <p className="text-center text-xs uppercase tracking-widest text-neutral-500 mb-6">Partners</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 place-items-center">
          {partners.map((src,i)=> (
            <img key={i} src={src} alt="partner" className="h-10 md:h-12 w-auto object-contain" loading="lazy" />
          ))}
        </div>
      </div>
    </section>
  )
}
