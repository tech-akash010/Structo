import React from 'react';
import type { LinkedListVisData } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface LinkedListVisualizerProps {
  visData: LinkedListVisData;
}

const Node: React.FC<{ value: string | number; isHighlighted?: boolean; isAdded?: boolean; }> = ({ value, isHighlighted, isAdded }) => (
  <div className="flex items-center">
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-500 border-2
        ${isHighlighted ? 'bg-red-500/80 border-red-300 scale-110' : 'bg-[#00FFE1]/80 border-[#00FFE1]'}
        ${isAdded ? 'bg-green-500/80 border-green-300 scale-110' : ''}
      `}
    >
      <span className="font-bold text-lg text-[#0F172A]">{value}</span>
    </motion.div>
  </div>
);

const Arrow: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="text-[#A0A0B0] text-2xl font-mono mx-2"
  >
    →
  </motion.div>
);

const NullNode: React.FC = () => (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="text-[#A0A0B0]/80 font-mono text-lg"
    >
        NULL
    </motion.div>
);

const LinkedListVisualizer: React.FC<LinkedListVisualizerProps> = ({ visData }) => {
  const { data, operation, highlightIndex, value } = visData;
  
  let displayData = [...data];
  if(operation === 'ADD_TAIL' && value !== undefined) displayData.push(value);
  if(operation === 'ADD_HEAD' && value !== undefined) displayData.unshift(value);

  return (
    <div className="bg-[#0F172A] p-4 rounded-lg">
      <p className="text-sm text-[#A0A0B0] mb-3 font-mono">
        Visualizing Operation: <span className="text-[#00FFE1]">{operation}</span>
      </p>
      <div className="flex items-center justify-center flex-wrap bg-[#0F172A]/50 p-4 rounded-md min-h-[80px]">
        <AnimatePresence>
          {displayData.map((item, index) => {
            const isHighlighted = operation === 'TRAVERSE' && index === highlightIndex;
            const isAdded = (operation === 'ADD_TAIL' && index === data.length) || (operation === 'ADD_HEAD' && index === 0);

            return (
              <React.Fragment key={index}>
                <Node value={item} isHighlighted={isHighlighted} isAdded={isAdded} />
                {index < displayData.length -1 && <Arrow />}
              </React.Fragment>
            );
          })}
           {displayData.length > 0 && <Arrow />}
           <NullNode />
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LinkedListVisualizer;