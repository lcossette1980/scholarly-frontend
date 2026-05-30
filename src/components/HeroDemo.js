// src/components/HeroDemo.js
//
// The "receipts" demo. A generated paragraph cycles through its citations;
// every few seconds the active citation pulses and a source panel reveals
// the EXACT passage in the source it was drawn from, highlighted.
//
// LAYOUT-STABILITY NOTE (v2):
// The previous version animated the source panel's WIDTH (0% → 46%), which
// caused the left paragraph pane (`flex-1`) to reflow each cycle. The
// paragraph re-wrapped narrower → taller → the demo container grew → the
// whole page below shifted with the animation cycle. Awful UX.
//
// This version uses a FIXED 2-column grid where both panes are always
// present at their final size. The source panel just toggles opacity +
// translateX; nothing ever resizes. The outer container also has a
// fixed-height grid so vertical reflow is impossible.

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X } from 'lucide-react';

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

const CYCLE_MS = 4200;

const HeroDemo = () => {
  const [activeCitation, setActiveCitation] = useState(1);
  const [userInteracted, setUserInteracted] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (userInteracted) return;
    timerRef.current = setInterval(() => {
      setActiveCitation((prev) => (prev === 1 ? 2 : 1));
    }, CYCLE_MS);
    return () => clearInterval(timerRef.current);
  }, [userInteracted]);

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
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-secondary-200 bg-secondary-50">
        <div className="w-2.5 h-2.5 rounded-full bg-secondary-300" />
        <div className="w-2.5 h-2.5 rounded-full bg-secondary-300" />
        <div className="w-2.5 h-2.5 rounded-full bg-secondary-300" />
        <div className="mx-auto text-xs text-secondary-500 font-mono">
          draftengineapp.com/content/view
        </div>
      </div>

      {/* Two-pane workspace — FIXED grid, FIXED height. Nothing here is
          allowed to change size at runtime. The panel slides in/out via
          opacity + translateX only. */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_minmax(0,360px)] h-[480px] sm:h-[460px]">
        {/* LEFT — generated paragraph (fixed column width) */}
        <div className="p-6 sm:p-10 flex flex-col border-b md:border-b-0 md:border-r border-secondary-200 overflow-hidden">
          <div className="flex items-center gap-2 mb-5 text-[11px] uppercase tracking-wider text-secondary-400 font-medium">
            <FileText className="w-3 h-3" />
            <span>Async at Scale · Draft · Editorial voice</span>
          </div>

          <h3 className="text-lg sm:text-xl font-semibold text-secondary-900 mb-4 tracking-tight">
            Why async-first teams keep their best people longer
          </h3>

          <p className="text-[15px] sm:text-base text-secondary-800 leading-[1.75] overflow-y-auto">
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
                  <sup
                    className={[
                      'ml-0.5 text-[10px] font-semibold tabular-nums transition-colors',
                      isActive ? 'text-primary' : 'text-secondary-500',
                    ].join(' ')}
                  >
                    [{frag.id}]
                  </sup>
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

          <p className="mt-6 text-xs text-secondary-400 flex-shrink-0">
            Click any citation to see the exact source passage.
          </p>
        </div>

        {/* RIGHT — source panel (FIXED column, contents toggle opacity) */}
        <div className="relative bg-secondary-50/50 overflow-hidden">
          <AnimatePresence mode="wait">
            {source && (
              <motion.aside
                key={activeCitation}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 18 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 p-5 sm:p-6 flex flex-col"
              >
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
                  <p className="text-[13px] leading-[1.7] text-secondary-800">
                    <span className="bg-yellow-200/60 px-0.5 rounded-sm">
                      {source.quote}
                    </span>
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-2 text-[11px] text-secondary-500">
                  <span className="inline-block w-1 h-1 rounded-full bg-success-500" />
                  <span>Citation {activeCitation} · {source.paragraphLabel}</span>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Placeholder text shown when no citation is active (keeps the
              column from looking empty after the user closes the panel) */}
          {!source && (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
              <p className="text-xs text-secondary-400 max-w-[200px] leading-relaxed">
                Click a citation on the left to reveal its source passage here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroDemo;
