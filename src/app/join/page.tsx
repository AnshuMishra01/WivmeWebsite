'use client';

import { FormEvent, useEffect, useState } from 'react';
import { getInviteInfo, registerWithInvite, STUDENT_APK_URL, type InviteInfo } from '@/lib/wivme-api';

type Step = 'loading' | 'invite' | 'register' | 'success' | 'error';

export default function JoinPage() {
  const [code, setCode] = useState('');
  const [step, setStep] = useState<Step>('loading');
  const [invite, setInvite] = useState<InviteInfo | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Registration form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [regError, setRegError] = useState('');

  useEffect(() => {
    // Extract code from URL path: /join/WIVME-A3K9 or query: /join?code=WIVME-A3K9
    const path = window.location.pathname;
    const pathMatch = path.match(/\/join\/(.+)/);
    const params = new URLSearchParams(window.location.search);
    const inviteCode = (pathMatch?.[1] || params.get('code') || '').toUpperCase().trim();

    if (!inviteCode) {
      setStep('error');
      setErrorMsg('No invite code provided.');
      return;
    }

    setCode(inviteCode);
    getInviteInfo(inviteCode)
      .then((info) => {
        setInvite(info);
        setName(info.child_name);
        setStep('invite');
      })
      .catch((err) => {
        setStep('error');
        setErrorMsg(err.message);
      });
  }, []);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setRegError('');
    setSubmitting(true);
    try {
      await registerWithInvite(code, name, email, password);
      setStep('success');
    } catch (err: unknown) {
      setRegError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="join-page">
      <div className="join-card">
        <div className="join-logo">Wivme</div>

        {step === 'loading' && (
          <div className="join-loading">
            <p>Verifying invite...</p>
          </div>
        )}

        {step === 'error' && (
          <div className="join-error">
            <h2>Oops!</h2>
            <p>{errorMsg}</p>
            <a href="https://wivme.ai" className="join-btn join-btn--primary">Go to Wivme</a>
          </div>
        )}

        {step === 'invite' && invite && (
          <div className="join-invite">
            <h2>Welcome to Wivme, {invite.child_name}!</h2>
            <p className="join-subtitle">
              Your parent <strong>{invite.parent_name}</strong> enrolled you.
              <br />Grade {invite.child_grade} &middot; {invite.child_board}
            </p>

            <div className="join-steps">
              <div className="join-step">
                <span className="join-step-num">1</span>
                <div>
                  <h3>Download the app</h3>
                  <a href={STUDENT_APK_URL} className="join-btn join-btn--download">
                    Download for Android
                  </a>
                </div>
              </div>

              <div className="join-step">
                <span className="join-step-num">2</span>
                <div>
                  <h3>Create your account</h3>
                  <p>Set up your login so you can use the app.</p>
                </div>
              </div>
            </div>

            <button className="join-btn join-btn--primary" onClick={() => setStep('register')}>
              Create Account
            </button>
          </div>
        )}

        {step === 'register' && invite && (
          <div className="join-register">
            <h2>Create your account</h2>
            <p className="join-subtitle">Grade {invite.child_grade} &middot; {invite.child_board}</p>

            <form onSubmit={handleRegister} className="join-form">
              <label>
                Name
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
              <label>
                Email
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com" />
              </label>
              <label>
                Password
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="At least 6 characters" />
              </label>

              {regError && <p className="join-error-msg">{regError}</p>}

              <button type="submit" className="join-btn join-btn--primary" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Account'}
              </button>
              <button type="button" className="join-btn join-btn--back" onClick={() => setStep('invite')}>
                Back
              </button>
            </form>
          </div>
        )}

        {step === 'success' && (
          <div className="join-success">
            <h2>You&apos;re all set!</h2>
            <p>Your account is created and linked to your parent.</p>
            <div className="join-next-steps">
              <p><strong>Next:</strong> Download the app and log in with your email and password.</p>
              <a href={STUDENT_APK_URL} className="join-btn join-btn--download">
                Download Wivme App
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
