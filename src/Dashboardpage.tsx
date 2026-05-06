import  { useState, useEffect, useCallback } from 'react';
import { GLOBAL_CSS } from './Tokens';
import { useStats } from './Hooks';
import { Sidebar } from './Sidebar';
import { TopBar } from './Topbar';
import { Spinner, ErrorBanner } from './Ui';
import { OverviewTab } from './Overviewtab';
import { SlotsTab } from './Slotstab';
import { BookingsTab } from './Bookingstab';
import { MonthlyTab } from './Monthlytab';
import { DryCleaningTab } from './Drycleaningtab';
import { SubAccountsTab } from './Subaccountstab';

interface DashboardPageProps {
  token?: string;
  user?: { firstName?: string };
  onLogout?: () => void;
}

export default function DashboardPage({ token, user, onLogout }: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [period, setPeriod]       = useState('weekly');
  const [collapsed, setCollapsed] = useState(false);

  const { data, loading, error, refetch } = useStats(token);
  const [refreshing, setRefreshing] = useState(false);

  // Inject global CSS once
  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const SIDEBAR_W = collapsed ? 68 : 240;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F7F3EE' }}>
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user || { firstName: 'Merchant' }}
        onLogout={onLogout || (() => {})}
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
      />

      <div style={{
        flex: 1,
        marginLeft: SIDEBAR_W,
        transition: 'margin-left 0.32s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <TopBar
          activeTab={activeTab}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          sidebarCollapsed={collapsed}
        />

        <div style={{ padding: '82px 32px 40px', minHeight: '100vh' }}>
          {/* Dry cleaning and sub-accounts don't need the main stats data */}
          {activeTab === 'dryCleaning' && <DryCleaningTab token={token} />}
          {activeTab === 'subAccounts' && <SubAccountsTab />}

          {/* All other tabs need stats */}
          {!['dryCleaning', 'subAccounts'].includes(activeTab) && (
            loading  ? <Spinner /> :
            error    ? <ErrorBanner msg={error} onRetry={refetch} /> :
            data     ? (
              <>
                {activeTab === 'overview' && (
                  <OverviewTab data={data} period={period} onPeriodChange={setPeriod} />
                )}
                {activeTab === 'slots' && <SlotsTab data={data} />}
                {activeTab === 'bookings' && <BookingsTab data={data} />}
                {activeTab === 'monthly' && <MonthlyTab data={data} />}
              </>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}