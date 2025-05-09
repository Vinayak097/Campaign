import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Campaign Management Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your campaigns and generate personalized messages
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Management</CardTitle>
            <CardDescription>
              Create and manage your outreach campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Organize your leads into campaigns, track progress, and manage your outreach efforts efficiently.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link to="/campaigns">View Campaigns</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Message Generator</CardTitle>
            <CardDescription>
              Create personalized outreach messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Generate personalized LinkedIn messages based on profile information using AI.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link to="/message-generator">Generate Messages</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
