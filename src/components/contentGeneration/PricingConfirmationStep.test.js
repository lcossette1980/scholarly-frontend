import { proAlternative } from './PricingConfirmationStep';

jest.mock('../../services/contentPayment', () => ({}), { virtual: false });
jest.mock('../../services/api', () => ({ contentGenerationAPI: {} }));
jest.mock('../../services/stripe', () => ({ SUBSCRIPTION_PLANS: {}, createCheckoutSession: jest.fn() }));
jest.mock('./PaymentModal', () => () => null);
jest.mock('../../context/AuthContext', () => ({ useAuth: () => ({}) }));
jest.mock('../../services/admin', () => ({ isAdmin: () => false }));
jest.mock('../../services/analytics', () => ({}));

describe('proAlternative', () => {
  it('stays hidden for a short Standard draft', () => {
    // 4 pages x $1.49 = $5.96 vs Pro $19.99 + $0
    expect(proAlternative(4, 'standard', 5.96).show).toBe(false);
  });
  it('shows once Pro is within $10 (Standard, 7 pages)', () => {
    // 7 x 1.49 = 10.43; Pro = 19.99 + 0 -> diff 9.56
    expect(proAlternative(7, 'standard', 10.43).show).toBe(true);
  });
  it('shows for Professional at 5 pages', () => {
    // 5 x 2.49 = 12.45; Pro = 19.99 -> diff 7.54
    expect(proAlternative(5, 'pro', 12.45).show).toBe(true);
    expect(proAlternative(4, 'pro', 9.96).show).toBe(false);
  });
  it('prices pages beyond the 10 included', () => {
    const a = proAlternative(14, 'standard', 20.86);
    expect(a.proDraftCost).toBeCloseTo(4.0);
    expect(a.show).toBe(true);
    expect(proAlternative(14, 'pro', 34.86).proDraftCost).toBeCloseTo(8.0);
  });
});
