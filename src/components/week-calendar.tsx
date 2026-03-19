import React, { useState } from 'react';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '@/lib/data-context';
import { CalendarDay } from './calendar-day';

export function WeekCalendar() {
  const { reports } = useData();
  const [currentDate, setCurrentDate] = useState(dayjs());
  
  // Calculate Monday (1) to Sunday (7)
  const dayOfWeek = currentDate.day() === 0 ? 7 : currentDate.day();
  const startOfWeek = currentDate.subtract(dayOfWeek - 1, 'day');
  
  const weekDays = Array.from({ length: 7 }).map((_, i) => startOfWeek.add(i, 'day'));

  const handlePrevWeek = () => setCurrentDate(prev => prev.subtract(1, 'week'));
  const handleNextWeek = () => setCurrentDate(prev => prev.add(1, 'week'));
  const handleToday = () => setCurrentDate(dayjs());

  return (
    <div className="flex flex-col h-full border-l border-border-light pl-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold tracking-tight">
          {startOfWeek.format('MMMM YYYY')}
        </h2>
        <div className="flex items-center gap-1">
          <button onClick={handleToday} className="text-xs px-2 py-1 bg-muted/60 text-muted-foreground font-medium rounded-sm hover:bg-muted/80 mr-2 transition-colors">
            Today
          </button>
          <button onClick={handlePrevWeek} className="p-1 text-muted-foreground hover:bg-muted/60 rounded-sm transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={handleNextWeek} className="p-1 text-muted-foreground hover:bg-muted/60 rounded-sm transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-y-auto overflow-x-hidden min-h-0 relative">
        <div className="flex w-full min-h-full border-t border-border-light">
          {weekDays.map(date => {
            const dateStr = date.format('YYYY-MM-DD');
            const dayReports = reports.filter(r => r.due_date === dateStr);
            return (
              <CalendarDay 
                key={dateStr} 
                date={date} 
                reports={dayReports} 
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
