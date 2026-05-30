// src/components/HeroDemo.js
//
// The "receipts" demo. A generated paragraph cycles through its citations;
// every few seconds the active citation pulses and a side panel slides in
// showing the EXACT passage in the source it was drawn from, highlighted.
//
// This is the homepage's single most important visual asset: it makes
// DraftEngine's actual differentiator (citations stay traceable, nothing
// invented) instantly legible without the visitor having to read marketing
// copy. The animation loop runs autoplay; users can also click a citation
// directly to scrub to it.

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X } from 'lucide-react';

// One paragraph of "generated" content with two citations. Both source
// excerpts are written to look like the real extract panel users see when
// they click a citation inside a generated draft.
const PARAGRAPH_FRAGMENTS = [
  { type: 'text', text: 'In remote-first organizations, asynchronous communication isn’t just a perk — it’s the operating system. Doist found that teams maintaining strict async defaults reported ' },
  { type: 'cite', id: 1, text: '41% fewer interrupt cycles per week' },
  { type: 'text', text: ', while a Buffer survey of 3,000 distributed workers noted that ' },
  { type: 'cite', id: 2, text: 'flexibility, not location, was the top reason employees stayed past three years' },
  { type: 'text', text: '.' },
];

const SOURCES = {
  1: {
    file: 'Doist_Async_Report_2024.pdf',
    page: 47,
    quote: 'Teams that enforced async-by-default communication patterns reported 41% fewer interrupt cycles per week compared to control teams using synchronous defaults. The effect was most pronounced in engineering and design functions, where deep-work time recovered by an average of 4.2 hours per week.',
    paragraphLabel: 'used in paragraph 1, sentence 1',
  },
  2: {
    file: 'Buffer_State_of_Remote_2024.pdf',
    page: 12,
    quote: 'When asked why they remained at their current employer for three or more years, 64% of respondents cited flexibility as the top reason — outranking compensation (21%) and growth opportunities (15%).',
    paragraphLabel: 'used in paragraph 1, sentence 2',
  },
};

const CYCLE_MS = 4200; // total time per citation in the loop

