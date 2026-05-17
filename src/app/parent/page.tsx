'use client';

import { FormEvent, useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import SiteFooter from '@/components/SiteFooter';
import {
  parentRegister,
  parentLogin,
  createInvite,
  getParentChildren,
  getParentInvites,
  PARENT_APK_URL,
  SITE_URL,
  type ParentAuthResponse,
  type InviteResponse,
} from '@/lib/wivme-api';

type View = 'auth' | 'dashboard';
type AuthTab = 'login' | 'register';

const BOARDS = ['CBSE', 'ICSE'];
const GRADES = ['6', '7', '8', '9', '10'];

export default function ParentPage() {
  const [view, setView] = useState<View>('auth');
  const [authTab, setAuthTab] = useState<AuthTab>('register');
  const [token, setToken] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');

  // Auth form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Dashboard
  const [children, setChildren] = useState<Array<{ child_id: string; name: string; standard: string; board: string; score: number }>>([]);
  const [invites, setInvites] = useState<InviteResponse[]>([]);

  // Add child form
  const [showAddChild, setShowAddChild] = useState(false);
  const [childName, setChildName] = useState('');
  const [childGrade, setChildGrade] = useState('8');
  const [childBoard, setChildBoard] = useState('CBSE');
  const [addingChild, setAddingChild] = useState(false);
  const [newInvite, setNewInvite] = useState<InviteResponse | null>(null);
  const [copied, setCopied] = useState(false);

  // Check saved session
  useEffect(() => {
    const saved = sessionStorage.getItem('wivme_parent');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setToken(data.token);
        setParentName(data.name);
        setParentEmail(data.email);
        setView('dashboard');
      } catch { /* ignore */ }
    }
  }, []);

  // Load dashboard data
  useEffect(() => {
    if (!token) return;
    getParentChildren(token).then((d) => setChildren(d.children || [])).catch(() => {});
    getParentInvites(token).then((d) => setInvites(d.invites || [])).catch(() => {});
  }, [token]);

  const handleAuth = (data: ParentAuthResponse) => {
    setToken(data.access_token);
    setParentName(data.parent.name);
    setParentEmail(data.parent.email);
    sessionStorage.setItem('wivme_parent', JSON.stringify({
      token: data.access_token,
      name: data.parent.name,
      email: data.parent.email,
    }));
    setView('dashboard');
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const data = await parentRegister(name, email, password, phone || undefined);
      handleAuth(data);
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const data = await parentLogin(email, password);
      handleAuth(data);
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAddChild = async (e: FormEvent) => {
    e.preventDefault();
    setAddingChild(true);
    try {
      const invite = await createInvite(token, childName, childGrade, childBoard);
      setNewInvite(invite);
      setInvites((prev) => [invite, ...prev]);
      setChildName('');
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Failed to create invite');
    } finally {
      setAddingChild(false);
    }
  };

  const getInviteLink = (invite: InviteResponse) =>
    invite.magic_link || `${SITE_URL}/join/${invite.code}`;

  const shareWhatsApp = (invite: InviteResponse) => {
    const link = getInviteLink(invite);
    const msg = `Hey! I've signed you up for *Wivme* — an app that helps you remember what you learn in school using short audio episodes, quizzes, and spaced repetition.

Here's what to do:
1. Tap this link: ${link}
2. Create your account
3. Download the app and start learning!

It's free for this academic year. Let me know once you've signed up!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const shareSMS = (invite: InviteResponse) => {
    const link = getInviteLink(invite);
    const msg = `I signed you up for Wivme - an app that helps you remember what you learn in school. Tap this link to create your account and download the app: ${link}`;
    window.open(`sms:?body=${encodeURIComponent(msg)}`, '_blank');
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const logout = () => {
    sessionStorage.removeItem('wivme_parent');
    setToken('');
    setView('auth');
    setName('');
    setEmail('');
    setPassword('');
    setPhone('');
  };

  return (
    <>
    <Navigation />
    <div className="parent-page">
      <div className="parent-container">

        {view === 'auth' && (
          <div className="parent-auth-card">
            <h1>Parent Portal</h1>
            <p className="parent-auth-sub">Register to enroll your child in Wivme</p>

            <div className="parent-tabs">
              <button className={authTab === 'register' ? 'active' : ''} onClick={() => { setAuthTab('register'); setAuthError(''); }}>
                Register
              </button>
              <button className={authTab === 'login' ? 'active' : ''} onClick={() => { setAuthTab('login'); setAuthError(''); }}>
                Login
              </button>
            </div>

            {authTab === 'register' ? (
              <form onSubmit={handleRegister} className="parent-form">
                <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="tel" placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <input type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                {authError && <p className="parent-error">{authError}</p>}
                <button type="submit" className="parent-btn" disabled={authLoading}>
                  {authLoading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="parent-form">
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                {authError && <p className="parent-error">{authError}</p>}
                <button type="submit" className="parent-btn" disabled={authLoading}>
                  {authLoading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            )}

          </div>
        )}

        {view === 'dashboard' && (
          <div className="parent-dashboard">
            <div className="parent-header">
              <div>
                <h1>Hi, {parentName.split(' ')[0]}</h1>
                <p className="parent-email">{parentEmail}</p>
              </div>
              <button className="parent-btn parent-btn--small" onClick={logout}>Logout</button>
            </div>

            {/* Download app banner */}
            <div className="parent-banner">
              <p>Download the Wivme Parent app to track your child&apos;s progress on the go.</p>
              <a href={PARENT_APK_URL} className="parent-btn parent-btn--outline parent-btn--small">Download App</a>
            </div>

            {/* Children */}
            <section className="parent-section">
              <div className="parent-section-header">
                <h2>Your Children</h2>
                <button className="parent-btn parent-btn--small" onClick={() => { setShowAddChild(true); setNewInvite(null); }}>
                  + Add Child
                </button>
              </div>

              {children.length === 0 && !showAddChild && (
                <p className="parent-empty">No children linked yet. Click &quot;Add Child&quot; to get started.</p>
              )}

              {children.map((c) => (
                <div key={c.child_id} className="parent-child-card">
                  <div>
                    <strong>{c.name}</strong>
                    <span className="parent-tag">Grade {c.standard} &middot; {c.board}</span>
                  </div>
                  <span className="parent-score">{c.score} pts</span>
                </div>
              ))}
            </section>

            {/* Add child form */}
            {showAddChild && !newInvite && (
              <section className="parent-section">
                <h2>Add a Child</h2>
                <form onSubmit={handleAddChild} className="parent-form">
                  <input type="text" placeholder="Child's name" value={childName} onChange={(e) => setChildName(e.target.value)} required />
                  <div className="parent-form-row">
                    <select value={childGrade} onChange={(e) => setChildGrade(e.target.value)}>
                      {GRADES.map((g) => <option key={g} value={g}>Grade {g}</option>)}
                    </select>
                    <select value={childBoard} onChange={(e) => setChildBoard(e.target.value)}>
                      {BOARDS.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <button type="submit" className="parent-btn" disabled={addingChild}>
                    {addingChild ? 'Creating invite...' : 'Create Invite'}
                  </button>
                  <button type="button" className="parent-btn parent-btn--ghost" onClick={() => setShowAddChild(false)}>
                    Cancel
                  </button>
                </form>
              </section>
            )}

            {/* Invite created — share screen */}
            {newInvite && (
              <section className="parent-section parent-share-section">
                <h2>Share with {newInvite.child_name}</h2>
                <p className="parent-share-sub">Send this link to your child so they can download the app and create their account.</p>

                <div className="parent-code-box">
                  <span className="parent-code">{newInvite.code}</span>
                  <button className="parent-btn parent-btn--small" onClick={() => copyLink(getInviteLink(newInvite))}>
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>

                <div className="parent-share-buttons">
                  <button className="parent-btn parent-btn--whatsapp" onClick={() => shareWhatsApp(newInvite)}>
                    Share via WhatsApp
                  </button>
                  <button className="parent-btn parent-btn--sms" onClick={() => shareSMS(newInvite)}>
                    Share via SMS
                  </button>
                </div>

                <button className="parent-btn parent-btn--ghost" onClick={() => { setNewInvite(null); setShowAddChild(false); }}>
                  Done
                </button>
              </section>
            )}

            {/* Previous invites */}
            {invites.length > 0 && !newInvite && (
              <section className="parent-section">
                <h2>Invites</h2>
                {invites.map((inv) => (
                  <div key={inv.code} className="parent-invite-row">
                    <div>
                      <strong>{inv.child_name}</strong>
                      <span className="parent-code-small">{inv.code}</span>
                    </div>
                    <button className="parent-btn parent-btn--small" onClick={() => shareWhatsApp(inv)}>Share</button>
                  </div>
                ))}
              </section>
            )}
          </div>
        )}
      </div>
    </div>
    <SiteFooter />
    </>
  );
}
