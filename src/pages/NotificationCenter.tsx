// components/NotificationCenter.tsx
import React, { useState, useEffect } from 'react';
import { supabase, type Lead, type LeadInteraction } from '../lib/supabase';
import './NotificationCenter.css';

interface Notification {
  id: string;
  admin_user_id: string;
  lead_id: string | null;
  type: 'new_lead' | 'status_change' | 'interaction' | 'high_value' | 'urgent' | 'reminder';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  is_read: boolean;
  metadata: Record<string, any>;
  created_at: string;
  read_at: string | null;
}

type LeadWithInteractions = Lead & {
  interactions: LeadInteraction[];
};

interface NotificationCenterProps {
  onLeadClick: (lead: LeadWithInteractions) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ onLeadClick }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    try {
      // Récupérer l'utilisateur actuel
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setCurrentUserId(user.id);
      await loadNotifications(user.id);

      // S'abonner aux changements en temps réel
      const channel = supabase
        .channel('notifications_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `admin_user_id=eq.${user.id}`
          },
          (payload) => {
            handleRealtimeNotification(payload);
          }
        )
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    } catch (error) {
      console.error('Error initializing notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('admin_user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleRealtimeNotification = (payload: any) => {
    if (payload.eventType === 'INSERT') {
      const newNotification = payload.new as Notification;
      setNotifications(prev => [newNotification, ...prev]);
      
      // Jouer un son
      playNotificationSound();
      
      // Afficher une notification système si l'utilisateur a donné la permission
      if (Notification.permission === 'granted' && !document.hasFocus()) {
        new Notification(newNotification.title, {
          body: newNotification.message,
          icon: '/favicon.ico',
          tag: newNotification.id
        });
      }
    } else if (payload.eventType === 'UPDATE') {
      setNotifications(prev =>
        prev.map(n => n.id === payload.new.id ? payload.new : n)
      );
    } else if (payload.eventType === 'DELETE') {
      setNotifications(prev =>
        prev.filter(n => n.id !== payload.old.id)
      );
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => n.id === notificationId 
          ? { ...n, is_read: true, read_at: new Date().toISOString() } 
          : n
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!currentUserId) return;

    try {
      const unreadIds = notifications
        .filter(n => !n.is_read)
        .map(n => n.id);

      if (unreadIds.length === 0) return;

      const { error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .in('id', unreadIds);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const fetchLeadDetails = async (leadId: string): Promise<LeadWithInteractions | null> => {
    try {
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (leadError || !leadData) {
        console.error('Erreur lors du chargement du lead:', leadError);
        return null;
      }

      const { data: interactions, error: interactionsError } = await supabase
        .from('lead_interactions')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (interactionsError) {
        console.error('Erreur lors du chargement des interactions:', interactionsError);
      }

      return {
        ...leadData,
        interactions: interactions || [],
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des détails du lead:', error);
      return null;
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
    
    if (notification.lead_id) {
      // Récupérer le lead complet avec ses interactions
      const lead = await fetchLeadDetails(notification.lead_id);
      if (lead) {
        onLeadClick(lead);
        setIsOpen(false);
      }
    }
  };

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      // Ignorer les erreurs audio
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.is_read)
    : notifications;

  return (
    <div className="notification-center">
      <button 
        className="notification-bell"
        onClick={() => {
          setIsOpen(!isOpen);
          requestNotificationPermission();
        }}
      >
        <i className="fas fa-bell"></i>
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="notification-overlay"
            onClick={() => setIsOpen(false)}
          />
          <div className="notification-panel">
            <div className="notification-header">
              <h3>Notifications</h3>
              <button 
                className="notification-close"
                onClick={() => setIsOpen(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="notification-filters">
              <button
                className={filter === 'all' ? 'active' : ''}
                onClick={() => setFilter('all')}
              >
                Toutes
              </button>
              <button
                className={filter === 'unread' ? 'active' : ''}
                onClick={() => setFilter('unread')}
              >
                Non lues ({unreadCount})
              </button>
              {unreadCount > 0 && (
                <button
                  className="mark-all-read"
                  onClick={markAllAsRead}
                >
                  Tout marquer lu
                </button>
              )}
            </div>

            <div className="notification-list">
              {loading ? (
                <div className="notification-loading">
                  <div className="loader"></div>
                  <p>Chargement...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="notification-empty">
                  <i className="fas fa-bell"></i>
                  <p>
                    {filter === 'unread' 
                      ? 'Aucune notification non lue' 
                      : 'Aucune notification'}
                  </p>
                </div>
              ) : (
                filteredNotifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`notification-item ${!notification.is_read ? 'unread' : ''} ${notification.type}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="notification-icon">
                      <i className={`fas ${
                        notification.type === 'new_lead' ? 'fa-user-plus' :
                        notification.type === 'high_value' ? 'fa-star' :
                        notification.type === 'status_change' ? 'fa-exchange-alt' :
                        notification.type === 'interaction' ? 'fa-comments' :
                        notification.type === 'urgent' ? 'fa-exclamation-circle' :
                        'fa-bell'
                      }`}></i>
                    </div>
                    
                    <div className="notification-content">
                      <div className="notification-title">
                        {notification.title}
                        {!notification.is_read && <span className="unread-dot"></span>}
                      </div>
                      <div className="notification-message">
                        {notification.message}
                      </div>
                      <div className="notification-time">
                        {formatTimestamp(notification.created_at)}
                      </div>
                    </div>

                    <button
                      className="notification-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      title="Supprimer"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter;