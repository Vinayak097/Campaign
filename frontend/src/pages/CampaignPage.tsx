import { useState } from "react";
import { Button } from "@/components/ui/button";

import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import CampaignList from "@/components/CampaignList";

const CampaignsPage = () => {
  return (
    <div className="container py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage your outreach campaigns
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button asChild>
            <Link to="/campaigns/new">
              <Plus className="mr-2 h-4 w-4" /> New Campaign
            </Link>
          </Button>
        </div>
      </div>

      <CampaignList />
    </div>
  );
};

export default CampaignsPage;