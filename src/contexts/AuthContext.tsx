import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  isAdmin: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log('🔄 AuthProvider: Initialisation...');
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('📦 Session récupérée:', session ? '✅ Session active' : '❌ Pas de session');
      if (session?.user) {
        console.log('👤 User ID:', session.user.id);
        console.log('📧 User Email:', session.user.email);
      }
      
      setUser(session?.user ?? null);
      checkAdminStatus(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔔 Auth State Changed:', event);
      console.log('📦 Nouvelle session:', session ? '✅ Active' : '❌ Inactive');
      
      (async () => {
        setUser(session?.user ?? null);
        await checkAdminStatus(session?.user ?? null);
        setLoading(false);
      })();
    });

    return () => {
      console.log('🧹 AuthProvider: Nettoyage de la subscription');
      subscription.unsubscribe();
    };
  }, []);

  const checkAdminStatus = async (currentUser: User | null) => {
    console.log('🔍 Vérification du statut admin...');
    
    if (!currentUser) {
      console.log('❌ Pas d\'utilisateur connecté');
      setIsAdmin(false);
      return;
    }

    console.log('🔎 Recherche dans admin_users pour:', currentUser.id);
    
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, email, role')
      .eq('id', currentUser.id)
      .maybeSingle();

    if (error) {
      console.error('❌ Erreur lors de la vérification admin:', error);
      setIsAdmin(false);
      return;
    }

    if (data) {
      console.log('✅ Utilisateur admin trouvé:', data);
      setIsAdmin(true);
    } else {
      console.log('⚠️ Utilisateur non trouvé dans admin_users');
      setIsAdmin(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔐 Tentative de connexion pour:', email);
    
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Erreur de connexion:', error.message);
      throw error;
    }

    console.log('✅ Connexion réussie!');
    console.log('👤 User ID:', data.user?.id);
    console.log('📧 Email:', data.user?.email);

    // Mise à jour du last_login
    console.log('⏰ Mise à jour de last_login...');
    const { error: updateError } = await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('email', email);

    if (updateError) {
      console.error('⚠️ Erreur mise à jour last_login:', updateError);
    } else {
      console.log('✅ last_login mis à jour');
    }
  };

  const signOut = async () => {
    console.log('🚪 Déconnexion...');
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('❌ Erreur de déconnexion:', error);
      throw error;
    }
    
    console.log('✅ Déconnexion réussie');
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    isAdmin,
  };

  // Log de l'état actuel
  console.log('📊 État actuel:', {
    userConnected: !!user,
    userId: user?.id,
    email: user?.email,
    isAdmin,
    loading
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};