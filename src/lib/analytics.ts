// lib/analytics.ts
import { supabase } from './supabase';

interface EventData {
  event_name: string;
  event_category?: string;
  lead_id?: string;
  user_id?: string;
  metadata?: Record<string, any>;
}

class AnalyticsService {
  private sessionId: string;

  constructor() {
    // Générer un ID de session unique
    this.sessionId = this.getOrCreateSessionId();
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Tracker un événement générique
   */
  async trackEvent(data: EventData): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('events').insert({
        event_name: data.event_name,
        event_category: data.event_category || 'general',
        lead_id: data.lead_id,
        user_id: user?.id || data.user_id,
        metadata: {
          ...data.metadata,
          session_id: this.sessionId,
          user_agent: navigator.userAgent,
          screen_size: `${window.screen.width}x${window.screen.height}`,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  /**
   * Tracker une vue de page
   */
  async trackPageView(pagePath: string, referrer?: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('page_views').insert({
        page_path: pagePath,
        user_id: user?.id,
        session_id: this.sessionId,
        referrer: referrer || document.referrer
      });
    } catch (error) {
      console.error('Page view tracking error:', error);
    }
  }

  /**
   * Tracker les actions sur les leads
   */
  async trackLeadAction(action: string, leadId: string, metadata?: Record<string, any>): Promise<void> {
    await this.trackEvent({
      event_name: action,
      event_category: 'lead_action',
      lead_id: leadId,
      metadata
    });
  }

  /**
   * Tracker la conversion d'un lead
   */
  async trackConversion(leadId: string, fromStatus: string, toStatus: string): Promise<void> {
    await this.trackEvent({
      event_name: 'lead_status_change',
      event_category: 'conversion',
      lead_id: leadId,
      metadata: {
        from_status: fromStatus,
        to_status: toStatus
      }
    });
  }

  /**
   * Tracker le téléchargement d'un PDF
   */
  async trackPDFDownload(leadId: string, pdfType: string): Promise<void> {
    await this.trackEvent({
      event_name: 'pdf_download',
      event_category: 'engagement',
      lead_id: leadId,
      metadata: {
        pdf_type: pdfType
      }
    });
  }

  /**
   * Tracker l'utilisation d'une fonctionnalité
   */
  async trackFeatureUsage(featureName: string, metadata?: Record<string, any>): Promise<void> {
    await this.trackEvent({
      event_name: 'feature_used',
      event_category: 'product',
      metadata: {
        feature_name: featureName,
        ...metadata
      }
    });
  }
}

// Export singleton
export const analytics = new AnalyticsService();

// Hooks React pour faciliter l'utilisation
export const useAnalytics = () => {
  return {
    trackEvent: analytics.trackEvent.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackLeadAction: analytics.trackLeadAction.bind(analytics),
    trackConversion: analytics.trackConversion.bind(analytics),
    trackPDFDownload: analytics.trackPDFDownload.bind(analytics),
    trackFeatureUsage: analytics.trackFeatureUsage.bind(analytics)
  };
};