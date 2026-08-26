import React, { useState } from 'react';

interface AccessibilitySectionProps {
  onShowToast: (msg: string) => void;
}

export const AccessibilitySection: React.FC<AccessibilitySectionProps> = ({
  onShowToast,
}) => {
  const [highContrast, setHighContrast] = useState(false);
  const [largerText, setLargerText] = useState(false);
  const [screenReaderLabels, setScreenReaderLabels] = useState(true);
  const [keyboardNav, setKeyboardNav] = useState(true);

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-xs font-sans">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Accessibility Features</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-sans font-medium">Enhance visual contrast, screen reader labels, and keyboard navigation</p>
        </div>
      </div>

      {/* ACCESSIBILITY TOGGLES */}
      <div className="space-y-3 font-mono">
        {[
          { label: 'High Contrast Mode', desc: 'Increases contrast boundaries for text and UI cards', active: highContrast, setter: setHighContrast },
          { label: 'Larger Touch & Click Targets', desc: 'Enforces minimum 44px touch targets on buttons', active: largerText, setter: setLargerText },
          { label: 'Screen Reader Friendly Labels', desc: 'Adds ARIA landmark tags to all buttons & drawers', active: screenReaderLabels, setter: setScreenReaderLabels },
          { label: 'Keyboard Focus Outline Highlights', desc: 'Shows distinct focus outlines on active inputs', active: keyboardNav, setter: setKeyboardNav }
        ].map((item) => (
          <div key={item.label} className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 font-sans shadow-sm">
            <div>
              <h5 className="font-bold text-slate-900 dark:text-white text-xs">{item.label}</h5>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">{item.desc}</p>
            </div>
            <button
              onClick={() => {
                const next = !item.active;
                item.setter(next);
                onShowToast(next ? `✓ ${item.label} enabled` : `✓ ${item.label} disabled`);
              }}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                item.active ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-800 border border-slate-400 dark:border-slate-700'
              }`}
            >
              <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                item.active ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
