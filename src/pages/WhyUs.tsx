import React from 'react';
import Header from '../components/Header';
import './WhyUs.css';

const WhyUs: React.FC = () => {
  return (
    <div className="why-us-page">
      <Header />
      
      {/* Hero Section Why Us */}
      <section className="why-us-hero">
        <div className="container">
          <div className="hero-content" data-aos="fade-up">
            <span className="subtitle">Pourquoi Choisir Inesic</span>
            <h1 className="hero-title">
              L'<span className="gradient-text">excellence africaine</span> au service de votre réussite
            </h1>
            <p className="hero-text">
              Découvrez ce qui fait d'Inesic le partenaire technologique de choix pour transformer 
              vos infrastructures et accélérer votre croissance en Afrique.
            </p>
          </div>
        </div>
      </section>

      {/* Valeurs fondamentales */}
      <section className="values-section">
        <div className="container">
          <div className="text-center">
            <span className="subtitle" data-aos="fade-up">Nos Valeurs</span>
            <h2 className="section-title" data-aos="fade-up" data-aos-delay="100">
              Fondements de notre <span className="gradient-text">excellence</span>
            </h2>
          </div>
          
          <div className="values-grid">
            <div className="value-card" data-aos="fade-up" data-aos-delay="200">
              <div className="value-icon">
                <i className="fas fa-lightbulb"></i>
              </div>
              <h3>Innovation</h3>
              <p>Nous repoussons constamment les limites technologiques pour créer des solutions révolutionnaires adaptées aux défis africains.</p>
              <ul className="value-features">
                <li>R&D continue</li>
                <li>Technologies de pointe</li>
                <li>Solutions sur mesure</li>
              </ul>
            </div>
            
            <div className="value-card" data-aos="fade-up" data-aos-delay="300">
              <div className="value-icon">
                <i className="fas fa-handshake"></i>
              </div>
              <h3>Confiance</h3>
              <p>Nous construisons des relations durables basées sur la transparence, la fiabilité et l'excellence dans l'exécution.</p>
              <ul className="value-features">
                <li>Transparence totale</li>
                <li>Engagements tenus</li>
                <li>Support continu</li>
              </ul>
            </div>
            
            <div className="value-card" data-aos="fade-up" data-aos-delay="400">
              <div className="value-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Collaboration</h3>
              <p>Nous travaillons en étroite collaboration avec nos clients pour comprendre leurs besoins et co-créer des solutions optimales.</p>
              <ul className="value-features">
                <li>Approche participative</li>
                <li>Co-création</li>
                <li>Partage d'expertise</li>
              </ul>
            </div>
            
            <div className="value-card" data-aos="fade-up" data-aos-delay="500">
              <div className="value-icon">
                <i className="fas fa-leaf"></i>
              </div>
              <h3>Impact</h3>
              <p>Nous créons des solutions qui génèrent un impact positif durable sur les communautés et l'environnement.</p>
              <ul className="value-features">
                <li>Développement durable</li>
                <li>Impact social</li>
                <li>Responsabilité environnementale</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages concurrentiels */}
      <section className="advantages-section">
        <div className="container">
          <div className="text-center">
            <span className="subtitle" data-aos="fade-up">Nos Avantages</span>
            <h2 className="section-title" data-aos="fade-up" data-aos-delay="100">
              Pourquoi <span className="gradient-text">Inesic</span> se démarque
            </h2>
          </div>
          
          <div className="advantages-content">
            <div className="advantage-item" data-aos="fade-right" data-aos-delay="200">
              <div className="advantage-number">01</div>
              <div className="advantage-content">
                <h3>Expertise Locale Africaine</h3>
                <p>Notre équipe d'ingénieurs africains comprend parfaitement les défis spécifiques du continent : contraintes énergétiques, conditions climatiques, contextes économiques et besoins locaux.</p>
                <div className="advantage-highlights">
                  <span>Ingénieurs africains qualifiés</span>
                  <span>Connaissance du terrain</span>
                  <span>Solutions adaptées localement</span>
                </div>
              </div>
            </div>
            
            <div className="advantage-item reverse" data-aos="fade-left" data-aos-delay="300">
              <div className="advantage-number">02</div>
              <div className="advantage-content">
                <h3>Technologies de Pointe Accessibles</h3>
                <p>Nous démocratisons l'accès aux technologies avancées en créant des solutions abordables et adaptées aux budgets africains, sans compromettre la qualité.</p>
                <div className="advantage-highlights">
                  <span>Prix compétitifs</span>
                  <span>Technologies de pointe</span>
                  <span>ROI rapide</span>
                </div>
              </div>
            </div>
            
            <div className="advantage-item" data-aos="fade-right" data-aos-delay="400">
              <div className="advantage-number">03</div>
              <div className="advantage-content">
                <h3>Support 24/7 Local</h3>
                <p>Notre équipe de support technique est disponible 24h/24 et 7j/7, avec une compréhension parfaite de vos enjeux et de votre contexte opérationnel.</p>
                <div className="advantage-highlights">
                  <span>Support multilingue</span>
                  <span>Intervention rapide</span>
                  <span>Formation continue</span>
                </div>
              </div>
            </div>
            
            <div className="advantage-item reverse" data-aos="fade-left" data-aos-delay="500">
              <div className="advantage-number">04</div>
              <div className="advantage-content">
                <h3>Innovation Continue</h3>
                <p>Nous investissons constamment dans la R&D pour anticiper les besoins futurs et maintenir nos solutions à la pointe de la technologie.</p>
                <div className="advantage-highlights">
                  <span>R&D permanente</span>
                  <span>Veille technologique</span>
                  <span>Évolution continue</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistiques et réalisations */}
      <section className="achievements-section">
        <div className="container">
          <div className="text-center">
            <span className="subtitle" data-aos="fade-up">Nos Réalisations</span>
            <h2 className="section-title" data-aos="fade-up" data-aos-delay="100">
              Chiffres qui <span className="gradient-text">parlent</span>
            </h2>
          </div>
          
          <div className="achievements-grid">
            <div className="achievement-item" data-aos="fade-up" data-aos-delay="200">
              <div className="achievement-number">50+</div>
              <div className="achievement-label">Projets Réalisés</div>
              <div className="achievement-description">Solutions déployées avec succès dans divers secteurs</div>
            </div>
            
            <div className="achievement-item" data-aos="fade-up" data-aos-delay="300">
              <div className="achievement-number">30%</div>
              <div className="achievement-label">Réduction des Coûts</div>
              <div className="achievement-description">Économies moyennes réalisées par nos clients</div>
            </div>
            
            <div className="achievement-item" data-aos="fade-up" data-aos-delay="400">
              <div className="achievement-number">98%</div>
              <div className="achievement-label">Satisfaction Client</div>
              <div className="achievement-description">Taux de satisfaction de nos clients</div>
            </div>
            
            <div className="achievement-item" data-aos="fade-up" data-aos-delay="500">
              <div className="achievement-number">24/7</div>
              <div className="achievement-label">Support Disponible</div>
              <div className="achievement-description">Support technique permanent</div>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages clients */}
      <section className="testimonials-section">
        <div className="container">
          <div className="text-center">
            <span className="subtitle" data-aos="fade-up">Témoignages</span>
            <h2 className="section-title" data-aos="fade-up" data-aos-delay="100">
              Ce que disent nos <span className="gradient-text">clients</span>
            </h2>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card" data-aos="fade-up" data-aos-delay="200">
              <div className="testimonial-content">
                <p>"Inesic a transformé notre gestion énergétique. Leur expertise locale et leur compréhension de nos défis ont fait toute la différence."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="author-info">
                  <h4>Moussa Diop</h4>
                  <span>Directeur Général, Industrie Dakar</span>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card" data-aos="fade-up" data-aos-delay="300">
              <div className="testimonial-content">
                <p>"L'équipe Inesic est exceptionnelle. Leur support 24/7 et leur expertise technique nous ont permis d'optimiser nos processus efficacement."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="author-info">
                  <h4>Aissatou Ndiaye</h4>
                  <span>Responsable IT, Centre Commercial</span>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card" data-aos="fade-up" data-aos-delay="400">
              <div className="testimonial-content">
                <p>"Un partenaire technologique de confiance qui comprend nos réalités africaines. Leur approche collaborative est remarquable."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="author-info">
                  <h4>Cheikh Fall</h4>
                  <span>Directeur Technique, Hôpital</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="why-us-cta">
        <div className="container">
          <div className="cta-content" data-aos="zoom-in">
            <h2>Prêt à découvrir la différence Inesic ?</h2>
            <p>Rejoignez les entreprises qui ont déjà transformé leurs infrastructures avec nos solutions</p>
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

export default WhyUs;
