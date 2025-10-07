import React from 'react';
import Header from '../components/Header';
import './Sakkanal.css';

const Sakkanal: React.FC = () => {
  return (
    <div className="sakkanal-page">
      <Header />
      
      {/* Hero Section Sakkanal */}
      <section className="sakkanal-hero">
        <div className="container">
          <div className="hero-content" data-aos="fade-up">
            <span className="subtitle">Plateforme d'Efficacité Énergétique</span>
            <h1 className="hero-title">
              <span className="gradient-text">Sakkanal</span> - 
              L'énergie intelligente pour l\'Afrique
            </h1>
            <p className="hero-text">
              Découvrez notre plateforme révolutionnaire qui transforme la gestion de l'énergie 
              en Afrique. Sakkanal combine IoT, IA et analytics pour optimiser votre consommation 
              énergétique et réduire vos coûts de 30% en moyenne.
            </p>
            <div className="hero-cta">
              <button className="hero-btn pulse-effect" onClick={() => window.location.href = '/sakkanal/qualification'}>Trouver ma solution</button>
              <button className="hero-btn outline glow-effect" onClick={() => window.location.href = '/contact'}>Demander une démo</button>
            </div>
          </div>
          
          <div className="hero-visual" data-aos="zoom-in" data-aos-delay="300">
            <div className="platform-preview">
              <div className="dashboard-mockup">
                <div className="mockup-header">
                  <div className="mockup-dots">
                    <span></span><span></span><span></span>
                  </div>
                  <div className="mockup-title">Sakkanal Dashboard</div>
                </div>
                <div className="mockup-content">
                  <div className="energy-chart">
                    <div className="chart-bar" style={{height: '60%'}}></div>
                    <div className="chart-bar" style={{height: '80%'}}></div>
                    <div className="chart-bar" style={{height: '40%'}}></div>
                    <div className="chart-bar" style={{height: '90%'}}></div>
                    <div className="chart-bar" style={{height: '70%'}}></div>
                  </div>
                  <div className="energy-stats">
                    <div className="stat">
                      <span className="stat-value">-32%</span>
                      <span className="stat-label">Économies</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">24/7</span>
                      <span className="stat-label">Monitoring</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités principales */}
      <section className="features-section">
        <div className="container">
          <div className="text-center">
            <span className="subtitle" data-aos="fade-up">Fonctionnalités Clés</span>
            <h2 className="section-title" data-aos="fade-up" data-aos-delay="100">
              Pourquoi choisir <span className="gradient-text">Sakkanal</span> ?
            </h2>
          </div>
          
          <div className="features-grid">
            <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
              <div className="feature-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Monitoring en Temps Réel</h3>
              <p>Surveillez votre consommation énergétique 24h/24 et 7j/7 avec des alertes intelligentes et des rapports détaillés.</p>
            </div>
            
            <div className="feature-card" data-aos="fade-up" data-aos-delay="300">
              <div className="feature-icon">
                <i className="fas fa-robot"></i>
              </div>
              <h3>IA Prédictive</h3>
              <p>Notre intelligence artificielle analyse vos données pour prédire les pics de consommation et optimiser automatiquement.</p>
            </div>
            
            <div className="feature-card" data-aos="fade-up" data-aos-delay="400">
              <div className="feature-icon">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3>Application Mobile</h3>
              <p>Gérez votre énergie depuis n'importe où avec notre application mobile intuitive et responsive.</p>
            </div>
            
            <div className="feature-card" data-aos="fade-up" data-aos-delay="500">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Sécurité Maximale</h3>
              <p>Vos données sont protégées par un chiffrement de niveau militaire et des serveurs sécurisés en Afrique.</p>
            </div>
            
            <div className="feature-card" data-aos="fade-up" data-aos-delay="600">
              <div className="feature-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Support Local</h3>
              <p>Une équipe d'experts africains disponible 24h/24 pour vous accompagner dans votre transition énergétique.</p>
            </div>
            
            <div className="feature-card" data-aos="fade-up" data-aos-delay="700">
              <div className="feature-icon">
                <i className="fas fa-leaf"></i>
              </div>
              <h3>Impact Environnemental</h3>
              <p>Réduisez votre empreinte carbone tout en économisant de l'argent. Un vrai gagnant-gagnant !</p>
            </div>
          </div>
        </div>
      </section>

      {/* Démonstration interactive */}
      <section className="demo-section">
        <div className="container">
          <div className="demo-content">
            <div className="demo-text" data-aos="fade-right">
              <span className="subtitle">Démonstration Interactive</span>
              <h2>Voyez Sakkanal en action</h2>
              <p>
                Découvrez comment Sakkanal peut transformer votre gestion énergétique. 
                Notre plateforme s'adapte à tous les secteurs : industrie, commerce, 
                institutions publiques et résidentiel.
              </p>
              <ul className="demo-features">
                <li><i className="fas fa-check"></i> Interface intuitive et moderne</li>
                <li><i className="fas fa-check"></i> Rapports personnalisables</li>
                <li><i className="fas fa-check"></i> Intégration facile avec vos systèmes existants</li>
                <li><i className="fas fa-check"></i> Formation et accompagnement inclus</li>
              </ul>
              <button className="demo-btn">Lancer la démo interactive</button>
            </div>
            
            <div className="demo-visual" data-aos="fade-left">
              <div className="interactive-demo">
                <div className="demo-screen">
                  <div className="screen-content">
                    <div className="energy-flow">
                      <div className="flow-item">
                        <i className="fas fa-solar-panel"></i>
                        <span>Production</span>
                      </div>
                      <div className="flow-arrow">→</div>
                      <div className="flow-item">
                        <i className="fas fa-battery-half"></i>
                        <span>Stockage</span>
                      </div>
                      <div className="flow-arrow">→</div>
                      <div className="flow-item">
                        <i className="fas fa-home"></i>
                        <span>Consommation</span>
                      </div>
                    </div>
                    <div className="real-time-data">
                      <div className="data-item">
                        <span className="data-value">2.4 kW</span>
                        <span className="data-label">Production actuelle</span>
                      </div>
                      <div className="data-item">
                        <span className="data-value">85%</span>
                        <span className="data-label">Batterie</span>
                      </div>
                      <div className="data-item">
                        <span className="data-value">1.8 kW</span>
                        <span className="data-label">Consommation</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages clients */}
      <section className="testimonials-section">
        <div className="container">
          <div className="text-center">
            <span className="subtitle" data-aos="fade-up">Témoignages Clients</span>
            <h2 className="section-title" data-aos="fade-up" data-aos-delay="100">
              Ils ont choisi <span className="gradient-text">Sakkanal</span>
            </h2>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card" data-aos="fade-up" data-aos-delay="200">
              <div className="testimonial-content">
                <p>"Sakkanal nous a permis de réduire notre facture énergétique de 35% en seulement 6 mois. L'équipe est très professionnelle et le support est excellent."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="author-info">
                  <h4>Mamadou Diallo</h4>
                  <span>Directeur Technique, Usine Textile Dakar</span>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card" data-aos="fade-up" data-aos-delay="300">
              <div className="testimonial-content">
                <p>"La plateforme est intuitive et les alertes nous ont permis d'éviter plusieurs pannes coûteuses. Un investissement qui se rentabilise rapidement."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="author-info">
                  <h4>Fatou Sall</h4>
                  <span>Responsable Maintenance, Centre Commercial</span>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card" data-aos="fade-up" data-aos-delay="400">
              <div className="testimonial-content">
                <p>"En tant qu'institution publique, nous cherchions une solution locale et fiable. Sakkanal a dépassé nos attentes avec un ROI de 300% la première année."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="author-info">
                  <h4>Ousmane Ba</h4>
                  <span>Directeur Administratif, Hôpital Régional</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content" data-aos="zoom-in">
            <h2>Prêt à transformer votre gestion énergétique ?</h2>
            <p>Rejoignez les centaines d'entreprises qui font confiance à Sakkanal</p>
            <div className="cta-buttons">
              <button className="cta-btn primary" onClick={() => window.location.href = '/sakkanal/qualification'}>Commencer maintenant</button>
              <button className="cta-btn secondary" onClick={() => window.location.href = '/contact'}>Parler à un expert</button>
            </div>
            <div className="cta-features">
              <span><i className="fas fa-check"></i> Essai gratuit 30 jours</span>
              <span><i className="fas fa-check"></i> Installation en 24h</span>
              <span><i className="fas fa-check"></i> Support 24/7 inclus</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sakkanal;
