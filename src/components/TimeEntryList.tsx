import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimeEntry, TimeFrame } from "@/types";
import { getTimeEntries, deleteTimeEntry } from "@/lib/storage";
import { formatDuration, filterEntriesByTimeFrame } from "@/lib/calculations";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export function TimeEntryList() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<TimeEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    filterEntries();
  }, [timeFrame, searchTerm, selectedCategory, entries]);

  function loadEntries() {
    const loadedEntries = getTimeEntries();
    loadedEntries.sort((a, b) => {
      const dateComparison = b.date.localeCompare(a.date);
      if (dateComparison !== 0) return dateComparison;
      return a.startTime.localeCompare(b.startTime);
    });
    setEntries(loadedEntries);
  }

  function filterEntries() {
    let filtered = filterEntriesByTimeFrame(entries, timeFrame);

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.task.toLowerCase().includes(lowerSearchTerm) || 
        (entry.notes && entry.notes.toLowerCase().includes(lowerSearchTerm))
      );
    }

    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(entry => entry.category === selectedCategory);
    }

    setFilteredEntries(filtered);
  }

  function handleDelete(id: string) {
    deleteTimeEntry(id);
    loadEntries();
    toast("Entry deleted", {
      description: "The time entry has been removed",
    });
  }

  const categories = ["all", ...Array.from(new Set(entries.map(entry => entry.category)))];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex-1">
          <Input
            placeholder="Search tasks or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timeFrame} onValueChange={(value) => setTimeFrame(value as TimeFrame)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="text-center py-12 border border-gray-300 rounded-xl bg-gray-100">
          <p className="text-gray-500">No time entries found</p>
          <p className="text-sm text-gray-400">Log your first hour to get started</p>
        </div>
      ) : (
        <div className="border rounded-xl border-gray-300">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="w-[300px]">Task</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    {format(parseISO(entry.date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    {entry.startTime} - {entry.endTime}
                  </TableCell>
                  <TableCell>
                    {formatDuration(entry.duration)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{entry.task}</div>
                      {entry.notes && (
                        <div className="text-xs text-gray-500">
                          {entry.notes}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-purple-100 text-purple-800">
                      {entry.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete time entry?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this time entry.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(entry.id)}
                            className="bg-red-600 text-white hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}