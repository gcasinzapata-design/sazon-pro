import Navbar from './components/Navbar'
import Hero from './components/Hero'
import PartnersStrip from './components/PartnersStrip'
import Services from './components/Services'
import Plans from './components/Plans'
import WhyUs from './components/WhyUs'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WhatsAppBubble from './components/WhatsAppBubble'

export default function App(){
  return (
    <>
      <Navbar />
      <main>
        <section id="inicio"><Hero/></section>
        <PartnersStrip/>
        <section id="servicios"><Services/></section>
        <section id="planes"><Plans/></section>
        <section id="porque"><WhyUs/></section>
        <section id="contacto"><Contact/></section>
      </main>
      <Footer/>
      <WhatsAppBubble/>
    </>
  )
}
