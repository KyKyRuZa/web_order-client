import { useEffect } from 'react';
import { Background } from './Background';
import { Header } from './Header';
import { Hero } from './Hero';
import { Services } from './Services';
import { About } from './About';
import { OrderForm } from './OrderForm';
import { Contact } from './Contact';
import { Footer } from './Footer';

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