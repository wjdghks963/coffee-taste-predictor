'use client';

import { motion } from 'framer-motion';
import { Award, Thermometer, Gauge, TrendingUp, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

export interface TasteProfile {
  acidity: number;
  sweetness: number;
  bitterness: number;
  body: number;
  balance: number;
}

export interface AnalysisResult {
  tasteProfile: TasteProfile;
  overallScore: number;
  comment: string;
  recommendations: {
    waterTemp: string;
    grindAdjustment: string;
    brewTime: string;
  };
}

interface ResultDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
}

export default function ResultDisplay({ result, onReset }: ResultDisplayProps) {
  const [displayedComment, setDisplayedComment] = useState('');
  const [commentComplete, setCommentComplete] = useState(false);

  const chartData = [
    { attribute: 'Acidity', value: result.tasteProfile.acidity, fullMark: 100 },
    { attribute: 'Sweetness', value: result.tasteProfile.sweetness, fullMark: 100 },
    { attribute: 'Bitterness', value: result.tasteProfile.bitterness, fullMark: 100 },
    { attribute: 'Body', value: result.tasteProfile.body, fullMark: 100 },
    { attribute: 'Balance', value: result.tasteProfile.balance, fullMark: 100 },
  ];

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= result.comment.length) {
        setDisplayedComment(result.comment.slice(0, currentIndex));
        currentIndex++;
      } else {
        setCommentComplete(true);
        clearInterval(typingInterval);
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [result.comment]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-coffee-medium';
    return 'text-orange-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    return 'Needs Adjustment';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-coffee-light/20 p-8 md:p-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-coffee-brown to-coffee-dark p-3 rounded-2xl">
              <Award className="w-8 h-8 text-cream" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-coffee-dark">Taste Analysis</h2>
              <p className="text-coffee-medium text-sm">AI-Generated Prediction</p>
            </div>
          </div>
          <motion.div
            className={`text-4xl font-bold ${getScoreColor(result.overallScore)}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          >
            {result.overallScore}
            <span className="text-sm text-coffee-medium block text-center">
              {getScoreLabel(result.overallScore)}
            </span>
          </motion.div>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={chartData}>
              <PolarGrid stroke="#c9a882" strokeWidth={1.5} />
              <PolarAngleAxis
                dataKey="attribute"
                tick={{ fill: '#2c1810', fontSize: 14, fontWeight: 600 }}
              />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#8b6f47' }} />
              <Radar
                name="Taste Profile"
                dataKey="value"
                stroke="#5c3d2e"
                fill="#8b6f47"
                fillOpacity={0.6}
                strokeWidth={3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* AI Comment with Typing Effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8 p-6 bg-cream/50 rounded-2xl border-2 border-coffee-light/30"
        >
          <p className="text-coffee-dark font-medium leading-relaxed">
            {displayedComment}
            {!commentComplete && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block w-0.5 h-5 bg-coffee-dark ml-1"
              />
            )}
          </p>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-4 mb-8"
        >
          <h3 className="text-xl font-bold text-coffee-dark flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Recommended Adjustments
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-gradient-to-br from-cream to-cream-light rounded-xl border border-coffee-light/20 cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-2">
                <Thermometer className="w-5 h-5 text-coffee-brown" />
                <h4 className="font-semibold text-coffee-dark">Water Temp</h4>
              </div>
              <p className="text-coffee-medium text-sm">{result.recommendations.waterTemp}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-gradient-to-br from-cream to-cream-light rounded-xl border border-coffee-light/20 cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="w-5 h-5 text-coffee-brown" />
                <h4 className="font-semibold text-coffee-dark">Grind Size</h4>
              </div>
              <p className="text-coffee-medium text-sm">{result.recommendations.grindAdjustment}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-gradient-to-br from-cream to-cream-light rounded-xl border border-coffee-light/20 cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-coffee-brown" />
                <h4 className="font-semibold text-coffee-dark">Brew Time</h4>
              </div>
              <p className="text-coffee-medium text-sm">{result.recommendations.brewTime}</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Reset Button */}
        <motion.button
          onClick={onReset}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-coffee-brown to-coffee-dark text-cream shadow-lg hover:shadow-2xl transition-all cursor-pointer"
        >
          <span className="flex items-center justify-center gap-2">
            <RotateCcw className="w-5 h-5" />
            Analyze Another Coffee
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}
