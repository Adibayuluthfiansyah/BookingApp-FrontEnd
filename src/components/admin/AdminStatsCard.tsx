'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { StatsCardProps } from '@/types';

export default function StatsCard({title,value,change,icon,changeType = 'increase',color,}: StatsCardProps) {
  return (
   <Card className="relative p-6 hover:shadow-lg transition-shadow duration-200">
  <div
    className="absolute bottom-0 left-0 w-full h-1 rounded-b-lg"
    style={{ backgroundColor: color }}
  />

  <div className="flex items-center">
    <div
      className="p-3 rounded-full"
      style={{ backgroundColor: `${color}20` }}
    >
      {icon}
    </div>
    <div className="ml-4 flex-1">
      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
        {title}
      </p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>

      {/* Badge taruh di bawah value */}
      {change && (
        <div
          className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
            changeType === 'increase'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {changeType === 'increase' ? (
            <TrendingUp className="w-4 h-4 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 mr-1" />
          )}
          {change}
        </div>
      )}
    </div>
  </div>
</Card>
    );
}