import React, { useState, useEffect } from 'react';
import {
  RefreshCw, LayoutDashboard, Grid, List, Repeat, Shirt,
  Car, Home, Warehouse, CalendarDays, LogOut,
  TrendingUp, ShoppingBag, BarChart2, Layers, Clock,
  CheckCircle, Truck, Package, Star, ChevronRight,
  AlertCircle, Zap, Bell, ChevronLeft,
  ArrowUpRight, Activity, DollarSign, MapPin, Crown,
  Gift
} from 'lucide-react';

// ─── Design tokens ─────────────────────────────────────────────────
const C = {
  bg: '#f8f7f4',
  card: '#ffffff',
  brand: '#FF9401',
  brandDark: '#e07f00',
  brandLight: '#fff4e6',
  brandGlow: 'rgba(255,148,1,0.25)',
  text: '#1a1a1a',
  gray: '#6b7280',
  lightGray: '#f3f4f6',
  border: '#ebebeb',
  sidebar: '#0f1115',
  sidebarActive: 'rgba(255,148,1,0.18)',
  sidebarText: '#8892a4',
  success: '#22c55e', successBg: '#f0fdf4',
  warning: '#f59e0b', warningBg: '#fffbeb',
  error: '#ef4444', errorBg: '#fef2f2',
  parking: '#3b82f6', parkingBg: '#eff6ff',
  garage: '#8b5cf6', garageBg: '#f5f3ff',
  residence: '#10b981', residenceBg: '#ecfdf5',
  purple: '#8b5cf6', purpleBg: '#f5f3ff',
  teal: '#14b8a6', tealBg: '#f0fdfa',
};

const VENUE_COLOR: Record<string, string> = { parking: C.parking, garage: C.garage, residence: C.residence };
const VENUE_BG: Record<string, string> = { parking: C.parkingBg, garage: C.garageBg, residence: C.residenceBg };
const PERIOD_LABEL: Record<string, string> = { daily: 'Today', weekly: 'This Week', monthly: 'This Month' };
const CAT_COLORS = [C.brand, C.purple, C.teal, C.success, C.warning];

