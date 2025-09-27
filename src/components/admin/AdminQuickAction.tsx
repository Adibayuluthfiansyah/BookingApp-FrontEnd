'use client';

import React from 'react';
import { toast } from 'sonner';
import { QuickActionProps } from '@/types';

export default function QuickActionCard({
  title,
  href,
  icon,
  color,
}: QuickActionProps) {
  return (
    <a
      href={href}
      onClick={() =>
        toast.info(`Navigating to ${title}...`, { duration: 1500 })
      }
      className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex items-center">
        <div
          className="p-3 rounded-lg group-hover:scale-110 transition-transform duration-200"
          style={{ backgroundColor: `${color}20` }}
        >
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700">
            {title}
          </h3>
          <p className="text-sm text-gray-600">Manage {title.toLowerCase()}</p>
        </div>
      </div>
    </a>
  );
}
