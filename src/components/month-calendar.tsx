import React, { useState, useMemo, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { useData } from '@/lib/data-context';
import { CalendarDay } from './calendar-day';
import { Report } from '@/types';

export function MonthCalendar() {
  const { reports } = useData();
  const scrollRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<HTMLDivElement>(null);
  const [visibleMonth, setVisibleMonth] = useState(dayjs().format('MMMM YYYY'));

  // Group reports by date for O(1) lookups during render
  const reportsByDate = useMemo(() => {
    const map = new Map<string, Report[]>();
    reports.forEach(r => {
      if (!r.due_date) return;
      if (!map.has(r.due_date)) map.set(r.due_date, []);
      map.get(r.due_date)!.push(r);
    });
    return map;
  }, [reports]);

  // Generate a continuous grid constraint: 6 months back, ~1 year forward (700 days / 100 weeks)
  const monthDays = useMemo(() => {
    const today = dayjs();
    const dayOfWeek = today.day() === 0 ? 7 : today.day();
    const thisMonday = today.subtract(dayOfWeek - 1, 'day');
    const startOfGrid = thisMonday.subtract(24, 'week'); // 24 weeks ago
    
    return Array.from({ length: 700 }).map((_, i) => startOfGrid.add(i, 'day'));
  }, []);

  // Initial scroll to today
  useEffect(() => {
    if (scrollRef.current && todayRef.current) {
      scrollRef.current.scrollTop = todayRef.current.offsetTop - 120;
    }
  }, []);

  // Intersection Observer to update month header on scroll
  useEffect(() => {
    if (!scrollRef.current) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const monthStr = entry.target.getAttribute('data-month');
          if (monthStr) setVisibleMonth(monthStr);
        }
      });
    }, {
      root: scrollRef.current,
      // A horizontal band ~100px from the top of the scroll container
      rootMargin: '-100px 0px -80% 0px', 
    });

    // Observe all Monday cells which act as markers for the week's month
    const elements = scrollRef.current.querySelectorAll('[data-month]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [monthDays]);

  const handleToday = () => {
    if (scrollRef.current && todayRef.current) {
      scrollRef.current.scrollTo({
        top: todayRef.current.offsetTop - 120,
        behavior: 'smooth'
      });
      setVisibleMonth(dayjs().format('MMMM YYYY'));
    }
  };

  return (
    <div className="flex flex-col h-full pl-8">
      <div className="flex items-center justify-between mb-4 pr-2">
        <h2 className="text-[1.1rem] font-semibold tracking-tight text-foreground">
          {visibleMonth}
        </h2>
        <button onClick={handleToday} className="text-xs px-3 py-1.5 bg-muted/60 text-muted-foreground font-medium rounded-sm hover:bg-muted/80 transition-colors">
          Today
        </button>
      </div>
      
      <div ref={scrollRef} className="flex-1 flex overflow-y-auto overflow-x-hidden min-h-0 relative pr-4 custom-scrollbar">
        <div className="grid grid-cols-7 w-full h-max border-t border-l border-border-light auto-rows-[minmax(120px,1fr)]">
          {/* Header row for days of week */}
          <div className="col-span-7 grid grid-cols-7 sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border-light h-9">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider flex items-center justify-center border-r border-border-light last:border-r-0 h-full">
                {day}
              </div>
            ))}
          </div>
          
          {monthDays.map(date => {
            const dateStr = date.format('YYYY-MM-DD');
            const dayReports = reportsByDate.get(dateStr) || [];
            const isToday = date.isSame(dayjs(), 'day');
            
            // Print the month name on the 1st of every month
            const isFirstOfMonth = date.date() === 1;
            const isMonday = date.day() === 1;
            
            return (
              <div 
                key={dateStr}
                ref={isToday ? todayRef : null}
                data-month={isMonday ? date.format('MMMM YYYY') : undefined}
                className={`border-b border-border-light h-full flex flex-col justify-stretch transition-opacity ${date.month() % 2 === 0 ? 'bg-muted/5' : ''}`}
              >
                <CalendarDay 
                  date={date} 
                  reports={dayReports}
                  hideDayOfWeek={true}
                  monthLabel={isFirstOfMonth ? date.format('MMM D') : undefined}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