const fmtCurrency = (n: number): string => n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n.toFixed(0)}`;
const fmtDate = (iso: string): string => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const fmtTime = (iso: string): string => new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
const statusColor = (s: string): string => s === 'SUCCESS' ? C.success : s === 'PENDING' ? C.warning : C.error;
const statusBg = (s: string): string => s === 'SUCCESS' ? C.successBg : s === 'PENDING' ? C.warningBg : C.errorBg;

const STATUS_META: Record<string, { label: string; color: string; bg: string; Icon: any }> = {
  pending: { label: 'Pending', color: C.warning, bg: C.warningBg, Icon: Clock },
  in_progress: { label: 'In Progress', color: C.purple, bg: C.purpleBg, Icon: Truck },
  ready_for_delivery: { label: 'Ready', color: C.success, bg: C.successBg, Icon: CheckCircle },
  completed: { label: 'Completed', color: C.success, bg: C.successBg, Icon: CheckCircle },
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_DATA = {
  totalEarnings: { daily: 1240, weekly: 8450, monthly: 32800 },
  totalBookings: { daily: 23, weekly: 156, monthly: 612 },
  venues: [
    { id: '1', name: 'Central Park Lot', address: '120 5th Ave, New York', type: 'parking' as const, earnings: { daily: 520, weekly: 3200, monthly: 12400 }, slots: { booked: 18, available: 7, total: 25 }, monthlyChargeEnabled: true, monthlyRate: 180, activeMonthlySubscriptions: 8, recentBookings: [] },
    { id: '2', name: 'Westside Garage', address: '88 Broadway, Manhattan', type: 'garage' as const, earnings: { daily: 380, weekly: 2800, monthly: 11200 }, slots: { booked: 12, available: 8, total: 20 }, monthlyChargeEnabled: true, monthlyRate: 220, activeMonthlySubscriptions: 5, recentBookings: [] },
    { id: '3', name: 'Harbor View Residence', address: '44 Pier St, Brooklyn', type: 'residence' as const, earnings: { daily: 340, weekly: 2450, monthly: 9200 }, slots: { booked: 6, available: 4, total: 10 }, monthlyChargeEnabled: false, monthlyRate: 0, activeMonthlySubscriptions: 0, recentBookings: [] }
  ],
  recentBookings: [
    { _id: '1', customerName: 'Marcus Johnson', type: 'parking' as const, slot: 'A-12', amount: 45, status: 'SUCCESS' as const, isMonthly: false, from: new Date(Date.now() - 3600000).toISOString(), to: new Date(Date.now() + 3600000).toISOString() },
    { _id: '2', customerName: 'Sarah Chen', type: 'garage' as const, slot: 'B-04', amount: 120, status: 'SUCCESS' as const, isMonthly: true, from: new Date(Date.now() - 86400000).toISOString(), to: new Date(Date.now() + 86400000 * 28).toISOString() },
    { _id: '3', customerName: 'David Park', type: 'parking' as const, slot: 'A-07', amount: 35, status: 'PENDING' as const, isMonthly: false, from: new Date(Date.now() + 3600000).toISOString(), to: new Date(Date.now() + 7200000).toISOString() },
    { _id: '4', customerName: 'Emma Wilson', type: 'residence' as const, slot: 'R-02', amount: 200, status: 'SUCCESS' as const, isMonthly: true, from: new Date(Date.now() - 86400000 * 5).toISOString(), to: new Date(Date.now() + 86400000 * 25).toISOString() },
  ]
};

const MOCK_DRY = {
  totalEarnings: { daily: 320, weekly: 2100, monthly: 8400 },
  totalBookings: { daily: 8, weekly: 54, monthly: 218 },
  overallStats: { avgOrderValue: 38, totalShops: 2 },
  statusBreakdown: [
    { status: 'pending', count: 4 },
    { status: 'in_progress', count: 7 },
    { status: 'ready_for_delivery', count: 3 },
    { status: 'completed', count: 40 },
  ],
  categoryBreakdown: [
    { category: 'Suits & Formalwear', totalRevenue: 3200, totalOrders: 84, totalItems: 168 },
    { category: 'Everyday Clothing', totalRevenue: 2100, totalOrders: 55, totalItems: 220 },
    { category: 'Bedding & Linens', totalRevenue: 1600, totalOrders: 40, totalItems: 80 },
    { category: 'Leather & Specialty', totalRevenue: 980, totalOrders: 26, totalItems: 30 },
  ],
  shops: [
    { id: 's1', shopname: 'FreshPress Cleaners', address: { street: '200 Lexington Ave', city: 'New York' }, earnings: { daily: 180, weekly: 1200, monthly: 4800 }, rating: 4.8, orderStatus: { pending: 3, active: 4, readyForDelivery: 2, paid: 28 } },
    { id: 's2', shopname: 'SteamMaster NYC', address: { street: '55 Park Ave', city: 'Manhattan' }, earnings: { daily: 140, weekly: 900, monthly: 3600 }, rating: 4.5, orderStatus: { pending: 1, active: 3, readyForDelivery: 1, paid: 12 } }
  ],
  recentOrders: [
    { _id: 'o1', orderNumber: 'ORD-2401', customerName: 'Alice Brown', itemCount: 4, totalAmount: 76, status: 'in_progress' },
    { _id: 'o2', orderNumber: 'ORD-2402', customerName: 'Bob Smith', itemCount: 2, totalAmount: 38, status: 'ready_for_delivery' },
    { _id: 'o3', orderNumber: 'ORD-2403', customerName: 'Carol Davis', itemCount: 6, totalAmount: 114, status: 'pending' },
  ]
};

// ─── Helper Components ────────────────────────────────────────────────────────
const VenueIcon = ({ type, size = 18, color }: { type: string; size?: number; color: string }) => {
  if (type === 'parking') return <Car size={size} color={color} />;
  if (type === 'garage') return <Warehouse size={size} color={color} />;
  return <Home size={size} color={color} />;
};

const PeriodToggle = ({ period, onChange }: { period: string; onChange: (p: string) => void }) => (
  <div style={{ display: 'flex', background: C.lightGray, borderRadius: 40, padding: 4, gap: 4, width: 'fit-content', marginBottom: 24 }}>
    {['daily', 'weekly', 'monthly'].map(p => (
      <button key={p} onClick={() => onChange(p)} style={{
        padding: '8px 24px', borderRadius: 32, border: 'none',
        background: period === p ? C.card : 'none',
        boxShadow: period === p ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
        color: period === p ? C.brand : C.gray,
        fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s',
      }}>{p.charAt(0).toUpperCase() + p.slice(1)}</button>
    ))}
  </div>
);

const StatCard = ({ label, value, color, sub, Icon, trend }: { label: string; value: string; color: string; sub?: string; Icon: any; trend?: string }) => (
  <div style={{
    background: C.card, borderRadius: 24, padding: '24px 28px', border: `1px solid ${C.border}`,
    boxShadow: '0 4px 14px rgba(0,0,0,0.02)', flex: '1 1 200px', transition: 'transform 0.25s ease, box-shadow 0.25s',
    position: 'relative', overflow: 'hidden', cursor: 'pointer'
  }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: color, borderRadius: '24px 24px 0 0' }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
      <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: C.gray, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{label}</p>
      <div style={{ width: 40, height: 40, borderRadius: 14, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={20} color={color} />
      </div>
    </div>
    <p style={{ margin: 0, fontSize: 36, fontWeight: 900, color, letterSpacing: '-1.5px', lineHeight: 1.2 }}>{value}</p>
    {sub && <p style={{ margin: '8px 0 0', fontSize: 12, color: C.gray }}>{sub}</p>}
    {trend && <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 10 }}><ArrowUpRight size={13} color={C.success} /><span style={{ fontSize: 12, color: C.success, fontWeight: 700 }}>{trend}</span></div>}
  </div>
);

// ─── Tab Components ────────────────────────────────────────────────────────────
const OverviewTab = ({ data, period, onPeriodChange }: { data: typeof MOCK_DATA; period: string; onPeriodChange: (p: string) => void }) => {
  const totalMRR = data.venues.filter(v => v.monthlyChargeEnabled).reduce((s, v) => s + v.monthlyRate * v.activeMonthlySubscriptions, 0);
  return (
    <div style={{  maxWidth: 1400, margin: '0 auto', width: '100%' }}>
      <PeriodToggle period={period} onChange={onPeriodChange} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 32 }}>
        <StatCard label="Total Revenue" value={fmtCurrency(data.totalEarnings[period as keyof typeof data.totalEarnings])} color={C.brand} sub={PERIOD_LABEL[period]} Icon={DollarSign} trend="+12.4%" />
        <StatCard label="Total Bookings" value={String(data.totalBookings[period as keyof typeof data.totalBookings])} color={C.parking} sub={PERIOD_LABEL[period]} Icon={CalendarDays} trend="+8.1%" />
        <StatCard label="Monthly MRR" value={`$${totalMRR.toLocaleString()}`} color={C.purple} sub="Recurring" Icon={Repeat} />
        <StatCard label="Active Venues" value={String(data.venues.length)} color={C.success} sub="Operational" Icon={MapPin} />
      </div>
      <div style={{ display: 'flex', gap: 20, marginBottom: 32, flexWrap: 'wrap' }}>
        {(['parking', 'garage', 'residence'] as const).map(type => {
          const total = data.venues.filter(v => v.type === type).reduce((s, v) => s + v.earnings[period as keyof typeof v.earnings], 0);
          return <div key={type} style={{ flex: 1, background: C.card, borderRadius: 20, padding: '20px', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 16 }}><div style={{ width: 48, height: 48, borderRadius: 16, background: VENUE_BG[type], display: 'flex', alignItems: 'center', justifyContent: 'center' }}><VenueIcon type={type} size={22} color={VENUE_COLOR[type]} /></div><div><p style={{ fontSize: 26, fontWeight: 900, color: VENUE_COLOR[type] }}>{fmtCurrency(total)}</p><p style={{ fontSize: 13, color: C.gray, textTransform: 'capitalize' }}>{type}s revenue</p></div></div>;
        })}
      </div>
      <div style={{ marginBottom: 24 }}><p style={{ fontSize: 14, fontWeight: 700, color: C.gray, letterSpacing: '0.8px' }}>📍 Your Venues</p></div>
      {data.venues.map(v => (
        <div key={v.id} style={{ background: C.card, borderRadius: 24, padding: '22px 26px', border: `1px solid ${C.border}`, marginBottom: 16, transition: 'all 0.25s' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: VENUE_BG[v.type], display: 'flex', alignItems: 'center', justifyContent: 'center' }}><VenueIcon type={v.type} size={24} color={VENUE_COLOR[v.type]} /></div>
            <div style={{ flex: 1, marginLeft: 16 }}><p style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{v.name}</p><p style={{ margin: '4px 0 0', fontSize: 13, color: C.gray }}>{v.address}</p></div>
            <div style={{ background: VENUE_BG[v.type], padding: '8px 18px', borderRadius: 40 }}><span style={{ fontSize: 18, fontWeight: 900, color: VENUE_COLOR[v.type] }}>{fmtCurrency(v.earnings[period as keyof typeof v.earnings])}</span></div>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {[{ label: 'Booked', val: v.slots.booked, color: VENUE_COLOR[v.type] }, { label: 'Free', val: v.slots.available, color: C.success }, { label: 'Total', val: v.slots.total, color: C.gray }].map(item => (
              <div key={item.label}><p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: item.color }}>{item.val}</p><p style={{ margin: 0, fontSize: 11, color: C.gray }}>{item.label}</p></div>
            ))}
            {v.monthlyChargeEnabled && <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, background: C.brandLight, padding: '6px 14px', borderRadius: 40 }}><Repeat size={12} color={C.brand} /><span style={{ fontSize: 12, fontWeight: 800, color: C.brand }}>{v.activeMonthlySubscriptions} monthly</span></div>}
          </div>
        </div>
      ))}
      <div style={{ background: 'linear-gradient(125deg, #fff1e0, #ffe4cc)', borderRadius: 24, padding: '28px 32px', marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}><div style={{ width: 52, height: 52, borderRadius: 20, background: C.brandLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Crown size={24} color={C.brand} /></div><div><p style={{ fontWeight: 800, fontSize: 18 }}>Monthly Recurring Revenue</p><p style={{ color: C.gray, fontSize: 13 }}>Active subscriptions across venues</p></div></div>
        <p style={{ fontSize: 44, fontWeight: 900, color: C.brand, letterSpacing: '-2px' }}>${totalMRR.toLocaleString()}</p>
      </div>
    </div>
  );
};

const SlotsTab = ({ data }: { data: typeof MOCK_DATA }) => (
  <div style={{  maxWidth: 1400, margin: '0 auto', width: '100%' }}>
    <p style={{ fontSize: 14, fontWeight: 700, color: C.gray, marginBottom: 24 }}>🎯 Slot Live Map</p>
    {data.venues.map(venue => {
      const vc = VENUE_COLOR[venue.type], vbg = VENUE_BG[venue.type];
      const { booked, total } = venue.slots;
      const pct = total ? Math.round((booked / total) * 100) : 0;
      return (
        <div key={venue.id} style={{ background: C.card, borderRadius: 28, padding: '24px 28px', marginBottom: 20, border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}><div style={{ width: 50, height: 50, borderRadius: 18, background: vbg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><VenueIcon type={venue.type} size={24} color={vc} /></div><div style={{ marginLeft: 16, flex: 1 }}><p style={{ fontSize: 18, fontWeight: 800 }}>{venue.name}</p><p style={{ fontSize: 13, color: C.gray }}>{venue.address}</p></div><div style={{ background: vbg, padding: '6px 16px', borderRadius: 40 }}><span style={{ fontWeight: 900, color: vc }}>{pct}% filled</span></div></div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
            {Array.from({ length: total }).map((_, i) => {
              const isMonthly = venue.monthlyChargeEnabled && i < venue.activeMonthlySubscriptions;
              const isBooked = i < booked;
              return <div key={i} style={{ width: 34, height: 34, borderRadius: 10, background: isMonthly ? C.brandLight : isBooked ? vbg : C.successBg, border: `2px solid ${isMonthly ? C.brand : isBooked ? vc : C.success}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: isMonthly ? C.brand : isBooked ? vc : C.success }} /></div>;
            })}
          </div>
        </div>
      );
    })}
  </div>
);

