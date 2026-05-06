import React from 'react';
import { C, StatsData, VENUE_COLOR, VENUE_BG } from './Tokens';
import { VenueIcon, SectionLabel } from './Ui';

interface SlotsTabProps { data: StatsData; }

export const SlotsTab: React.FC<SlotsTabProps> = ({ data }) => (
  <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
    <SectionLabel>Live Slot Map</SectionLabel>
    {data.venues.map((venue, vi) => {
      const vc  = VENUE_COLOR[venue.type];
      const vbg = VENUE_BG[venue.type];
      const { booked, total } = venue.slots;
      const pct = total ? Math.round((booked / total) * 100) : 0;

      return (
        <div key={venue.id} className="card-hover fade-up" style={{
          background: C.card, borderRadius: 22, padding: '20px 24px', marginBottom: 16,
          border: `1.5px solid ${C.border}`, boxShadow: '0 2px 10px rgba(28,20,16,0.05)',
          animationDelay: `${vi * 70}ms`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <div style={{
              width: 46, height: 46, borderRadius: 14, flexShrink: 0,
              background: vbg, border: `1px solid ${vc}20`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <VenueIcon type={venue.type} size={20} color={vc} />
            </div>
            <div style={{ marginLeft: 13, flex: 1 }}>
              <p style={{
                fontSize: 16, fontWeight: 700, margin: 0,
                fontFamily: 'Playfair Display, serif',
              }}>{venue.name}</p>
              <p style={{ fontSize: 12, color: C.gray, margin: 0 }}>{venue.address}</p>
            </div>
            <div style={{
              background: `${vc}10`, border: `1px solid ${vc}20`,
              padding: '5px 14px', borderRadius: 40,
            }}>
              <span style={{ fontWeight: 700, color: vc, fontSize: 13 }}>{pct}% filled</span>
            </div>
          </div>

          {/* Slot grid */}
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 16 }}>
            {Array.from({ length: total }).map((_, i) => {
              const isMonthly = venue.monthlyChargeEnabled && i < venue.activeMonthlySubscriptions;
              const isBooked  = i < booked;
              return (
                <div key={i} style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: isMonthly ? C.brandLight : isBooked ? vbg : C.successBg,
                  border: `1.5px solid ${isMonthly ? C.brand : isBooked ? vc : C.success}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.18s',
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: isMonthly ? C.brand : isBooked ? vc : C.success,
                    opacity: isMonthly || isBooked ? 1 : 0.5,
                  }} />
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            {[
              { label: 'Booked',    color: vc        },
              { label: 'Monthly',   color: C.brand   },
              { label: 'Available', color: C.success },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: l.color }} />
                <span style={{ fontSize: 11, color: C.gray }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      );
    })}
  </div>
);

export default SlotsTab;