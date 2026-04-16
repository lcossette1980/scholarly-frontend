import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
};

const StaggerChildren = ({
  children,
  className = '',
  staggerDelay = 0.08,
}) => {
  const variants = {
    ...containerVariants,
    visible: {
      ...containerVariants.visible,
      transition: {
        ...containerVariants.visible.transition,
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '200px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const StaggerItem = ({ children, className = '' }) => (
  <motion.div variants={itemVariants} className={className}>
    {children}
  </motion.div>
);

export { StaggerChildren, StaggerItem };
export default StaggerChildren;
