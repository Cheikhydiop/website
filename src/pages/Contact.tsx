import React, { useState } from 'react';
import Header from '../components/Header';
import './Contact.css';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici vous pouvez ajouter la logique d'envoi du formulaire
    console.log('Form submitted:', formData);
    alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');
  };

  return (
    <div className="contact-page">
      <Header />
      
      {/* Hero Section Contact */}
      <section className="contact-hero">
        <div className="container">
          <div className="hero-content" data-aos="fade-up">
            <span className="subtitle">Contactez-nous</span>
            <h1 className="hero-title">
              Parlons de votre <span className="gradient-text">projet</span>
            </h1>
            <p className="hero-text">
              Prêt à transformer votre infrastructure avec nos solutions technologiques innovantes ? 
              Notre équipe d'experts est là pour vous accompagner.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            {/* Informations de contact */}
            <div className="contact-info" data-aos="fade-right">
              <h2>Nos Coordonnées</h2>
              <p>N'hésitez pas à nous contacter pour discuter de votre projet ou pour toute question.</p>
              
              <div className="contact-methods">
                <div className="contact-method">
                  <div className="method-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="method-content">
                    <h4>Adresse</h4>
                    <p>Dakar, Sénégal<br />Zone Industrielle de Thies</p>
                  </div>
                </div>
                
                <div className="contact-method">
                  <div className="method-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="method-content">
                    <h4>Téléphone</h4>
                    <p>+221 33 XXX XX XX<br />+221 77 XXX XX XX</p>
                  </div>
                </div>
                
                <div className="contact-method">
                  <div className="method-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="method-content">
                    <h4>Email</h4>
                    <p>contact@inesic.sn<br />info@inesic.sn</p>
                  </div>
                </div>
                
                <div className="contact-method">
                  <div className="method-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="method-content">
                    <h4>Horaires</h4>
                    <p>Lun - Ven: 8h00 - 18h00<br />Sam: 9h00 - 13h00</p>
                  </div>
                </div>
              </div>
              
              <div className="social-links">
                <h4>Suivez-nous</h4>
                <div className="social-icons">
                  <a href="#" className="social-icon">
                    <i className="fab fa-linkedin"></i>
                  </a>
                  <a href="#" className="social-icon">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="social-icon">
                    <i className="fab fa-facebook"></i>
                  </a>
                  <a href="#" className="social-icon">
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Formulaire de contact */}
            <div className="contact-form-container" data-aos="fade-left">
              <div className="contact-form">
                <h2>Envoyez-nous un message</h2>
                <p>Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.</p>
                
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Nom complet *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Votre nom complet"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="company">Entreprise</label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Nom de votre entreprise"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="phone">Téléphone</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Votre numéro de téléphone"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="subject">Sujet *</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="devis">Demande de devis</option>
                      <option value="demo">Démonstration Sakkanal</option>
                      <option value="partnership">Partenariat</option>
                      <option value="support">Support technique</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Décrivez votre projet ou votre demande..."
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="submit-btn">
                    <i className="fas fa-paper-plane"></i>
                    Envoyer le message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <div className="text-center">
            <span className="subtitle" data-aos="fade-up">Questions Fréquentes</span>
            <h2 className="section-title" data-aos="fade-up" data-aos-delay="100">
              Tout savoir sur <span className="gradient-text">Inesic</span>
            </h2>
          </div>
          
          <div className="faq-grid">
            <div className="faq-item" data-aos="fade-up" data-aos-delay="200">
              <h3>Quels sont vos délais de livraison ?</h3>
              <p>Nos délais varient selon la complexité du projet. Un projet simple peut être livré en 2-4 semaines, tandis qu'un projet complexe peut prendre 2-3 mois.</p>
            </div>
            
            <div className="faq-item" data-aos="fade-up" data-aos-delay="300">
              <h3>Proposez-vous un support après livraison ?</h3>
              <p>Oui, nous offrons un support technique complet après la livraison, incluant la formation de vos équipes et un accompagnement continu.</p>
            </div>
            
            <div className="faq-item" data-aos="fade-up" data-aos-delay="400">
              <h3>Vos solutions sont-elles adaptées au contexte africain ?</h3>
              <p>Absolument ! Toutes nos solutions sont conçues spécifiquement pour répondre aux défis et contraintes des environnements africains.</p>
            </div>
            
            <div className="faq-item" data-aos="fade-up" data-aos-delay="500">
              <h3>Proposez-vous des formations ?</h3>
              <p>Oui, nous formons vos équipes à l'utilisation de nos solutions et assurons le transfert de compétences pour une autonomie complète.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="container">
          <div className="map-container" data-aos="zoom-in">
            <div className="map-placeholder">
              <i className="fas fa-map-marked-alt"></i>
              <h3>Carte Interactive</h3>
              <p>Localisez nos bureaux et centres de service</p>
              <button className="map-btn">Ouvrir la carte</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
