import React, { useState } from 'react';
import { ShoppingBag, CheckCircle, Truck, Clock, Star } from 'lucide-react';
import { useDryStats } from './Hooks';
import {
  C, PeriodTotals, STATUS_META,
} from './Tokens';
import { Spinner, ErrorBanner } from './Ui';
import { TrendingUp, BarChart2, MapPin } from 'lucide-react';

interface DryCleaningTabProps { token?: string; }

const ORANGE = '#FFA629';
const ORANGE_LIGHT = '#FF8E0033';
const ORANGE_BORDER = '#FFA62940';

const STATUS_ICONS: Record<string, React.FC<any>> = {
  pending: Clock, in_progress: Truck,
  ready_for_delivery: CheckCircle, completed: CheckCircle,
};

const STAT_ICONS = [TrendingUp, ShoppingBag, BarChart2, MapPin];

export const DryCleaningTab: React.FC<DryCleaningTabProps> = ({ token }) => {
  const { data, loading, error, refetch } = useDryStats(token);
  const [period, setPeriod] = useState('weekly');
  const [view, setView]     = useState('overview');

  if (loading) return <Spinner />;
  if (error || !data) return <ErrorBanner msg={error ?? 'No data'} onRetry={refetch} />;

  const p      = period as keyof PeriodTotals;
  const maxCat = data.categoryBreakdown[0]?.totalRevenue || 1;

  const PERIODS = ['daily', 'weekly', 'monthly'];
  const VIEWS   = ['overview', 'orders', 'analytics'];

  const statCards = [
    { label: 'Revenue',   value: `$${data.totalEarnings[p]}`,          sub: 'This Week',  pct: '+12.4%', icon: TrendingUp },
    { label: 'Orders',    value: String(data.totalBookings[p]),         sub: 'This Week',  pct: null,      icon: ShoppingBag },
    { label: 'Avg Order', value: `$${data.overallStats.avgOrderValue}`, sub: null,         pct: null,      icon: BarChart2 },
    { label: 'Shops',     value: String(data.overallStats.totalShops),  sub: null,         pct: null,      icon: MapPin },
  ];

  return (
    <>
      <style>{`
        .dc-wrap { max-width: 1280px; margin: 0 auto; width: 100%; }

        /* pill row */
        .pill-row { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
        .pill-btn {
          padding: 8px 22px; border-radius: 24px; font-size: 13px; font-weight: 600;
          cursor: pointer; border: 1.5px solid #ddd; background: #fff; color: #333;
          transition: all 0.15s;
        }
        .pill-btn.active {
          background: ${ORANGE}; border-color: ${ORANGE}; color: #fff;
          box-shadow: 0 3px 10px rgba(255,166,41,0.30);
        }

        /* stat cards grid */
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px; margin-bottom: 20px;
        }
        @media (max-width: 900px) { .stat-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px) { .stat-grid { grid-template-columns: 1fr 1fr; } }

        .stat-card {
          background: ${ORANGE_LIGHT};
          border: 1.5px solid ${ORANGE_BORDER};
          border-radius: 16px; padding: 16px;
          display: flex; justify-content: space-between; align-items: flex-start;
          box-sizing: border-box;
        }
        .stat-card-label { font-size: 10px; font-weight: 700; color: #999; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 4px; }
        .stat-card-value { font-size: 26px; font-weight: 800; color: #1a1a1a; margin: 0; font-family: 'Playfair Display', serif; }
        .stat-card-sub   { font-size: 11px; color: #aaa; margin: 2px 0 0; }
        .stat-card-pct   { font-size: 11px; color: #22c55e; font-weight: 600; margin: 0; }
        .stat-icon-wrap  {
          width: 38px; height: 38px; border-radius: 50%;
          background: ${ORANGE}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }

        /* top categories */
        .cat-card {
          background: ${ORANGE};
          border-radius: 20px; padding: 20px 24px; margin-bottom: 22px;
        }
        .cat-title { font-weight: 700; font-size: 16px; color: #fff; margin: 0 0 16px; font-family: 'Playfair Display', serif; }
        .cat-row   { margin-bottom: 14px; }
        .cat-row-top { display: flex; justify-content: space-between; margin-bottom: 6px; }
        .cat-name  { font-size: 14px; font-weight: 600; color: #fff; }
        .cat-val   { font-size: 14px; font-weight: 700; color: #fff; }
        .cat-bar-bg { height: 6px; background: rgba(255,255,255,0.25); border-radius: 4; overflow: hidden; }
        .cat-bar-fill { height: 6px; background: #1a1a1a; border-radius: 4; transition: width 1s ease; }

        /* shops */
        .shop-section-label { font-size: 12px; font-weight: 700; color: #999; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 12px; }

        .shop-card {
          background: ${ORANGE_LIGHT};
          border: 1.5px solid ${ORANGE_BORDER};
          border-radius: 18px; margin-bottom: 14px;
          overflow: hidden; box-sizing: border-box;
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .shop-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255,166,41,0.18); }
        .shop-card-header {
          padding: 16px 20px;
          display: flex; align-items: center; gap: 13;
        }
        .shop-avatar {
          width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0;
          background: ${ORANGE}; color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 18px; font-family: 'Playfair Display', serif;
        }
        .shop-name { font-weight: 700; font-size: 15px; margin: 0; color: #1a1a1a; font-family: 'Playfair Display', serif; }
        .shop-sub  { font-size: 11px; color: #aaa; margin: 0; }
        .shop-earnings { font-size: 22px; font-weight: 800; color: #22c55e; margin: 0; font-family: 'Playfair Display', serif; }

        .shop-stats {
          display: flex; background: rgba(255,255,255,0.5);
          border-top: 1px solid ${ORANGE_BORDER};
          padding: 10px 0; justify-content: space-around;
        }
        .shop-stat { text-align: center; flex: 1; }
        .shop-stat + .shop-stat { border-left: 1px solid rgba(255,166,41,0.2); }
        .shop-stat-val { font-size: 18px; font-weight: 800; color: #1a1a1a; margin: 0; font-family: 'Playfair Display', serif; }
        .shop-stat-label { font-size: 10px; color: #999; margin: 0; }

        /* orders */
        .orders-wrap { background: #fff; border-radius: 22px; border: 1.5px solid #eee; overflow: hidden; }
        .order-row { display: flex; align-items: center; gap: 13px; padding: 14px 20px; border-bottom: 1px solid #f5f0ea; }
        .order-row:last-child { border-bottom: none; }
        .order-icon { width: 38px; height: 38px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

        /* analytics */
        .analytics-wrap { background: #fff; border-radius: 22px; padding: 24px; border: 1.5px solid #eee; }
        .analytics-title { font-weight: 700; margin-bottom: 20px; font-size: 15px; font-family: 'Playfair Display', serif; }
        .analytics-row { margin-bottom: 16px; }
        .analytics-row-top { display: flex; align-items: center; gap: 11px; margin-bottom: 6px; }
        .analytics-icon { width: 32px; height: 32px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .analytics-bar-bg { height: 5px; background: #f5f0ea; border-radius: 4px; overflow: hidden; }
        .analytics-bar-fill { height: 5px; border-radius: 4px; transition: width 1s ease; }
      `}</style>

      <div className="dc-wrap">
        {/* Sub-nav pills */}
        <div className="pill-row">
          {VIEWS.map(v => (
            <button key={v} className={`pill-btn${view === v ? ' active' : ''}`} onClick={() => setView(v)}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {view === 'overview' && <>
          {/* Period toggle */}
          <div className="pill-row" style={{ marginBottom: 20 }}>
            {PERIODS.map(pp => (
              <button key={pp} className={`pill-btn${period === pp ? ' active' : ''}`} onClick={() => setPeriod(pp)}>
                {pp.charAt(0).toUpperCase() + pp.slice(1)}
              </button>
            ))}
          </div>

          {/* Stat cards */}
          <div className="stat-grid">
            {statCards.map((s, i) => (
              <div key={s.label} className="stat-card">
                <div>
                  <p className="stat-card-label">{s.label}</p>
                  <p className="stat-card-value">{s.value}</p>
                  {s.sub && <p className="stat-card-sub">{s.sub}</p>}
                  {s.pct && <p className="stat-card-pct">● {s.pct}</p>}
                </div>
                <div className="stat-icon-wrap">
                  <s.icon size={17} color="#fff" />
                </div>
              </div>
            ))}
          </div>

          {/* Top Categories */}
          <div className="cat-card">
            <p className="cat-title">Top Categories</p>
            {data.categoryBreakdown.map((item) => {
              const pct = (item.totalRevenue / maxCat) * 100;
              return (
                <div key={item.category} className="cat-row">
                  <div className="cat-row-top">
                    <span className="cat-name">{item.category}</span>
                    <span className="cat-val">${item.totalRevenue}</span>
                  </div>
                  <div className="cat-bar-bg">
                    <div className="cat-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Your Shops */}
          <p className="shop-section-label">Your Shops</p>
          {data.shops.map((shop) => (
            <div key={shop.id} className="shop-card">
              <div className="shop-card-header" style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '16px 20px' }}>
                <div className="shop-avatar">{shop.shopname?.[0] ?? 'S'}</div>
                <div style={{ flex: 1 }}>
                  <p className="shop-name">{shop.shopname}</p>
                  <p className="shop-sub">{shop.address?.street ?? ''}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p className="shop-earnings">${shop.earnings[p]}</p>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 3, marginTop: 2 }}>
                    <Star size={11} fill="#FFA629" color="#FFA629" />
                    <span style={{ fontSize: 11, color: '#aaa' }}>{shop.rating}</span>
                  </div>
                </div>
              </div>
              <div className="shop-stats">
                {Object.entries(shop.orderStatus).map(([k, val]) => (
                  <div key={k} className="shop-stat">
                    <p className="shop-stat-val">{val as React.ReactNode}</p>
                    <p className="shop-stat-label" style={{ textTransform: 'capitalize' }}>{k}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>}

        {/* ── Orders ── */}
        {view === 'orders' && (
          <div className="orders-wrap">
            {data.recentOrders.length === 0 && (
              <p style={{ color: '#aaa', textAlign: 'center', padding: 48 }}>No recent orders.</p>
            )}
            {data.recentOrders.map(o => {
              const meta = STATUS_META[o.status] || STATUS_META.pending;
              const Icon = STATUS_ICONS[o.status] || Clock;
              return (
                <div key={o._id} className="order-row">
                  <div className="order-icon" style={{ background: meta.bg, border: `1px solid ${meta.color}20` }}>
                    <Icon size={16} color={meta.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, margin: 0, fontSize: 14 }}>{o.orderNumber}</p>
                    <p style={{ fontSize: 12, color: '#aaa', margin: 0 }}>{o.customerName} · {o.itemCount} items</p>
                  </div>
                  <span style={{ fontWeight: 700, color: ORANGE, fontSize: 15 }}>${o.totalAmount}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Analytics ── */}
        {view === 'analytics' && (
          <div className="analytics-wrap">
            <p className="analytics-title">Order Status Flow</p>
            {data.statusBreakdown.map(item => {
              const meta  = STATUS_META[item.status] || STATUS_META.pending;
              const Icon  = STATUS_ICONS[item.status] || Clock;
              const total = data.statusBreakdown.reduce((s, b) => s + b.count, 0);
              const pct   = Math.round((item.count / total) * 100);
              return (
                <div key={item.status} className="analytics-row">
                  <div className="analytics-row-top">
                    <div className="analytics-icon" style={{ background: meta.bg, border: `1px solid ${meta.color}20` }}>
                      <Icon size={13} color={meta.color} />
                    </div>
                    <span style={{ flex: 1, fontWeight: 500, fontSize: 14 }}>{meta.label}</span>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{item.count}</span>
                  </div>
                  <div className="analytics-bar-bg">
                    <div className="analytics-bar-fill" style={{ width: `${pct}%`, background: meta.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default DryCleaningTab;