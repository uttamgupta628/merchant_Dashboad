import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, Trash2, Loader2, CheckCircle, Users, Eye, EyeOff,
} from 'lucide-react';
import axiosInstance from './Axios';
import { C, RealSubAccount } from './Tokens';
import { Spinner } from './Ui';

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
    <div style={{ maxWidth: 1060, margin: '0 auto', width: '100%' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 22, right: 22, zIndex: 9999,
          background: toast.type === 'success' ? C.successBg : C.errorBg,
          border: `1.5px solid ${toast.type === 'success' ? C.success + '40' : C.error + '40'}`,
          borderRadius: 14, padding: '13px 18px',
          display: 'flex', alignItems: 'center', gap: 11,
          boxShadow: '0 8px 28px rgba(28,20,16,0.14)',
          minWidth: 260,
        }}>
          <CheckCircle size={16} color={toast.type === 'success' ? C.success : C.error} />
          <span style={{
            flex: 1, fontSize: 13, fontWeight: 600,
            color: toast.type === 'success' ? C.success : C.error,
          }}>{toast.msg}</span>
          <button onClick={() => setToast(null)} style={{
            background: 'none', border: 'none', cursor: 'pointer', color: C.gray, fontSize: 18, lineHeight: 1,
          }}>×</button>
        </div>
      )}

      {/* Confirm dialog */}
      {confirmId && confirmTarget && (
        <div onClick={() => setConfirmId(null)} style={{
          position: 'fixed', inset: 0, zIndex: 8888,
          background: 'rgba(28,20,16,0.5)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: C.card, borderRadius: 20, padding: '30px 32px',
            maxWidth: 400, width: '90%', border: `1.5px solid ${C.border}`,
            boxShadow: '0 32px 64px rgba(28,20,16,0.18)',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 16, background: C.errorBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
            }}>
              <Trash2 size={20} color={C.error} />
            </div>
            <h3 style={{
              fontSize: 17, fontWeight: 700, margin: '0 0 6px',
              fontFamily: 'Playfair Display, serif',
            }}>Remove Sub-Account</h3>
            <p style={{ fontSize: 14, color: C.textSub, margin: '0 0 24px' }}>
              Remove <strong style={{ color: C.text }}>{confirmTarget.email}</strong>?
              This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirmId(null)} style={{
                flex: 1, padding: 12, borderRadius: 10,
                border: `1.5px solid ${C.border}`, background: 'none',
                color: C.textSub, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13,
              }}>Cancel</button>
              <button onClick={() => handleRemove(confirmId)} style={{
                flex: 1, padding: 12, borderRadius: 10, border: 'none',
                background: C.error, color: '#fff', fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit', fontSize: 13,
              }}>Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: 24, flexWrap: 'wrap', gap: 14,
      }}>
        <div>
          <h2 style={{
            margin: 0, fontSize: 24, fontWeight: 700, color: C.text,
            fontFamily: 'Playfair Display, serif',
          }}>Sub-Accounts</h2>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: C.gray }}>
            {accounts.length}/10 slots used
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary"
          style={{ padding: '10px 20px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 7 }}>
          <Plus size={14} /> Add Login
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ height: 5, background: C.bgDeep, borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            width: `${(accounts.length / 10) * 100}%`, height: 5,
            background: accounts.length >= 9 ? C.error : C.brand,
            borderRadius: 4, transition: 'width 0.5s ease',
          }} />
        </div>
      </div>

      {/* List */}
      {loading ? <Spinner /> : accounts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 24px' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 22, background: C.brandLight,
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px',
          }}>
            <Users size={28} color={C.brand} />
          </div>
          <h3 style={{
            fontSize: 17, fontWeight: 700, color: C.text, margin: '0 0 6px',
            fontFamily: 'Playfair Display, serif',
          }}>No sub-accounts yet</h3>
          <p style={{ fontSize: 14, color: C.gray, margin: 0 }}>
            Add your first login to give a team member access.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {accounts.map((sa, i) => (
            <div key={sa._id} className="card-hover fade-up" style={{
              background: C.card, borderRadius: 18, padding: '18px 20px',
              border: `1.5px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 13,
              opacity: sa.isActive ? 1 : 0.65, animationDelay: `${i * 55}ms`,
              boxShadow: '0 2px 8px rgba(28,20,16,0.05)',
            }}>
              {/* Avatar */}
              <div style={{
                width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                background: sa.isActive
                  ? `linear-gradient(135deg, ${C.brand}, ${C.brandDark})`
                  : C.bgDeep,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 700, color: sa.isActive ? '#fff' : C.gray,
                fontFamily: 'Playfair Display, serif',
              }}>
                {(sa.label || sa.email || '?').charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {sa.label && (
                  <p style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: '0 0 1px' }}>
                    {sa.label}
                  </p>
                )}
                <p style={{
                  fontSize: 13, color: C.gray, margin: '0 0 5px',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{sa.email}</p>
                <div style={{ display: 'flex', gap: 9 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 20,
                    background: sa.isActive ? C.successBg : C.errorBg,
                    color: sa.isActive ? C.success : C.error,
                  }}>
                    {sa.isActive ? '● Active' : '○ Inactive'}
                  </span>
                  <span style={{ fontSize: 11, color: C.gray }}>
                    {new Date(sa.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
                {actionId === sa._id ? (
                  <Loader2 size={18} color={C.brand} style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <>
                    {/* Toggle switch */}
                    <button
                      onClick={() => handleToggle(sa._id, sa.isActive)}
                      style={{
                        width: 46, height: 25, borderRadius: 13, border: 'none',
                        background: sa.isActive
                          ? `linear-gradient(135deg, ${C.brand}, ${C.brandDark})`
                          : C.bgDeep,
                        cursor: 'pointer', position: 'relative', transition: 'background 0.25s',
                        boxShadow: sa.isActive ? `0 3px 10px rgba(184,134,11,0.3)` : 'none',
                      }}
                    >
                      <span style={{
                        position: 'absolute', top: 3,
                        left: sa.isActive ? 22 : 3,
                        width: 19, height: 19, borderRadius: '50%', background: '#fff',
                        boxShadow: '0 1px 4px rgba(28,20,16,0.25)',
                        transition: 'left 0.25s cubic-bezier(0.4,0,0.2,1)',
                        display: 'block',
                      }} />
                    </button>

                    {/* Remove */}
                    <button onClick={() => setConfirmId(sa._id)} style={{
                      width: 34, height: 34, borderRadius: 9,
                      background: C.errorBg, border: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                      <Trash2 size={14} color={C.error} />
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
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <h3 style={{
                  margin: 0, fontSize: 19, fontWeight: 700, color: C.text,
                  fontFamily: 'Playfair Display, serif',
                }}>Add Sub-Account</h3>
                <p style={{ margin: '3px 0 0', fontSize: 12, color: C.gray }}>
                  They can log in independently
                </p>
              </div>
              <button onClick={() => setShowModal(false)} style={{
                background: 'none', border: 'none', color: C.gray, cursor: 'pointer', fontSize: 22, lineHeight: 1,
              }}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Label */}
              <div>
                <label style={{
                  fontSize: 10, fontWeight: 700, color: C.gray, display: 'block',
                  marginBottom: 5, letterSpacing: '1.8px', textTransform: 'uppercase',
                }}>Label (optional)</label>
                <input
                  placeholder="e.g. Manager, Cashier"
                  className="input-field"
                  value={newAcc.label}
                  onChange={e => setNewAcc(p => ({ ...p, label: e.target.value }))}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{
                  fontSize: 10, fontWeight: 700, color: C.gray, display: 'block',
                  marginBottom: 5, letterSpacing: '1.8px', textTransform: 'uppercase',
                }}>Email *</label>
                <input
                  type="email" placeholder="login@example.com" className="input-field"
                  value={newAcc.email}
                  onChange={e => { setNewAcc(p => ({ ...p, email: e.target.value })); setErrors(er => ({ ...er, email: undefined })); }}
                  style={{ borderColor: errors.email ? C.error : undefined }}
                />
                {errors.email && <p style={{ fontSize: 12, color: C.error, margin: '4px 0 0' }}>{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label style={{
                  fontSize: 10, fontWeight: 700, color: C.gray, display: 'block',
                  marginBottom: 5, letterSpacing: '1.8px', textTransform: 'uppercase',
                }}>Password *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="Min. 6 characters" className="input-field"
                    value={newAcc.password}
                    onChange={e => { setNewAcc(p => ({ ...p, password: e.target.value })); setErrors(er => ({ ...er, password: undefined })); }}
                    style={{ borderColor: errors.password ? C.error : undefined, paddingRight: 42 }}
                  />
                  <button
                    onClick={() => setShowPw(v => !v)}
                    style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: C.gray,
                    }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p style={{ fontSize: 12, color: C.error, margin: '4px 0 0' }}>{errors.password}</p>}
              </div>
            </div>

            <div style={{ marginTop: 22, display: 'flex', gap: 9 }}>
              <button onClick={() => setShowModal(false)} style={{
                flex: 1, padding: 12, background: 'none',
                border: `1.5px solid ${C.border}`, borderRadius: 10,
                color: C.gray, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'Instrument Sans, sans-serif',
              }}>Cancel</button>
              <button onClick={handleAdd} disabled={addLoading} className="btn-primary"
                style={{ flex: 2, padding: 12, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {addLoading
                  ? <><Loader2 size={15} color="#fff" style={{ animation: 'spin 1s linear infinite' }} /> Adding…</>
                  : 'Add Sub-Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubAccountsTab;