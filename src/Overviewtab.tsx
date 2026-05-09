import React from 'react';
import { motion, Variants } from 'framer-motion';

import {
  DollarSign,
  CalendarDays,
  Repeat,
  MapPin,
  Crown,
} from 'lucide-react';

import {
  StatsData,
  PeriodTotals,
  fmtCurrency,
} from './Tokens';

import {
  PeriodToggle,
  VenueIcon,
  SectionLabel,
} from './Ui';

// ── Orange palette override ──────────────────────────────────────────────────
const O = {
  primary:    '#FFA629',          // vivid orange
  primaryBg:  '#FF8E0033',        // translucent orange tint
  primaryDark:'#E08A00',          // darker shade for shadows / borders
  primarySoft:'rgba(255,166,41,0.12)', // very soft fill
  white:      '#FFFFFF',
  offWhite:   '#FFF8EE',
  text:       '#1A0F00',
  textMuted:  '#7A5C30',
  cardBg:     '#FFFFFF',
  border:     'rgba(255,166,41,0.20)',
  shadow:     'rgba(255,142,0,0.10)',
  bgDeep:     '#FFF1D6',
};

// Venue accent colours – all harmonised to the orange palette
const VENUE_CLR: Record<string, string> = {
  parking:   '#FFA629',
  garage:    '#E08A00',
  residence: '#FF6B00',
};

const VENUE_BG_O: Record<string, string> = {
  parking:   'rgba(255,166,41,0.12)',
  garage:    'rgba(224,138,0,0.12)',
  residence: 'rgba(255,107,0,0.12)',
};
// ─────────────────────────────────────────────────────────────────────────────

interface OverviewTabProps {
  data: StatsData;
  period: string;
  onPeriodChange: (p: string) => void;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.25, 0.25, 0, 1] },
  }),
};

