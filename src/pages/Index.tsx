import { useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Dashboard } from "@/components/Dashboard";
import { TimeEntryForm } from "@/components/TimeEntryForm";
import { TimeEntryList } from "@/components/TimeEntryList";
import { Profile } from "@/components/Profile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/lib/storage";
import { User } from "@/types";
import { Clock, User as UserIcon, Calendar } from "lucide-react";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const loadedUser = getUser();
    setUser(loadedUser);
    if (!loadedUser) {
      setActiveTab("profile");
    }
  }, []);

  return (
    <div className="mx-auto max-w-7xl p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-purple-700">OJT Hour Tracker</h1>
        <p className="text-gray-500">Track and monitor your on-the-job training hours</p>
      </header>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <div className="mb-6 flex items-center border-b border-gray-300 pb-4">
          <TabsList className="mr-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="log-hours" className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> Log Hours
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> History
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" /> Profile
            </TabsTrigger>
          </TabsList>

          {user && (
            <div className="ml-auto text-right text-sm">
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-gray-500">{user.position}</div>
            </div>
          )}
        </div>

        <TabsContent value="dashboard">
          <Dashboard />
        </TabsContent>

        <TabsContent value="log-hours">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Log Hours</h2>
              <p className="text-gray-500">Record your OJT activities and hours</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>New Time Entry</CardTitle>
                <CardDescription>
                  Track the time spent on OJT tasks and activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TimeEntryForm onSuccess={() => setActiveTab("history")} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Time History</h2>
              <p className="text-gray-500">View and manage your logged hours</p>
            </div>

            <TimeEntryList />
          </div>
        </TabsContent>

        <TabsContent value="profile">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Your Profile</h2>
              <p className="text-gray-500">Manage your trainee information</p>
            </div>

            <Profile />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;