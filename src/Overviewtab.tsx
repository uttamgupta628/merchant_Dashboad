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
  C,
  StatsData,
  PeriodTotals,
  VENUE_COLOR,
  VENUE_BG,
  fmtCurrency,
} from './Tokens';

import {
  StatCard,
  PeriodToggle,
  VenueIcon,
  SectionLabel,
} from './Ui';

interface OverviewTabProps {
  data: StatsData;
  period: string;
  onPeriodChange: (p: string) => void;
}

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },

  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,

    transition: {
      delay: i * 0.08,
      duration: 0.6,
      ease: [0.25, 0.25, 0, 1],
    },
  }),
};

export const OverviewTab: React.FC<OverviewTabProps> = ({
  data,
  period,
  onPeriodChange,
}) => {
  const totalMRR = data.venues
    .filter(v => v.monthlyChargeEnabled)
    .reduce(
      (s, v) => s + v.monthlyRate * v.activeMonthlySubscriptions,
      0
    );

  const p = period as keyof PeriodTotals;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      style={{
        maxWidth: 1280,
        margin: '0 auto',
        width: '100%',
      }}
    >
      <PeriodToggle
        period={period}
        onChange={onPeriodChange}
      />

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(210px,1fr))',
          gap: 16,
          marginBottom: 26,
        }}
      >
        {[
          {
            label: 'Total Revenue',
            value: fmtCurrency(data.totalEarnings[p]),
            color: C.brand,
            sub: period,
            Icon: DollarSign,
            trend: '+12.4%',
          },

          {
            label: 'Total Bookings',
            value: String(data.totalBookings[p]),
            color: C.parking,
            sub: period,
            Icon: CalendarDays,
            trend: '+8.1%',
          },

          {
            label: 'Monthly MRR',
            value: `$${totalMRR.toLocaleString()}`,
            color: C.purple,
            sub: 'Recurring',
            Icon: Repeat,
          },

          {
            label: 'Active Venues',
            value: String(data.venues.length),
            color: C.success,
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
            whileHover={{
              y: -6,
              scale: 1.02,
            }}
          >
            <StatCard {...item} />
          </motion.div>
        ))}
      </div>

      {/* Revenue Cards */}
      <div
        style={{
          display: 'flex',
          gap: 14,
          marginBottom: 26,
          flexWrap: 'wrap',
        }}
      >
        {(['parking', 'garage', 'residence'] as const).map(
          (type, i) => {
            const total = data.venues
              .filter(v => v.type === type)
              .reduce(
                (s, v) => s + v.earnings[p],
                0
              );

            return (
              <motion.div
                key={type}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                whileHover={{
                  y: -5,
                  scale: 1.02,
                }}
                style={{
                  flex: 1,
                  background: C.card,
                  borderRadius: 18,
                  padding: '16px 20px',
                  border: `1.5px solid ${C.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 13,
                  minWidth: 140,
                  boxShadow:
                    '0 2px 8px rgba(28,20,16,0.05)',
                }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                  }}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 13,
                    background: VENUE_BG[type],
                    border: `1px solid ${VENUE_COLOR[type]}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <VenueIcon
                    type={type}
                    size={19}
                    color={VENUE_COLOR[type]}
                  />
                </motion.div>

                <div>
                  <p
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: VENUE_COLOR[type],
                      margin: 0,
                      fontFamily:
                        'Playfair Display, serif',
                    }}
                  >
                    {fmtCurrency(total)}
                  </p>

                  <p
                    style={{
                      fontSize: 11,
                      color: C.gray,
                      margin: 0,
                      textTransform: 'capitalize',
                    }}
                  >
                    {type}s revenue
                  </p>
                </div>
              </motion.div>
            );
          }
        )}
      </div>

      {/* Venue Section */}
      <SectionLabel>Your Venues</SectionLabel>

      {data.venues.length === 0 && (
        <p
          style={{
            color: C.gray,
            textAlign: 'center',
            padding: 48,
          }}
        >
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
          whileHover={{
            y: -4,
          }}
          style={{
            background: C.card,
            borderRadius: 20,
            padding: '18px 22px',
            border: `1.5px solid ${C.border}`,
            marginBottom: 12,
            boxShadow:
              '0 2px 8px rgba(28,20,16,0.04)',
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
              whileHover={{
                scale: 1.08,
                rotate: 5,
              }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 15,
                flexShrink: 0,
                background: VENUE_BG[v.type],
                border: `1px solid ${VENUE_COLOR[v.type]}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <VenueIcon
                type={v.type}
                size={21}
                color={VENUE_COLOR[v.type]}
              />
            </motion.div>

            <div
              style={{
                flex: 1,
                marginLeft: 13,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 700,
                  fontFamily:
                    'Playfair Display, serif',
                }}
              >
                {v.name}
              </p>

              <p
                style={{
                  margin: '2px 0 0',
                  fontSize: 12,
                  color: C.gray,
                }}
              >
                {v.address}
              </p>
            </div>

            <motion.div
              whileHover={{
                scale: 1.05,
              }}
              style={{
                background: `${VENUE_COLOR[v.type]}10`,
                border: `1px solid ${VENUE_COLOR[v.type]}20`,
                padding: '7px 16px',
                borderRadius: 40,
              }}
            >
              <span
                style={{
                  fontSize: 19,
                  fontWeight: 800,
                  color: VENUE_COLOR[v.type],
                  fontFamily:
                    'Playfair Display, serif',
                }}
              >
                {fmtCurrency(v.earnings[p])}
              </span>
            </motion.div>
          </div>

          {/* Animated Progress */}
          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                height: 6,
                background: C.bgDeep,
                borderRadius: 5,
                overflow: 'hidden',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    v.slots.total
                      ? (v.slots.booked /
                          v.slots.total) *
                        100
                      : 0
                  }%`,
                }}
                transition={{
                  duration: 1.2,
                  ease: [0.25, 0.25, 0, 1],
                }}
                style={{
                  height: '100%',
                  background: `linear-gradient(
                    90deg,
                    ${VENUE_COLOR[v.type]},
                    ${VENUE_COLOR[v.type]}80
                  )`,
                  borderRadius: 4,
                }}
              />
            </div>
          </div>

          {/* Stats */}
          <div
            style={{
              display: 'flex',
              gap: 18,
              alignItems: 'center',
            }}
          >
            {[
              {
                label: 'Booked',
                val: v.slots.booked,
                color: VENUE_COLOR[v.type],
              },

              {
                label: 'Available',
                val: v.slots.available,
                color: C.success,
              },

              {
                label: 'Total',
                val: v.slots.total,
                color: C.gray,
              },
            ].map(item => (
              <motion.div
                key={item.label}
                whileHover={{
                  scale: 1.05,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 800,
                    color: item.color,
                    fontFamily:
                      'Playfair Display, serif',
                  }}
                >
                  {item.val}
                </p>

                <p
                  style={{
                    margin: 0,
                    fontSize: 10,
                    color: C.gray,
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
                whileHover={{
                  scale: 1.05,
                }}
                style={{
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  background: C.brandLight,
                  padding: '4px 12px',
                  borderRadius: 40,
                  border: `1px solid ${C.brand}20`,
                }}
              >
                <Repeat
                  size={10}
                  color={C.brand}
                />

                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.brand,
                  }}
                >
                  {v.activeMonthlySubscriptions} monthly
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}

      {/* Bottom Banner */}
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
          delay: 0.5,
          duration: 0.7,
          ease: [0.25, 0.25, 0, 1],
        }}
        whileHover={{
          scale: 1.01,
        }}
        style={{
          background: `linear-gradient(
            135deg,
            ${C.brandLight} 0%,
            rgba(184,134,11,0.04) 100%
          )`,
          border: `1.5px solid rgba(184,134,11,0.22)`,
          borderRadius: 20,
          padding: '24px 28px',
          marginTop: 12,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 16,
            alignItems: 'center',
          }}
        >
          <motion.div
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
            }}
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              background: C.brandLight,
              border: `1px solid ${C.brand}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Crown
              size={20}
              color={C.brand}
            />
          </motion.div>

          <div>
            <p
              style={{
                fontWeight: 700,
                fontSize: 16,
                margin: 0,
                fontFamily:
                  'Playfair Display, serif',
              }}
            >
              Monthly Recurring Revenue
            </p>

            <p
              style={{
                color: C.gray,
                fontSize: 12,
                margin: 0,
              }}
            >
              Active subscriptions across all venues
            </p>
          </div>
        </div>

        <motion.p
          animate={{
            scale: [1, 1.04, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
          }}
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: C.brand,
            letterSpacing: '-2px',
            margin: 0,
            fontFamily:
              'Playfair Display, serif',
          }}
        >
          ${totalMRR.toLocaleString()}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default OverviewTab;