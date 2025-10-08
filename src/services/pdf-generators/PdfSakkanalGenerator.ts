// src/services/pdf-generators/PdfSakkanalGenerator.ts

import jsPDF from 'jspdf';

interface SakkanalScenario {
  id: string;
  name: string;
  description: string;
  category: string;
  estimated_savings: number;
  equipment_lifespan: number;
  min_budget?: number;
  max_budget?: number | null;
  site_types: string[];
}

interface UserData {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
}

interface QuestionnaireData {
  siteType: string;
  electricityBill: number;
  installationPower: number;
  budget: number;
  specificNeeds: string[];
}

export class PdfSakkanalGenerator {

  /**
   * Génère le PDF complet pour Sakkanal
   */
  generateSakkanalPDF(
    scenario: SakkanalScenario,
    userData: UserData,
    formData: QuestionnaireData
  ): jsPDF {
    const doc = new jsPDF();
    let currentY = 20;

    // 1. En-tête avec logo INESIC
    currentY = this.generateHeader(doc, currentY);

    // 2. Salutation personnalisée
    currentY = this.generateGreeting(doc, userData, currentY);

    // 3. Profil énergétique
    currentY = this.generateEnergyProfile(doc, formData, currentY);

    // 4. Solution recommandée
    currentY = this.generateSolutionSection(doc, scenario, currentY);

    // 5. Économies estimées
    currentY = this.generateSavingsSection(doc, scenario, formData, currentY);

    // 6. Caractéristiques techniques
    currentY = this.generateTechnicalDetails(doc, scenario, currentY);

    // 7. Coordonnées entreprise
    this.generateCompanyContact(doc, currentY);

    return doc;
  }

  private generateHeader(doc: jsPDF, startY: number): number {
    // Bande dégradée supérieure
    const gradientSteps = 10;
    for (let i = 0; i < gradientSteps; i++) {
      const ratio = i / gradientSteps;
      const r = Math.round(255 * (1 - ratio) + 0 * ratio);
      const g = Math.round(102 * (1 - ratio) + 150 * ratio);
      const b = Math.round(0 * (1 - ratio) + 136 * ratio);
      doc.setFillColor(r, g, b);
      doc.rect(0, i * 0.8, 210, 0.8, 'F');
    }

    try {
      // Logo INESIC
      doc.addImage({
        imageData: '/assets/images/logo_inesic.png',
        x: 15,
        y: startY,
        width: 45,
        height: 20,
      });
    } catch (error) {
      // Fallback professionnel
      doc.setFillColor(0, 150, 136);
      doc.roundedRect(15, startY, 45, 20, 3, 3, 'F');
      
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text('INESIC', 37.5, startY + 13, { align: 'center' });
    }

    // Titre principal
    doc.setFontSize(24);
    doc.setTextColor(0, 150, 136);
    doc.setFont('helvetica', 'bold');
    doc.text('RAPPORT ÉNERGÉTIQUE', 75, startY + 12);

    // Sous-titre
    doc.setFontSize(11);
    doc.setTextColor(255, 102, 0);
    doc.setFont('helvetica', 'normal');
    doc.text('Analyse et Recommandations Personnalisées', 75, startY + 20);

    // Ligne décorative
    doc.setDrawColor(0, 150, 136);
    doc.setLineWidth(1.5);
    doc.line(75, startY + 23, 195, startY + 23);

    // Date
    const dateStr = new Date().toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
    
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(155, startY + 28, 40, 8, 2, 2, 'F');
    doc.setFontSize(8);
    doc.setTextColor(119, 119, 119);
    doc.setFont('helvetica', 'normal');
    doc.text(dateStr, 175, startY + 33, { align: 'center' });

    return startY + 50;
  }

