import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { IconTrendingUp } from '@tabler/icons-react';
import { NURSING_MOCK_DATA } from './mockData';
import { useTheme } from '../theme/ThemeProvider';

export const NursePerformanceChart: React.FC = () => {
  const [metric, setMetric] = useState<'visits' | 'responseTime'>('visits');
  const data = NURSING_MOCK_DATA.weeklyPerformance;
  const { isDark } = useTheme();

  return (
    <div className="bg-white dark:bg-[#1b1e27] rounded-2xl border border-[#eceef1] dark:border-slate-800 shadow-sm p-5 h-[300px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <IconTrendingUp className="w-4 h-4 text-[#0d9488]" /> Performance
        </h2>
        
        {/* Metric Tabs */}
        <div className="flex bg-[#f6f7f9] dark:bg-[#12141a] p-1 rounded-lg border border-[#eceef1] dark:border-slate-800">
          <button
            onClick={() => setMetric('visits')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
              metric === 'visits' 
                ? 'bg-white dark:bg-[#1b1e27] text-slate-900 dark:text-white shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Visits
          </button>
          <button
            onClick={() => setMetric('responseTime')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
              metric === 'responseTime' 
                ? 'bg-white dark:bg-[#1b1e27] text-slate-900 dark:text-white shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Avg Time (m)
          </button>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b', fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b', fontWeight: 600 }}
            />
            <Tooltip 
              cursor={{ fill: isDark ? '#1e293b' : '#f8fafc' }}
              contentStyle={{ 
                backgroundColor: isDark ? '#12141a' : '#ffffff', 
                borderRadius: '12px',
                border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                fontSize: '12px',
                fontWeight: 'bold',
                color: isDark ? '#f8fafc' : '#0f172a'
              }}
              formatter={(value: number) => [
                metric === 'visits' ? `${value} visits` : `${value} mins`, 
                metric === 'visits' ? 'Visits Completed' : 'Avg Response Time'
              ]}
            />
            <Bar 
              dataKey={metric} 
              radius={[4, 4, 4, 4]} 
              barSize={24}
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={metric === 'visits' ? '#0d9488' : '#ec4899'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
