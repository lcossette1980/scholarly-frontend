// src/components/VoiceSwitcher.js
//
// Interactive showcase of DraftEngine's voice routing. Visitor clicks
// one of five tabs (editorial / business / academic / scientific /
// reference) and the same source library produces a meaningfully
// different output. This is the single feature no other AI writer ships,
// so it gets its own section on the home page rather than being a bullet
// in a feature list.
//
// The sample prose is hand-crafted (not generated) to make sure each
// voice actually reads distinct. If you ever swap these for live
// outputs, keep them short — visitors should be able to skim each in
// 3 seconds.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, Briefcase, GraduationCap, FlaskConical, BookOpen } from 'lucide-react';

const VOICES = [
  {
    key: 'editorial',
    label: 'Editorial',
    icon: Newspaper,
    summary: 'Atlantic-style narrative essay',
    document: 'Long-form article',
    sample: `When the pandemic hauled the office onto our kitchen tables, we promised ourselves it was temporary. Four years on, the kitchen is still the office, and the office is something we visit, like a museum of a former life. The companies that grasped this earliest aren't the ones with the slickest video-conference rituals. They're the ones who understood that asynchrony, not flexibility, was the actual deliverable — and built their operating system around it.`,
  },
  {
    key: 'business',
    label: 'Business',
    icon: Briefcase,
    summary: 'Executive memo or white paper',
    document: 'Strategic brief',
    sample: `Executive summary. Async-first organizations show measurably stronger retention among senior contributors. Doist's 2024 telemetry reports a 41% reduction in interrupt cycles for teams operating on strict async defaults, and Buffer's annual workforce survey identifies flexibility — not compensation — as the leading retention driver among employees with 3+ years of tenure. The implication for leadership: synchronous-default communication is a tax on the people you can least afford to lose.`,
  },
  {
    key: 'academic',
    label: 'Academic',
    icon: GraduationCap,
    summary: 'Peer-reviewed research paper',
    document: 'Scholarly article',
    sample: `This paper examines the relationship between asynchronous communication norms and organizational retention in distributed knowledge work. Drawing on Doist (2024) and Buffer (2024), we argue that flexibility — operationalized here as scheduling autonomy and async-default communication — functions as a non-pecuniary compensation channel. Section 2 reviews prior literature; Section 3 develops the analytic framework; Section 4 presents survey-based evidence; Section 5 considers limitations and directions for future research.`,
  },
  {
    key: 'scientific',
    label: 'Scientific',
    icon: FlaskConical,
    summary: 'IMRAD structure for studies',
    document: 'Research report',
    sample: `Introduction. Asynchronous communication patterns have been hypothesized to reduce cognitive switching costs in distributed teams (Doist, 2024). We tested whether enforced async defaults predict reduced interrupt frequency and improved retention. Methods. We conducted a secondary analysis of cross-sectional survey data from 3,000 distributed knowledge workers (Buffer, 2024). Results. Async-default teams reported 41% fewer weekly interrupt cycles (p < 0.01). Flexibility was the leading retention factor at 64% (vs. compensation, 21%).`,
  },
  {
    key: 'reference',
    label: 'Reference',
    icon: BookOpen,
    summary: 'Annotated bibliography',
    document: 'Source listing',
    sample: `Buffer. (2024). State of Remote Work 2024. Retrieved from buffer.com/state-of-remote-work.
Annotation: Survey of 3,000 distributed knowledge workers. Findings establish flexibility as the leading retention factor (64%), outranking compensation (21%) and growth opportunities (15%). Methodology section detailed; sampling skews toward tech and creative roles.

Doist. (2024). The Async Productivity Report. Retrieved from doist.com/async-report.
Annotation: Telemetry-based study of communication patterns across 1,200 distributed teams. Documents a 41% reduction in interrupt cycles for async-default teams (p. 47).`,
  },
];

const VoiceSwitcher = () => {
  const [activeKey, setActiveKey] = useState('editorial');
  const active = VOICES.find((v) => v.key === activeKey) || VOICES[0];

  return (
    <div className="rounded-xl border border-secondary-200 bg-white overflow-hidden shadow-sm">
      {/* Tab strip */}
      <div className="flex overflow-x-auto border-b border-secondary-200 bg-secondary-50/60">
        {VOICES.map((v) => {
          const Icon = v.icon;
          const isActive = v.key === activeKey;
          return (
            <button
              key={v.key}
              type="button"
              onClick={() => setActiveKey(v.key)}
              className={[
                'flex-1 min-w-[120px] flex items-center justify-center gap-1.5 px-3 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                isActive
                  ? 'border-primary text-secondary-900 bg-white'
                  : 'border-transparent text-secondary-500 hover:text-secondary-900',
              ].join(' ')}
              aria-pressed={isActive}
            >
              <Icon className={['w-3.5 h-3.5', isActive ? 'text-primary' : 'text-secondary-400'].join(' ')} />
              <span>{v.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sample document area */}
      <div className="p-6 sm:p-8 min-h-[260px]">
        {/* Meta line: shows what kind of document this voice produces */}
        <div className="flex items-center gap-2 mb-4 text-[11px] uppercase tracking-wider text-secondary-400 font-medium">
          <span>{active.document}</span>
          <span className="text-secondary-300">·</span>
          <span>{active.summary}</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={active.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="text-[15px] leading-[1.75] text-secondary-800 whitespace-pre-line"
          >
            {active.sample}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Footer caption */}
      <div className="px-6 sm:px-8 py-3 border-t border-secondary-200 bg-secondary-50/40 text-xs text-secondary-500">
        Same five sources. Five different document types. One library.
      </div>
    </div>
  );
};

export default VoiceSwitcher;
