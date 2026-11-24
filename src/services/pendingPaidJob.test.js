import {
  paymentIntentIdFromSecret,
  savePendingPaidJob,
  loadPendingPaidJob,
  clearPendingPaidJob,
  planResume,
  MAX_AGE_MS,
} from './pendingPaidJob';

const REC = {
  paymentIntentId: 'pi_1',
  sources: [{ id: 's1' }],
  outline: { t: 1 },
  settings: {},
  tier: 'standard',
};

beforeEach(() => sessionStorage.clear());

test('payment intent id from client secret', () => {
  expect(paymentIntentIdFromSecret('pi_123_secret_abc')).toBe('pi_123');
  expect(paymentIntentIdFromSecret(null)).toBeNull();
});

test('save / load / clear round trip, keyed by payment intent', () => {
  savePendingPaidJob(REC);
  expect(loadPendingPaidJob('pi_1').sources[0].id).toBe('s1');
  expect(loadPendingPaidJob('pi_other')).toBeNull();
  clearPendingPaidJob();
  expect(loadPendingPaidJob('pi_1')).toBeNull();
});

test('stale records are ignored', () => {
  savePendingPaidJob(REC);
  const later = Date.now() + MAX_AGE_MS + 1;
  expect(loadPendingPaidJob('pi_1', sessionStorage, later)).toBeNull();
});

test('no Stripe params -> nothing to do', () => {
  expect(planResume('?template=x').action).toBe('none');
});

test('succeeded + matching record -> resume', () => {
  savePendingPaidJob(REC);
  const p = planResume(
    '?payment_intent=pi_1&payment_intent_client_secret=x&redirect_status=succeeded'
  );
  expect(p.action).toBe('resume');
  expect(p.record.tier).toBe('standard');
});

test('succeeded but no record (other tab / cleared) -> support with the id', () => {
  const p = planResume('?payment_intent=pi_9&redirect_status=succeeded');
  expect(p).toEqual({ action: 'support', paymentIntentId: 'pi_9' });
});

test('failed -> retry (restore the pricing step when we can)', () => {
  savePendingPaidJob(REC);
  const p = planResume('?payment_intent=pi_1&redirect_status=failed');
  expect(p.action).toBe('retry');
  expect(p.record).not.toBeNull();
});
