import { Background } from './Background';
import { Header } from './Header';
import { Hero } from './Hero';
import { Services } from './Services';
import { About } from './About';
import { OrderForm } from './OrderForm';
import { Contact } from './Contact';
import { Footer } from './Footer';

function App() {
  return (
    <>
      <Background />
      <Header />
      <main>
        <Hero />
        <Services />
        <About />
        <OrderForm />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;