import React from 'react';
import Header from '../components/Header';
import './Expertise.css';

const Expertise: React.FC = () => {
  return (
    <div className="expertise-page">
      <Header />
      
      {/* Hero Section Expertise */}
      <section className="expertise-hero">
        <div className="container">
          <div className="hero-content" data-aos="fade-up">
            <span className="subtitle">Nos Domaines d'Expertise</span>
            <h1 className="hero-title">
              <span className="gradient-text">Solutions Sur Mesure</span> pour l'Afrique
            </h1>
            <p className="hero-text">
              Nous développons des solutions technologiques innovantes adaptées aux réalités africaines, 
              conçues pour résoudre les défis spécifiques de nos infrastructures.
            </p>
          </div>
        </div>
      </section>

      {/* Expertise Grid */}
      <section className="expertise-grid-section">
        <div className="container">
          <div className="expertise-grid">
            <div className="expertise-card" data-aos="fade-up" data-aos-delay="100">
              <div className="expertise-icon">
                <i className="fas fa-bolt"></i>
              </div>
              <h3>Efficacité Énergétique</h3>
              <p>Optimisation de la consommation électrique, monitoring intelligent et solutions de réduction des coûts énergétiques.</p>
              <ul className="expertise-features">
                <li>Audit énergétique complet</li>
                <li>Monitoring en temps réel</li>
                <li>Optimisation automatique</li>
                <li>Réduction des coûts garantie</li>
              </ul>
            </div>

            <div className="expertise-card" data-aos="fade-up" data-aos-delay="200">
              <div className="expertise-icon">
                <i className="fas fa-microchip"></i>
              </div>
              <h3>Internet des Objets (IoT)</h3>
              <p>Développement de solutions connectées intelligentes pour la surveillance et l'automatisation des infrastructures.</p>
              <ul className="expertise-features">
                <li>Capteurs intelligents</li>
                <li>Connectivité LoRaWAN</li>
                <li>Plateformes cloud</li>
                <li>Applications mobiles</li>
              </ul>
            </div>

            <div className="expertise-card" data-aos="fade-up" data-aos-delay="300">
              <div className="expertise-icon">
                <i className="fas fa-cogs"></i>
              </div>
              <h3>Mécatronique & Automatisation</h3>
              <p>Systèmes automatisés innovants conçus pour les environnements africains exigeants.</p>
              <ul className="expertise-features">
                <li>Contrôleurs industriels</li>
                <li>Robots de service</li>
                <li>Systèmes de sécurité</li>
                <li>Maintenance prédictive</li>
              </ul>
            </div>

            <div className="expertise-card" data-aos="fade-up" data-aos-delay="400">
              <div className="expertise-icon">
                <i className="fas fa-tablet-alt"></i>
              </div>
              <h3>Digitalisation des Processus</h3>
              <p>Transformation numérique des processus métiers pour améliorer l'efficacité opérationnelle.</p>
              <ul className="expertise-features">
                <li>Workflow automatisés</li>
                <li>Gestion documentaire</li>
                <li>Tableaux de bord</li>
                <li>Intégration systèmes</li>
              </ul>
            </div>

            <div className="expertise-card" data-aos="fade-up" data-aos-delay="500">
              <div className="expertise-icon">
                <i className="fas fa-network-wired"></i>
              </div>
              <h3>Smart Grids & Réseaux</h3>
              <p>Réseaux électriques intelligents adaptés aux défis de distribution d'énergie en Afrique.</p>
              <ul className="expertise-features">
                <li>Gestion de charge</li>
                <li>Détection de pannes</li>
                <li>Optimisation distribution</li>
                <li>Intégration renouvelables</li>
              </ul>
            </div>

            <div className="expertise-card" data-aos="fade-up" data-aos-delay="600">
              <div className="expertise-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Analytics & Intelligence Artificielle</h3>
              <p>Solutions d'analyse prédictive et d'IA pour optimiser les décisions opérationnelles.</p>
              <ul className="expertise-features">
                <li>Machine Learning</li>
                <li>Prédiction maintenance</li>
                <li>Optimisation ressources</li>
                <li>Alertes intelligentes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Méthodologie */}
      <section className="methodology-section">
        <div className="container">
          <div className="text-center">
            <span className="subtitle" data-aos="fade-up">Notre Approche</span>
            <h2 className="section-title" data-aos="fade-up" data-aos-delay="100">
              Méthodologie <span className="gradient-text">Inesic</span>
            </h2>
          </div>
          
          <div className="methodology-steps">
            <div className="step" data-aos="fade-right" data-aos-delay="200">
              <div className="step-number">01</div>
              <div className="step-content">
                <h3>Analyse & Audit</h3>
                <p>Évaluation complète de vos besoins, contraintes et objectifs spécifiques au contexte africain.</p>
              </div>
            </div>
            
            <div className="step" data-aos="fade-left" data-aos-delay="300">
              <div className="step-number">02</div>
              <div className="step-content">
                <h3>Conception Sur Mesure</h3>
                <p>Développement de solutions adaptées à vos réalités locales et contraintes techniques.</p>
              </div>
            </div>
            
            <div className="step" data-aos="fade-right" data-aos-delay="400">
              <div className="step-number">03</div>
              <div className="step-content">
                <h3>Implémentation & Formation</h3>
                <p>Déploiement progressif avec formation complète de vos équipes pour l'autonomie.</p>
              </div>
            </div>
            
            <div className="step" data-aos="fade-left" data-aos-delay="500">
              <div className="step-number">04</div>
              <div className="step-content">
                <h3>Support & Évolution</h3>
                <p>Accompagnement continu et amélioration continue de vos solutions technologiques.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Utilisées */}
      <section className="technologies-section">
        <div className="container">
          <div className="text-center">
            <span className="subtitle" data-aos="fade-up">Technologies</span>
            <h2 className="section-title" data-aos="fade-up" data-aos-delay="100">
              Stack Technologique <span className="gradient-text">Moderne</span>
            </h2>
          </div>
          
          <div className="tech-grid">
            <div className="tech-category" data-aos="fade-up" data-aos-delay="200">
              <h3>Hardware</h3>
              <div className="tech-items">
                <span>Raspberry Pi</span>
                <span>Arduino</span>
                <span>Capteurs IoT</span>
                <span>Modules LoRa</span>
              </div>
            </div>
            
            <div className="tech-category" data-aos="fade-up" data-aos-delay="300">
              <h3>Software</h3>
              <div className="tech-items">
                <span>Python</span>
                <span>Node.js</span>
                <span>React</span>
                <span>Docker</span>
              </div>
            </div>
            
            <div className="tech-category" data-aos="fade-up" data-aos-delay="400">
              <h3>Cloud & IA</h3>
              <div className="tech-items">
                <span>AWS</span>
                <span>TensorFlow</span>
                <span>MongoDB</span>
                <span>Redis</span>
              </div>
            </div>
            
            <div className="tech-category" data-aos="fade-up" data-aos-delay="500">
              <h3>Protocoles</h3>
              <div className="tech-items">
                <span>LoRaWAN</span>
                <span>MQTT</span>
                <span>HTTP/HTTPS</span>
                <span>WebSocket</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="expertise-cta">
        <div className="container">
          <div className="cta-content" data-aos="zoom-in">
            <h2>Prêt à transformer votre infrastructure ?</h2>
            <p>Nos experts sont là pour vous accompagner dans votre projet technologique</p>
            <div className="cta-buttons">
              <button className="cta-btn primary">Discuter de votre projet</button>
              <button className="cta-btn secondary">Voir nos réalisations</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Expertise;
