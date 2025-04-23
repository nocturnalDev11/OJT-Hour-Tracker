
import { TimeEntry, TimeFrame, CategorySummary, DashboardStats } from "@/types";
import { getTimeEntries, getUser } from "./storage";
import { format, parseISO, startOfWeek, startOfMonth, differenceInMinutes, isWithinInterval } from "date-fns";

// Calculate time difference in minutes
export const calculateDuration = (startTime: string, endTime: string): number => {
  const start = parseISO(`2023-01-01T${startTime}`);
  const end = parseISO(`2023-01-01T${endTime}`);
  return differenceInMinutes(end, start);
};

// Convert minutes to hours format (e.g., 125 minutes -> "2h 5m")
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

// Filter entries by timeframe
export const filterEntriesByTimeFrame = (entries: TimeEntry[], timeFrame: TimeFrame): TimeEntry[] => {
  const now = new Date();
  
  switch (timeFrame) {
    case 'day':
      const today = format(now, 'yyyy-MM-dd');
      return entries.filter(entry => entry.date === today);
    case 'week':
      const weekStart = startOfWeek(now);
      return entries.filter(entry => {
        const entryDate = parseISO(entry.date);
        return entryDate >= weekStart;
      });
    case 'month':
      const monthStart = startOfMonth(now);
      return entries.filter(entry => {
        const entryDate = parseISO(entry.date);
        return entryDate >= monthStart;
      });
    case 'all':
    default:
      return entries;
  }
};

// Get total hours for a given time frame
export const getTotalHours = (timeFrame: TimeFrame = 'all'): number => {
  const entries = getTimeEntries();
  const filteredEntries = filterEntriesByTimeFrame(entries, timeFrame);
  
  return filteredEntries.reduce((total, entry) => total + entry.duration, 0) / 60;
};

// Calculate dashboard stats
export const getDashboardStats = (): DashboardStats => {
  const user = getUser();
  const totalHours = getTotalHours('all');
  const weeklyHours = getTotalHours('week');
  const monthlyHours = getTotalHours('month');
  
  const targetHours = user?.targetHours || 0;
  const completionPercentage = targetHours ? Math.min(100, (totalHours / targetHours) * 100) : 0;
  
  return {
    totalHours,
    weeklyHours,
    monthlyHours,
    completionPercentage
  };
};

// Get hours by category
export const getHoursByCategory = (timeFrame: TimeFrame = 'all'): CategorySummary[] => {
  const entries = getTimeEntries();
  const filteredEntries = filterEntriesByTimeFrame(entries, timeFrame);
  
  // Group by category and sum duration
  const categorySums: Record<string, number> = {};
  let totalMinutes = 0;
  
  filteredEntries.forEach(entry => {
    categorySums[entry.category] = (categorySums[entry.category] || 0) + entry.duration;
    totalMinutes += entry.duration;
  });
  
  // Convert to array of CategorySummary
  return Object.keys(categorySums).map(category => ({
    category,
    hours: categorySums[category] / 60,
    percentage: totalMinutes ? (categorySums[category] / totalMinutes) * 100 : 0
  }));
};
