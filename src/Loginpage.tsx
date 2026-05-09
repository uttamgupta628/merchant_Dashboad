
import React, {
  useState,
  useEffect,
  type CSSProperties,
} from 'react';

import { motion } from 'framer-motion';

import axiosInstance from './Axios';

import {
  Eye,
  EyeOff,
  ArrowRight,
  Lock,
  Mail,
  AlertCircle,
  Zap,
  ShieldCheck,
} from 'lucide-react';

import type {
  MerchantUser,
} from './types/Index';

import colors from './colors';

/* ───────────────────────────────────────────── */
/* ERROR HELPERS */
/* ───────────────────────────────────────────── */

const STATUS_MAP: Record<
  number,
  string
> = {
  400: 'Invalid request.',
  401:
    'Invalid email or password.',
  403:
    'Access denied. Merchant accounts only.',
  404:
    'No merchant account found.',
  500:
    'Server error. Try again later.',
};

function getErrorMessage(
  error: unknown
): string {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error
  ) {
    const err = error as {
      response?: {
        data?: unknown;
        status?: number;
      };
    };

    const d =
      err.response?.data;

    if (
      typeof d === 'object' &&
      d
    ) {
      const data =
        d as Record<
          string,
          unknown
        >;

      if (
        typeof data.message ===
        'string'
      ) {
        return data.message;
      }
    }

    if (
      err.response?.status
    ) {
      return (
        STATUS_MAP[
          err.response.status
        ] ||
        'Login failed.'
      );
    }
  }

  return 'Login failed.';
}

/* ───────────────────────────────────────────── */
/* PROPS */
/* ───────────────────────────────────────────── */

interface LoginPageProps {
  onLogin: (
    token: string,
    user: MerchantUser
  ) => void;
}

/* ───────────────────────────────────────────── */
/* ANIMATION */
/* ───────────────────────────────────────────── */

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 30,
  },

  visible: (
    delay = 0
  ) => ({
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.7,
      delay,
    },
  }),
};

/* ───────────────────────────────────────────── */
/* MAIN */
/* ───────────────────────────────────────────── */