const BookingsTab = ({ data }: { data: typeof MOCK_DATA }) => {
  const [filter, setFilter] = useState<string>('all');
  const filtered = filter === 'all' ? data.recentBookings : data.recentBookings.filter(b => b.type === filter);
  return (
    <div style={{  maxWidth: 1400, margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
        {['all', 'parking', 'garage', 'residence'].map(f => {
          const active = filter === f;
          const vc = f === 'all' ? C.brand : VENUE_COLOR[f];
          return <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 24px', borderRadius: 40, border: `1.5px solid ${active ? vc : C.border}`, background: active ? vc : C.card, color: active ? '#fff' : C.gray, fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: '0.2s' }}>{f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}</button>;
        })}
      </div>
      <div style={{ background: C.card, borderRadius: 28, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
        {filtered.map(booking => {
          const vc = VENUE_COLOR[booking.type], vbg = VENUE_BG[booking.type];
          return (
            <div key={booking._id} style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', borderBottom: `1px solid ${C.border}`, gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: vbg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><VenueIcon type={booking.type} size={20} color={vc} /></div>
              <div style={{ flex: 1 }}><div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}><span style={{ fontWeight: 700 }}>{booking.customerName}</span>{booking.isMonthly && <span style={{ fontSize: 10, fontWeight: 800, background: C.brandLight, color: C.brand, padding: '2px 10px', borderRadius: 20 }}>Monthly</span>}</div><p style={{ fontSize: 13, color: C.gray }}>Slot {booking.slot} · {fmtDate(booking.from)} {fmtTime(booking.from)}</p></div>
              <div style={{ textAlign: 'right' }}><p style={{ fontWeight: 800 }}>${booking.amount.toFixed(2)}</p><div style={{ padding: '4px 10px', borderRadius: 20, background: statusBg(booking.status), display: 'inline-block' }}><span style={{ fontSize: 11, fontWeight: 700, color: statusColor(booking.status) }}>{booking.status}</span></div></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MonthlyTab = ({ data }: { data: typeof MOCK_DATA }) => {
  const totalMRR = data.venues.filter(v => v.monthlyChargeEnabled).reduce((s, v) => s + v.monthlyRate * v.activeMonthlySubscriptions, 0);
  const totalSubs = data.venues.filter(v => v.monthlyChargeEnabled).reduce((s, v) => s + v.activeMonthlySubscriptions, 0);
  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', width: '100%' }}>
      <div style={{ background: `linear-gradient(135deg, ${C.card}, #fffaf2)`, borderRadius: 32, padding: '32px 40px', marginBottom: 28, border: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><p style={{ fontSize: 12, fontWeight: 700, color: C.gray, letterSpacing: 1 }}>TOTAL MONTHLY RECURRING</p><p style={{ fontSize: 56, fontWeight: 900, color: C.brand, letterSpacing: '-3px' }}>${totalMRR.toLocaleString()}</p><p style={{ fontSize: 14, color: C.gray }}>{totalSubs} active subscribers</p></div>
        <div style={{ width: 70, height: 70, borderRadius: 30, background: C.brandLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Gift size={32} color={C.brand} /></div>
      </div>
      {data.venues.filter(v => v.monthlyChargeEnabled).map(v => (
        <div key={v.id} style={{ background: C.card, borderRadius: 24, padding: '24px 28px', marginBottom: 18, border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}><div style={{ width: 48, height: 48, borderRadius: 16, background: VENUE_BG[v.type], display: 'flex', alignItems: 'center', justifyContent: 'center' }}><VenueIcon type={v.type} size={22} color={VENUE_COLOR[v.type]} /></div><div style={{ flex: 1, marginLeft: 16 }}><p style={{ fontWeight: 800, fontSize: 18 }}>{v.name}</p><p style={{ fontSize: 13, color: C.gray }}>{v.type}</p></div><div><span style={{ fontSize: 32, fontWeight: 900, color: C.brand }}>${v.monthlyRate}</span><span style={{ fontSize: 13, color: C.gray }}> /mo</span></div></div>
          <div style={{ display: 'flex', background: C.lightGray, borderRadius: 20, padding: '16px 24px', gap: 20, justifyContent: 'space-around' }}><div><p style={{ fontSize: 28, fontWeight: 900 }}>{v.activeMonthlySubscriptions}</p><p style={{ fontSize: 12, color: C.gray }}>Active Subs</p></div><div><p style={{ fontSize: 28, fontWeight: 900, color: C.brand }}>${v.monthlyRate * v.activeMonthlySubscriptions}</p><p style={{ fontSize: 12, color: C.gray }}>MRR</p></div><div><p style={{ fontSize: 28, fontWeight: 900 }}>{v.slots.booked}/{v.slots.total}</p><p style={{ fontSize: 12, color: C.gray }}>Slots Used</p></div></div>
        </div>
      ))}
    </div>
  );
};

const DryCleaningTab = () => {
  const [data] = useState(MOCK_DRY);
  const [period, setPeriod] = useState<string>('weekly');
  const [view, setView] = useState<string>('overview');
  const maxCat = data.categoryBreakdown[0]?.totalRevenue || 1;
  return (
    <div style={{  maxWidth: 1400, margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>{['overview', 'orders', 'analytics'].map(v => <button key={v} onClick={() => setView(v)} style={{ padding: '8px 28px', borderRadius: 40, border: `1.5px solid ${view === v ? C.brand : C.border}`, background: view === v ? C.brandLight : C.card, color: view === v ? C.brand : C.gray, fontWeight: 700, cursor: 'pointer' }}>{v.charAt(0).toUpperCase() + v.slice(1)}</button>)}</div>
      {view === 'overview' && <>
        <PeriodToggle period={period} onChange={setPeriod} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 20, marginBottom: 32 }}>
          <StatCard label="Revenue" value={`$${data.totalEarnings[period as keyof typeof data.totalEarnings]}`} color={C.brand} Icon={TrendingUp} />
          <StatCard label="Orders" value={String(data.totalBookings[period as keyof typeof data.totalBookings])} color={C.purple} Icon={ShoppingBag} />
          <StatCard label="Avg Order" value={`$${data.overallStats.avgOrderValue}`} color={C.teal} Icon={BarChart2} />
          <StatCard label="Shops" value={String(data.overallStats.totalShops)} color={C.success} Icon={Layers} />
        </div>
        <div style={{ background: C.card, borderRadius: 24, padding: '24px', marginBottom: 28 }}><p style={{ fontWeight: 700, marginBottom: 16 }}>📊 Top Categories</p>{data.categoryBreakdown.map((item, i) => { const pct = (item.totalRevenue / maxCat) * 100; return <div key={item.category} style={{ marginBottom: 16 }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span>{item.category}</span><span style={{ fontWeight: 800, color: CAT_COLORS[i % CAT_COLORS.length] }}>${item.totalRevenue}</span></div><div style={{ height: 6, background: C.lightGray, borderRadius: 4 }}><div style={{ width: `${pct}%`, height: 6, background: CAT_COLORS[i % CAT_COLORS.length], borderRadius: 4 }} /></div></div>;})}</div>
        {data.shops.map(shop => <div key={shop.id} style={{ background: C.card, borderRadius: 24, marginBottom: 18, border: `1px solid ${C.border}` }}><div style={{ padding: '22px 28px', display: 'flex', alignItems: 'center', gap: 16 }}><div style={{ width: 52, height: 52, borderRadius: 18, background: C.brandLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShoppingBag size={24} color={C.brand} /></div><div style={{ flex: 1 }}><p style={{ fontWeight: 800, fontSize: 18 }}>{shop.shopname}</p><p style={{ fontSize: 13, color: C.gray }}>{shop.address.street}</p></div><div style={{ textAlign: 'right' }}><p style={{ fontSize: 28, fontWeight: 900, color: C.brand }}>${shop.earnings[period as keyof typeof shop.earnings]}</p><div style={{ display: 'flex', gap: 4, alignItems: 'center' }}><Star size={14} fill={C.warning} color={C.warning} /><span>{shop.rating}</span></div></div></div><div style={{ display: 'flex', background: C.lightGray, padding: '14px 28px', borderRadius: '0 0 24px 24px', gap: 16, justifyContent: 'space-around' }}>{Object.entries(shop.orderStatus).map(([k, val]) => <div key={k}><p style={{ fontSize: 24, fontWeight: 900, color: C.brand }}>{val}</p><p style={{ fontSize: 12, color: C.gray }}>{k}</p></div>)}</div></div>)}
      </>}
      {view === 'orders' && (
  <div
    style={{
      background: C.card,
      borderRadius: 28,
      overflow: 'hidden',
    }}
  >
    {data?.recentOrders?.map((o) => {
      const meta = STATUS_META[o.status] || STATUS_META.pending;
      const IconComp = meta.Icon;

      return (
        <div
          key={o._id}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '18px 24px',
            borderBottom: `1px solid ${C.border}`,
            gap: 16,
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: meta.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconComp size={20} color={meta.color} />
          </div>

          {/* Order Info */}
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700 }}>{o.orderNumber}</p>
            <p style={{ fontSize: 13, color: C.gray }}>
              {o.customerName} · {o.itemCount} items
            </p>
          </div>

          {/* Price */}
          <span style={{ fontWeight: 800, color: C.brand }}>
            ${o.totalAmount}
          </span>
        </div>
      );
    })}
  </div>
)}
      {view === 'analytics' && <div style={{ background: C.card, borderRadius: 28, padding: '28px' }}><p style={{ fontWeight: 700, marginBottom: 24 }}>📈 Order Status Flow</p>{data.statusBreakdown.map(item => { const meta = STATUS_META[item.status] || STATUS_META.pending; const total = data.statusBreakdown.reduce((s, b) => s + b.count, 0); const pct = Math.round((item.count / total) * 100); const IconComp = meta.Icon; return <div key={item.status} style={{ marginBottom: 20 }}><div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}><div style={{ width: 34, height: 34, borderRadius: 10, background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconComp size={16} color={meta.color} /></div><span style={{ flex: 1, fontWeight: 600 }}>{meta.label}</span><span style={{ fontWeight: 800 }}>{item.count}</span></div><div style={{ height: 6, background: C.lightGray, borderRadius: 4 }}><div style={{ width: `${pct}%`, height: 6, background: meta.color, borderRadius: 4 }} /></div></div>;})}</div>}
    </div>
  );
};

// ─── Sidebar with BIG V LOGO ──────────────────────────────────────────────────
const Sidebar = ({ activeTab, onTabChange, user, onLogout, collapsed, onToggle }: { activeTab: string; onTabChange: (tab: string) => void; user: { firstName?: string }; onLogout: () => void; collapsed: boolean; onToggle: () => void }) => {
  const NAV_ITEMS = [
    { key: 'overview', label: 'Overview', Icon: LayoutDashboard },
    { key: 'slots', label: 'Slots', Icon: Grid },
    { key: 'bookings', label: 'Bookings', Icon: List },
    { key: 'monthly', label: 'Monthly', Icon: Repeat },
    { key: 'dryCleaning', label: 'Laundry', Icon: Shirt },
  ];
  return (
    <div style={{ width: collapsed ? 80 : 260, minHeight: '100vh', background: C.sidebar, display: 'flex', flexDirection: 'column', transition: 'width 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100, overflow: 'hidden', boxShadow: '8px 0 32px rgba(0,0,0,0.2)' }}>
      <div style={{ padding: collapsed ? '24px 0' : '28px 24px', display: 'flex', alignItems: 'center', gap: 12, justifyContent: collapsed ? 'center' : 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ width: 48, height: 48, borderRadius: 20, background: `linear-gradient(145deg, ${C.brand}, ${C.brandDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 20px ${C.brandGlow}` }}>
          <span style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>V</span>
        </div>
        {!collapsed && <span style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-1.5px' }}>ervoer</span>}
      </div>
      <nav style={{ flex: 1, padding: '24px 12px' }}>{NAV_ITEMS.map(({ key, label, Icon }) => {
        const active = activeTab === key;
        return <button key={key} onClick={() => onTabChange(key)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: collapsed ? '14px 0' : '14px 18px', background: active ? C.sidebarActive : 'none', border: 'none', borderLeft: `3px solid ${active ? C.brand : 'transparent'}`, borderRadius: '12px', marginBottom: 6, transition: 'all 0.2s', justifyContent: collapsed ? 'center' : 'flex-start', cursor: 'pointer' }}><Icon size={20} color={active ? C.brand : C.sidebarText} />{!collapsed && <span style={{ fontSize: 14, fontWeight: active ? 700 : 500, color: active ? '#fff' : C.sidebarText }}>{label}</span>}</button>;
      })}</nav>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: collapsed ? '20px 0' : '20px 20px' }}>{!collapsed && <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: 16, marginBottom: 16 }}><div style={{ width: 40, height: 40, borderRadius: 14, background: C.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900 }}>{user?.firstName?.[0] || 'M'}</div><div><p style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{user?.firstName || 'Merchant'}</p><p style={{ fontSize: 11, color: C.sidebarText }}>Owner</p></div></div>}<button onClick={onLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '12px 0' : '12px 16px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 14, justifyContent: collapsed ? 'center' : 'flex-start', cursor: 'pointer' }}><LogOut size={18} color={C.error} />{!collapsed && <span style={{ color: C.error, fontWeight: 600 }}>Logout</span>}</button></div>
      <button onClick={onToggle} style={{ position: 'absolute', top: 32, right: -16, width: 32, height: 32, borderRadius: '50%', background: C.sidebar, border: '2px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px black' }}>{collapsed ? <ChevronRight size={14} color={C.sidebarText} /> : <ChevronLeft size={14} color={C.sidebarText} />}</button>
    </div>
  );
};

const TopBar = ({ activeTab, onRefresh, refreshing, sidebarCollapsed }: { activeTab: string; onRefresh: () => void; refreshing: boolean; sidebarCollapsed: boolean }) => {
  const TAB_LABELS: Record<string, string> = { overview: 'Command Center', slots: 'Slot Map', bookings: 'Activity Log', monthly: 'Recurring Hub', dryCleaning: 'Dry Clean Suite' };
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  useEffect(() => { const t = setInterval(() => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })), 10000); return () => clearInterval(t); }, []);
  return (
    <div style={{ position: 'fixed', top: 0, right: 0, left: sidebarCollapsed ? 80 : 260, zIndex: 50, height: 72, background: 'rgba(248,247,244,0.92)', backdropFilter: 'blur(24px)', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', padding: '0 40px', gap: 20, transition: 'left 0.3s' }}>
      <div style={{ flex: 1 }}><h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', background: 'linear-gradient(135deg, #1e1e2a, #FF9401)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{TAB_LABELS[activeTab]}</h1><p style={{ fontSize: 13, color: C.gray }}>live · {time}</p></div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}><div style={{ background: C.card, padding: '8px 20px', borderRadius: 40, border: `1px solid ${C.border}` }}><Activity size={14} color={C.success} /><span style={{ marginLeft: 8, fontSize: 12, fontWeight: 600 }}>Operational</span></div><button onClick={onRefresh} style={{ width: 42, height: 42, borderRadius: 14, background: C.brandLight, border: 'none', cursor: 'pointer' }}><RefreshCw size={18} color={C.brand} style={refreshing ? { animation: 'spin 1s linear infinite' } : {}} /></button><button style={{ width: 42, height: 42, borderRadius: 14, background: C.card, border: `1px solid ${C.border}`, position: 'relative', cursor: 'pointer' }}><Bell size={18} color={C.gray} /><div style={{ position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: '50%', background: C.brand }} /></button></div>
    </div>
  );
};

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export default function DashboardPage({ user, onLogout }: { token?: string; user?: { firstName?: string }; onLogout?: () => void }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [period, setPeriod] = useState('weekly');
  const [data] = useState(MOCK_DATA);
  const [refreshing, setRefreshing] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => { setMounted(true); }, []);
  const handleRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000); };
  
  useEffect(() => {
  const style = document.createElement('style');
  style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);

  return () => {
    document.head.removeChild(style);
  };
}, []);
  
  if (!mounted) return null;
  
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} user={user || { firstName: 'Alex' }} onLogout={onLogout || (() => console.log('logout'))} collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div style={{ flex: 1, marginLeft: collapsed ? 80 : 260, transition: 'margin-left 0.3s', minHeight: '100vh' }}>
        <TopBar activeTab={activeTab} onRefresh={handleRefresh} refreshing={refreshing} sidebarCollapsed={collapsed} />
        <div style={{ paddingTop: 80 }}>
          {activeTab === 'overview' && <OverviewTab data={data} period={period} onPeriodChange={setPeriod} />}
          {activeTab === 'slots' && <SlotsTab data={data} />}
          {activeTab === 'bookings' && <BookingsTab data={data} />}
          {activeTab === 'monthly' && <MonthlyTab data={data} />}
          {activeTab === 'dryCleaning' && <DryCleaningTab />}
        </div>
      </div>
    </div>
  );
}