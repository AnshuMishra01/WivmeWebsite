/**
 * Client for the WivmeBackend (Go) API.
 * Used for parent auth, invite codes, and child registration.
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_WIVME_BACKEND_URL ?? 'https://wivme-aura.onrender.com/api/v1';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wivmewebsite-1.onrender.com';

const STUDENT_APK_URL = 'https://github.com/AnshuMishra01/WivmeWebsite/releases/download/v1.0.0/wivme-student-v1.0.0.apk';
const PARENT_APK_URL = 'https://github.com/AnshuMishra01/WivmeWebsite/releases/download/v1.0.0/wivme-parent-v1.0.0.apk';

export { STUDENT_APK_URL, PARENT_APK_URL, SITE_URL };

async function post<T>(path: string, body: Record<string, unknown>, token?: string): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Frontend-URL': SITE_URL,
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || data.error || `Request failed (${res.status})`);
  }
  return data as T;
}

async function get<T>(path: string, token?: string): Promise<T> {
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BACKEND_URL}${path}`, { headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || data.error || `Request failed (${res.status})`);
  }
  return data as T;
}

// ── Auth ────────────────────────────────────────────────────────

export interface ParentAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  parent: {
    parent_id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

export function parentRegister(name: string, email: string, password: string, phone?: string) {
  return post<ParentAuthResponse>('/auth/parent/register', { name, email, password, phone });
}

export function parentLogin(email: string, password: string) {
  return post<ParentAuthResponse>('/auth/parent/login', { email, password });
}

// ── Invite Codes ────────────────────────────────────────────────

export interface InviteResponse {
  code: string;
  magic_link: string;
  expires_at: string;
  child_name: string;
}

export function createInvite(token: string, childName: string, childGrade: string, childBoard: string) {
  return post<InviteResponse>('/parent/invite-child', {
    child_name: childName,
    child_grade: childGrade,
    child_board: childBoard,
  }, token);
}

export interface InviteInfo {
  code: string;
  child_name: string;
  child_grade: string;
  child_board: string;
  parent_name: string;
  status: string;
  expires_at: string;
}

export function getInviteInfo(code: string) {
  return get<InviteInfo>(`/auth/invite/${code}`);
}

export interface ChildRegisterResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: {
    student_id: string;
    name: string;
    email: string;
    standard: string;
    board: string;
  };
}

export function registerWithInvite(code: string, name: string, email: string, password: string) {
  return post<ChildRegisterResponse>('/auth/direct/register-with-invite', {
    code, name, email, password,
  });
}

// ── Parent Data ─────────────────────────────────────────────────

export function getParentProfile(token: string) {
  return get<{ id: string; name: string; email: string; phone?: string }>('/parent/profile', token);
}

export function getParentInvites(token: string) {
  return get<{ invites: InviteResponse[] }>('/parent/invites', token);
}

export function getParentChildren(token: string) {
  return get<{ children: Array<{ child_id: string; child_type: string; name: string; standard: string; board: string; score: number; rank: number }> }>('/parent/children', token);
}
