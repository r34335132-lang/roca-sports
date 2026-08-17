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
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { fetchOwnedLeagues, fetchPlayersByAuthUser } from "@/lib/services/leagues";
import { dashboardPath, fetchProfileRole, resolveRole } from "@/lib/roles";
import type { League, Player, UserRole } from "@/lib/types";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  rolesReady: boolean;
  role: UserRole;
  ownedLeagues: League[];
  playerProfiles: Player[];
  configured: boolean;
  signIn: (email: string, password: string) => Promise<UserRole>;
  signUp: (email: string, password: string, fullName: string) => Promise<UserRole>;
  signOut: () => Promise<void>;
  refreshRoles: () => Promise<UserRole>;
  destPath: string;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [rolesReady, setRolesReady] = useState(false);
  const [ownedLeagues, setOwnedLeagues] = useState<League[]>([]);
  const [playerProfiles, setPlayerProfiles] = useState<Player[]>([]);
  const [profileRole, setProfileRole] = useState<UserRole | null>(null);

  const refreshRoles = useCallback(async (): Promise<UserRole> => {
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user || !isSupabaseConfigured) {
      setOwnedLeagues([]);
      setPlayerProfiles([]);
      setProfileRole(null);
      setRolesReady(true);
      return "guest";
    }
    try {
      const [owned, players, fromDb] = await Promise.all([
        fetchOwnedLeagues(user.id),
        fetchPlayersByAuthUser(user.id),
        fetchProfileRole(user),
      ]);
      setOwnedLeagues(owned);
      setPlayerProfiles(players);
      setProfileRole(fromDb);
      const next = resolveRole({
        user,
        profileRole: fromDb,
        ownedLeagueCount: owned.length,
        playerCount: players.length,
      });
      setRolesReady(true);
      return next;
    } catch {
      setOwnedLeagues([]);
      setPlayerProfiles([]);
      setProfileRole(null);
      setRolesReady(true);
      return resolveRole({
        user,
        profileRole: null,
        ownedLeagueCount: 0,
        playerCount: 0,
      });
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      setRolesReady(true);
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
      setProfileRole(null);
      setRolesReady(!loading);
    }
  }, [session?.user?.id, refreshRoles, loading]);

  const role: UserRole = useMemo(
    () =>
      resolveRole({
        user: session?.user ?? null,
        profileRole,
        ownedLeagueCount: ownedLeagues.length,
        playerCount: playerProfiles.length,
      }),
    [session, profileRole, ownedLeagues.length, playerProfiles.length],
  );

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.session) setSession(data.session);
    return refreshRoles();
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) throw error;
    if (data.session) setSession(data.session);
    return refreshRoles();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setRolesReady(true);
  };

  const value: AuthContextValue = {
    session,
    user: session?.user ?? null,
    loading,
    rolesReady,
    role,
    ownedLeagues,
    playerProfiles,
    configured: isSupabaseConfigured,
    signIn,
    signUp,
    signOut,
    refreshRoles,
    destPath: dashboardPath(role),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
