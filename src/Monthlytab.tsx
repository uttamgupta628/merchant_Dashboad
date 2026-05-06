import React from 'react';
import { Gift } from 'lucide-react';
import { C, StatsData, VENUE_COLOR, VENUE_BG } from './Tokens';
import { VenueIcon } from './Ui';

interface MonthlyTabProps { data: StatsData; }

export const MonthlyTab: React.FC<MonthlyTabProps> = ({ data }) => {
  const totalMRR  = data.venues.filter(v => v.monthlyChargeEnabled)
    .reduce((s, v) => s + v.monthlyRate * v.activeMonthlySubscriptions, 0);
  const totalSubs = data.venues.filter(v => v.monthlyChargeEnabled)
    .reduce((s, v) => s + v.activeMonthlySubscriptions, 0);
  const monthlyVenues = data.venues.filter(v => v.monthlyChargeEnabled);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
      {/* MRR Hero */}
      <div className="fade-up" style={{
        background: `linear-gradient(135deg, ${C.brandLight} 0%, rgba(184,134,11,0.03) 100%)`,
        border: `1.5px solid rgba(184,134,11,0.22)`,
        borderRadius: 22, padding: '28px 34px', marginBottom: 24,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 4px 20px rgba(184,134,11,0.08)',
        animation: 'borderPulse 5s ease-in-out infinite',
      }}>
        <div>
          <p style={{
            fontSize: 10, fontWeight: 700, color: C.gray,
            letterSpacing: '2.2px', margin: 0, textTransform: 'uppercase',
          }}>Total Monthly Recurring</p>
          <p style={{
            fontSize: 52, fontWeight: 800, color: C.brand,
            letterSpacing: '-2.5px', margin: '4px 0',
            fontFamily: 'Playfair Display, serif',
          }}>${totalMRR.toLocaleString()}</p>
          <p style={{ fontSize: 13, color: C.gray, margin: 0 }}>{totalSubs} active subscribers</p>
        </div>
        <div style={{
          width: 64, height: 64, borderRadius: 22,
          background: C.brandLight, border: `1.5px solid ${C.brand}20`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Gift size={28} color={C.brand} />
        </div>
      </div>

      {monthlyVenues.length === 0 && (
        <p style={{ color: C.gray, textAlign: 'center', padding: 48 }}>
          No venues with monthly billing.
        </p>
      )}

      {monthlyVenues.map((v, i) => (
        <div key={v.id} className="card-hover fade-up" style={{
          background: C.card, borderRadius: 20, padding: '20px 24px',
          border: `1.5px solid ${C.border}`, marginBottom: 14,
          boxShadow: '0 2px 10px rgba(28,20,16,0.05)',
          animationDelay: `${i * 70}ms`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 13, flexShrink: 0,
              background: VENUE_BG[v.type], border: `1px solid ${VENUE_COLOR[v.type]}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <VenueIcon type={v.type} size={19} color={VENUE_COLOR[v.type]} />
            </div>
            <div style={{ flex: 1, marginLeft: 13 }}>
              <p style={{
                fontWeight: 700, fontSize: 16, margin: 0,
                fontFamily: 'Playfair Display, serif',
              }}>{v.name}</p>
              <p style={{ fontSize: 12, color: C.gray, margin: 0, textTransform: 'capitalize' }}>
                {v.type}
              </p>
            </div>
            <div>
              <span style={{
                fontSize: 30, fontWeight: 800, color: C.brand,
                fontFamily: 'Playfair Display, serif',
              }}>${v.monthlyRate}</span>
              <span style={{ fontSize: 12, color: C.gray }}>/mo</span>
            </div>
          </div>

          <div style={{
            display: 'flex', background: C.bgDeep, borderRadius: 14,
            padding: '13px 20px', gap: 20, justifyContent: 'space-around',
            border: `1px solid ${C.border}`,
          }}>
            {[
              { val: v.activeMonthlySubscriptions, label: 'Active Subs', color: C.text },
              { val: `$${v.monthlyRate * v.activeMonthlySubscriptions}`, label: 'MRR', color: C.brand },
              { val: `${v.slots.booked}/${v.slots.total}`, label: 'Slots Used', color: C.teal },
            ].map(item => (
              <div key={item.label} style={{ textAlign: 'center' }}>
                <p style={{
                  fontSize: 24, fontWeight: 800, margin: 0, color: item.color,
                  fontFamily: 'Playfair Display, serif',
                }}>{item.val}</p>
                <p style={{ fontSize: 11, color: C.gray, margin: 0 }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MonthlyTab;