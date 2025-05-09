import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/components/ui/use-toast";
import { getCampaignById, createCampaign, updateCampaign } from "@/services/api";
import type { Campaign, CampaignStatus } from "@/types";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  isActive: z.boolean(),
  leads: z.string(),
  accountIDs: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const CampaignFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
      leads: "",
      accountIDs: "",
    },
  });

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;

      try {
        const response = await getCampaignById(id);
        if (response.data) {
          const campaign = response.data;
          form.reset({
            name: campaign.name,
            description: campaign.description,
            isActive: campaign.status === "ACTIVE",
            leads: campaign.leads.join(", "),
            accountIDs: campaign.accountIDs.join(", "),
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
        setInitialLoading(false);
      }
    };

    if (id) {
      fetchCampaign();
    } else {
      setInitialLoading(false);
    }
  }, [id, navigate, toast, form]);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);

    try {
      const campaignData: Campaign = {
        name: values.name,
        description: values.description,
        status: values.isActive ? "ACTIVE" : "INACTIVE",
        leads: values.leads.split(",").map((lead) => lead.trim()).filter(Boolean),
        accountIDs: values.accountIDs.split(",").map((id) => id.trim()).filter(Boolean),
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
          description: id ? "Campaign updated successfully" : "Campaign created successfully",
        });
        navigate("/campaigns");
      } else {
        toast({
          title: "Error",
          description: response.error || `Failed to ${id ? "update" : "create"} campaign`,
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

  if (initialLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center">
          <p>Loading campaign data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{id ? "Edit" : "Create"} Campaign</h1>
        <p className="text-muted-foreground">
          {id ? "Update campaign details" : "Set up a new outreach campaign"}
        </p>
      </div>

      <div className="max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      placeholder="Enter campaign description"
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
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Set the campaign as active or inactive
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="leads"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leads</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter LinkedIn profile URLs, separated by commas"
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
              name="accountIDs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account IDs</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter account IDs, separated by commas"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : id ? "Update Campaign" : "Create Campaign"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/campaigns")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CampaignFormPage;