const HeroDemo = () => {
  // null = panel closed (paragraph full width). Number = which citation is active.
  const [activeCitation, setActiveCitation] = useState(1);
  // userInteracted pauses the autoplay loop so a curious visitor doesn't
  // get yanked off the citation they just clicked.
  const [userInteracted, setUserInteracted] = useState(false);
  const timerRef = useRef(null);

  // Autoplay: rotate through citations on a fixed cadence.
  useEffect(() => {
    if (userInteracted) return;
    timerRef.current = setInterval(() => {
      setActiveCitation((prev) => (prev === 1 ? 2 : 1));
    }, CYCLE_MS);
    return () => clearInterval(timerRef.current);
  }, [userInteracted]);

  // On hover, pause autoplay; resume after pointer leaves.
  const onPointerEnter = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
  const onPointerLeave = () => {
    if (userInteracted) return;
    timerRef.current = setInterval(() => {
      setActiveCitation((prev) => (prev === 1 ? 2 : 1));
    }, CYCLE_MS);
  };

  const handleCitationClick = (id) => {
    setUserInteracted(true);
    setActiveCitation(id);
    // Resume autoplay after 10s of inactivity
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => setUserInteracted(false), 10000);
  };

  const source = activeCitation ? SOURCES[activeCitation] : null;

  return (
    <div
      className="relative rounded-xl border border-secondary-200 bg-white overflow-hidden shadow-medium"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {/* Browser-style chrome */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-secondary-200 bg-secondary-50">
        <div className="w-2.5 h-2.5 rounded-full bg-secondary-300" />
        <div className="w-2.5 h-2.5 rounded-full bg-secondary-300" />
        <div className="w-2.5 h-2.5 rounded-full bg-secondary-300" />
        <div className="mx-auto text-xs text-secondary-500 font-mono">
          draftengineapp.com/content/view
        </div>
      </div>

      {/* Two-pane workspace: paragraph on the left, source panel on the right */}
      <div className="flex min-h-[440px] sm:min-h-[420px]">
        {/* LEFT — generated paragraph */}
        <motion.div
          layout
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 p-6 sm:p-10 flex flex-col"
        >
          {/* Tiny header so it reads as a real document, not a screenshot */}
          <div className="flex items-center gap-2 mb-5 text-[11px] uppercase tracking-wider text-secondary-400 font-medium">
            <FileText className="w-3 h-3" />
            <span>Async at Scale · Draft · Editorial voice</span>
          </div>

          <h3 className="text-lg sm:text-xl font-semibold text-secondary-900 mb-4 tracking-tight">
            Why async-first teams keep their best people longer
          </h3>

          <p className="text-[15px] sm:text-base text-secondary-800 leading-[1.75]">
            {PARAGRAPH_FRAGMENTS.map((frag, idx) => {
              if (frag.type === 'text') return <span key={idx}>{frag.text}</span>;
              const isActive = activeCitation === frag.id;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleCitationClick(frag.id)}
                  className={[
                    'relative inline whitespace-normal text-left transition-colors duration-200 rounded-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30',
                    isActive
                      ? 'bg-primary/12 text-secondary-900'
                      : 'bg-primary/[0.04] text-secondary-800 hover:bg-primary/10',
                  ].join(' ')}
                >
                  {frag.text}
                  {/* Superscript citation marker */}
                  <sup
                    className={[
                      'ml-0.5 text-[10px] font-semibold tabular-nums transition-colors',
                      isActive ? 'text-primary' : 'text-secondary-500',
                    ].join(' ')}
                  >
                    [{frag.id}]
                  </sup>
                  {/* Pulse ring when active */}
                  {isActive && (
                    <motion.span
                      aria-hidden
                      className="absolute -inset-0.5 rounded-sm ring-2 ring-primary/40 pointer-events-none"
                      initial={{ opacity: 0.6 }}
                      animate={{ opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                </button>
              );
            })}
          </p>

          {/* Footnote / nudge so the interaction is discoverable */}
          <p className="mt-6 text-xs text-secondary-400">
            Click any citation to see the exact source passage.
          </p>
        </motion.div>

        {/* RIGHT — source panel */}
        <AnimatePresence mode="wait">
          {source && (
            <motion.aside
              key={activeCitation}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '46%', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="border-l border-secondary-200 bg-secondary-50/50 overflow-hidden flex-shrink-0"
            >
              <div className="p-5 sm:p-6 h-full flex flex-col">
                {/* Panel header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-wider text-secondary-400 font-medium mb-1">
                      Source
                    </div>
                    <div className="text-sm font-medium text-secondary-900 truncate">
                      {source.file}
                    </div>
                    <div className="text-xs text-secondary-500 mt-0.5 font-mono">
                      page {source.page}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveCitation(null)}
                    className="text-secondary-400 hover:text-secondary-700 transition-colors p-1 -m-1"
                    aria-label="Close source panel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Faux PDF page surface */}
                <div className="flex-1 rounded-md border border-secondary-200 bg-white p-4 shadow-sm overflow-hidden">
                  <div className="text-[10px] font-mono text-secondary-300 uppercase tracking-wider mb-3">
                    — excerpt
                  </div>
                  <motion.p
                    key={source.quote}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.15 }}
                    className="text-[13px] leading-[1.7] text-secondary-800"
                  >
                    <span className="bg-yellow-200/60 px-0.5 rounded-sm">
                      {source.quote}
                    </span>
                  </motion.p>
                </div>

                {/* Traceability footer */}
                <div className="mt-4 flex items-center gap-2 text-[11px] text-secondary-500">
                  <span className="inline-block w-1 h-1 rounded-full bg-success-500" />
                  <span>Citation {activeCitation} · {source.paragraphLabel}</span>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HeroDemo;
