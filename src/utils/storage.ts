import { LessonPlan, SharedResource, PlanStatus, PrimaryGrade, SubjectId } from '../types';
import { INITIAL_LESSON_PLANS, SHARED_COMMUNITY_RESOURCES } from '../data/curriculumData';

const STORAGE_KEY_PLANS = 'kruplano_plans_v1';
const STORAGE_KEY_RESOURCES = 'kruplano_resources_v1';
const STORAGE_KEY_PIN = 'kruplano_pin_lock';
const STORAGE_KEY_BIO_ENABLED = 'kruplano_biometric_enabled';
const STORAGE_KEY_THEME = 'kruplano_theme';
const STORAGE_KEY_LANG = 'kruplano_lang';

export function getLocalPlans(): LessonPlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PLANS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to read local plans', e);
  }
  return INITIAL_LESSON_PLANS;
}

export function saveLocalPlans(plans: LessonPlan[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(plans));
  } catch (e) {
    console.error('Failed to save local plans', e);
  }
}

export function getLocalResources(): SharedResource[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RESOURCES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to read local resources', e);
  }
  return SHARED_COMMUNITY_RESOURCES;
}

export function saveLocalResources(res: SharedResource[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_RESOURCES, JSON.stringify(res));
  } catch (e) {
    console.error('Failed to save local resources', e);
  }
}

// Cloud sync integration
export async function syncPlansWithCloud(localPlans: LessonPlan[]): Promise<LessonPlan[]> {
  try {
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plansToUpload: localPlans }),
    });
    if (response.ok) {
      const data = await response.json();
      if (data.serverPlans && Array.isArray(data.serverPlans)) {
        saveLocalPlans(data.serverPlans);
        return data.serverPlans;
      }
    }
  } catch (err) {
    console.log('Running in offline mode; using cached plans.');
  }
  return localPlans;
}

// CSV Export Generator
export function exportPlansToCsv(plans: LessonPlan[]): void {
  const headers = [
    'Plan ID',
    'Date',
    'Grade',
    'Subject',
    'Lesson Title (Khmer)',
    'Lesson Title (English)',
    'Duration (Min)',
    'Status',
    'Total Students',
    'Teacher',
    'School',
    'Principal Approved',
  ];

  const rows = plans.map((p) => [
    `"${p.id}"`,
    `"${p.date}"`,
    `"${p.grade}"`,
    `"${p.subject}"`,
    `"${p.lessonTitleKm.replace(/"/g, '""')}"`,
    `"${p.lessonTitleEn.replace(/"/g, '""')}"`,
    p.durationMinutes,
    `"${p.status}"`,
    p.totalStudents,
    `"${p.teacherNameKm}"`,
    `"${p.schoolNameKm}"`,
    `"${p.status === 'approved' ? 'Yes' : 'No'}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `kruplano_lesson_plans_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Biometric & WebAuthn helper
export async function verifyBiometricAuth(): Promise<boolean> {
  if (window.PublicKeyCredential && PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
    try {
      const isAvailable = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (isAvailable) {
        // Trigger platform authentication challenge
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);
        const options: CredentialCreationOptions = {
          publicKey: {
            challenge,
            rp: { name: 'KruPlano MoEYS' },
            user: {
              id: new Uint8Array([1, 2, 3, 4]),
              name: 'teacher@moeys.gov.kh',
              displayName: 'Cambodian Primary Educator',
            },
            pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
            authenticatorSelection: {
              authenticatorAttachment: 'platform',
              userVerification: 'preferred',
            },
            timeout: 30000,
          },
        };
        await navigator.credentials.create(options);
        return true;
      }
    } catch (e) {
      console.warn('Biometric challenge skipped or canceled, falling back to PIN', e);
    }
  }
  return false;
}
