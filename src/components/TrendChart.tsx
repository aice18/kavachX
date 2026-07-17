import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { format } from 'date-fns';

interface TrendChartProps {
  data: any[];
  dataKey: string;
  timeKey?: string;
  isCritical?: boolean;
}

export function TrendChart({ data, dataKey, timeKey = 'time', isCritical = false }: TrendChartProps) {
  const mainColor = isCritical ? '#ef4444' : '#22d3ee';
  const shadowColor = isCritical ? 'rgba(239,68,68,0.5)' : 'rgba(34,211,238,0.5)';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id={`colorGradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={mainColor} stopOpacity={0.4}/>
            <stop offset="95%" stopColor={mainColor} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />
        <XAxis 
          dataKey={timeKey} 
          stroke="#475569" 
          fontSize={11} 
          tickLine={false} 
          axisLine={false} 
          tickFormatter={(val) => {
            try {
              return format(new Date(val), 'HH:mm');
            } catch {
              return val;
            }
          }} 
          minTickGap={30}
        />
        <YAxis 
          stroke="#475569" 
          fontSize={11} 
          tickLine={false} 
          axisLine={false} 
          domain={[0, 100]} 
          ticks={[0, 25, 50, 75, 100]}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '0.5rem', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.5)' }}
          itemStyle={{ color: '#f8fafc' }}
          labelFormatter={(label) => {
            try {
              return format(new Date(label), 'MMM d, HH:mm');
            } catch {
              return label;
            }
          }}
          labelStyle={{ color: '#94a3b8', marginBottom: '0.25rem' }}
        />
        <Area 
          type="monotone" 
          dataKey={dataKey} 
          stroke={mainColor} 
          strokeWidth={3} 
          fillOpacity={1} 
          fill={`url(#colorGradient-${dataKey})`} 
          isAnimationActive={false} 
          style={{ filter: `drop-shadow(0 0 5px ${shadowColor})` }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
