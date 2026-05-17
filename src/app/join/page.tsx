'use client';

import { useEffect, useState } from 'react';
import { getInviteInfo, STUDENT_APK_URL, type InviteInfo } from '@/lib/wivme-api';

type Step = 'loading' | 'invite' | 'error';

export default function JoinPage() {
  const [step, setStep] = useState<Step>('loading');
  const [invite, setInvite] = useState<InviteInfo | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
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
        setStep('invite');
      })
      .catch((err) => {
        setStep('error');
        setErrorMsg(err.message);
      });
  }, []);

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
            <a href="/" className="join-btn join-btn--primary">Go to Wivme</a>
          </div>
        )}

        {step === 'invite' && invite && (
          <div className="join-invite">
            <h2>Welcome to Wivme, {invite.child_name}!</h2>
            <p className="join-subtitle">
              Your parent <strong>{invite.parent_name}</strong> enrolled you.
              <br />Grade {invite.child_grade} &middot; {invite.child_board}
            </p>

            <p className="join-about">
              Wivme helps you remember what you learn in school using short audio episodes,
              quizzes, and spaced repetition. Download the app to get started.
            </p>

            <div className="join-steps">
              <div className="join-step">
                <span className="join-step-num">1</span>
                <div>
                  <h3>Download the Wivme app</h3>
                  <a href={STUDENT_APK_URL} className="join-btn join-btn--download">
                    Download for Android
                  </a>
                </div>
              </div>

              <div className="join-step">
                <span className="join-step-num">2</span>
                <div>
                  <h3>Open the app and register</h3>
                  <p>Create your account in the app using your email and password.</p>
                </div>
              </div>

              <div className="join-step">
                <span className="join-step-num">3</span>
                <div>
                  <h3>Enter your invite code</h3>
                  <div className="join-code-display">
                    <span className="join-code-value">{code}</span>
                  </div>
                  <p>Use this code in the app to link with your parent.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
