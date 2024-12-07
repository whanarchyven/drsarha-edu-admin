'use client';
import { cubicBezier, motion } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const variantsPage = {
  in: {
    opacity: 1,
    transition: {
      duration: 1,
      delay: 0,
      ease: cubicBezier(0.55, 0.055, 0.675, 0.19),
    },
  },
  out: {
    opacity: 0,
    transition: {
      duration: 1,
      delay: 0,
      ease: cubicBezier(0.55, 0.055, 0.675, 0.19),
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 3,
      delay: 0,
      ease: cubicBezier(0.55, 0.055, 0.675, 0.19),
    },
  },
};

const Template = ({ children }: any) => {
  return (
    <motion.div variants={variantsPage} animate="in" initial="out" exit="out">
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </motion.div>
  );
};

export default Template;
