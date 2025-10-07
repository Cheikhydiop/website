// hooks/useAnalyticsTracking.ts
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const useAnalyticsTracking = () => {
  const location = useLocation();
  const hasTracked = useRef(false);

  // Générer un ID visiteur unique
  const getVisitorId = () => {
    if (typeof window === 'undefined') return 'server';
    
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('visitor_id', visitorId);
    }
    return visitorId;
  };

  // Track page view
  const trackPageView = async (pagePath: string) => {
    if (hasTracked.current) return;
    
    try {
      const visitorId = getVisitorId();
      
      // Enregistrer la visite de page
      const { error: pageVisitError } = await supabase
        .from('page_visits')
        .insert({
          page_path: pagePath,
          visitor_id: visitorId,
          user_agent: navigator?.userAgent,
          referrer: document?.referrer || 'direct'
        });

      if (pageVisitError) {
        console.error('Error tracking page view:', pageVisitError);
        return;
      }

      // Mettre à jour le visiteur unique
      const { error: uniqueVisitorError } = await supabase
        .rpc('upsert_unique_visitor', {
          p_visitor_id: visitorId
        });

      if (uniqueVisitorError) {
        console.error('Error updating unique visitor:', uniqueVisitorError);
      }

      hasTracked.current = true;
      
    } catch (error) {
      console.error('Error in trackPageView:', error);
    }
  };

  // Track des événements personnalisés
  const trackEvent = async (eventName: string, properties?: any) => {
    try {
      const visitorId = getVisitorId();
      
      const { error } = await supabase
        .from('custom_events')
        .insert({
          event_name: eventName,
          visitor_id: visitorId,
          properties: properties,
          page_path: window.location.pathname
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  useEffect(() => {
    // Track la page initiale
    trackPageView(location.pathname);

    // Réinitialiser le flag de tracking pour la prochaine page
    hasTracked.current = false;
  }, [location.pathname]);

  return { trackEvent };
};