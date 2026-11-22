// src/components/contentGeneration/PartialFailureBanner.js
// A5: shown on a completed draft when some sections ended as a support
// placeholder. The charge stands for those jobs; support regenerates or
// refunds the missing sections.
import React from 'react';
import { AlertTriangle, Mail } from 'lucide-react';

const SUPPORT_EMAIL = 'support@draftengineapp.com';

const PartialFailureBanner = ({
  failedSections,
  totalSections,
  jobId,
  title,
}) => {
  const failed = (failedSections || []).filter(Boolean);
  if (failed.length === 0) return null;

  const n = failed.length;
  const total = totalSections && totalSections >= n ? totalSections : null;
  const heading = total
    ? `${n} of ${total} sections couldn't be generated`
    : `${n} ${n === 1 ? 'section' : 'sections'} couldn't be generated`;
  const draftName = title || 'my draft';
  const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
    `Regenerate sections — ${draftName}`
  )}&body=${encodeURIComponent(
    `Job ID: ${jobId}\nMissing sections: ${failed
      .map((f) => f.heading)
      .filter(Boolean)
      .join(', ')}`
  )}`;

  return (
    <div
      role="status"
      className="mb-6 rounded-lg border border-warning-300 bg-warning-50 p-4"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-secondary-900">{heading}</p>
          <p className="text-sm text-secondary-700 mt-1">
            The rest of your draft is complete and every citation still traces
            to your sources. Email {SUPPORT_EMAIL} with this draft's name and
            we'll regenerate the missing section(s) or refund you.
          </p>
          <ul className="mt-2 list-disc list-inside text-sm text-secondary-700">
            {failed.map((f, i) => (
              <li key={`${f.index ?? i}-${f.heading}`}>
                {f.heading || `Section ${(f.index ?? i) + 1}`}
              </li>
            ))}
          </ul>
          <a
            href={mailto}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <Mail className="w-4 h-4" />
            Email support
          </a>
        </div>
      </div>
    </div>
  );
};

export default PartialFailureBanner;
