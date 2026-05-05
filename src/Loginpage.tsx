import React, { useState, type CSSProperties, useEffect } from 'react';
import axiosInstance from './Axios';
import { Eye, EyeOff, ArrowRight, Lock, Mail, AlertCircle, Zap } from 'lucide-react';
import type { MerchantUser, LoginResponse, LoginPayload } from './types/Index';
import colors from './colors';

const ERROR_MAP: Record<string, string> = {
  USER_NOT_FOUND: 'No merchant account found with this email.',
  INVALID_EMAIL_OR_PASSWORD: 'Invalid email or password.',
  PASSWORD_LOGIN_NOT_AVAILABLE: 'This account uses social login.',
  UNAUTHORIZED_ACCESS: 'Access denied. Merchant accounts only.',
  TOKEN_EXPIRED: 'Session expired. Please login again.',
  NOT_MERCHANT: 'Access denied. Only merchant accounts can log in here.',
};

const STATUS_MAP: Record<number, string> = {
  400: 'Invalid request. Please check your details.',
  401: 'Invalid email or password.',
  403: 'Access denied. Only merchant accounts can log in here.',
  404: 'No merchant account found with this email.',
  500: 'Server error. Please try again later.',
};

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const err = error as { response?: { data?: unknown; status?: number } };
    const d = err.response?.data;
    if (typeof d === 'string') {
      const m = d.match(/Error:\s*([A-Z_]+)/);
      if (m?.[1] && ERROR_MAP[m[1]]) return ERROR_MAP[m[1]];
      if (m?.[1]) return m[1].replace(/_/g, ' ').toLowerCase();
    }
    if (d && typeof d === 'object') {
      const data = d as Record<string, unknown>;
      if (data.userType && data.userType !== 'merchant')
        return 'Access denied. Only merchant accounts can log in here.';
      if (typeof data.message === 'string') return data.message;
      if (typeof data.error === 'string') return data.error;
    }
    if (err.response?.status) return STATUS_MAP[err.response.status] ?? `Error ${err.response.status}.`;
  }
  if (error instanceof Error) {
    if (error.message === 'NOT_MERCHANT') return ERROR_MAP.NOT_MERCHANT;
    if (error.message.includes('Network')) return 'Network error. Check your connection.';
  }
  return 'Login failed. Please try again.';
}

