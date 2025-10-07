import React from 'react';
import Header from '../components/Header';
import './About.css';

const About: React.FC = () => {
  return (
    <div className="about-page">
      <Header />
      
      {/* Hero Section About */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content" data-aos="fade-up">
            <span className="subtitle">Qui sommes-nous</span>
            <h1 className="hero-title">
              <span className="gradient-text">Inesic</span> - 
              L'innovation technologique au service de l'Afrique
            </h1>
            <p className="hero-text">
              Nous sommes une startup technologique sénégalaise qui développe des solutions innovantes 
              adaptées aux besoins spécifiques des infrastructures africaines. Notre mission : 
              démocratiser l'accès aux technologies de pointe sur le continent.
            </p>
          </div>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="story-section">
        <div className="container">
          <div className="story-content">
            <div className="story-text" data-aos="fade-right">
              <span className="subtitle">Notre Histoire</span>
              <h2>Une vision née des défis africains</h2>
              <p>
                Fondée en 2023 au Sénégal, Inesic est née de la vision de jeunes ingénieurs africains 
                qui ont identifié les défis spécifiques auxquels font face les infrastructures du continent.
              </p>
              <p>
                Face aux contraintes énergétiques, aux défis climatiques et aux besoins de modernisation, 
                nous avons décidé de créer des solutions technologiques sur mesure, pensées pour nos réalités locales.
              </p>
              <div className="story-highlights">
                <div className="highlight-item">
                  <i className="fas fa-calendar-alt"></i>
                  <span>Fondation en 2023</span>
                </div>
                <div className="highlight-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>Basé au Sénégal</span>
                </div>
                <div className="highlight-item">
                  <i className="fas fa-users"></i>
                  <span>Équipe africaine</span>
                </div>
              </div>
            </div>
            
            <div className="story-visual" data-aos="fade-left">
              <div className="story-image">
                <div className="image-placeholder">
                  <i className="fas fa-building"></i>
                  <h3>Siège Inesic</h3>
                  <p>Dakar, Sénégal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Mission et Vision */}
      <section className="mission-vision-section">
        <div className="container">
          <div className="mission-vision-grid">
            <div className="mission-card" data-aos="fade-up" data-aos-delay="200">
              <div className="card-icon">
                <i className="fas fa-bullseye"></i>
              </div>
              <h3>Notre Mission</h3>
              <p>
                Développer et déployer des solutions technologiques innovantes qui transforment 
                les infrastructures africaines, en améliorant leur efficacité, leur durabilité 
                et leur impact sur le développement économique du continent.
              </p>
              <ul className="mission-points">
                <li>Solutions adaptées aux réalités africaines</li>
                <li>Technologies accessibles et abordables</li>
                <li>Impact positif sur les communautés</li>
                <li>Transfert de compétences local</li>
              </ul>
            </div>
            
            <div className="vision-card" data-aos="fade-up" data-aos-delay="300">
              <div className="card-icon">
                <i className="fas fa-eye"></i>
              </div>
              <h3>Notre Vision</h3>
              <p>
                Devenir le leader africain des solutions technologiques intelligentes, 
                en positionnant l'Afrique comme un hub d'innovation technologique 
                reconnu mondialement pour sa créativité et son adaptabilité.
              </p>
              <ul className="vision-points">
                <li>Leadership technologique africain</li>
                <li>Innovation reconnue mondialement</li>
                <li>Solutions exportées vers d'autres continents</li>
                <li>Écosystème technologique africain fort</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Équipe */}
      <section className="team-section">
        <div className="container">
          <div className="text-center">
            <span className="subtitle" data-aos="fade-up">Notre Équipe</span>
            <h2 className="section-title" data-aos="fade-up" data-aos-delay="100">
              Des <span className="gradient-text">experts passionnés</span> au service de l'Afrique
            </h2>
          </div>
          
          <div className="team-grid">
            <div className="team-member" data-aos="fade-up" data-aos-delay="200">
              <div className="member-avatar">
                <i className="fas fa-user"></i>
              </div>
              <h3>Mamadou Diallo</h3>
              <span className="member-role">Directeur Général & Co-fondateur</span>
              <p>Ingénieur en électronique avec 8 ans d'expérience dans l'industrie énergétique africaine.</p>
              <div className="member-expertise">
                <span>Gestion de projet</span>
                <span>Stratégie d'entreprise</span>
                <span>Relations clients</span>
              </div>
            </div>
            
            <div className="team-member" data-aos="fade-up" data-aos-delay="300">
              <div className="member-avatar">
                <i className="fas fa-user"></i>
              </div>
              <h3>Fatou Sall</h3>
              <span className="member-role">Directrice Technique & Co-fondatrice</span>
              <p>Ingénieure en informatique spécialisée en IoT et systèmes embarqués.</p>
              <div className="member-expertise">
                <span>Développement IoT</span>
                <span>Architecture système</span>
                <span>Innovation produit</span>
              </div>
            </div>
            
            <div className="team-member" data-aos="fade-up" data-aos-delay="400">
              <div className="member-avatar">
                <i className="fas fa-user"></i>
              </div>
              <h3>Ousmane Ba</h3>
              <span className="member-role">Directeur R&D</span>
              <p>Docteur en mécatronique avec expertise en automatisation industrielle.</p>
              <div className="member-expertise">
                <span>Recherche & Développement</span>
                <span>Automatisation</span>
                <span>Innovation technologique</span>
              </div>
            </div>
            
            <div className="team-member" data-aos="fade-up" data-aos-delay="500">
              <div className="member-avatar">
                <i className="fas fa-user"></i>
              </div>
              <h3>Aissatou Ndiaye</h3>
              <span className="member-role">Responsable Commerciale</span>
              <p>Experte en développement commercial avec une solide connaissance du marché africain.</p>
              <div className="member-expertise">
                <span>Développement commercial</span>
                <span>Stratégie marketing</span>
                <span>Relations partenaires</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="values-section">
        <div className="container">
          <div className="text-center">
            <span className="subtitle" data-aos="fade-up">Nos Valeurs</span>
            <h2 className="section-title" data-aos="fade-up" data-aos-delay="100">
              Les piliers de notre <span className="gradient-text">identité</span>
            </h2>
          </div>
          
          <div className="values-grid">
            <div className="value-item" data-aos="fade-up" data-aos-delay="200">
              <div className="value-icon">
                <i className="fas fa-lightbulb"></i>
              </div>
              <h3>Innovation</h3>
              <p>Nous repoussons constamment les limites pour créer des solutions révolutionnaires.</p>
            </div>
            
            <div className="value-item" data-aos="fade-up" data-aos-delay="300">
              <div className="value-icon">
                <i className="fas fa-handshake"></i>
              </div>
              <h3>Intégrité</h3>
              <p>Nous agissons avec honnêteté, transparence et respect dans toutes nos relations.</p>
            </div>
            
            <div className="value-item" data-aos="fade-up" data-aos-delay="400">
              <div className="value-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Collaboration</h3>
              <p>Nous croyons en la force du travail d'équipe et des partenariats durables.</p>
            </div>
            
            <div className="value-item" data-aos="fade-up" data-aos-delay="500">
              <div className="value-icon">
                <i className="fas fa-leaf"></i>
              </div>
              <h3>Durabilité</h3>
              <p>Nous créons des solutions qui respectent l'environnement et les générations futures.</p>
            </div>
            
            <div className="value-item" data-aos="fade-up" data-aos-delay="600">
              <div className="value-icon">
                <i className="fas fa-heart"></i>
              </div>
              <h3>Passion</h3>
              <p>Nous sommes passionnés par la technologie et son potentiel à transformer l'Afrique.</p>
            </div>
            
            <div className="value-item" data-aos="fade-up" data-aos-delay="700">
              <div className="value-icon">
                <i className="fas fa-star"></i>
              </div>
              <h3>Excellence</h3>
              <p>Nous visons l'excellence dans tout ce que nous faisons, sans compromis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Impact */}
      <section className="impact-section">
        <div className="container">
          <div className="text-center">
            <span className="subtitle" data-aos="fade-up">Notre Impact</span>
            <h2 className="section-title" data-aos="fade-up" data-aos-delay="100">
              Transformer l'<span className="gradient-text">Afrique</span> par la technologie
            </h2>
          </div>
          
          <div className="impact-content">
            <div className="impact-text" data-aos="fade-right" data-aos-delay="200">
              <h3>Un impact mesurable et durable</h3>
              <p>
                Depuis notre création, nous avons contribué à transformer les infrastructures 
                de plus de 50 entreprises et institutions en Afrique de l'Ouest.
              </p>
              <div className="impact-stats">
                <div className="stat-item">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Projets réalisés</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">30%</span>
                  <span className="stat-label">Réduction des coûts</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">100+</span>
                  <span className="stat-label">Emplois créés</span>
                </div>
              </div>
            </div>
            
            <div className="impact-visual" data-aos="fade-left" data-aos-delay="300">
              <div className="impact-chart">
                <div className="chart-item">
                  <div className="chart-bar" style={{height: '80%'}}></div>
                  <span>Énergie</span>
                </div>
                <div className="chart-item">
                  <div className="chart-bar" style={{height: '65%'}}></div>
                  <span>Efficacité</span>
                </div>
                <div className="chart-item">
                  <div className="chart-bar" style={{height: '90%'}}></div>
                  <span>Innovation</span>
                </div>
                <div className="chart-item">
                  <div className="chart-bar" style={{height: '75%'}}></div>
                  <span>Durabilité</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-content" data-aos="zoom-in">
            <h2>Prêt à rejoindre l'aventure Inesic ?</h2>
            <p>Découvrez comment nous pouvons transformer votre infrastructure ensemble</p>
            <div className="cta-buttons">
              <button className="cta-btn primary">Discuter de votre projet</button>
              <button className="cta-btn secondary">Rejoindre notre équipe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
