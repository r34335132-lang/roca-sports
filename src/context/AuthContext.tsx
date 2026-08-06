import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getAdminEmails, isSupabaseConfigured, supabase } from "@/lib/supabase";
import { fetchOwnedLeagues, fetchPlayersByAuthUser } from "@/lib/services/leagues";
import type { League, Player, UserRole } from "@/lib/types";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  role: UserRole;
  ownedLeagues: League[];
  playerProfiles: Player[];
  configured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshRoles: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [ownedLeagues, setOwnedLeagues] = useState<League[]>([]);
  const [playerProfiles, setPlayerProfiles] = useState<Player[]>([]);

  const refreshRoles = useCallback(async () => {
    const uid = (await supabase.auth.getUser()).data.user?.id;
    if (!uid || !isSupabaseConfigured) {
      setOwnedLeagues([]);
      setPlayerProfiles([]);
      return;
    }
    try {
      const [owned, players] = await Promise.all([
        fetchOwnedLeagues(uid),
        fetchPlayersByAuthUser(uid),
      ]);
      setOwnedLeagues(owned);
      setPlayerProfiles(players);
    } catch {
      setOwnedLeagues([]);
      setPlayerProfiles([]);
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user) void refreshRoles();
    else {
      setOwnedLeagues([]);
      setPlayerProfiles([]);
    }
  }, [session?.user?.id, refreshRoles]);

  const role: UserRole = useMemo(() => {
    if (!session?.user) return "guest";
    const email = session.user.email?.toLowerCase() ?? "";
    if (getAdminEmails().includes(email)) return "admin";
    if (ownedLeagues.length > 0) return "owner";
    if (playerProfiles.length > 0) return "player";
    return "owner"; // default: puede crear liga
  }, [session, ownedLeagues.length, playerProfiles.length]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value: AuthContextValue = {
    session,
    user: session?.user ?? null,
    loading,
    role,
    ownedLeagues,
    playerProfiles,
    configured: isSupabaseConfigured,
    signIn,
    signUp,
    signOut,
    refreshRoles,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
