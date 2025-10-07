import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero" id="accueil">
      <div className="hero-3d-background" id="hero-3d-scene"></div>
      <div className="container">
        <div className="flex items-center">
          <div className="hero-content" data-aos="fade-up" data-aos-duration="1000">
            <span className="subtitle">Innovation Technologique</span>
            <h1 className="hero-title">
              La technologie au service des <span className="gradient-text">infrastructures africaines</span>
            </h1>
            <p className="hero-text">
              Nous concevons des systèmes intelligents pensés pour nos réalités africaines. 
              Des solutions connectées pour moderniser les infrastructures, optimiser l'énergie 
              et digitaliser les processus métiers.
            </p>
            <div className="hero-cta">
              <Link to="/contact" className="hero-btn pulse-effect">
                Discuter de votre projet
              </Link>
              <Link to="/expertise" className="hero-btn outline glow-effect">
                Découvrir nos solutions
              </Link>
            </div>
          </div>
          
          <div className="hero-3d-container" data-aos="zoom-in" data-aos-delay="300">
            <div className="hero-3d-model" id="model-container"></div>
            
            {/* Cartes flottantes */}
            <div className="floating-card top-right" data-aos="fade-left" data-aos-delay="600">
              <div className="floating-card-icon">
                <i className="fas fa-bolt"></i>
              </div>
              <div className="floating-card-content">
                <h4>Efficacité énergétique</h4>
                <p>Réduction des coûts garantie</p>
              </div>
            </div>
            
            <div className="floating-card mid-right" data-aos="fade-left" data-aos-delay="700">
              <div className="floating-card-icon">
                <i className="fas fa-microchip"></i>
              </div>
              <div className="floating-card-content">
                <h4>Internet des Objets</h4>
                <p>Solutions connectées intelligentes</p>
              </div>
            </div>
            
            <div className="floating-card bottom-right" data-aos="fade-left" data-aos-delay="800">
              <div className="floating-card-icon">
                <i className="fas fa-cogs"></i>
              </div>
              <div className="floating-card-content">
                <h4>Mécatronique</h4>
                <p>Systèmes automatisés innovants</p>
              </div>
            </div>
            
            <div className="floating-card bottom-left" data-aos="fade-right" data-aos-delay="900">
              <div className="floating-card-icon">
                <i className="fas fa-tablet-alt"></i>
              </div>
              <div className="floating-card-content">
                <h4>Digitalisation</h4>
                <p>Processus optimisés</p>
              </div>
            </div>
            
            <div className="floating-card mid-left" data-aos="fade-right" data-aos-delay="1000">
              <div className="floating-card-icon">
                <i className="fas fa-network-wired"></i>
              </div>
              <div className="floating-card-content">
                <h4>Smart Grids</h4>
                <p>Réseaux électriques intelligents</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-particles" id="particles-container"></div>
    </section>
  );
};

export default Hero;
