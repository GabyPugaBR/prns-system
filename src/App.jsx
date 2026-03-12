import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabaseClient";

import Spinner              from "./components/shared/Spinner";
import SJHeader             from "./components/shared/SJHeader";
import LoginScreen          from "./components/auth/LoginScreen";
import OnboardingScreen     from "./components/auth/OnboardingScreen";
import ForgotPasswordScreen from "./components/auth/ForgotpasswordScreen";
import ResetPasswordScreen  from "./components/auth/ResetpasswordScreen";
import SupervisorView       from "./views/SupervisorView";
import ManagerView          from "./views/ManagerView";
import AdminView            from "./views/AdminView";

const INACTIVITY_LIMIT = 10 * 60 * 1000; // 10 minutes in ms

export default function App() {
  const [session, setSession]           = useState(null);
  const [profile, setProfile]           = useState(null);
  const [teams, setTeams]               = useState([]);
  const [staff, setStaff]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [isNewUser, setIsNewUser]       = useState(false);
  const [showForgot, setShowForgot]     = useState(false);
  const [isResetting, setIsResetting]   = useState(false);

  const inactivityTimer = useRef(null);

  // ── Inactivity timer ────────────────────────────────────────
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(async () => {
      await supabase.auth.signOut();
    }, INACTIVITY_LIMIT);
  }, []);

  const startInactivityTracking = useCallback(() => {
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    events.forEach(e => window.addEventListener(e, resetInactivityTimer));
    resetInactivityTimer();
    return () => {
      events.forEach(e => window.removeEventListener(e, resetInactivityTimer));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [resetInactivityTimer]);

  // ── Data loading ────────────────────────────────────────────
  const loadUserData = useCallback(async (user) => {
    setLoading(true);
    const [profileRes, teamsRes, staffRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("teams").select("*").order("name"),
      supabase.from("staff").select("*").order("name"),
    ]);

    if (!profileRes.data || !profileRes.data.name) {
      setIsNewUser(true);
    } else {
      setProfile(profileRes.data);
      setIsNewUser(false);
    }

    if (teamsRes.data) setTeams(teamsRes.data);
    if (staffRes.data) setStaff(staffRes.data);
    setLoading(false);
  }, []);

  // ── Auth state ──────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadUserData(session.user);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsResetting(true);
        setSession(session);
        setLoading(false);
        return;
      }

      // USER_UPDATED fires when password is set during onboarding — skip to avoid race condition
      if (event === "USER_UPDATED") return;

      if (event === "SIGNED_OUT") {
        setProfile(null);
        setSession(null);
        setIsNewUser(false);
        setIsResetting(false);
        setShowForgot(false);
        setLoading(false);
        if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
        return;
      }

      setSession(session);
      if (session) loadUserData(session.user);
      else { setProfile(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, [loadUserData]);

  // ── Start inactivity tracking when logged in ────────────────
  useEffect(() => {
    if (session && !isResetting) {
      return startInactivityTracking();
    }
  }, [session, isResetting, startInactivityTracking]);

  // ── Logout ──────────────────────────────────────────────────
  const handleLogout = async () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    await supabase.auth.signOut();
    setProfile(null);
    setSession(null);
    setIsNewUser(false);
  };

  // ── Render guards ────────────────────────────────────────────
  if (loading)     return <Spinner />;

  // Password reset flow (user clicked email link)
  if (isResetting) return (
    <ResetPasswordScreen onComplete={() => {
      setIsResetting(false);
      if (session) loadUserData(session.user);
    }} />
  );

  if (!session) {
    if (showForgot) return <ForgotPasswordScreen onBack={() => setShowForgot(false)} />;
    return <LoginScreen onForgotPassword={() => setShowForgot(true)} />;
  }

  if (isNewUser) return (
    <OnboardingScreen user={session.user} onComplete={() => loadUserData(session.user)} />
  );

  if (!profile) return <Spinner />;

  return (
    <div>
      <SJHeader profile={profile} onLogout={handleLogout} />
      {profile.role === "supervisor" && <SupervisorView profile={profile} teams={teams} staff={staff} />}
      {profile.role === "manager"    && <ManagerView    profile={profile} teams={teams} staff={staff} />}
      {profile.role === "admin"      && <AdminView      profile={profile} teams={teams} staff={staff} />}
    </div>
  );
}