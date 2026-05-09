import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, Trash2, Loader2, CheckCircle, Users, Eye, EyeOff,
} from 'lucide-react';
import axiosInstance from './Axios';
import { RealSubAccount } from './Tokens';
import { Spinner } from './Ui';

const ORANGE = '#FFA629';
const ORANGE_LIGHT = '#FF8E0033';
const ORANGE_BORDER = '#FFA62940';

export const SubAccountsTab: React.FC = () => {
  const [accounts, setAccounts]     = useState<RealSubAccount[]>([]);
  const [loading, setLoading]       = useState(true);
  const [actionId, setActionId]     = useState<string | null>(null);
  const [showModal, setShowModal]   = useState(false);
  const [showPw, setShowPw]         = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [confirmId, setConfirmId]   = useState<string | null>(null);
  const [toast, setToast]           = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [errors, setErrors]         = useState<{ email?: string; password?: string }>({});
  const [newAcc, setNewAcc]         = useState({ email: '', password: '', label: '' });

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (msg: string, type: 'success' | 'error') => setToast({ msg, type });

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/merchants/sub-accounts');
      if (res.data.success) setAccounts(res.data.data || []);
      else throw new Error(res.data.message);
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to load sub-accounts', 'error');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAccounts(); }, [fetchAccounts]);

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!newAcc.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAcc.email.trim())) errs.email = 'Enter a valid email';
    if (!newAcc.password.trim()) errs.password = 'Password is required';
    else if (newAcc.password.length < 6) errs.password = 'Minimum 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAdd = async () => {
    if (!validate()) return;
    setAddLoading(true);
    try {
      const res = await axiosInstance.post('/merchants/sub-accounts', {
        email: newAcc.email.trim().toLowerCase(),
        password: newAcc.password,
        label: newAcc.label.trim(),
      });
      if (res.data.success) {
        setAccounts(res.data.data || accounts);
        setNewAcc({ email: '', password: '', label: '' });
        setErrors({});
        setShowModal(false);
        showToast('Sub-account added successfully', 'success');
      } else throw new Error(res.data.message);
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to add sub-account', 'error');
    } finally { setAddLoading(false); }
  };

  const handleToggle = async (id: string, current: boolean) => {
    setActionId(id);
    try {
      const res = await axiosInstance.patch('/merchants/sub-accounts/toggle', { subAccountId: id });
      if (res.data.success) {
        setAccounts(prev => prev.map(a => a._id === id ? { ...a, isActive: !current } : a));
        showToast(`Account ${!current ? 'activated' : 'deactivated'}`, 'success');
      } else throw new Error(res.data.message);
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to update', 'error');
    } finally { setActionId(null); }
  };

  const handleRemove = async (id: string) => {
    setConfirmId(null);
    setActionId(id);
    try {
      const res = await axiosInstance.delete('/merchants/sub-accounts', { data: { subAccountId: id } });
      if (res.data.success) {
        setAccounts(prev => prev.filter(a => a._id !== id));
        showToast('Sub-account removed', 'success');
      } else throw new Error(res.data.message);
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to remove', 'error');
    } finally { setActionId(null); }
  };

  const confirmTarget = accounts.find(a => a._id === confirmId);

  return (
    <>
      <style>{`
        .sa-wrap { max-width: 1060px; margin: 0 auto; width: 100%; }

        /* Add login button */
        .sa-add-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 10px 22px; border-radius: 24px;
          background: ${ORANGE}; border: none; color: #fff;
          font-size: 13px; font-weight: 700; cursor: pointer;
          box-shadow: 0 4px 14px rgba(255,166,41,0.35);
          transition: transform 0.15s, box-shadow 0.15s;
          font-family: inherit;
        }
        .sa-add-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(255,166,41,0.45); }

        /* Progress bar */
        .sa-progress-bg { height: 6px; background: #1a1a1a; border-radius: 4px; overflow: hidden; margin-bottom: 24px; }
        .sa-progress-fill { height: 6px; background: ${ORANGE}; border-radius: 4px; transition: width 0.5s ease; }

        /* Account card — solid orange */
        .sa-card {
          background: ${ORANGE};
          border-radius: 18px;
          padding: 16px 20px;
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 12px;
          box-shadow: 0 4px 16px rgba(255,166,41,0.25);
          transition: transform 0.18s, box-shadow 0.18s;
          box-sizing: border-box;
        }
        .sa-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,166,41,0.35); }
        .sa-card.inactive { opacity: 0.7; }

        /* White square avatar */
        .sa-avatar {
          width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
          background: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; font-weight: 800; color: ${ORANGE};
          font-family: 'Playfair Display', serif;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        }

        .sa-name  { font-size: 15px; font-weight: 700; color: #fff; margin: 0; font-family: 'Playfair Display', serif; }
        .sa-email { font-size: 12px; color: rgba(255,255,255,0.80); margin: 2px 0 5px; }
        .sa-badge {
          display: inline-block; font-size: 10px; font-weight: 700;
          padding: 2px 9px; border-radius: 20px;
          background: rgba(255,255,255,0.25); color: #fff;
        }
        .sa-badge.active { background: rgba(34,197,94,0.25); color: #86efac; }
        .sa-date { font-size: 10px; color: rgba(255,255,255,0.65); margin-left: 6px; }

        /* Toggle switch — green when active */
        .sa-toggle {
          width: 46px; height: 25px; border-radius: 13px; border: none;
          cursor: pointer; position: relative; transition: background 0.25s; flex-shrink: 0;
        }
        .sa-toggle-thumb {
          position: absolute; top: 3px; width: 19px; height: 19px;
          border-radius: 50%; background: #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.25);
          transition: left 0.25s cubic-bezier(0.4,0,0.2,1);
        }

        /* Delete button */
        .sa-delete {
          width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
          background: #ef4444; border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.15s;
        }
        .sa-delete:hover { background: #dc2626; transform: scale(1.05); }

        /* Empty state */
        .sa-empty { text-align: center; padding: 64px 24px; }
        .sa-empty-icon {
          width: 64px; height: 64px; border-radius: 22px;
          background: ${ORANGE_LIGHT}; border: 1.5px solid ${ORANGE_BORDER};
          display: flex; align-items: center; justify-content: center; margin: 0 auto 18px;
        }

        /* Modal */
        .sa-modal-overlay {
          position: fixed; inset: 0; z-index: 8888;
          background: rgba(0,0,0,0.45); backdrop-filter: blur(10px);
          display: flex; align-items: center; justify-content: center;
        }
        .sa-modal-box {
          background: #fff; border-radius: 22px; padding: 30px 32px;
          max-width: 420px; width: 90%; border: 1.5px solid #eee;
          box-shadow: 0 32px 64px rgba(0,0,0,0.18);
        }
        .sa-input {
          width: 100%; padding: 11px 14px; border-radius: 10px;
          border: 1.5px solid #e5e7eb; font-size: 14px; font-family: inherit;
          outline: none; box-sizing: border-box; background: #fafafa;
          transition: border-color 0.15s;
        }
        .sa-input:focus { border-color: ${ORANGE}; background: #fff; }
        .sa-label {
          font-size: 10px; font-weight: 700; color: #999;
          display: block; margin-bottom: 5px;
          letter-spacing: 1.8px; text-transform: uppercase;
        }
        .sa-modal-cancel {
          flex: 1; padding: 12px; background: none;
          border: 1.5px solid #e5e7eb; border-radius: 10px;
          color: #666; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit;
        }
        .sa-modal-submit {
          flex: 2; padding: 12px; background: ${ORANGE}; border: none;
          border-radius: 10px; color: #fff; font-size: 13px; font-weight: 700;
          cursor: pointer; font-family: inherit;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 12px rgba(255,166,41,0.35);
        }

        /* Confirm dialog */
        .sa-confirm-box {
          background: #fff; border-radius: 20px; padding: 28px 30px;
          max-width: 380px; width: 90%; border: 1.5px solid #eee;
          box-shadow: 0 24px 48px rgba(0,0,0,0.16);
        }

        /* Toast */
        .sa-toast {
          position: fixed; top: 22px; right: 22px; z-index: 9999;
          border-radius: 14px; padding: 13px 18px;
          display: flex; align-items: center; gap: 11px;
          box-shadow: 0 8px 28px rgba(0,0,0,0.14); min-width: 260px;
        }

        @media (max-width: 500px) {
          .sa-modal-box { padding: 22px 18px; }
          .sa-card { padding: 14px 14px; }
        }
      `}</style>

      <div className="sa-wrap">
        {/* Toast */}
        {toast && (
          <div className="sa-toast" style={{
            background: toast.type === 'success' ? '#f0fdf4' : '#fef2f2',
            border: `1.5px solid ${toast.type === 'success' ? '#86efac' : '#fca5a5'}`,
          }}>
            <CheckCircle size={16} color={toast.type === 'success' ? '#22c55e' : '#ef4444'} />
            <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: toast.type === 'success' ? '#16a34a' : '#dc2626' }}>
              {toast.msg}
            </span>
            <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: 18, lineHeight: 1 }}>×</button>
          </div>
        )}

        {/* Confirm dialog */}
        {confirmId && confirmTarget && (
          <div className="sa-modal-overlay" onClick={() => setConfirmId(null)}>
            <div className="sa-confirm-box" onClick={e => e.stopPropagation()}>
              <div style={{ width: 46, height: 46, borderRadius: 14, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <Trash2 size={20} color="#ef4444" />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 6px', fontFamily: 'Playfair Display, serif' }}>Remove Sub-Account</h3>
              <p style={{ fontSize: 14, color: '#666', margin: '0 0 22px' }}>
                Remove <strong style={{ color: '#1a1a1a' }}>{confirmTarget.email}</strong>? This cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="sa-modal-cancel" onClick={() => setConfirmId(null)}>Cancel</button>
                <button onClick={() => handleRemove(confirmId)} style={{ flex: 1, padding: 12, borderRadius: 10, border: 'none', background: '#ef4444', color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>Remove</button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#1a1a1a', fontFamily: 'Playfair Display, serif' }}>Sub-Accounts</h2>
            <p style={{ margin: '3px 0 0', fontSize: 13, color: '#999' }}>{accounts.length}/10 slots used</p>
          </div>
          <button className="sa-add-btn" onClick={() => setShowModal(true)}>
            <Plus size={14} /> + Add login
          </button>
        </div>

        {/* Progress bar */}
        <div className="sa-progress-bg" style={{ marginTop: 14 }}>
          <div className="sa-progress-fill" style={{ width: `${(accounts.length / 10) * 100}%`, background: accounts.length >= 9 ? '#ef4444' : ORANGE }} />
        </div>

        {/* List */}
        {loading ? <Spinner /> : accounts.length === 0 ? (
          <div className="sa-empty">
            <div className="sa-empty-icon"><Users size={28} color={ORANGE} /></div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1a1a1a', margin: '0 0 6px', fontFamily: 'Playfair Display, serif' }}>No sub-accounts yet</h3>
            <p style={{ fontSize: 14, color: '#999', margin: 0 }}>Add your first login to give a team member access.</p>
          </div>
        ) : (
          <div>
            {accounts.map((sa) => (
              <div key={sa._id} className={`sa-card${sa.isActive ? '' : ' inactive'}`}>
                {/* White square avatar */}
                <div className="sa-avatar">{(sa.label || sa.email || '?').charAt(0).toUpperCase()}</div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {sa.label && <p className="sa-name">{sa.label}</p>}
                  <p className="sa-email">{sa.email}</p>
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className={`sa-badge${sa.isActive ? ' active' : ''}`}>
                      {sa.isActive ? '● Active' : '○ Inactive'}
                    </span>
                    <span className="sa-date">
                      {new Date(sa.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  {actionId === sa._id ? (
                    <Loader2 size={18} color="#fff" style={{ animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <>
                      {/* Toggle */}
                      <button
                        className="sa-toggle"
                        onClick={() => handleToggle(sa._id, sa.isActive)}
                        style={{ background: sa.isActive ? '#22c55e' : 'rgba(255,255,255,0.3)' }}
                      >
                        <span className="sa-toggle-thumb" style={{ left: sa.isActive ? 22 : 3 }} />
                      </button>
                      {/* Delete */}
                      <button className="sa-delete" onClick={() => setConfirmId(sa._id)}>
                        <Trash2 size={14} color="#fff" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Modal */}
        {showModal && (
          <div className="sa-modal-overlay" onClick={() => setShowModal(false)}>
            <div className="sa-modal-box" onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: '#1a1a1a', fontFamily: 'Playfair Display, serif' }}>Add Sub-Account</h3>
                  <p style={{ margin: '3px 0 0', fontSize: 12, color: '#999' }}>They can log in independently</p>
                </div>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: 22, lineHeight: 1 }}>×</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label className="sa-label">Label (optional)</label>
                  <input className="sa-input" placeholder="e.g. Manager, Cashier" value={newAcc.label} onChange={e => setNewAcc(p => ({ ...p, label: e.target.value }))} />
                </div>
                <div>
                  <label className="sa-label">Email *</label>
                  <input className="sa-input" type="email" placeholder="login@example.com" value={newAcc.email}
                    onChange={e => { setNewAcc(p => ({ ...p, email: e.target.value })); setErrors(er => ({ ...er, email: undefined })); }}
                    style={{ borderColor: errors.email ? '#ef4444' : undefined }}
                  />
                  {errors.email && <p style={{ fontSize: 12, color: '#ef4444', margin: '4px 0 0' }}>{errors.email}</p>}
                </div>
                <div>
                  <label className="sa-label">Password *</label>
                  <div style={{ position: 'relative' }}>
                    <input className="sa-input" type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters"
                      value={newAcc.password}
                      onChange={e => { setNewAcc(p => ({ ...p, password: e.target.value })); setErrors(er => ({ ...er, password: undefined })); }}
                      style={{ borderColor: errors.password ? '#ef4444' : undefined, paddingRight: 42 }}
                    />
                    <button onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa' }}>
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.password && <p style={{ fontSize: 12, color: '#ef4444', margin: '4px 0 0' }}>{errors.password}</p>}
                </div>
              </div>

              <div style={{ marginTop: 22, display: 'flex', gap: 9 }}>
                <button className="sa-modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="sa-modal-submit" onClick={handleAdd} disabled={addLoading}>
                  {addLoading ? <><Loader2 size={15} color="#fff" style={{ animation: 'spin 1s linear infinite' }} /> Adding…</> : 'Add Sub-Account'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SubAccountsTab;