interface LoginPageProps {
  onLogin: (token: string, user: MerchantUser) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [passErr, setPassErr]   = useState('');
  const [mounted, setMounted]   = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const validate = (): boolean => {
    let ok = true;
    if (!email) { setEmailErr('Email is required'); ok = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailErr('Enter a valid email address'); ok = false; }
    else setEmailErr('');
    if (!password) { setPassErr('Password is required'); ok = false; }
    else if (password.length < 6) { setPassErr('Min 6 characters'); ok = false; }
    else setPassErr('');
    return ok;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.post<LoginResponse>('/users/login', {
        email, password, userType: 'merchant',
      });
      const payload: LoginPayload = res.data?.data ?? (res.data as unknown as LoginPayload);
      const userType = payload?.user?.userType ?? payload?.merchant?.userType ?? (payload as Record<string,unknown>)?.userType;
      if (userType && userType !== 'merchant') throw new Error('NOT_MERCHANT');
      if (payload?.token || payload?.success || (res.data as unknown as { success?: boolean })?.success) {
        const token = payload?.token ?? payload?.accessToken ?? (res.data as unknown as { token?: string })?.token;
        const user: MerchantUser = (payload?.user as MerchantUser) ?? (payload?.merchant as MerchantUser) ?? (payload as unknown as MerchantUser);
        if (!token) throw new Error('Invalid response from server');
        onLogin(token, user);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.root}>
      <style>{css}</style>

      {/* Animated background */}
      <div style={s.bgLayer}>
        <div style={s.orb1} />
        <div style={s.orb2} />
        <div style={s.orb3} />
        <div style={s.grid} />
      </div>

      {/* Left panel */}
      <div style={{ ...s.leftPanel, opacity: mounted ? 1 : 0, transform: mounted ? 'translateX(0)' : 'translateX(-40px)', transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)' }}>
        <div style={s.brandRow}>
          <div style={s.logoWrap}>
            <div style={s.logoInner}>
              <Zap size={22} color={colors.white} fill={colors.white} />
            </div>
            <div style={s.logoPulse} />
          </div>
          <span style={s.brandName}>vervoer</span>
        </div>

        <div style={s.heroBlock}>
          <div style={s.heroPill}>
            <span style={s.heroPillDot} />
            Merchant Portal
          </div>
          <h1 style={s.heroH1}>
            Power your<br />
            <span style={s.heroAccent}>business</span><br />
            effortlessly.
          </h1>
          <p style={s.heroSub}>
            Real-time bookings, earnings tracking, slot management and dry cleaning — unified in one dashboard.
          </p>
        </div>

        <div style={s.statsRow}>
          {[['24/7', 'Monitoring'], ['99.9%', 'Uptime'], ['3 min', 'Setup']].map(([val, lbl], i) => (
            <div key={lbl} style={{ ...s.statBox, animationDelay: `${0.2 + i * 0.1}s` }} className="stat-box">
              <span style={s.statVal}>{val}</span>
              <span style={s.statLbl}>{lbl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ ...s.rightPanel, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s' }}>
        <div style={s.card}>
          <div style={s.cardTop}>
            <div style={s.cardBadge}>
              <span style={s.cardBadgeDot} />
              Merchants Only
            </div>
            <h2 style={s.cardTitle}>Welcome back</h2>
            <p style={s.cardSub}>Sign in to your Vervoer merchant account</p>
          </div>

          {error && (
            <div style={s.errorBox} className="error-shake">
              <AlertCircle size={15} color={colors.error} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} noValidate>
            <div style={s.field}>
              <label style={s.label}>Email address</label>
              <div style={s.inputWrap}>
                <Mail size={15} color={emailErr ? colors.error : colors.gray} style={s.inputIcon} />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setEmailErr(''); }}
                  placeholder="you@company.com"
                  style={{ ...s.input, ...(emailErr ? s.inputErr : {}) }}
                  autoComplete="email"
                  className="form-input"
                />
              </div>
              {emailErr && <span style={s.fieldErr}>{emailErr}</span>}
            </div>

            <div style={s.field}>
              <div style={s.labelRow}>
                <label style={s.label}>Password</label>
                <button type="button" style={s.forgotBtn}
                  onClick={() => alert('Password reset — wire to your endpoint.')}>
                  Forgot?
                </button>
              </div>
              <div style={s.inputWrap}>
                <Lock size={15} color={passErr ? colors.error : colors.gray} style={s.inputIcon} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setPassErr(''); }}
                  placeholder="••••••••"
                  style={{ ...s.input, paddingRight: 44, ...(passErr ? s.inputErr : {}) }}
                  autoComplete="current-password"
                  className="form-input"
                />
                <button type="button" onClick={() => setShowPass(p => !p)} style={s.eyeBtn}>
                  {showPass ? <EyeOff size={15} color={colors.gray} /> : <Eye size={15} color={colors.gray} />}
                </button>
              </div>
              {passErr && <span style={s.fieldErr}>{passErr}</span>}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ ...s.submitBtn, ...(loading ? s.submitDisabled : {}) }}
              className={loading ? '' : 'submit-btn'}
            >
              {loading ? (
                <span style={s.spinner} />
              ) : (
                <>
                  <span>Sign in to Vervoer</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div style={s.lockNote}>
            <span>🔒</span>
            <span>Exclusive access for verified merchants only</span>
          </div>

          <p style={s.foot}>
            Need an account?{' '}
            <a href="mailto:support@vervoer.com" style={s.footLink}>Contact support</a>
          </p>
        </div>
      </div>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes float1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,-20px) scale(1.05); } }
  @keyframes float2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-20px,30px) scale(1.08); } }
  @keyframes float3 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(15px,15px); } }
  @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(2.2); opacity: 0; } }
  @keyframes fadeSlideUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }
  @keyframes error-shake { 0%,100% { transform: translateX(0); } 20%,60% { transform: translateX(-6px); } 40%,80% { transform: translateX(6px); } }
  .stat-box { animation: fadeSlideUp 0.5s ease both; }
  .error-shake { animation: error-shake 0.4s ease; }
  .form-input:focus { outline: none !important; border-color: ${colors.primary} !important; box-shadow: 0 0 0 3px rgba(255,148,1,0.15) !important; }
  .submit-btn:hover { background: ${colors.primaryDark} !important; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(255,148,1,0.35) !important; }
  .submit-btn:active { transform: translateY(0); }
  * { box-sizing: border-box; }
  button:focus { outline: none; }
