// src/components/SourceLimitCard.js
// Starter reached 5 of 5 free sources: replace the dead "Add source" button
// with the two plans that actually lift the limit (spec 2B2, Plus at the
// source limit). Plus doesn't lower the per-page price, so it says so.
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { SUBSCRIPTION_PLANS, createCheckoutSession } from '../services/stripe';
import { trackSourceLimitReached, trackUpsellCtaClicked } from '../services/analytics';

const SourceLimitCard = ({ userId }) => {
  const [busy, setBusy] = useState(null);
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackSourceLimitReached();
  }, []);

  const go = async (planId) => {
    setBusy(planId);
    trackUpsellCtaClicked(planId === 'student' ? 'plus' : 'pro', 'source_limit');
    try {
      await createCheckoutSession(userId, SUBSCRIPTION_PLANS[planId].priceId, planId);
    } catch (error) {
      toast.error(error.message || 'Failed to start checkout');
      setBusy(null);
    }
  };

  return (
    <div className="rounded-lg border border-secondary-200 bg-secondary-50 p-4">
      <p className="text-sm font-semibold text-secondary-900">
        You've imported 5 of 5 free sources.
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div>
          <p className="text-sm text-secondary-700">
            <strong>Plus, $9.99/month:</strong> unlimited sources (drafts still pay per page).
          </p>
          <button
            type="button"
            className="btn btn-secondary btn-sm mt-2"
            onClick={() => go('student')}
            disabled={busy !== null}
          >
            {busy === 'student' ? 'Starting…' : 'Get Plus'}
          </button>
        </div>
        <div>
          <p className="text-sm text-secondary-700">
            <strong>Pro, $19.99/month:</strong> unlimited sources + 10 pages/month + Research
            Feeds.
          </p>
          <button
            type="button"
            className="btn btn-primary btn-sm mt-2"
            onClick={() => go('researcher')}
            disabled={busy !== null}
          >
            {busy === 'researcher' ? 'Starting…' : 'Get Pro'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SourceLimitCard;