export const OverviewTab: React.FC<OverviewTabProps> = ({
  data,
  period,
  onPeriodChange,
}) => {
  const totalMRR = data.venues
    .filter(v => v.monthlyChargeEnabled)
    .reduce((s, v) => s + v.monthlyRate * v.activeMonthlySubscriptions, 0);

  const p = period as keyof PeriodTotals;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}
    >
      <PeriodToggle period={period} onChange={onPeriodChange} />

      {/* ── KPI Cards ── */}
      <style>{`
        .kpi-card {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 14px 18px;
          border: 1.5px solid rgba(255,166,41,0.20);
          box-shadow: 0 2px 12px rgba(255,142,0,0.08);
          cursor: pointer;
          transition: background 0.28s ease, box-shadow 0.28s ease, transform 0.22s ease, border-color 0.28s ease;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          min-height: 80px;
        }
        .kpi-card:hover {
          background: #FFA629;
          border-color: #E08A00;
          box-shadow: 0 6px 24px rgba(255,142,0,0.30);
          transform: translateY(-5px) scale(1.02);
        }
        .kpi-card__left { display: flex; flex-direction: column; gap: 4px; }
        .kpi-card__label {
          font-size: 11px;
          font-weight: 600;
          color: #7A5C30;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          transition: color 0.28s ease;
        }
        .kpi-card:hover .kpi-card__label { color: rgba(255,255,255,0.80); }
        .kpi-card__value {
          font-size: 24px;
          font-weight: 800;
          color: #1A0F00;
          font-family: 'Playfair Display', serif;
          line-height: 1;
          transition: color 0.28s ease;
        }
        .kpi-card:hover .kpi-card__value { color: #FFFFFF; }
        .kpi-card__sub {
          font-size: 11px;
          color: #7A5C30;
          transition: color 0.28s ease;
        }
        .kpi-card:hover .kpi-card__sub { color: rgba(255,255,255,0.75); }
        .kpi-card__trend {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 11px;
          font-weight: 700;
          color: #22a44f;
          background: rgba(34,164,79,0.10);
          padding: 2px 8px;
          border-radius: 20px;
          margin-top: 2px;
          transition: background 0.28s ease, color 0.28s ease;
          width: fit-content;
        }
        .kpi-card:hover .kpi-card__trend {
          background: rgba(255,255,255,0.25);
          color: #FFFFFF;
        }
        .kpi-card__icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: rgba(255,166,41,0.12);
          border: 1px solid rgba(255,166,41,0.20);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.28s ease, border-color 0.28s ease;
        }
        .kpi-card:hover .kpi-card__icon {
          background: rgba(255,255,255,0.25);
          border-color: rgba(255,255,255,0.35);
        }
        .kpi-card__icon svg {
          transition: stroke 0.28s ease, color 0.28s ease;
        }
        .kpi-card:hover .kpi-card__icon svg {
          stroke: #FFFFFF !important;
          color: #FFFFFF !important;
        }
      `}</style>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))',
          gap: 14,
          marginBottom: 26,
        }}
      >
        {[
          {
            label: 'Total Revenue',
            value: fmtCurrency(data.totalEarnings[p]),
            sub: period,
            Icon: DollarSign,
            trend: '+12.4%',
          },
          {
            label: 'Total Bookings',
            value: String(data.totalBookings[p]),
            sub: period,
            Icon: CalendarDays,
            trend: '+8.1%',
          },
          {
            label: 'Monthly MRR',
            value: `$${totalMRR.toLocaleString()}`,
            sub: 'Recurring',
            Icon: Repeat,
          },
          {
            label: 'Active Venues',
            value: String(data.venues.length),
            sub: 'Operational',
            Icon: MapPin,
          },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="kpi-card"
          >
            <div className="kpi-card__left">
              <span className="kpi-card__label">{item.label}</span>
              <span className="kpi-card__value">{item.value}</span>
              <span className="kpi-card__sub">{item.sub}</span>
              {item.trend && (
                <span className="kpi-card__trend">▲ {item.trend}</span>
              )}
            </div>
            <div className="kpi-card__icon">
              <item.Icon size={18} color={O.primary} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Revenue type cards ── */}
      <div
        style={{
          display: 'flex',
          gap: 14,
          marginBottom: 26,
          flexWrap: 'wrap',
        }}
      >
        {(['parking', 'garage', 'residence'] as const).map((type, i) => {
          const total = data.venues
            .filter(v => v.type === type)
            .reduce((s, v) => s + v.earnings[p], 0);

          return (
            <motion.div
              key={type}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -5, scale: 1.02 }}
              style={{
                flex: 1,
                background: O.primary,
                borderRadius: 18,
                padding: '16px 20px',
                border: `1.5px solid ${O.primaryDark}`,
                display: 'flex',
                alignItems: 'center',
                gap: 13,
                minWidth: 140,
                boxShadow: `0 4px 16px ${O.shadow}`,
              }}
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 13,
                  background: 'rgba(255,255,255,0.25)',
                  border: '1px solid rgba(255,255,255,0.30)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <VenueIcon type={type} size={19} color={O.white} />
              </motion.div>

              <div>
                <p
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: O.white,
                    margin: 0,
                    fontFamily: 'Playfair Display, serif',
                  }}
                >
                  {fmtCurrency(total)}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.75)',
                    margin: 0,
                    textTransform: 'capitalize',
                  }}
                >
                  {type}s revenue
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Venue Section ── */}
      <SectionLabel>Your Venues</SectionLabel>

      {data.venues.length === 0 && (
        <p style={{ color: O.textMuted, textAlign: 'center', padding: 48 }}>
          No venues found.
        </p>
      )}

      {data.venues.map((v, i) => (
        <motion.div
          key={v.id}
          custom={i}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -4 }}
          style={{
            background: O.primary,
            borderRadius: 20,
            padding: '18px 22px',
            border: `1.5px solid ${O.primaryDark}`,
            marginBottom: 12,
            boxShadow: `0 4px 18px ${O.shadow}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            <motion.div
              whileHover={{ scale: 1.08, rotate: 5 }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 15,
                flexShrink: 0,
                background: 'rgba(255,255,255,0.25)',
                border: '1px solid rgba(255,255,255,0.30)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <VenueIcon type={v.type} size={21} color={O.white} />
            </motion.div>

            <div style={{ flex: 1, marginLeft: 13 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 700,
                  color: O.white,
                  fontFamily: 'Playfair Display, serif',
                }}
              >
                {v.name}
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.70)' }}>
                {v.address}
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                background: 'rgba(255,255,255,0.20)',
                border: '1px solid rgba(255,255,255,0.30)',
                padding: '7px 16px',
                borderRadius: 40,
              }}
            >
              <span
                style={{
                  fontSize: 19,
                  fontWeight: 800,
                  color: O.white,
                  fontFamily: 'Playfair Display, serif',
                }}
              >
                {fmtCurrency(v.earnings[p])}
              </span>
            </motion.div>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                height: 6,
                background: 'rgba(255,255,255,0.20)',
                borderRadius: 5,
                overflow: 'hidden',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    v.slots.total
                      ? (v.slots.booked / v.slots.total) * 100
                      : 0
                  }%`,
                }}
                transition={{ duration: 1.2, ease: [0.25, 0.25, 0, 1] }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.90), rgba(255,255,255,0.45))',
                  borderRadius: 4,
                }}
              />
            </div>
          </div>

          {/* Slot stats */}
          <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            {[
              { label: 'Booked',    val: v.slots.booked,    color: O.white },
              { label: 'Available', val: v.slots.available, color: 'rgba(255,255,255,0.80)' },
              { label: 'Total',     val: v.slots.total,     color: 'rgba(255,255,255,0.60)' },
            ].map(item => (
              <motion.div key={item.label} whileHover={{ scale: 1.05 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 800,
                    color: item.color,
                    fontFamily: 'Playfair Display, serif',
                  }}
                >
                  {item.val}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 10,
                    color: 'rgba(255,255,255,0.65)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  {item.label}
                </p>
              </motion.div>
            ))}

            {v.monthlyChargeEnabled && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  background: 'rgba(255,255,255,0.20)',
                  padding: '4px 12px',
                  borderRadius: 40,
                  border: '1px solid rgba(255,255,255,0.30)',
                }}
              >
                <Repeat size={10} color={O.white} />
                <span style={{ fontSize: 11, fontWeight: 700, color: O.white }}>
                  {v.activeMonthlySubscriptions} monthly
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}

      {/* ── Bottom MRR Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7, ease: [0.25, 0.25, 0, 1] }}
        whileHover={{ scale: 1.01 }}
        style={{
          background: `linear-gradient(135deg, ${O.primaryBg} 0%, rgba(255,166,41,0.04) 100%)`,
          border: `1.5px solid rgba(255,166,41,0.30)`,
          borderRadius: 20,
          padding: '24px 28px',
          marginTop: 12,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              background: O.primarySoft,
              border: `1px solid ${O.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Crown size={20} color={O.primary} />
          </motion.div>

          <div>
            <p
              style={{
                fontWeight: 700,
                fontSize: 16,
                margin: 0,
                color: O.text,
                fontFamily: 'Playfair Display, serif',
              }}
            >
              Monthly Recurring Revenue
            </p>
            <p style={{ color: O.textMuted, fontSize: 12, margin: 0 }}>
              Active subscriptions across all venues
            </p>
          </div>
        </div>

        <motion.p
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: O.primary,
            letterSpacing: '-2px',
            margin: 0,
            fontFamily: 'Playfair Display, serif',
          }}
        >
          ${totalMRR.toLocaleString()}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default OverviewTab;