import { useState } from 'react';
import LoginPage from './Loginpage';
import DashboardPage from './Dashboardpage';
import type { MerchantUser } from './types/Index';

const TOKEN_KEY = 'merchant_token';
const USER_KEY  = 'merchant_user';

export default function App() {
  const [token, setToken] = useState<string | null>(
    () => sessionStorage.getItem(TOKEN_KEY)
  );
  const [user, setUser] = useState<MerchantUser | null>(() => {
    try {
      const raw = sessionStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as MerchantUser) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (tok: string, usr: MerchantUser) => {
    sessionStorage.setItem(TOKEN_KEY, tok);
    sessionStorage.setItem(USER_KEY, JSON.stringify(usr));
    setToken(tok);
    setUser(usr);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  if (!token) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <DashboardPage
      token={token}
      user={user ?? {}}
      onLogout={handleLogout}
    />
  );
}