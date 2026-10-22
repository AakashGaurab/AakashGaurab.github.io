import React from 'react';
import { motion, useMotionValue, useSpring, type HTMLMotionProps } from 'motion/react';

/** Shared spring used by every scroll reveal so the page moves as one system. */
export const revealTransition = (delay = 0) => ({ type: 'spring' as const, stiffness: 260, damping: 24, delay });

interface RevealProps extends HTMLMotionProps<'div'> {
  delay?: number;
  /** Offset the element starts from; use x for side-entering items. */
  x?: number;
  y?: number;
}

/** Fades and slides its children in the first time they scroll into view. */
export function Reveal({ delay = 0, x = 0, y = 24, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={revealTransition(delay)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

interface TiltCardProps extends HTMLMotionProps<'div'> {
  delay?: number;
  /** Maximum rotation in degrees. */
  maxTilt?: number;
}

/** Scroll-revealed card that tilts in 3D towards the mouse (mouse only, not touch). */
export function TiltCard({ delay = 0, maxTilt = 6, style, children, ...rest }: TiltCardProps) {
  const rotateX = useSpring(useMotionValue(0), { stiffness: 300, damping: 25 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 300, damping: 25 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-py * 2 * maxTilt);
    rotateY.set(px * 2 * maxTilt);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={revealTransition(delay)}
      whileTap={{ scale: 0.985 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      style={{ ...style, rotateX, rotateY, transformPerspective: 1000 }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
