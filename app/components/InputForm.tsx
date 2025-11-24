'use client';

import { motion } from 'framer-motion';
import { Coffee, Gauge, Settings2, Sparkles, Plus, Minus } from 'lucide-react';
import { useState } from 'react';

interface InputFormProps {
  onAnalyze: (data: CoffeeInputData) => void;
}

export interface CoffeeInputData {
  beanName: string;
  roastLevel: number;
  grinderModel: string;
  grindSize: number;
  grindUnit: 'clicks' | 'microns';
}

const roastLabels = ['Light', 'Light-Medium', 'Medium', 'Medium-Dark', 'Dark'];

export default function InputForm({ onAnalyze }: InputFormProps) {
  const [beanName, setBeanName] = useState('');
  const [roastLevel, setRoastLevel] = useState(2);
  const [grinderModel, setGrinderModel] = useState('');
  const [grindSize, setGrindSize] = useState(0);
  const [grindUnit, setGrindUnit] = useState<'clicks' | 'microns'>('clicks');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze({
      beanName,
      roastLevel,
      grinderModel,
      grindSize,
      grindUnit,
    });
  };

  const isFormValid = beanName && grinderModel && grindSize > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-coffee-light/20 p-8 md:p-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="bg-gradient-to-br from-coffee-brown to-coffee-dark p-3 rounded-2xl">
            <Coffee className="w-8 h-8 text-cream" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-coffee-dark">Digital Barista</h1>
            <p className="text-coffee-medium text-sm">AI-Powered Coffee Taste Predictor</p>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bean Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <label className="flex items-center gap-2 text-sm font-semibold text-coffee-dark">
              <Coffee className="w-4 h-4" />
              Bean Name
            </label>
            <input
              type="text"
              value={beanName}
              onChange={(e) => setBeanName(e.target.value)}
              placeholder="e.g., Ethiopian Yirgacheffe"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-light/50 focus:border-coffee-medium focus:outline-none transition-colors bg-white/50"
            />
          </motion.div>

          {/* Roast Level Slider */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <label className="flex items-center gap-2 text-sm font-semibold text-coffee-dark">
              <Gauge className="w-4 h-4" />
              Roast Level
            </label>
            <div className="relative pt-2 pb-6">
              <input
                type="range"
                min="0"
                max="4"
                value={roastLevel}
                onChange={(e) => setRoastLevel(Number(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-coffee-light via-coffee-medium to-coffee-dark rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #c9a882 0%, #8b6f47 50%, #2c1810 100%)`,
                }}
              />
              <div className="flex justify-between mt-2 text-xs text-coffee-medium">
                {roastLabels.map((label, idx) => (
                  <span
                    key={label}
                    className={`transition-all ${
                      idx === roastLevel ? 'font-bold text-coffee-dark scale-110' : ''
                    }`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Grinder Model */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-2"
          >
            <label className="flex items-center gap-2 text-sm font-semibold text-coffee-dark">
              <Settings2 className="w-4 h-4" />
              Grinder Model
            </label>
            <input
              type="text"
              value={grinderModel}
              onChange={(e) => setGrinderModel(e.target.value)}
              placeholder="e.g., Comandante C40"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-light/50 focus:border-coffee-medium focus:outline-none transition-colors bg-white/50"
            />
          </motion.div>

          {/* Grind Size */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-semibold text-coffee-dark">
                <Sparkles className="w-4 h-4" />
                Grind Size
              </label>
              <span className="text-xs text-coffee-medium">
                {grindUnit === 'clicks' ? 'Typical: 15-25' : 'Typical: 300-800'}
              </span>
            </div>

            <div className="flex gap-2">
              {/* Decrease Button */}
              <motion.button
                type="button"
                onClick={() => setGrindSize(Math.max(0, grindSize - 1))}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-coffee-light to-coffee-medium text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Minus className="w-5 h-5" />
              </motion.button>

              {/* Number Display/Input */}
              <div className="flex-1 relative">
                <input
                  type="number"
                  value={grindSize || ''}
                  onChange={(e) => setGrindSize(Number(e.target.value))}
                  placeholder="e.g., 20"
                  className="w-full h-12 px-4 text-center text-2xl font-bold rounded-xl border-2 border-slate-light/50 focus:border-coffee-medium focus:outline-none transition-colors bg-white/50"
                />
                {grindSize > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-coffee-dark text-cream text-xs px-2 py-0.5 rounded-full"
                  >
                    {grindSize}
                  </motion.div>
                )}
              </div>

              {/* Increase Button */}
              <motion.button
                type="button"
                onClick={() => setGrindSize(grindSize + 1)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-coffee-medium to-coffee-dark text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Plus className="w-5 h-5" />
              </motion.button>

              {/* Unit Selector */}
              <select
                value={grindUnit}
                onChange={(e) => setGrindUnit(e.target.value as 'clicks' | 'microns')}
                className="px-4 h-12 rounded-xl border-2 border-slate-light/50 focus:border-coffee-medium focus:outline-none transition-colors bg-white/50 cursor-pointer font-semibold text-coffee-dark"
              >
                <option value="clicks">Clicks</option>
                <option value="microns">Microns</option>
              </select>
            </div>

            {/* Visual Indicator Bar */}
            {grindSize > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative h-2 bg-cream rounded-full overflow-hidden"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: grindUnit === 'clicks'
                      ? `${Math.min((grindSize / 30) * 100, 100)}%`
                      : `${Math.min((grindSize / 1000) * 100, 100)}%`
                  }}
                  transition={{ type: 'spring', stiffness: 100 }}
                  className="h-full bg-gradient-to-r from-coffee-light via-coffee-medium to-coffee-dark"
                />
              </motion.div>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={!isFormValid}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={isFormValid ? { scale: 1.02 } : {}}
            whileTap={isFormValid ? { scale: 0.98 } : {}}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
              isFormValid
                ? 'bg-gradient-to-r from-coffee-brown to-coffee-dark text-cream hover:shadow-2xl hover:from-coffee-dark hover:to-coffee-brown cursor-pointer'
                : 'bg-slate-light/50 text-slate cursor-not-allowed'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Analyze Coffee
            </span>
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
