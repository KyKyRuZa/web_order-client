import { useEffect } from 'react';
import { Background } from '../layout/Background';
import { Header } from '../layout/Header';
import { Hero } from '../sections/Hero';
import { Services } from '../sections/Services';
import { About } from '../sections/About';
import { OrderForm } from '../sections/OrderForm';
import { Contact } from '../sections/Contact';
import { Footer } from '../layout/Footer';

const App = () => {
  useEffect(() => {
    // Обработка якорной навигации при загрузке страницы
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100); // Небольшая задержка для гарантии загрузки DOM
      }
    }
  }, []);

  return (
    <>
      <Background />
      <Header />
      <main>
        <Hero id="home" />
        <Services id="services" />
        <About id="about" />
        <OrderForm id="order" />
        <Contact id="contact" />
      </main>
      <Footer />
    </>
  );
};

export default App;