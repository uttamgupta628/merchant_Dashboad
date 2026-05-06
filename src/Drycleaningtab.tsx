import React, { useState } from 'react';
import { ShoppingBag, CheckCircle, Truck, Clock, Star } from 'lucide-react';
import { useDryStats } from './Hooks';
import {
  C, PeriodTotals, CAT_COLORS, STATUS_META,
} from './Tokens';
import { Spinner, ErrorBanner, PeriodToggle, StatCard, SectionLabel } from './Ui';
import { TrendingUp, BarChart2, Layers } from 'lucide-react';

interface DryCleaningTabProps { token?: string; }

const STATUS_ICONS: Record<string, React.FC<any>> = {
  pending: Clock, in_progress: Truck,
  ready_for_delivery: CheckCircle, completed: CheckCircle,
};

export const DryCleaningTab: React.FC<DryCleaningTabProps> = ({ token }) => {
  const { data, loading, error, refetch } = useDryStats(token);
  const [period, setPeriod] = useState('weekly');
  const [view, setView]     = useState('overview');

  if (loading) return <Spinner />;
  if (error || !data) return <ErrorBanner msg={error ?? 'No data'} onRetry={refetch} />;

  const p      = period as keyof PeriodTotals;
  const maxCat = data.categoryBreakdown[0]?.totalRevenue || 1;

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
      {/* Sub-nav */}
      <div style={{ display: 'flex', gap: 9, marginBottom: 24 }}>
        {['overview', 'orders', 'analytics'].map(v => (
          <button key={v} onClick={() => setView(v)} className="filter-pill" style={{
            border: `1.5px solid ${view === v ? C.brand : C.border}`,
            background: view === v ? C.brandLight : C.card,
            color: view === v ? C.brand : C.gray,
            fontSize: 13, padding: '8px 22px',
            boxShadow: view === v ? `0 2px 8px rgba(184,134,11,0.15)` : 'none',
          }}>
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {view === 'overview' && <>
        <PeriodToggle period={period} onChange={setPeriod} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(185px,1fr))', gap: 15, marginBottom: 26 }}>
          <StatCard label="Revenue"   value={`$${data.totalEarnings[p]}`}          color={C.brand}   Icon={TrendingUp}  delay={0} />
          <StatCard label="Orders"    value={String(data.totalBookings[p])}         color={C.purple}  Icon={ShoppingBag} delay={60} />
          <StatCard label="Avg Order" value={`$${data.overallStats.avgOrderValue}`} color={C.teal}    Icon={BarChart2}   delay={120} />
          <StatCard label="Shops"     value={String(data.overallStats.totalShops)}  color={C.success} Icon={Layers}      delay={180} />
        </div>

        {/* Category bars */}
        <div className="card-hover fade-up" style={{
          background: C.card, borderRadius: 20, padding: '20px 24px', marginBottom: 22,
          border: `1.5px solid ${C.border}`, boxShadow: '0 2px 10px rgba(28,20,16,0.05)',
        }}>
          <p style={{
            fontWeight: 700, marginBottom: 16, fontSize: 14,
            fontFamily: 'Playfair Display, serif',
          }}>Top Categories</p>
          {data.categoryBreakdown.map((item, i) => {
            const pct = (item.totalRevenue / maxCat) * 100;
            const color = CAT_COLORS[i % CAT_COLORS.length];
            return (
              <div key={item.category} style={{ marginBottom: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{item.category}</span>
                  <span style={{ fontWeight: 700, color, fontSize: 13 }}>${item.totalRevenue}</span>
                </div>
                <div style={{ height: 5, background: C.bgDeep, borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    width: `${pct}%`, height: 5, background: color,
                    borderRadius: 4, transition: 'width 1s ease',
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Shops */}
        <SectionLabel>Your Shops</SectionLabel>
        {data.shops.map((shop, i) => (
          <div key={shop.id} className="card-hover fade-up" style={{
            background: C.card, borderRadius: 20, marginBottom: 14,
            border: `1.5px solid ${C.border}`, boxShadow: '0 2px 8px rgba(28,20,16,0.04)',
            animationDelay: `${i * 70}ms`,
          }}>
            <div style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 13 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 15,
                background: C.brandLight, border: `1px solid ${C.brand}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ShoppingBag size={20} color={C.brand} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontWeight: 700, fontSize: 15, margin: 0,
                  fontFamily: 'Playfair Display, serif',
                }}>{shop.shopname}</p>
                <p style={{ fontSize: 12, color: C.gray, margin: 0 }}>{shop.address.street}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{
                  fontSize: 24, fontWeight: 800, color: C.brand, margin: 0,
                  fontFamily: 'Playfair Display, serif',
                }}>${shop.earnings[p]}</p>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', justifyContent: 'flex-end', marginTop: 2 }}>
                  <Star size={11} fill={C.warning} color={C.warning} />
                  <span style={{ fontSize: 12, color: C.gray }}>{shop.rating}</span>
                </div>
              </div>
            </div>
            <div style={{
              display: 'flex', background: C.bgDeep, padding: '11px 22px',
              borderRadius: '0 0 20px 20px', gap: 14,
              justifyContent: 'space-around', borderTop: `1px solid ${C.border}`,
            }}>
              {Object.entries(shop.orderStatus).map(([k, val]) => (
                <div key={k} style={{ textAlign: 'center' }}>
                  <p style={{
                    fontSize: 20, fontWeight: 800, color: C.brand, margin: 0,
                    fontFamily: 'Playfair Display, serif',
                  }}>{val}</p>
                  <p style={{ fontSize: 10, color: C.gray, margin: 0, textTransform: 'capitalize' }}>{k}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </>}

      {/* ── Orders ── */}
      {view === 'orders' && (
        <div className="fade-in" style={{
          background: C.card, borderRadius: 22,
          border: `1.5px solid ${C.border}`, overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(28,20,16,0.06)',
        }}>
          {data.recentOrders.length === 0 && (
            <p style={{ color: C.gray, textAlign: 'center', padding: 48 }}>No recent orders.</p>
          )}
          {data.recentOrders.map(o => {
            const meta = STATUS_META[o.status] || STATUS_META.pending;
            const Icon = STATUS_ICONS[o.status] || Clock;
            return (
              <div key={o._id} className="booking-row">
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: meta.bg, border: `1px solid ${meta.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={17} color={meta.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, margin: 0, fontSize: 14 }}>{o.orderNumber}</p>
                  <p style={{ fontSize: 12, color: C.gray, margin: 0 }}>
                    {o.customerName} · {o.itemCount} items
                  </p>
                </div>
                <span style={{ fontWeight: 700, color: C.brand, fontSize: 15 }}>${o.totalAmount}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Analytics ── */}
      {view === 'analytics' && (
        <div className="fade-in card-hover" style={{
          background: C.card, borderRadius: 22, padding: '24px',
          border: `1.5px solid ${C.border}`,
          boxShadow: '0 4px 16px rgba(28,20,16,0.06)',
        }}>
          <p style={{
            fontWeight: 700, marginBottom: 20, fontSize: 14,
            fontFamily: 'Playfair Display, serif',
          }}>Order Status Flow</p>
          {data.statusBreakdown.map(item => {
            const meta  = STATUS_META[item.status] || STATUS_META.pending;
            const Icon  = STATUS_ICONS[item.status] || Clock;
            const total = data.statusBreakdown.reduce((s, b) => s + b.count, 0);
            const pct   = Math.round((item.count / total) * 100);
            return (
              <div key={item.status} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 6 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 9,
                    background: meta.bg, border: `1px solid ${meta.color}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={14} color={meta.color} />
                  </div>
                  <span style={{ flex: 1, fontWeight: 500, fontSize: 14 }}>{meta.label}</span>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{item.count}</span>
                </div>
                <div style={{ height: 5, background: C.bgDeep, borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: 5, background: meta.color, borderRadius: 4, transition: 'width 1s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DryCleaningTab;