  private generateGreeting(doc: jsPDF, userData: UserData, startY: number): number {
    const safeUserData = {
      fullName: userData?.fullName || 'Client'
    };

    // Salutation personnalisée dans un encadré élégant
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(15, startY, 180, 20, 4, 4, 'F');
    
    // Bordure gauche accent
    doc.setFillColor(0, 150, 136);
    doc.roundedRect(15, startY, 3, 20, 0, 0, 'F');

    doc.setFontSize(12);
    doc.setTextColor(51, 51, 51);
    doc.setFont('helvetica', 'normal');
    doc.text('Bonjour', 25, startY + 8);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 150, 136);
    doc.text(safeUserData.fullName + ',', 45, startY + 8);

    doc.setFontSize(9);
    doc.setTextColor(119, 119, 119);
    doc.setFont('helvetica', 'normal');
    doc.text('Nous avons le plaisir de vous présenter votre audit énergétique personnalisé.', 25, startY + 15);

    return startY + 30;
  }

  private generateEnergyProfile(doc: jsPDF, formData: QuestionnaireData, startY: number): number {
    this.drawSectionTitle(doc, 'PROFIL ÉNERGÉTIQUE', startY);
    
    let currentY = startY + 15;

    const cards = [
      { 
        label: 'Type de site', 
        value: formData.siteType,
        color: [52, 152, 219] as [number, number, number]
      },
      { 
        label: 'Facture mensuelle', 
        value: `${formData.electricityBill.toLocaleString()} FCFA`,
        color: [231, 76, 60] as [number, number, number]
      },
      { 
        label: 'Puissance installée', 
        value: `${formData.installationPower} kW`,
        color: [243, 156, 18] as [number, number, number]
      },
      { 
        label: 'Budget disponible', 
        value: formData.budget > 0 ? `${formData.budget.toLocaleString()} FCFA` : 'À définir',
        color: [46, 204, 113] as [number, number, number]
      }
    ];

    cards.forEach((card, index) => {
      const x = 15 + (index % 2) * 92;
      const y = currentY + Math.floor(index / 2) * 30;

      // Carte avec bordure colorée
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(x, y, 88, 26, 4, 4, 'F');
      
      doc.setDrawColor(card.color[0], card.color[1], card.color[2]);
      doc.setLineWidth(1.2);
      doc.roundedRect(x, y, 88, 26, 4, 4, 'S');

      // Barre supérieure colorée
      doc.setFillColor(card.color[0], card.color[1], card.color[2]);
      doc.rect(x + 1, y + 1, 86, 3, 'F');

      // Label
      doc.setFontSize(8);
      doc.setTextColor(119, 119, 119);
      doc.setFont('helvetica', 'bold');
      doc.text(card.label.toUpperCase(), x + 6, y + 12);

      // Valeur
      doc.setFontSize(11);
      doc.setTextColor(51, 51, 51);
      doc.setFont('helvetica', 'bold');
      const valueLines = doc.splitTextToSize(card.value, 76);
      doc.text(valueLines, x + 6, y + 19);
    });

    return currentY + 70;
  }

  private generateSolutionSection(doc: jsPDF, scenario: SakkanalScenario, startY: number): number {
    if (startY > 240) {
      doc.addPage();
      startY = 20;
    }

    this.drawSectionTitle(doc, 'SOLUTION RECOMMANDÉE', startY);
    
    let currentY = startY + 12;

    // Carte principale
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(15, currentY, 180, 65, 6, 6, 'F');

    const categoryColor = this.getCategoryColor(scenario.category);
    
    // Badge catégorie
    doc.setFillColor(categoryColor[0], categoryColor[1], categoryColor[2]);
    doc.roundedRect(165, currentY + 6, 25, 8, 2, 2, 'F');
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(scenario.category.toUpperCase(), 177.5, currentY + 11, { align: 'center' });

    currentY += 12;

    // Nom de la solution
    doc.setFontSize(15);
    doc.setTextColor(0, 150, 136);
    doc.setFont('helvetica', 'bold');
    doc.text(scenario.name, 20, currentY);

    currentY += 10;

    // Description
    doc.setFontSize(10);
    doc.setTextColor(51, 51, 51);
    doc.setFont('helvetica', 'normal');
    const descriptionLines = doc.splitTextToSize(scenario.description, 165);
    doc.text(descriptionLines, 20, currentY);

    currentY += descriptionLines.length * 5 + 15;

    // Points forts
    if (currentY < 235) {
      const highlights = [
        'Solution adaptée à votre profil énergétique',
        'Installation et maintenance incluses',
        'Garantie constructeur étendue',
        'Accompagnement personnalisé'
      ];

      doc.setFontSize(8);
      doc.setTextColor(46, 204, 113);
      doc.setFont('helvetica', 'normal');
      
      highlights.forEach((highlight, index) => {
        // Puce carrée
        doc.setFillColor(46, 204, 113);
        doc.rect(20, currentY + (index * 6) - 2, 2, 2, 'F');
        doc.text(highlight, 25, currentY + (index * 6));
      });

      currentY += 30;
    }

    return currentY;
  }

  private generateSavingsSection(
    doc: jsPDF, 
    scenario: SakkanalScenario, 
    formData: QuestionnaireData, 
    startY: number
  ): number {
    if (startY > 200) {
      doc.addPage();
      startY = 20;
    }

    this.drawSectionTitle(doc, 'ÉCONOMIES ESTIMÉES', startY);
    
    let currentY = startY + 15;

    const monthlySavings = (formData.electricityBill * scenario.estimated_savings) / 100;
    const annualSavings = monthlySavings * 12;
    const totalSavings = annualSavings * scenario.equipment_lifespan;

    const metrics = [
      { 
        label: 'Taux d\'économie', 
        value: `${scenario.estimated_savings}%`, 
        color: [0, 150, 136] as [number, number, number]
      },
      { 
        label: 'Économies mensuelles', 
        value: `${Math.round(monthlySavings).toLocaleString()} FCFA`, 
        color: [255, 102, 0] as [number, number, number]
      },
      { 
        label: 'Économies annuelles', 
        value: `${Math.round(annualSavings).toLocaleString()} FCFA`, 
        color: [46, 204, 113] as [number, number, number]
      },
      { 
        label: `Total sur ${scenario.equipment_lifespan} ans`, 
        value: `${Math.round(totalSavings).toLocaleString()} FCFA`, 
        color: [52, 152, 219] as [number, number, number]
      }
    ];

    metrics.forEach((metric, index) => {
      const x = 15 + (index % 2) * 92;
      const y = currentY + Math.floor(index / 2) * 32;

      // Carte avec bordure
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(x, y, 88, 28, 5, 5, 'F');
      
      // Barre supérieure colorée
      doc.setFillColor(metric.color[0], metric.color[1], metric.color[2]);
      doc.rect(x + 1, y + 1, 86, 3, 'F');
      
      // Bordure
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.5);
      doc.roundedRect(x, y, 88, 28, 5, 5, 'S');

      // Valeur principale
      doc.setFontSize(13);
      doc.setTextColor(metric.color[0], metric.color[1], metric.color[2]);
      doc.setFont('helvetica', 'bold');
      doc.text(metric.value, x + 44, y + 14, { align: 'center' });

      // Label
      doc.setFontSize(7);
      doc.setTextColor(119, 119, 119);
      doc.setFont('helvetica', 'normal');
      const labelLines = doc.splitTextToSize(metric.label, 80);
      doc.text(labelLines, x + 44, y + 22, { align: 'center' });
    });

    return currentY + 75;
  }

  private generateTechnicalDetails(doc: jsPDF, scenario: SakkanalScenario, startY: number): number {
    if (startY > 220) {
      doc.addPage();
      startY = 20;
    }

    this.drawSectionTitle(doc, 'CARACTÉRISTIQUES TECHNIQUES', startY);
    
    let currentY = startY + 12;

    // Tableau professionnel
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(15, currentY, 180, 55, 4, 4, 'F');

    const details = [
      { 
        label: 'Durée de vie des équipements', 
        value: `${scenario.equipment_lifespan} ans` 
      },
      { 
        label: 'Catégorie de solution', 
        value: scenario.category.charAt(0).toUpperCase() + scenario.category.slice(1) 
      },
      { 
        label: 'Budget minimum recommandé', 
        value: scenario.min_budget ? `${scenario.min_budget.toLocaleString()} FCFA` : 'Non spécifié' 
      },
      { 
        label: 'Budget maximum recommandé', 
        value: scenario.max_budget ? `${scenario.max_budget.toLocaleString()} FCFA` : 'Non spécifié' 
      }
    ];

    currentY += 10;

    details.forEach((detail, index) => {
      const y = currentY + (index * 12);

      // Ligne séparatrice
      if (index > 0) {
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.3);
        doc.line(20, y - 3, 190, y - 3);
      }

      // Puce carrée
      doc.setFillColor(0, 150, 136);
      doc.rect(20, y - 2, 2, 2, 'F');
      
      doc.setFontSize(9);
      doc.setTextColor(119, 119, 119);
      doc.setFont('helvetica', 'bold');
      doc.text(detail.label, 25, y);

      doc.setTextColor(51, 51, 51);
      doc.setFont('helvetica', 'normal');
      doc.text(detail.value, 110, y);
    });

    return currentY + 60;
  }

  private generateCompanyContact(doc: jsPDF, startY: number): void {
    if (startY > 150) {
      doc.addPage();
      startY = 20;
    }

    // Encadré de contact
    doc.setFillColor(0, 150, 136);
    doc.roundedRect(15, startY, 180, 65, 6, 6, 'F');

    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('CONTACTEZ-NOUS', 105, startY + 15, { align: 'center' });

    // Ligne décorative
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.8);
    doc.line(70, startY + 18, 140, startY + 18);

    const contacts = [
      { label: 'Email', text: 'contact@inesic.com' },
      { label: 'Téléphone', text: '+221 78 962 54 39' },
      { label: 'Adresse', text: 'Dakar, Sénégal' },
      { label: 'Web', text: 'www.inesic.com' }
    ];

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    contacts.forEach((contact, index) => {
      const y = startY + 30 + (index * 9);
      doc.setFont('helvetica', 'bold');
      doc.text(contact.label + ':', 50, y);
      doc.setFont('helvetica', 'normal');
      doc.text(contact.text, 85, y);
    });

    // Pied de page
    const footerY = 280;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(15, footerY, 195, footerY);

    doc.setFontSize(7);
    doc.setTextColor(119, 119, 119);
    doc.setFont('helvetica', 'normal');
    doc.text('© 2025 INESIC - Tous droits réservés', 105, footerY + 5, { align: 'center' });
    
    doc.setFontSize(8);
    doc.text('Rapport généré le ' + new Date().toLocaleDateString('fr-FR'), 15, footerY + 10);
    doc.text(`Page ${doc.getNumberOfPages()}`, 195, footerY + 10, { align: 'right' });
  }

  private drawSectionTitle(doc: jsPDF, title: string, y: number): void {
    doc.setFontSize(13);
    doc.setTextColor(0, 150, 136);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 15, y);

    // Ligne décorative
    doc.setDrawColor(255, 102, 0);
    doc.setLineWidth(1.8);
    doc.line(15, y + 2, 32, y + 2);
    
    doc.setDrawColor(0, 150, 136);
    doc.setLineWidth(0.4);
    doc.line(34, y + 2, 195, y + 2);
  }

  private getCategoryColor(category: string): [number, number, number] {
    switch (category.toLowerCase()) {
      case 'premium':
        return [0, 150, 136];
      case 'standard':
        return [255, 102, 0];
      case 'economique':
      case 'économique':
        return [46, 204, 113];
      default:
        return [0, 150, 136];
    }
  }
}