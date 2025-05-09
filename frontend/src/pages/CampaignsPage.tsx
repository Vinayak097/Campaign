import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCampaigns } from "@/services/api";
import type { Campaign } from "@/types";
import { useToast } from "@/components/ui/use-toast";

const CampaignsPage = () => {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch campaigns on component mount
  useState(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await getCampaigns();
        if (response.data) {
          setCampaigns(response.data);
        } else {
          toast({
            title: "Error",
            description: response.error || "Failed to fetch campaigns",
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

    fetchCampaigns();
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "INACTIVE":
        return "secondary";
      case "DELETED":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage your outreach campaigns
          </p>
        </div>
        <Button asChild>
          <Link to="/campaigns/new">Create Campaign</Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <p>Loading campaigns...</p>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No campaigns found</p>
          <Button asChild>
            <Link to="/campaigns/new">Create Your First Campaign</Link>
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Leads</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell>{campaign.description}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(campaign.status)}>
                    {campaign.status}
                  </Badge>
                </TableCell>
                <TableCell>{campaign.leads.length}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="mr-2"
                  >
                    <Link to={`/campaigns/edit/${campaign.id}`}>Edit</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default CampaignsPage;
