// src/services/pdf-generators/PdfTypes.ts

export interface PdfColors {
    // Couleurs Inesic pour en-têtes et structures
    inesicOrange: [number, number, number];
    inesicGreen: [number, number, number];
    inesicLightOrange: [number, number, number];
    inesicLightGreen: [number, number, number];
  
    // Couleurs harmonisées pour contenu
    primary: [number, number, number];
    secondary: [number, number, number];
    lightBlue: [number, number, number];
    lightGray: [number, number, number];
    mediumGray: [number, number, number];
    darkGray: [number, number, number];
    success: [number, number, number];
    warning: [number, number, number];
    danger: [number, number, number];
    white: [number, number, number];
  }
  
  export interface PdfDimensions {
    pageWidth: number;
    pageHeight: number;
    margin: number;
    contentWidth: number;
  }
  
  export interface MetricCard {
    icon: string;
    label: string;
    value: string;
    color: [number, number, number];
    bgColor: [number, number, number];
  }
  
  export interface PdfPosition {
    x: number;
    y: number;
  }
  
  export interface PdfSize {
    width: number;
    height: number;
  }
  
  // Types pour les données de rapport (simplifiés pour Sakkanal)
  export interface ReportData {
    metadata: {
      type: string;
      generatedAt: Date;
    };
    period: {
      startDate: Date;
      endDate: Date;
    };
    organization: {
      name: string;
    };
    summary?: {
      totalMeters: number;
      activeMeters: number;
    };
    aggregatedMetrics?: {
      totalConsumption: number;
      averagePowerFactor: number;
      totalPeakPower: number;
      dataQuality?: {
        totalAlerts: number;
        averageQualityScore: number;
      };
      costs?: {
        estimatedCost: number;
      };
    };
    comparison?: {
      consumption: {
        changePercent: number;
      };
    };
    meterBreakdown?: Array<{
      meter: {
        name: string;
        status: string;
      };
      metrics: {
        consumption: {
          total: number;
        };
        demand: {
          peak: number;
          current: number;
        };
        voltage: {
          average: number;
        };
        power?: {
          powerFactor: number;
        };
      };
      dataPoints: number;
    }>;
  }
  
  // Export par défaut pour éviter les problèmes d'import
  export default {
    PdfColors,
    PdfDimensions,
    MetricCard,
    PdfPosition,
    PdfSize,
    ReportData
  };