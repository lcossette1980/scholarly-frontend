import { useEffect, useRef, useState } from 'react';
import { useInView, animate } from 'framer-motion';

const AnimatedCounter = ({
  target,
  duration = 1.5,
  suffix = '',
  prefix = '',
  className = ''
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!isInView) return;

    const numericTarget = typeof target === 'string'
      ? parseFloat(target.replace(/[^0-9.]/g, ''))
      : target;

    if (isNaN(numericTarget)) {
      setDisplay(String(target));
      return;
    }

    const controls = animate(0, numericTarget, {
      duration,
      ease: 'easeOut',
      onUpdate: (value) => {
        if (numericTarget >= 1000) {
          setDisplay(Math.round(value).toLocaleString());
        } else if (numericTarget % 1 !== 0) {
          setDisplay(value.toFixed(1));
        } else {
          setDisplay(Math.round(value).toString());
        }
      },
    });

    return () => controls.stop();
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  );
};

export default AnimatedCounter;
