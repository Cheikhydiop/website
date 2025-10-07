import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <Header />
      <Hero />
      
      {/* Section About */}
      <section id="about">
        <div className="section-3d-bg" id="about-3d-bg"></div>
        <div className="container">
          <div className="text-center">
            <span className="subtitle" data-aos="fade-up">Qui sommes-nous</span>
            <h2 className="section-title" data-aos="fade-up" data-aos-delay="100">Notre Mission</h2>
            <p className="section-subtitle" data-aos="fade-up" data-aos-delay="200">
              INESIC est une startup technologique basée au Sénégal qui développe des solutions innovantes 
              adaptées aux besoins spécifiques des infrastructures africaines. <br/>
              Notre slogan : <strong>Des systèmes intelligents, pensés pour nos réalités</strong>
            </p>
          </div>
          
          <div className="stats-container glass-card" data-aos="zoom-in" data-aos-delay="300">
            <div className="stats-grid">
              <div className="stat-item" data-aos="fade-up" data-aos-delay="400">
                <h3 className="gradient-text" style={{fontSize: '32px', marginBottom: '15px'}}>Innovation</h3>
                <div className="stat-label">Au cœur de notre ADN</div>
                <div className="stat-icon"><i className="fas fa-lightbulb"></i></div>
              </div>
              <div className="stat-item" data-aos="fade-up" data-aos-delay="500">
                <h3 className="gradient-text" style={{fontSize: '32px', marginBottom: '15px'}}>Expertise</h3>
                <div className="stat-label">Ingénieurs africains qualifiés</div>
                <div className="stat-icon"><i className="fas fa-user-graduate"></i></div>
              </div>
              <div className="stat-item" data-aos="fade-up" data-aos-delay="600">
                <h3 className="gradient-text" style={{fontSize: '32px', marginBottom: '15px'}}>Local</h3>
                <div className="stat-label">Solutions adaptées à l'Afrique</div>
                <div className="stat-icon"><i className="fas fa-map-marker-alt"></i></div>
              </div>
              <div className="stat-item" data-aos="fade-up" data-aos-delay="700">
                <h3 className="gradient-text" style={{fontSize: '32px', marginBottom: '15px'}}>Impact</h3>
                <div className="stat-label">Développement durable</div>
                <div className="stat-icon"><i className="fas fa-seedling"></i></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
