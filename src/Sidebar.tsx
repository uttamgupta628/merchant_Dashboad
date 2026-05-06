import React from 'react';
import { motion } from 'framer-motion';

import {
  LayoutDashboard,
  Grid,
  List,
  Repeat,
  Shirt,
  Users,
  LogOut,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';


export const NAV_ITEMS = [
  {
    key: 'overview',
    label: 'Overview',
    Icon: LayoutDashboard,
    badge: null,
  },

  {
    key: 'slots',
    label: 'Slots',
    Icon: Grid,
    badge: null,
  },

  {
    key: 'bookings',
    label: 'Bookings',
    Icon: List,
    badge: '12',
  },

  {
    key: 'monthly',
    label: 'Monthly',
    Icon: Repeat,
    badge: null,
  },

  {
    key: 'dryCleaning',
    label: 'Laundry',
    Icon: Shirt,
    badge: '3',
  },

  {
    key: 'subAccounts',
    label: 'Team',
    Icon: Users,
    badge: null,
  },
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (t: string) => void;
  user: { firstName?: string };
  onLogout: () => void;
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  user,
  onLogout,
  collapsed,
  onToggle,
}) => {
  return (
    <motion.div
      animate={{
        width: collapsed ? 84 : 270,
      }}
      transition={{
        duration: 0.35,
      }}
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(180deg, #0f172a 0%, #111827 100%)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 100,
        overflow: 'hidden',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.35)',
        backdropFilter: 'blur(18px)',
      }}
    >
      {/* Glow Background */}
      <div
        style={{
          position: 'absolute',
          top: -120,
          left: -120,
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'rgba(99,102,241,0.18)',
          filter: 'blur(80px)',
        }}
      />

      {/* Logo */}
      <div
        style={{
          padding: collapsed ? '24px 0' : '24px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          position: 'relative',
        }}
      >
        <motion.div
          whileHover={{
            rotate: 8,
            scale: 1.08,
          }}
          style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            background:
              'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 12px 30px rgba(99,102,241,0.35)',
          }}
        >
          <span
            style={{
              color: '#fff',
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            V
          </span>
        </motion.div>

        {!collapsed && (
          <motion.div
            initial={{
              opacity: 0,
              x: -10,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
          >
            <h2
              style={{
                margin: 0,
                color: '#fff',
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: '-1px',
              }}
            >
              Vervoer
            </h2>

            <p
              style={{
                margin: 0,
                color: '#94a3b8',
                fontSize: 11,
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              Merchant Panel
            </p>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <div
        style={{
          flex: 1,
          padding: '18px 12px',
        }}
      >
        {!collapsed && (
          <p
            style={{
              color: '#64748b',
              fontSize: 11,
              marginBottom: 12,
              paddingLeft: 12,
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            Navigation
          </p>
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {NAV_ITEMS.map(
            ({
              key,
              label,
              Icon,
              badge,
            }) => {
              const active =
                activeTab === key;

              return (
                <motion.button
                  key={key}
                  whileHover={{
                    scale: 1.02,
                    x: 4,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  onClick={() =>
                    onTabChange(key)
                  }
                  style={{
                    width: '100%',
                    border: active
                      ? '1px solid rgba(99,102,241,0.3)'
                      : '1px solid transparent',
                    outline: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: collapsed
                      ? '14px'
                      : '14px 16px',
                    borderRadius: 18,
                    background: active
                      ? 'linear-gradient(135deg, rgba(99,102,241,0.22), rgba(139,92,246,0.18))'
                      : 'transparent',
                    color: active
                      ? '#fff'
                      : '#94a3b8',
                    position: 'relative',
                    overflow: 'hidden',
                    transition:
                      'all 0.25s ease',
                    justifyContent:
                      collapsed
                        ? 'center'
                        : 'flex-start',
                    backdropFilter:
                      'blur(10px)',
                  }}
                >
                  {active && (
                    <motion.div
                      layoutId="active-pill"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 18,
                        background:
                          'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(139,92,246,0.08))',
                        zIndex: 0,
                      }}
                    />
                  )}

                  <div
                    style={{
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <Icon
                      size={18}
                      color={
                        active
                          ? '#fff'
                          : '#94a3b8'
                      }
                    />
                  </div>

                  {!collapsed && (
                    <>
                      <span
                        style={{
                          flex: 1,
                          textAlign: 'left',
                          fontSize: 14,
                          fontWeight: active
                            ? 700
                            : 500,
                          position: 'relative',
                          zIndex: 1,
                        }}
                      >
                        {label}
                      </span>

                      {badge && (
                        <motion.div
                          animate={{
                            scale: [
                              1,
                              1.08,
                              1,
                            ],
                          }}
                          transition={{
                            repeat:
                              Infinity,
                            duration: 2,
                          }}
                          style={{
                            minWidth: 24,
                            height: 24,
                            borderRadius: 999,
                            background: active
                              ? '#fff'
                              : 'rgba(99,102,241,0.18)',
                            color: active
                              ? '#6366f1'
                              : '#a5b4fc',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent:
                              'center',
                            fontSize: 11,
                            fontWeight: 700,
                            position:
                              'relative',
                            zIndex: 1,
                          }}
                        >
                          {badge}
                        </motion.div>
                      )}
                    </>
                  )}
                </motion.button>
              );
            }
          )}
        </div>
      </div>

      {/* User Section */}
      <div
        style={{
          padding: 14,
          borderTop:
            '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {!collapsed && (
          <motion.div
            whileHover={{
              scale: 1.02,
            }}
            style={{
              padding: 14,
              borderRadius: 20,
              background:
                'rgba(255,255,255,0.04)',
              border:
                '1px solid rgba(255,255,255,0.06)',
              marginBottom: 12,
              backdropFilter: 'blur(10px)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  background:
                    'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                {user?.firstName?.[0]?.toUpperCase() ||
                  'M'}
              </div>

              <div>
                <p
                  style={{
                    margin: 0,
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {user?.firstName ||
                    'Merchant'}
                </p>

                <p
                  style={{
                    margin: 0,
                    color: '#94a3b8',
                    fontSize: 11,
                  }}
                >
                  Admin Access
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Logout Button */}
        <motion.button
          whileHover={{
            scale: 1.02,
          }}
          whileTap={{
            scale: 0.98,
          }}
          onClick={onLogout}
          style={{
            width: '100%',
            outline: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              collapsed
                ? 'center'
                : 'flex-start',
            gap: 12,
            padding: collapsed
              ? '14px'
              : '14px 16px',
            borderRadius: 18,
            background:
              'rgba(239,68,68,0.12)',
            border:
              '1px solid rgba(239,68,68,0.2)',
            color: '#ef4444',
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          <LogOut size={18} />

          {!collapsed && (
            <span>Sign Out</span>
          )}
        </motion.button>
      </div>

      {/* Collapse Toggle */}
      <motion.button
        whileHover={{
          scale: 1.1,
        }}
        whileTap={{
          scale: 0.92,
        }}
        onClick={onToggle}
        style={{
          position: 'absolute',
          top: 24,
          right: -14,
          width: 30,
          height: 30,
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          background:
            'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow:
            '0 10px 24px rgba(99,102,241,0.4)',
        }}
      >
        {collapsed ? (
          <ChevronRight
            size={14}
            color="#fff"
          />
        ) : (
          <ChevronLeft
            size={14}
            color="#fff"
          />
        )}
      </motion.button>
    </motion.div>
  );
};

export default Sidebar;