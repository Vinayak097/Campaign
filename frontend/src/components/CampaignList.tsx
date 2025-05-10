
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Campaign } from "@/types";
import { getCampaigns, deleteCampaign, updateCampaign } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
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

  const handleStatusChange = async (id: string, isActive: boolean) => {
    try {
      const status = isActive ? "active" : "inactive";
      const response = await updateCampaign(id, { status });
      
      if (response.data) {
        setCampaigns(
          campaigns.map((campaign) =>
            campaign.id === id ? { ...campaign, status } : campaign
          )
        );
        toast({
          title: "Success",
          description: `Campaign status updated to ${status}`,
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update campaign status",
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

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) {
      return;
    }

    try {
      const response = await deleteCampaign(id);
      if (response.message) {
        // Remove from UI
        setCampaigns(campaigns.filter((campaign) => campaign.id !== id));
        toast({
          title: "Success",
          description: "Campaign deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete campaign",
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
        <p>Loading campaigns...</p>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Leads</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                No campaigns found. Create your first campaign!
              </TableCell>
            </TableRow>
          ) : (
            campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {campaign.description.length > 50
                    ? `${campaign.description.substring(0, 50)}...`
                    : campaign.description}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={campaign.status === "ACTIVE"}
                      onCheckedChange={(checked:any) =>
                        handleStatusChange(campaign.id!, checked)
                      }
                    />
                    <Badge
                      variant={campaign.status === "ACTIVE" ? "default" : "secondary"}
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {campaign.leads.length}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link to={`/campaigns/edit/${campaign.id}`}>
                      <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(campaign.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default CampaignList;