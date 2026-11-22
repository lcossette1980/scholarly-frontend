import { ensureVercelQueue } from './analytics';

jest.mock('@vercel/analytics/react', () => ({ track: () => {} }), {
  virtual: true,
});

describe('ensureVercelQueue', () => {
  beforeEach(() => {
    delete window.va;
    delete window.vaq;
  });

  it('creates the library queue so first-load events are kept', () => {
    ensureVercelQueue();
    window.va('event', { name: 'signup_view' });
    expect(window.vaq).toEqual([['event', { name: 'signup_view' }]]);
  });

  it('leaves an existing window.va alone', () => {
    const existing = () => {};
    window.va = existing;
    ensureVercelQueue();
    expect(window.va).toBe(existing);
    expect(window.vaq).toBeUndefined();
  });
});