export default function LoginPage({
  onLogin,
}: LoginPageProps) {
  const [email, setEmail] =
    useState('');

  const [
    password,
    setPassword,
  ] = useState('');

  const [
    showPass,
    setShowPass,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [error, setError] =
    useState('');

  const [
    emailErr,
    setEmailErr,
  ] = useState('');

  const [
    passErr,
    setPassErr,
  ] = useState('');

  const [
    mounted,
    setMounted,
  ] = useState(false);

  useEffect(() => {
    setTimeout(
      () => setMounted(true),
      100
    );
  }, []);

  /* VALIDATION */

  const validate =
    (): boolean => {
      let ok = true;

      if (!email) {
        setEmailErr(
          'Email is required'
        );

        ok = false;
      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          email
        )
      ) {
        setEmailErr(
          'Enter valid email'
        );

        ok = false;
      } else {
        setEmailErr('');
      }

      if (!password) {
        setPassErr(
          'Password is required'
        );

        ok = false;
      } else if (
        password.length < 6
      ) {
        setPassErr(
          'Minimum 6 characters'
        );

        ok = false;
      } else {
        setPassErr('');
      }

      return ok;
    };

  /* LOGIN */

  const handleLogin =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      if (!validate())
        return;

      setLoading(true);

      setError('');

      try {
        const res =
          await axiosInstance.post(
            '/users/login',
            {
              email,
              password,
              userType:
                'merchant',
            }
          );

        console.log(
          'LOGIN RESPONSE =>',
          res.data
        );

        const token =
          res.data.token;

        const user =
          res.data.user;

        if (
          !token ||
          !user
        ) {
          throw new Error(
            'Invalid response from server'
          );
        }

        onLogin(
          token,
          user
        );
      } catch (err) {
        console.error(err);

        setError(
          getErrorMessage(
            err
          )
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div style={s.root}>
      <style>{css}</style>

      {/* BACKGROUND */}
      <div style={s.bg}>
        <div style={s.orb1} />

        <div style={s.orb2} />

        <div style={s.grid} />
      </div>

      {/* LEFT */}
      <motion.div
        initial="hidden"
        animate={
          mounted
            ? 'visible'
            : 'hidden'
        }
        variants={fadeUp}
        custom={0}
        style={s.left}
      >
        {/* LOGO */}
        <motion.div
          whileHover={{
            scale: 1.04,
          }}
          style={s.logoRow}
        >
          <div style={s.logo}>
            <Zap
              size={24}
              color="#fff"
            />
          </div>

          <span style={s.brand}>
            vervoer
          </span>
        </motion.div>

        {/* HERO */}
        <div>
          <motion.div
            custom={0.2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={s.heroBadge}
          >
            <span
              style={
                s.heroDot
              }
            />

            Merchant Portal
          </motion.div>

          <motion.h1
            custom={0.3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={s.heroTitle}
          >
            Grow your
            <br />
            business
            <br />
            <span
              style={
                s.heroAccent
              }
            >
              smarter.
            </span>
          </motion.h1>

          <motion.p
            custom={0.4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={s.heroSub}
          >
            Manage bookings,
            parking slots,
            customers,
            laundry services
            and analytics —
            all in one
            premium dashboard.
          </motion.p>
        </div>

        {/* STATS */}
        <div style={s.stats}>
          {[
            [
              '24/7',
              'Monitoring',
            ],

            [
              '99.9%',
              'Uptime',
            ],

            [
              '3 min',
              'Setup',
            ],
          ].map(
            (
              [v, l],
              i
            ) => (
              <motion.div
                key={l}
                whileHover={{
                  y: -6,
                  scale: 1.03,
                }}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay:
                    0.5 +
                    i * 0.1,
                }}
                style={
                  s.statCard
                }
              >
                <h3
                  style={
                    s.statVal
                  }
                >
                  {v}
                </h3>

                <p
                  style={
                    s.statLbl
                  }
                >
                  {l}
                </p>
              </motion.div>
            )
          )}
        </div>
      </motion.div>

      {/* RIGHT */}
      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
          delay: 0.2,
        }}
        style={s.right}
      >
        <motion.div
          whileHover={{
            y: -4,
          }}
          style={s.card}
        >
          {/* TOP */}
          <div
            style={{
              marginBottom: 28,
            }}
          >
            <div style={s.cardBadge}>
              <ShieldCheck
                size={13}
              />

              Verified Merchants
            </div>

            <h2 style={s.title}>
              Welcome Back
            </h2>

            <p style={s.subtitle}>
              Sign in to your
              merchant dashboard
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              style={s.error}
            >
              <AlertCircle
                size={16}
              />

              <span>
                {error}
              </span>
            </motion.div>
          )}

          {/* FORM */}
          <form
            onSubmit={
              handleLogin
            }
          >
            {/* EMAIL */}
            <div
              style={
                s.field
              }
            >
              <label
                style={
                  s.label
                }
              >
                Email
              </label>

              <div
                style={
                  s.inputWrap
                }
              >
                <Mail
                  size={16}
                  color={
                    colors.gray
                  }
                  style={
                    s.inputIcon
                  }
                />

                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={e => {
                    setEmail(
                      e.target
                        .value
                    );

                    setEmailErr(
                      ''
                    );
                  }}
                  style={{
                    ...s.input,

                    ...(emailErr
                      ? {
                          border:
                            '1px solid #ef4444',
                        }
                      : {}),
                  }}
                />
              </div>

              {emailErr && (
                <span
                  style={
                    s.fieldErr
                  }
                >
                  {emailErr}
                </span>
              )}
            </div>

            {/* PASSWORD */}
            <div
              style={
                s.field
              }
            >
              <label
                style={
                  s.label
                }
              >
                Password
              </label>

              <div
                style={
                  s.inputWrap
                }
              >
                <Lock
                  size={16}
                  color={
                    colors.gray
                  }
                  style={
                    s.inputIcon
                  }
                />

                <input
                  type={
                    showPass
                      ? 'text'
                      : 'password'
                  }
                  placeholder="••••••••"
                  value={
                    password
                  }
                  onChange={e => {
                    setPassword(
                      e.target
                        .value
                    );

                    setPassErr(
                      ''
                    );
                  }}
                  style={{
                    ...s.input,
                    paddingRight: 48,

                    ...(passErr
                      ? {
                          border:
                            '1px solid #ef4444',
                        }
                      : {}),
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPass(
                      p => !p
                    )
                  }
                  style={
                    s.eyeBtn
                  }
                >
                  {showPass ? (
                    <EyeOff
                      size={16}
                      color={
                        colors.gray
                      }
                    />
                  ) : (
                    <Eye
                      size={16}
                      color={
                        colors.gray
                      }
                    />
                  )}
                </button>
              </div>

              {passErr && (
                <span
                  style={
                    s.fieldErr
                  }
                >
                  {passErr}
                </span>
              )}
            </div>

            {/* BUTTON */}
            <motion.button
              whileHover={{
                scale: 1.02,
                y: -2,
              }}
              whileTap={{
                scale: 0.98,
              }}
              type="submit"
              disabled={
                loading
              }
              style={
                s.submit
              }
            >
              {loading ? (
                <span
                  style={
                    s.spinner
                  }
                />
              ) : (
                <>
                  <span>
                    Sign in
                  </span>

                  <ArrowRight
                    size={18}
                  />
                </>
              )}
            </motion.button>
          </form>

          {/* FOOT */}
          <div style={s.footer}>
            🔒 Secure merchant
            login
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* CSS */

const css = `
*{
box-sizing:border-box;
}

body{
margin:0;
}

@keyframes spin{
to{
transform:rotate(360deg);
}
}

input:focus{
outline:none;
border-color:#ff9500!important;
box-shadow:0 0 0 4px rgba(255,149,0,0.12);
}
`;

/* STYLES */

const s: Record<
  string,
  CSSProperties
> = {
  root: {
    minHeight: '100vh',
    display: 'flex',
    background:
      '#06070b',
    overflow: 'hidden',
    position: 'relative',
    fontFamily:
      'Inter, sans-serif',
  },

  bg: {
    position: 'fixed',
    inset: 0,
  },

  orb1: {
    position: 'absolute',
    top: -180,
    left: -120,
    width: 500,
    height: 500,
    borderRadius: '50%',
    background:
      'rgba(255,149,0,0.12)',
    filter:
      'blur(120px)',
  },

  orb2: {
    position: 'absolute',
    bottom: -200,
    right: -150,
    width: 600,
    height: 600,
    borderRadius: '50%',
    background:
      'rgba(255,149,0,0.08)',
    filter:
      'blur(140px)',
  },

  grid: {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
    backgroundSize:
      '48px 48px',
  },

  left: {
    flex: 1,
    padding:
      '56px 64px',
    display: 'flex',
    flexDirection:
      'column',
    justifyContent:
      'space-between',
    position: 'relative',
    zIndex: 1,
  },

  logoRow: {
    display: 'flex',
    alignItems:
      'center',
    gap: 14,
  },

  logo: {
    width: 52,
    height: 52,
    borderRadius: 18,
    background:
      'linear-gradient(135deg,#ff9500,#ff6a00)',
    display: 'flex',
    alignItems:
      'center',
    justifyContent:
      'center',
  },

  brand: {
    fontSize: 30,
    fontWeight: 900,
    color: '#fff',
  },

  heroBadge: {
    display: 'inline-flex',
    alignItems:
      'center',
    gap: 8,
    background:
      'rgba(255,149,0,0.12)',
    border:
      '1px solid rgba(255,149,0,0.2)',
    borderRadius: 999,
    padding:
      '8px 16px',
    color: '#ff9500',
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 28,
  },

  heroDot: {
    width: 7,
    height: 7,
    borderRadius:
      '50%',
    background:
      '#ff9500',
  },

  heroTitle: {
    margin:
      '0 0 24px',
    color: '#fff',
    fontSize: 68,
    lineHeight: 1,
    fontWeight: 900,
  },

  heroAccent: {
    color: '#ff9500',
  },

  heroSub: {
    maxWidth: 500,
    color:
      'rgba(255,255,255,0.55)',
    fontSize: 18,
    lineHeight: 1.8,
  },

  stats: {
    display: 'flex',
    gap: 18,
  },

  statCard: {
    flex: 1,
    background:
      'rgba(255,255,255,0.04)',
    border:
      '1px solid rgba(255,255,255,0.06)',
    borderRadius: 22,
    padding:
      '22px 20px',
  },

  statVal: {
    margin:
      '0 0 4px',
    color: '#ff9500',
    fontSize: 30,
    fontWeight: 900,
  },

  statLbl: {
    margin: 0,
    color:
      'rgba(255,255,255,0.45)',
  },

  right: {
    width: 520,
    display: 'flex',
    alignItems:
      'center',
    justifyContent:
      'center',
    padding:
      '48px 56px',
    position: 'relative',
    zIndex: 1,
  },

  card: {
    width: '100%',
    maxWidth: 430,
    background:
      'rgba(17,20,30,0.75)',
    border:
      '1px solid rgba(255,255,255,0.06)',
    borderRadius: 34,
    padding: 34,
    backdropFilter:
      'blur(24px)',
  },

  cardBadge: {
    display: 'inline-flex',
    alignItems:
      'center',
    gap: 7,
    background:
      'rgba(255,149,0,0.12)',
    border:
      '1px solid rgba(255,149,0,0.2)',
    borderRadius: 999,
    padding:
      '7px 14px',
    color: '#ff9500',
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 20,
  },

  title: {
    margin:
      '0 0 8px',
    color: '#fff',
    fontSize: 38,
    fontWeight: 900,
  },

  subtitle: {
    margin: 0,
    color:
      'rgba(255,255,255,0.45)',
  },

  error: {
    display: 'flex',
    alignItems:
      'center',
    gap: 10,
    background:
      'rgba(239,68,68,0.12)',
    border:
      '1px solid rgba(239,68,68,0.2)',
    color: '#ef4444',
    padding:
      '14px 16px',
    borderRadius: 16,
    marginBottom: 18,
  },

  field: {
    marginBottom: 20,
  },

  label: {
    display: 'block',
    marginBottom: 8,
    color:
      'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: 600,
  },

  inputWrap: {
    position: 'relative',
  },

  inputIcon: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform:
      'translateY(-50%)',
  },

  input: {
    width: '100%',
    height: 56,
    paddingLeft: 46,
    borderRadius: 16,
    border:
      '1px solid rgba(255,255,255,0.08)',
    background:
      'rgba(255,255,255,0.04)',
    color: '#fff',
    fontSize: 15,
  },

  eyeBtn: {
    position: 'absolute',
    top: '50%',
    right: 14,
    transform:
      'translateY(-50%)',
    border: 'none',
    background:
      'transparent',
    cursor: 'pointer',
  },

  submit: {
    width: '100%',
    height: 58,
    border: 'none',
    borderRadius: 18,
    background:
      'linear-gradient(135deg,#ff9500,#ff6a00)',
    color: '#fff',
    fontWeight: 800,
    fontSize: 15,
    display: 'flex',
    alignItems:
      'center',
    justifyContent:
      'center',
    gap: 10,
    cursor: 'pointer',
    marginTop: 12,
  },

  spinner: {
    width: 18,
    height: 18,
    border:
      '2px solid rgba(255,255,255,0.3)',
    borderTop:
      '2px solid #fff',
    borderRadius:
      '50%',
    animation:
      'spin .7s linear infinite',
  },

  fieldErr: {
    display: 'block',
    color: '#ef4444',
    fontSize: 12,
    marginTop: 6,
  },

  footer: {
    marginTop: 20,
    textAlign: 'center',
    color:
      'rgba(255,255,255,0.35)',
    fontSize: 13,
  },
};