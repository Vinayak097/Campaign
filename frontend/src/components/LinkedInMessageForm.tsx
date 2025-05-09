
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { LinkedInProfile } from "@/types";
import { generatePersonalizedMessage } from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  job_title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().min(1, "Location is required"),
  summary: z.string().min(1, "Summary is required"),
});

type FormValues = z.infer<typeof formSchema>;

const LinkedInMessageForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "John Doe",
      job_title: "Head of Marketing",
      company: "TechCorp",
      location: "San Francisco, CA",
      summary: "Experienced in digital marketing strategies and lead generation",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setGeneratedMessage(null);
    
    try {
      const profileData: LinkedInProfile = {
        ...values,
      };
      
      const response = await generatePersonalizedMessage(profileData);
      
      if (response.data) {
        setGeneratedMessage(response.data.message);
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to generate message",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyMessageToClipboard = () => {
    if (generatedMessage) {
      navigator.clipboard.writeText(generatedMessage);
      toast({
        title: "Copied",
        description: "Message copied to clipboard",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>LinkedIn Message Generator</CardTitle>
          <CardDescription>
            Enter LinkedIn profile details to generate a personalized outreach message
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="job_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter job title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Summary</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a brief professional summary"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Generating..." : "Generate Message"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {generatedMessage && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Message</CardTitle>
            <CardDescription>
              Personalized outreach message based on the provided LinkedIn profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap bg-muted p-4 rounded-md">
              {generatedMessage}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={copyMessageToClipboard}>Copy to Clipboard</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default LinkedInMessageForm;