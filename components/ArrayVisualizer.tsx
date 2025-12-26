import React from 'react';
import type { ArrayVisData } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface ArrayVisualizerProps {
  visData: ArrayVisData;
}

const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({ visData }) => {
  const { data, operation, highlightIndex, value } = visData;

  let displayData = [...data];
  if (operation === 'ADD' && value !== undefined) {
    displayData.push(value);
  }

  return (
    <div className="bg-[#0F172A] p-4 rounded-lg">
      <p className="text-sm text-[#A0A0B0] mb-3 font-mono">
        Visualizing Operation: <span className="text-[#00FFE1]">{operation}</span>
      </p>
      <div className="flex items-center justify-center space-x-1 bg-[#0F172A]/50 p-4 rounded-md min-h-[80px]">
        <AnimatePresence>
          {displayData.map((item, index) => {
            const isHighlighted = (operation === 'ACCESS' || operation === 'DELETE') && index === highlightIndex;
            const isAdded = operation === 'ADD' && index === data.length;

            return (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="flex flex-col items-center"
              >
                <div
                  className={`relative w-12 h-12 flex items-center justify-center rounded transition-all duration-500
                    ${isHighlighted ? 'bg-red-500/80 ring-2 ring-red-300 scale-110' : 'bg-[#00FFE1]/80'}
                    ${isAdded ? 'bg-green-500/80 ring-2 ring-green-300 scale-110' : ''}
                  `}
                >
                  <span className="font-bold text-lg text-[#0F172A]">{item}</span>
                </div>
                <span className="text-xs text-[#A0A0B0] mt-1">{index}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ArrayVisualizer;