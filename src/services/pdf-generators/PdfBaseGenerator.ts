// src/services/pdf-generators/PdfBaseGenerator.ts - Classe de base pour les générateurs PDF

import PDFDocument from 'pdfkit';
import { PDF_COLORS, PDF_DIMENSIONS, FONTS, FONT_SIZES } from './PdfConstants';
import { PdfColors, PdfDimensions } from './PdfTypes';
import type { PdfColors, PdfDimensions } from './PdfTypes'; // Utiliser type pour les imports

export abstract class PdfBaseGenerator {
  protected colors: PdfColors = PDF_COLORS;
  protected dimensions: PdfDimensions = PDF_DIMENSIONS;

  /**
   * Applique une couleur de remplissage
   */
  protected setFillColor(doc: PDFKit.PDFDocument, color: [number, number, number]): PDFKit.PDFDocument {
    return doc.fillColor(color);
  }

  /**
   * Applique une couleur de contour
   */
  protected setStrokeColor(doc: PDFKit.PDFDocument, color: [number, number, number]): PDFKit.PDFDocument {
    return doc.strokeColor(color);
  }

  /**
   * Applique un style de texte standard
   */
  protected setTextStyle(
    doc: PDFKit.PDFDocument,
    size: number = FONT_SIZES.body,
    color: [number, number, number] = this.colors.darkGray,
    font: string = FONTS.regular
  ): PDFKit.PDFDocument {
    return doc.fontSize(size).fillColor(color).font(font);
  }

  /**
   * Dessine un rectangle avec style
   */
  protected drawRect(
    doc: PDFKit.PDFDocument,
    x: number,
    y: number,
    width: number,
    height: number,
    fillColor?: [number, number, number],
    strokeColor?: [number, number, number],
    lineWidth: number = 1
  ): void {
    if (fillColor) {
      doc.rect(x, y, width, height).fill(fillColor);
    }
    if (strokeColor) {
      doc.strokeColor(strokeColor).lineWidth(lineWidth).rect(x, y, width, height).stroke();
    }
    if (!fillColor && !strokeColor) {
      doc.rect(x, y, width, height);
    }
  }

  /**
   * Dessine une ligne
   */
  protected drawLine(
    doc: PDFKit.PDFDocument,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: [number, number, number] = this.colors.mediumGray,
    width: number = 1
  ): void {
    doc.strokeColor(color).lineWidth(width).moveTo(x1, y1).lineTo(x2, y2).stroke();
  }

  /**
   * Ajoute du texte avec gestion du débordement
   */
  protected addText(
    doc: PDFKit.PDFDocument,
    text: string,
    x: number,
    y: number,
    options?: {
      width?: number;
      align?: 'left' | 'center' | 'right';
      truncate?: boolean;
      maxLength?: number;
    }
  ): void {
    let finalText = text;
    
    if (options?.truncate && options?.maxLength && text.length > options.maxLength) {
      finalText = text.substring(0, options.maxLength - 3) + '...';
    }

    const textOptions: any = {};
    if (options?.width) textOptions.width = options.width;
    if (options?.align) textOptions.align = options.align;

    doc.text(finalText, x, y, textOptions);
  }

  /**
   * Vérifie si une nouvelle page est nécessaire
   */
  protected checkNewPage(doc: PDFKit.PDFDocument, currentY: number, requiredSpace: number): number {
    const pageBottomMargin = this.dimensions.pageHeight - this.dimensions.margin;
    
    if (currentY + requiredSpace > pageBottomMargin) {
      doc.addPage();
      return this.dimensions.margin;
    }
    
    return currentY;
  }

  /**
   * Calcule la largeur du texte
   */
  protected getTextWidth(doc: PDFKit.PDFDocument, text: string): number {
    return doc.widthOfString(text);
  }

  /**
   * Formate une date en français
   */
  protected formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR');
  }

  /**
   * Formate un nombre avec séparateurs français
   */
  protected formatNumber(num: number, decimals: number = 1): string {
    return num.toFixed(decimals).replace(/\./g, ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  /**
   * Dessine un rectangle avec des coins arrondis
   */
  protected drawRoundedRect(
    doc: PDFKit.PDFDocument,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fillColor: [number, number, number]
  ): void {
    doc.save();
    
    // Définir la couleur de remplissage (valeurs RGB 0-255)
    doc.fillColor([fillColor[0], fillColor[1], fillColor[2]]);
    
    // Dessiner le rectangle arrondi
    doc.roundedRect(x, y, width, height, radius).fill();
    
    doc.restore();
  }
}