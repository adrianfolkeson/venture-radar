'use client';

import { useState } from 'react';
import { MOCK_OPPORTUNITIES } from '@/lib/supabase';
import { getScoreLabel, getTrendDirection } from '@/lib/scoring';

export default function Home() {
  const [opportunities] = useState(MOCK_OPPORTUNITIES);
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' 
    ? opportunities 
    : opportunities.filter(o => o.tags.includes(filter));

  const getScoreClass = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-emerald-400';
    if (score >= 40) return 'text-yellow-400';
    if (score >= 20) return 'text-orange-400';
    return 'text-red-400';
  };

  const getTrendIcon = (mentions: number[]) => {
    const trend = getTrendDirection(mentions);
    if (trend === 'up') return '📈';
    if (trend === 'down') return '📉';
    return '➡️';
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-indigo-400">VENTURE</span> RADAR
        </h1>
        <p className="text-gray-400">
          AI-powered startup opportunity discovery
        </p>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto mb-8 grid grid-cols-4 gap-4">
        <div className="bg-[#1a1a2e] border border-[#3b3b5c] rounded-lg p-4">
          <div className="text-3xl font-bold text-indigo-400">{opportunities.length}</div>
          <div className="text-sm text-gray-400">Opportunities</div>
        </div>
        <div className="bg-[#1a1a2e] border border-[#3b3b5c] rounded-lg p-4">
          <div className="text-3xl font-bold text-green-400">72</div>
          <div className="text-sm text-gray-400">Avg Score</div>
        </div>
        <div className="bg-[#1a1a2e] border border-[#3b3b5c] rounded-lg p-4">
          <div className="text-3xl font-bold text-yellow-400">3</div>
          <div className="text-sm text-gray-400">High Priority</div>
        </div>
        <div className="bg-[#1a1a2e] border border-[#3b3b5c] rounded-lg p-4">
          <div className="text-3xl font-bold text-emerald-400">1</div>
          <div className="text-sm text-gray-400">Should Build</div>
        </div>
      </div>

      {/* Filter */}
      <div className="max-w-6xl mx-auto mb-6 flex gap-2">
        {['all', 'AI', 'developer-tools', 'no-code'].map((tag) => (
          <button
            key={tag}
            onClick={() => setFilter(tag)}
            className={`px-4 py-2 rounded-full text-sm ${
              filter === tag
                ? 'bg-indigo-600 text-white'
                : 'bg-[#1a1a2e] text-gray-400 hover:bg-[#2a2a4e]'
            }`}
          >
            {tag === 'all' ? 'All' : tag}
          </button>
        ))}
      </div>

      {/* Opportunities List */}
      <div className="max-w-6xl mx-auto space-y-4">
        {filtered.map((opp) => (
          <div
            key={opp.id}
            className="bg-[#1a1a2e] border border-[#3b3b5c] rounded-lg p-6 hover:border-indigo-500/50 transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-1">{opp.name}</h3>
                <p className="text-gray-400 text-sm">{opp.description}</p>
                <div className="flex gap-2 mt-2">
                  {opp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-[#2a2a4e] rounded text-xs text-indigo-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Score */}
              <div className="text-right">
                <div className={`text-4xl font-bold ${getScoreClass(opp.overall_score)}`}>
                  {opp.overall_score}
                </div>
                <div className="text-sm text-gray-400">
                  {getScoreLabel(opp.overall_score)}
                </div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Velocity</div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-[#2a2a4e] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500" 
                      style={{ width: `${opp.velocity_score}%` }}
                    />
                  </div>
                  <span className="text-sm">{opp.velocity_score}</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Saturation</div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-[#2a2a4e] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500" 
                      style={{ width: `${opp.saturation_score}%` }}
                    />
                  </div>
                  <span className="text-sm">{opp.saturation_score}</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Monetization</div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-[#2a2a4e] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500" 
                      style={{ width: `${opp.monetization_score}%` }}
                    />
                  </div>
                  <span className="text-sm">{opp.monetization_score}</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Timing</div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-[#2a2a4e] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500" 
                      style={{ width: `${opp.timing_score}%` }}
                    />
                  </div>
                  <span className="text-sm">{opp.timing_score}</span>
                </div>
              </div>
            </div>

            {/* AI Summary */}
            <div className="bg-[#0a0a1f] rounded-lg p-4 border border-[#2a2a4e]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-indigo-400 font-semibold">AI ANALYSIS</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  opp.ai_should_build 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {opp.ai_should_build ? '✅ Should Build' : '❌ Skip'}
                </span>
              </div>
              <p className="text-sm text-gray-300 mb-3">{opp.ai_summary}</p>
              <div className="flex gap-2">
                {opp.ai_pain_points.map((point, i) => (
                  <span key={i} className="text-xs bg-red-500/10 text-red-300 px-2 py-1 rounded">
                    💢 {point}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
              <span>{getTrendIcon([opp.mentions_w1, opp.mentions_w2, opp.mentions_w3, opp.mentions_w4])}</span>
              <span>{opp.source.toUpperCase()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto mt-12 text-center text-gray-500 text-sm">
        Built with Next.js + Supabase + OpenAI
      </div>
    </div>
  );
}