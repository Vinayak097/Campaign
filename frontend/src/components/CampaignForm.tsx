
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import type { Campaign } from "@/types";
import { getCampaignById, createCampaign, updateCampaign } from "@/services/api";
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
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["active", "inactive"]),
  leads: z.string().refine(
    (val) => {
      // Split by newline and validate each as URL
      const urls = val.split("\n").filter((url) => url.trim() !== "");
      return urls.every((url) => url.startsWith("http"));
    },
    {
      message: "Each line must be a valid URL starting with http:// or https://",
    }
  ),
  accountIDs: z.string().refine(
    (val) => {
      // Split by newline and validate not empty
      const ids = val.split("\n").filter((id) => id.trim() !== "");
      return ids.length > 0;
    },
    {
      message: "At least one account ID is required",
    }
  ),
});

type FormValues = z.infer<typeof formSchema>;

const CampaignForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(id ? true : false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "ACTIVE",
      leads: "",
      accountIDs: "",
    },
  });

  useEffect(() => {
    if (id) {
      fetchCampaign(id);
    }
  }, [id]);

  const fetchCampaign = async (campaignId: string) => {
    try {
      const response = await getCampaignById(campaignId);
      if (response.data) {
        const campaign = response.data;
        form.reset({
          name: campaign.name,
          description: campaign.description,
          status: campaign.status === "active" ? "inactive" : campaign.status,
          leads: campaign.leads.join("\n"),
          accountIDs: campaign.accountIDs.join("\n"),
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to fetch campaign",
          variant: "destructive",
        });
        navigate("/campaigns");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      navigate("/campaigns");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const campaignData: Campaign = {
        name: values.name,
        description: values.description,
        status: values.status,
        leads: values.leads.split("\n").filter((url) => url.trim() !== ""),
        accountIDs: values.accountIDs.split("\n").filter((id) => id.trim() !== ""),
      };

      let response;
      if (id) {
        response = await updateCampaign(id, campaignData);
      } else {
        response = await createCampaign(campaignData);
      }

      if (response.data) {
        toast({
          title: "Success",
          description: id
            ? "Campaign updated successfully"
            : "Campaign created successfully",
        });
        navigate("/campaigns");
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to save campaign",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading campaign...</p>
      </div>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{id ? "Edit Campaign" : "Create Campaign"}</CardTitle>
        <CardDescription>
          {id
            ? "Update your campaign details below."
            : "Fill out the form below to create a new campaign."}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter campaign name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your campaign"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value === "active"}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? "ACTIVE" : "INACTIVE")
                        }
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="leads"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn Profile URLs</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter LinkedIn profile URLs (one per line)"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountIDs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account IDs</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter account IDs (one per line)"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/campaigns")}
            >
              Cancel
            </Button>
            <Button type="submit">{id ? "Update" : "Create"}</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default CampaignForm;