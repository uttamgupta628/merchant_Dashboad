import React from 'react';
import { Gift } from 'lucide-react';
import {  StatsData } from './Tokens';
import { VenueIcon } from './Ui';

interface MonthlyTabProps { data: StatsData; }

const ORANGE = '#FFA629';
const ORANGE_LIGHT = '#FF8E0033';
const ORANGE_BORDER = '#FFA62940';

export const MonthlyTab: React.FC<MonthlyTabProps> = ({ data }) => {
  const totalMRR  = data.venues.filter(v => v.monthlyChargeEnabled)
    .reduce((s, v) => s + v.monthlyRate * v.activeMonthlySubscriptions, 0);
  const totalSubs = data.venues.filter(v => v.monthlyChargeEnabled)
    .reduce((s, v) => s + v.activeMonthlySubscriptions, 0);
  const monthlyVenues = data.venues.filter(v => v.monthlyChargeEnabled);

  return (
    <>
      <style>{`
        .monthly-tab { max-width: 1280px; margin: 0 auto; width: 100%; padding: 0 4px; box-sizing: border-box; }

        .mrr-hero {
          background: ${ORANGE};
          border-radius: 18px;
          padding: 24px 28px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 6px 24px rgba(255,166,41,0.30);
        }
        .mrr-hero-label {
          font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.85);
          letter-spacing: 2px; margin: 0; text-transform: uppercase;
        }
        .mrr-hero-amount {
          font-size: 48px; font-weight: 800; color: #fff;
          letter-spacing: -2px; margin: 4px 0;
          font-family: 'Playfair Display', serif;
        }
        .mrr-hero-subs { font-size: 13px; color: rgba(255,255,255,0.85); margin: 0; }
        .mrr-hero-icon {
          width: 56px; height: 56px; border-radius: 16px;
          background: rgba(255,255,255,0.25);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .venue-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        @media (max-width: 900px) {
          .venue-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .venue-grid { grid-template-columns: 1fr; }
          .mrr-hero { padding: 18px 20px; }
          .mrr-hero-amount { font-size: 36px; }
        }

        .venue-card {
          background: ${ORANGE_LIGHT};
          border-radius: 18px;
          padding: 16px 18px 14px;
          border: 1.5px solid ${ORANGE_BORDER};
          box-shadow: 0 2px 10px rgba(255,166,41,0.08);
          transition: transform 0.18s, box-shadow 0.18s;
          box-sizing: border-box;
        }
        .venue-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255,166,41,0.18);
        }
        .venue-card-header {
          display: flex; align-items: center; margin-bottom: 14px; gap: 12px;
        }
        .venue-icon-wrap {
          width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0;
          background: ${ORANGE}; border: 1.5px solid rgba(255,255,255,0.3);
          display: flex; align-items: center; justify-content: center;
        }
        .venue-name {
          font-weight: 700; font-size: 15px; margin: 0; color: #1a1a1a;
          font-family: 'Playfair Display', serif;
        }
        .venue-type {
          font-size: 11px; color: #888; margin: 0; text-transform: capitalize;
        }
        .venue-rate {
          margin-left: auto; display: flex; align-items: baseline; gap: 2px; flex-shrink: 0;
        }
        .venue-rate-num {
          font-size: 22px; font-weight: 800; color: ${ORANGE};
          font-family: 'Playfair Display', serif;
        }
        .venue-rate-unit { font-size: 11px; color: #888; }

        .venue-stats {
          display: flex; background: rgba(255,255,255,0.55);
          border-radius: 12px; padding: 10px 0;
          border: 1px solid rgba(255,166,41,0.15);
          justify-content: space-around;
        }
        .stat-item { text-align: center; flex: 1; }
        .stat-item + .stat-item { border-left: 1px solid rgba(255,166,41,0.18); }
        .stat-val {
          font-size: 20px; font-weight: 800; margin: 0;
          font-family: 'Playfair Display', serif;
        }
        .stat-label { font-size: 10px; color: #888; margin: 0; }

        .empty-msg { color: #aaa; text-align: center; padding: 48px; }
      `}</style>

      <div className="monthly-tab">
        <div className="mrr-hero">
          <div>
            <p className="mrr-hero-label">Total Monthly Recurring</p>
            <p className="mrr-hero-amount">${totalMRR.toLocaleString()}</p>
            <p className="mrr-hero-subs">{totalSubs} active subscribers</p>
          </div>
          <div className="mrr-hero-icon">
            <Gift size={26} color="#fff" />
          </div>
        </div>

        {monthlyVenues.length === 0 && (
          <p className="empty-msg">No venues with monthly billing.</p>
        )}

        <div className="venue-grid">
          {monthlyVenues.map((v) => (
            <div key={v.id} className="venue-card">
              <div className="venue-card-header">
                <div className="venue-icon-wrap">
                  <VenueIcon type={v.type} size={18} color="#fff" />
                </div>
                <div>
                  <p className="venue-name">{v.name}</p>
                  <p className="venue-type">{v.type}</p>
                </div>
                <div className="venue-rate">
                  <span className="venue-rate-num">${v.monthlyRate}</span>
                  <span className="venue-rate-unit">/mo</span>
                </div>
              </div>

              <div className="venue-stats">
                {[
                  { val: v.activeMonthlySubscriptions, label: 'Active Subs', color: '#1a1a1a' },
                  { val: `$${v.monthlyRate * v.activeMonthlySubscriptions}`, label: 'MRR', color: '#FFA629' },
                  { val: `${v.slots.booked}/${v.slots.total}`, label: 'Slots Used', color: '#2aa8a0' },
                ].map(item => (
                  <div key={item.label} className="stat-item">
                    <p className="stat-val" style={{ color: item.color }}>{item.val}</p>
                    <p className="stat-label">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MonthlyTab;