`;

const s: Record<string, CSSProperties> = {
  root: {
    minHeight: '100vh',
    display: 'flex',
    fontFamily: "'DM Sans', sans-serif",
    background: colors.sidebarBg,
    position: 'relative',
    overflow: 'hidden',
  },
  bgLayer: {
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 0,
  },
  orb1: {
    position: 'absolute', top: '-10%', left: '-5%',
    width: 500, height: 500, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,148,1,0.18) 0%, transparent 70%)',
    animation: 'float1 8s ease-in-out infinite',
  },
  orb2: {
    position: 'absolute', bottom: '-15%', right: '-5%',
    width: 600, height: 600, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,148,1,0.1) 0%, transparent 70%)',
    animation: 'float2 10s ease-in-out infinite',
  },
  orb3: {
    position: 'absolute', top: '40%', left: '30%',
    width: 300, height: 300, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,148,1,0.06) 0%, transparent 70%)',
    animation: 'float3 6s ease-in-out infinite',
  },
  grid: {
    position: 'absolute', inset: 0,
    backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
    backgroundSize: '48px 48px',
  },
  leftPanel: {
    flex: 1,
    padding: '52px 56px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 1,
  },
  brandRow: {
    display: 'flex', alignItems: 'center', gap: 14,
  },
  logoWrap: {
    position: 'relative', width: 48, height: 48,
  },
  logoInner: {
    width: 48, height: 48, borderRadius: 16,
    background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: `0 8px 24px rgba(255,148,1,0.4)`,
    position: 'relative', zIndex: 1,
  },
  logoPulse: {
    position: 'absolute', inset: 0, borderRadius: 16,
    border: `2px solid ${colors.primary}`,
    animation: 'pulse-ring 2s ease-out infinite',
  },
  brandName: {
    color: colors.white,
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 28,
    letterSpacing: '-1px',
  },
  heroBlock: {
    flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 48,
  },
  heroPill: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: 'rgba(255,148,1,0.12)',
    border: '1px solid rgba(255,148,1,0.25)',
    color: colors.primary,
    borderRadius: 24, padding: '6px 16px',
    fontSize: 12, fontWeight: 700, letterSpacing: '0.8px',
    textTransform: 'uppercase' as const,
    marginBottom: 28, width: 'fit-content',
  },
  heroPillDot: {
    width: 6, height: 6, borderRadius: '50%',
    background: colors.primary, display: 'inline-block',
    boxShadow: `0 0 6px ${colors.primary}`,
  },
  heroH1: {
    color: colors.white,
    fontFamily: "'Syne', sans-serif",
    fontSize: 58, fontWeight: 800, lineHeight: 1.08,
    letterSpacing: '-2.5px', margin: '0 0 24px',
  },
  heroAccent: {
    color: colors.primary,
    textShadow: `0 0 40px rgba(255,148,1,0.4)`,
  },
  heroSub: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 16, lineHeight: 1.7, maxWidth: 380, margin: 0,
  },
  statsRow: {
    display: 'flex', gap: 16,
    borderTop: '1px solid rgba(255,255,255,0.07)',
    paddingTop: 36,
  },
  statBox: {
    flex: 1, background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16, padding: '18px 16px',
    display: 'flex', flexDirection: 'column', gap: 4,
    backdropFilter: 'blur(8px)',
  },
  statVal: {
    color: colors.primary,
    fontFamily: "'Syne', sans-serif",
    fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px',
  },
  statLbl: {
    color: 'rgba(255,255,255,0.35)', fontSize: 12, fontWeight: 500,
  },
  rightPanel: {
    width: 500, display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '40px 48px',
    background: 'rgba(255,255,255,0.03)',
    borderLeft: '1px solid rgba(255,255,255,0.06)',
    backdropFilter: 'blur(20px)',
    position: 'relative', zIndex: 1,
  },
  card: {
    width: '100%', maxWidth: 420,
  },
  cardTop: { marginBottom: 32 },
  cardBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 7,
    background: colors.primaryLight,
    color: colors.primaryDark,
    border: `1px solid rgba(255,148,1,0.2)`,
    borderRadius: 20, padding: '4px 14px',
    fontSize: 11, fontWeight: 700,
    letterSpacing: '0.6px', textTransform: 'uppercase' as const,
    marginBottom: 18,
  },
  cardBadgeDot: {
    width: 6, height: 6, borderRadius: '50%',
    background: colors.primary, display: 'inline-block',
  },
  cardTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 34, fontWeight: 800, color: colors.white,
    margin: '0 0 8px', letterSpacing: '-1.5px',
  },
  cardSub: {
    color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0, lineHeight: 1.5,
  },
  errorBox: {
    display: 'flex', alignItems: 'flex-start', gap: 10,
    background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.2)',
    color: '#FF6B6B', borderRadius: 12, padding: '12px 16px',
    fontSize: 13, marginBottom: 20, fontWeight: 500, lineHeight: 1.4,
  },
  field: { marginBottom: 20 },
  label: {
    display: 'block', fontSize: 13, fontWeight: 600,
    color: 'rgba(255,255,255,0.65)', marginBottom: 8,
  },
  labelRow: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 8,
  },
  forgotBtn: {
    background: 'none', border: 'none',
    color: colors.primary, fontSize: 13, fontWeight: 600,
    cursor: 'pointer', padding: 0, fontFamily: 'inherit',
  },
  inputWrap: { position: 'relative' },
  inputIcon: {
    position: 'absolute', left: 14, top: '50%',
    transform: 'translateY(-50%)', pointerEvents: 'none',
  },
  input: {
    width: '100%', paddingLeft: 42, paddingRight: 16,
    paddingTop: 13, paddingBottom: 13,
    fontSize: 15,
    border: '1.5px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    background: 'rgba(255,255,255,0.06)',
    color: colors.white,
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
  },
  inputErr: { borderColor: 'rgba(255,0,0,0.5)' },
  eyeBtn: {
    position: 'absolute', right: 12, top: '50%',
    transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer',
    padding: 4, display: 'flex', alignItems: 'center',
  },
  fieldErr: {
    display: 'block', marginTop: 6,
    fontSize: 12, color: '#FF6B6B', fontWeight: 500,
  },
  submitBtn: {
    width: '100%', padding: '14px 24px',
    background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
    color: colors.white, border: 'none', borderRadius: 12,
    fontSize: 15, fontWeight: 700, cursor: 'pointer',
    marginTop: 8, display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: 8,
    transition: 'all 0.2s',
    fontFamily: 'inherit',
    boxShadow: `0 4px 16px rgba(255,148,1,0.3)`,
  },
  submitDisabled: { opacity: 0.6, cursor: 'not-allowed' },
  spinner: {
    width: 18, height: 18,
    border: '2.5px solid rgba(255,255,255,0.3)',
    borderTop: '2.5px solid #fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    display: 'inline-block',
  },
  lockNote: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 10, padding: '10px 14px',
    fontSize: 12, color: 'rgba(255,255,255,0.3)',
    marginTop: 16, fontWeight: 500,
  },
  foot: {
    textAlign: 'center' as const, marginTop: 20,
    fontSize: 13, color: 'rgba(255,255,255,0.25)',
  },
  footLink: { color: colors.primary, fontWeight: 600, textDecoration: 'none' },
};