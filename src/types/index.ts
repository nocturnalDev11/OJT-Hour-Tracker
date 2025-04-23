
// Types for the OJT Hour Tracking System

export interface TimeEntry {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  task: string;
  category: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  position: string;
  department: string;
  supervisor: string;
  targetHours: number;
}

export interface DashboardStats {
  totalHours: number;
  weeklyHours: number;
  monthlyHours: number;
  completionPercentage: number;
}

export type TimeFrame = 'day' | 'week' | 'month' | 'all';

export interface CategorySummary {
  category: string;
  hours: number;
  percentage: number;
}
