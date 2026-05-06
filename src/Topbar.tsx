import React, { useState, useEffect } from 'react';
import { RefreshCw, Bell } from 'lucide-react';
import { C } from './Tokens';

const TAB_LABELS: Record<string, string> = {
  overview:    'Command Centre',
  slots:       'Slot Map',
  bookings:    'Activity Log',
  monthly:     'Recurring Hub',
  dryCleaning: 'Laundry Suite',
  subAccounts: 'Team Management',
};

const TAB_SUBS: Record<string, string> = {
  overview:    'Revenue & performance overview',
  slots:       'Live availability across venues',
  bookings:    'Recent booking activity',
  monthly:     'Subscription management',
  dryCleaning: 'Laundry orders & shops',
  subAccounts: 'Manage team access',
};

interface TopBarProps {
  activeTab: string;
  onRefresh: () => void;
  refreshing: boolean;
  sidebarCollapsed: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab, onRefresh, refreshing, sidebarCollapsed,
}) => {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  useEffect(() => {
    const t = setInterval(
      () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
      15000
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0,
      left: sidebarCollapsed ? 68 : 240,
      zIndex: 50, height: 64,
      background: 'rgba(247,243,238,0.88)',
      backdropFilter: 'blur(24px)',
      borderBottom: `1px solid ${C.border}`,
      display: 'flex', alignItems: 'center', padding: '0 32px', gap: 16,
      transition: 'left 0.32s cubic-bezier(0.4,0,0.2,1)',
    }}>
      <div style={{ flex: 1 }}>
        <h1 style={{
          fontSize: 19, fontWeight: 700, letterSpacing: '-0.3px',
          color: C.text, margin: 0,
          fontFamily: 'Playfair Display, serif',
        }}>
          {TAB_LABELS[activeTab] || 'Dashboard'}
        </h1>
        <p style={{ fontSize: 11, color: C.gray, margin: 0 }}>
          {TAB_SUBS[activeTab]} · {time}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
        {/* Live badge */}
        <div style={{
          background: C.card, padding: '6px 14px', borderRadius: 40,
          border: `1.5px solid ${C.border}`,
          display: 'flex', alignItems: 'center', gap: 7,
          boxShadow: '0 2px 8px rgba(28,20,16,0.07)',
        }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: C.success, animation: 'pulseDot 2s ease-in-out infinite',
          }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: C.textSub }}>Live</span>
        </div>

        {/* Refresh */}
        <button onClick={onRefresh} style={{
          width: 38, height: 38, borderRadius: 11,
          background: C.brandLight, border: `1.5px solid ${C.brand}22`,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}>
          <RefreshCw
            size={15} color={C.brand}
            style={refreshing ? { animation: 'spin 1s linear infinite' } : {}}
          />
        </button>

        {/* Bell */}
        <button style={{
          width: 38, height: 38, borderRadius: 11,
          background: C.card, border: `1.5px solid ${C.border}`,
          cursor: 'pointer', position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}>
          <Bell size={15} color={C.gray} />
          <div style={{
            position: 'absolute', top: 8, right: 8,
            width: 7, height: 7, borderRadius: '50%',
            background: C.brand, animation: 'pulseDot 2s ease-in-out infinite',
          }} />
        </button>
      </div>
    </div>
  );
};

export default TopBar;