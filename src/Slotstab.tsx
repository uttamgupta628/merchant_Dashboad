import React, { useState } from 'react';
import { StatsData } from './Tokens';
import { VenueIcon } from './Ui';

interface SlotsTabProps { data: StatsData; }

const O = {
  primary:     '#FFA629',
  primaryBg:   'rgba(255,166,41,0.10)',
  primaryBorder:'rgba(255,166,41,0.55)',
  card:        '#FFFFFF',
  cardBorder:  'rgba(255,166,41,0.50)',
  text:        '#1A0F00',
  muted:       '#8A7560',
  slotBooked:  '#4B9EFF',   // blue dot — booked
  slotMonthly: '#FFA629',   // orange dot — monthly
  slotAvail:   '#D1D5DB',   // grey dot — available
  success:     '#22C55E',
  pillBg:      'rgba(255,166,41,0.12)',
  pillActiveBg:'#FFA629',
  pillText:    '#FFA629',
  pillActiveText:'#FFFFFF',
};

// Filter definitions — each has a label and a predicate on fill %
const FILTERS = [
  { label: 'All',         test: (_pct: number) => true          },
  { label: '0% filled',   test: (pct: number)  => pct === 0     },
  { label: '≤25% filled', test: (pct: number)  => pct > 0 && pct <= 25  },
  { label: '≤50% filled', test: (pct: number)  => pct > 25 && pct <= 50 },
  { label: '>50% filled', test: (pct: number)  => pct > 50      },
];

export const SlotsTab: React.FC<SlotsTabProps> = ({ data }) => {
  const [activeFilter, setActiveFilter] = useState(0);

  // compute pct per venue once, then filter
  const venuesWithPct = data.venues.map(v => ({
    ...v,
    pct: v.slots.total ? Math.round((v.slots.booked / v.slots.total) * 100) : 0,
  }));

  const filtered = venuesWithPct.filter(v => FILTERS[activeFilter].test(v.pct));

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>

      {/* ── Filter Pills ── */}
      <div
        style={{
          display: 'inline-flex',
          gap: 6,
          background: O.primaryBg,
          border: `1.5px solid ${O.primaryBorder}`,
          borderRadius: 40,
          padding: '6px 8px',
          marginBottom: 28,
          flexWrap: 'wrap',
        }}
      >
        {FILTERS.map((f, i) => (
          <button
            key={f.label}
            onClick={() => setActiveFilter(i)}
            style={{
              padding: '5px 16px',
              borderRadius: 30,
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 700,
              background: activeFilter === i ? O.pillActiveBg : 'transparent',
              color: activeFilter === i ? O.pillActiveText : O.pillText,
              transition: 'all 0.2s ease',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── 3-column Card Grid ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
        }}
      >
        {filtered.length === 0 && (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '48px 0',
            color: O.muted,
            fontSize: 14,
          }}>
            No venues match this filter.
          </div>
        )}

        {filtered.map((venue, vi) => {
          const { booked, total } = venue.slots;
          const pct = venue.pct;

          return (
            <div
              key={venue.id}
              style={{
                background: O.card,
                borderRadius: 18,
                padding: '18px 20px 16px',
                border: `1.5px solid ${O.cardBorder}`,
                boxShadow: '0 2px 12px rgba(255,142,0,0.07)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(255,142,0,0.16)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(255,142,0,0.07)';
              }}
            >
              {/* ── Header ── */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                {/* Icon badge */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 13,
                    background: O.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(255,166,41,0.35)',
                  }}
                >
                  <VenueIcon type={venue.type} size={20} color="#FFFFFF" />
                </div>

                {/* Name + address */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 15,
                      fontWeight: 700,
                      color: O.text,
                      fontFamily: 'Playfair Display, serif',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {venue.name}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: O.muted }}>{venue.address}</p>
                </div>
              </div>

              {/* ── Slot dot grid ── */}
              <div
                style={{
                  display: 'flex',
                  gap: 6,
                  flexWrap: 'wrap',
                  marginBottom: 14,
                }}
              >
                {Array.from({ length: total }).map((_, i) => {
                  const isMonthly = venue.monthlyChargeEnabled && i < venue.activeMonthlySubscriptions;
                  const isBooked  = i < booked;
                  const dotColor  = isMonthly ? O.slotMonthly : isBooked ? O.slotBooked : O.slotAvail;

                  return (
                    <div
                      key={i}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: isBooked || isMonthly
                          ? `${dotColor}18`
                          : '#F3F4F6',
                        border: `1.5px solid ${isBooked || isMonthly ? dotColor + '40' : '#E5E7EB'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: 9,
                          height: 9,
                          borderRadius: '50%',
                          background: dotColor,
                          opacity: isBooked || isMonthly ? 1 : 0.4,
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* ── Legend ── */}
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                {[
                  { label: 'Booked',    color: O.slotBooked   },
                  { label: 'Monthly',   color: O.slotMonthly  },
                  { label: 'Available', color: O.success       },
                ].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: l.color,
                      }}
                    />
                    <span style={{ fontSize: 11, color: O.muted, fontWeight: 500 }}>
                      {l.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SlotsTab;