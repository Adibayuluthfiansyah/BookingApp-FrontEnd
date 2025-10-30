'use client';

import { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  onClick?: () => void;
}

export default function AdminStatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor = 'bg-primary/10',
  iconColor = 'text-primary',
  onClick,
}: StatsCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "border-border shadow-sm",
        onClick ? 'cursor-pointer hover:bg-accent/50 transition-colors' : ''
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4 lg:p-6">
        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate pr-2">
          {title}
        </CardTitle>
        <div className={cn("p-1.5 sm:p-2 rounded-lg flex-shrink-0", iconBgColor)}>
          <Icon className={cn("w-4 h-4 sm:w-5 sm:h-5", iconColor)} />
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
        <div className="text-xl sm:text-2xl font-bold text-foreground break-words">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}