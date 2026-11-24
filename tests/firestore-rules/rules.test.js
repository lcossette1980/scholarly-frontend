// Firestore rules tests (needs the emulator; see package.json description).
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} = require('@firebase/rules-unit-testing');
const {
  doc, setDoc, getDoc, updateDoc, deleteDoc, addDoc, collection, increment, serverTimestamp,
} = require('firebase/firestore');

const TRIAL = {
  plan: 'trial', status: 'active', entriesUsed: 0, entriesLimit: 5,
  entriesRemaining: 5, isLifetime: true, periodEnd: null,
};
let env;

test.before(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-draftengine',
    firestore: { rules: fs.readFileSync(path.join(__dirname, '../../firestore.rules'), 'utf8') },
  });
});
test.after(async () => env && env.cleanup());
test.beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async ctx => {
    await setDoc(doc(ctx.firestore(), 'users/alice'), {
      displayName: 'A', email: 'alice@example.test', subscription: { ...TRIAL, entriesUsed: 2, entriesRemaining: 3 },
      preferences: { researchFocus: '', notificationsEnabled: true, theme: 'light' },
    });
    await setDoc(doc(ctx.firestore(), 'bibliography_entries/e1'), { userId: 'alice', citation: 'c' });
    await setDoc(doc(ctx.firestore(), 'content_generation_jobs/j1'), { userId: 'alice', status: 'completed' });
  });
});

const alice = () => env.authenticatedContext('alice', { email: 'alice@example.test', email_verified: true }).firestore();
const bob = () => env.authenticatedContext('bob', { email: 'bob@example.test', email_verified: true }).firestore();
const admin = () => env.authenticatedContext('founder', { email: 'loren.cossette@gmail.com', email_verified: true }).firestore();

// ---- the P0 ------------------------------------------------------------
for (const [name, patch] of [
  ['is_admin', { is_admin: true }],
  ['subscription.plan', { 'subscription.plan': 'researcher' }],
  ['whole subscription', { subscription: { ...TRIAL, plan: 'researcher', entriesLimit: -1 } }],
  ['entriesLimit', { 'subscription.entriesLimit': 999 }],
  ['entriesUsed reset', { 'subscription.entriesUsed': 0 }],
  ['entriesUsed increment', { 'subscription.entriesUsed': increment(1) }],
  ['stripeCustomerId', { 'subscription.stripeCustomerId': 'cus_victim' }],
  ['outlineUsage', { outlineUsage: { date: '2026-11-23', count: 0 } }],
]) {
  test(`owner cannot write ${name}`, async () => {
    await assertFails(updateDoc(doc(alice(), 'users/alice'), patch));
  });
}

test('create with a paid plan or is_admin is denied', async () => {
  await assertFails(setDoc(doc(bob(), 'users/bob'), { displayName: 'B', email: 'bob@example.test', subscription: { ...TRIAL, plan: 'researcher' } }));
  await assertFails(setDoc(doc(bob(), 'users/bob'), { displayName: 'B', email: 'bob@example.test', is_admin: true }));
  await assertFails(setDoc(doc(bob(), 'users/bob'), { displayName: 'B', email: 'someone@else.test', subscription: TRIAL }));
});

// ---- legitimate client writes keep working ------------------------------
test('createUserDocument (trial default) works', async () => {
  await assertSucceeds(setDoc(doc(bob(), 'users/bob'), {
    displayName: 'B', email: 'bob@example.test', photoURL: '', createdAt: serverTimestamp(),
    subscription: TRIAL, preferences: { researchFocus: '', notificationsEnabled: true, theme: 'light' },
  }));
});
test('ProfilePage profile edit works', async () => {
  await assertSucceeds(updateDoc(doc(alice(), 'users/alice'), {
    displayName: 'Alice', 'preferences.researchFocus': 'x', 'preferences.notificationsEnabled': false, updatedAt: new Date(),
  }));
});
test('Dashboard onboarding works', async () => {
  await assertSucceeds(updateDoc(doc(alice(), 'users/alice'), {
    onboardingRole: 'analyst', onboardingPurpose: 'a', onboardingPurposes: ['a'], onboardingCompleted: true,
  }));
});
test('owner reads and deletes own doc; others cannot', async () => {
  await assertSucceeds(getDoc(doc(alice(), 'users/alice')));
  await assertFails(getDoc(doc(bob(), 'users/alice')));
  await assertFails(updateDoc(doc(bob(), 'users/alice'), { displayName: 'x' }));
  await assertSucceeds(deleteDoc(doc(alice(), 'users/alice')));
});

test('bibliography_entries: own CRUD only', async () => {
  await assertSucceeds(addDoc(collection(alice(), 'bibliography_entries'), { userId: 'alice', citation: 'c' }));
  await assertFails(addDoc(collection(alice(), 'bibliography_entries'), { userId: 'bob', citation: 'c' }));
  await assertSucceeds(updateDoc(doc(alice(), 'bibliography_entries/e1'), { citation: 'c2' }));
  await assertFails(updateDoc(doc(alice(), 'bibliography_entries/e1'), { userId: 'bob' }));
  await assertFails(getDoc(doc(bob(), 'bibliography_entries/e1')));
  await assertSucceeds(deleteDoc(doc(alice(), 'bibliography_entries/e1')));
});

test('content_generation_jobs: read/delete own, no client writes', async () => {
  await assertSucceeds(getDoc(doc(alice(), 'content_generation_jobs/j1')));
  await assertFails(getDoc(doc(bob(), 'content_generation_jobs/j1')));
  await assertFails(updateDoc(doc(alice(), 'content_generation_jobs/j1'), { payment_status: 'paid' }));
  await assertSucceeds(deleteDoc(doc(alice(), 'content_generation_jobs/j1')));
});

test('support_messages: users send, only the admin reads', async () => {
  const ref = await assertSucceeds(addDoc(collection(alice(), 'support_messages'), {
    userId: 'alice', userEmail: 'alice@example.test', userName: 'A', subject: 's', message: 'm',
    category: 'general', read: false, priority: 'medium', createdAt: serverTimestamp(),
  }));
  await assertFails(getDoc(doc(alice(), `support_messages/${ref.id}`)));
  await assertSucceeds(getDoc(doc(admin(), `support_messages/${ref.id}`)));
});

test('server-only collections are closed', async () => {
  await assertFails(getDoc(doc(alice(), 'monthly_page_reservations/alice_2026-11')));
  await assertFails(setDoc(doc(alice(), 'stripe_webhook_events/x'), { a: 1 }));
});
