export default function PartnersStrip(){
  const partners = [
    '/partners/rappi_logo.png',
    '/partners/peya_logo.png',
    '/partners/didi_logo.png',
    '/partners/justo_logo.png',
    '/partners/vtex_logo.png'
  ]
  const loop = [...partners, ...partners]

  return (
    <section className="py-6 bg-light border-y border-neutral-200 overflow-hidden">
      <div className="animate-marquee flex items-center gap-10">
        {loop.map((src,i)=> (
          <img key={i} src={src} alt="partner" className="h-12 md:h-16 w-auto object-contain opacity-90" loading="lazy" />
        ))}
      </div>
    </section>
  )
}
