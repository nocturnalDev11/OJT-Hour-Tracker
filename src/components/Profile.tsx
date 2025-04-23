
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User } from "@/types";
import { getUser, saveUser } from "@/lib/storage";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  position: z.string().min(2, "Position must be at least 2 characters"),
  department: z.string().min(2, "Department must be at least 2 characters"),
  supervisor: z.string().min(2, "Supervisor name must be at least 2 characters"),
  targetHours: z.coerce.number().min(1, "Target hours must be at least 1"),
});

export function Profile() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      position: "",
      department: "",
      supervisor: "",
      targetHours: 0,
    },
  });

  useEffect(() => {
    const user = getUser();
    if (user) {
      form.reset({
        name: user.name,
        position: user.position,
        department: user.department,
        supervisor: user.supervisor,
        targetHours: user.targetHours,
      });
    }
  }, [form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Get existing user or create new one
    const existingUser = getUser();
    const user: User = {
      id: existingUser?.id || uuidv4(),
      name: values.name,
      position: values.position,
      department: values.department,
      supervisor: values.supervisor,
      targetHours: values.targetHours,
    };
    
    saveUser(user);
    
    toast("Profile updated", {
      description: "Your profile information has been saved",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trainee Profile</CardTitle>
        <CardDescription>
          Update your profile information for OJT tracking
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position / Role</FormLabel>
                    <FormControl>
                      <Input placeholder="Your position or role" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="Your department" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="supervisor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supervisor</FormLabel>
                    <FormControl>
                      <Input placeholder="Your supervisor's name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="targetHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target OJT Hours</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Total hours to complete" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Total number of OJT hours required
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button 
              type="submit" 
              className="bg-purple-400 hover:bg-purple-600"
            >
              Save Profile
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
