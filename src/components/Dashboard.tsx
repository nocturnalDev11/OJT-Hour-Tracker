import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardStats, CategorySummary, User } from "@/types";
import { getDashboardStats, getHoursByCategory } from "@/lib/calculations";
import { getUser, getTimeEntries } from "@/lib/storage";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { Clock, Calendar, Timer } from "lucide-react";

const COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA', '#E5DEFF'];

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalHours: 0,
    weeklyHours: 0,
    monthlyHours: 0,
    completionPercentage: 0
  });
  const [categorySummary, setCategorySummary] = useState<CategorySummary[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'all'>('week');

  useEffect(() => {
    setUser(getUser());
    setStats(getDashboardStats());
    setCategorySummary(getHoursByCategory(timeFrame));
  }, [timeFrame]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Track your OJT progress and logged hours</p>
      </div>

      {!user && (
        <Card className="bg-accent">
          <CardContent className="pt-6">
            <p>Please complete your profile to get started tracking your OJT hours.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">hours logged for your OJT</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{timeFrame === 'week' ? 'This Week' : 'This Month'}</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {timeFrame === 'week' ? stats.weeklyHours.toFixed(1) : stats.monthlyHours.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">hours in current {timeFrame}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <Timer className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.completionPercentage)}%</div>
            <Progress value={stats.completionPercentage} className="mt-2 bg-muted [&>div]:bg-primary" />
            <p className="text-xs text-muted-foreground mt-2">
              of your target {user?.targetHours || 0} hours
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="week" onValueChange={(v: 'week' | 'month' | 'all') => setTimeFrame(v)}>
        <TabsList>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
          <TabsTrigger value="all">All Time</TabsTrigger>
        </TabsList>
        <TabsContent value="week" className="space-y-4">
          <CategoryBreakdown data={categorySummary} />
        </TabsContent>
        <TabsContent value="month" className="space-y-4">
          <CategoryBreakdown data={categorySummary} />
        </TabsContent>
        <TabsContent value="all" className="space-y-4">
          <CategoryBreakdown data={categorySummary} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CategoryBreakdown({ data }: { data: CategorySummary[] }) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>Hours spent by category</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No data available yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
        <CardDescription>Hours spent by category</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="hours"
              nameKey="category"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter>
        <div className="w-full space-y-1">
          {data.map((category, i) => (
            <div key={category.category} className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="h-3 w-3 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span>{category.category}</span>
              </div>
              <div className="font-medium">{category.hours.toFixed(1)} hrs</div>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}