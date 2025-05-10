import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCampaignById, createCampaign, updateCampaign } from "../services/api";
import type { Campaign } from "../types";
import { useToast } from "../components/Toast";

const CampaignFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "Tech Startups Outreach Campaign",
    description: "A targeted campaign to connect with founders and CTOs of emerging tech startups in the San Francisco Bay Area.",
    isActive: true,
    leads: "https://linkedin.com/in/techfounder1, https://linkedin.com/in/cto-startup, https://linkedin.com/in/siliconvalley-tech",
    accountIDs: "acc123, acc456"
  });

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;

      try {
        const response = await getCampaignById(id);
        if (response.data) {
          const campaign = response.data;
          setFormData({
            name: campaign.name,
            description: campaign.description,
            isActive: campaign.status === "active",
            leads: campaign.leads.join(", "),
            accountIDs: campaign.accountIDs.join(", ")
          });
        } else {
          setError(response.error || "Failed to fetch campaign");
          setTimeout(() => navigate("/"), 2000);
        }
      } catch (error) {
        setError("An unexpected error occurred");
        setTimeout(() => navigate("/"), 2000);
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      fetchCampaign();
    } else {
      setInitialLoading(false);
    }
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      isActive: e.target.checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const campaignData: Campaign = {
        name: formData.name,
        description: formData.description,
        status: formData.isActive ? "active" : "inactive",
        leads: formData.leads.split(",").map(lead => lead.trim()).filter(Boolean),
        accountIDs: formData.accountIDs.split(",").map(accId => accId.trim()).filter(Boolean)
      };

      let response;
      if (id) {
        response = await updateCampaign(id, campaignData);
      } else {
        response = await createCampaign(campaignData);
      }

      if (response.data) {
        showToast(
          id ? "Campaign updated successfully" : "Campaign created successfully",
          "success"
        );
        navigate("/");
      } else {
        setError(response.error || `Failed to ${id ? "update" : "create"} campaign`);
        showToast(`Failed to ${id ? "update" : "create"} campaign`, "error");
      }
    } catch (error) {
      setError("An unexpected error occurred");
      showToast("An unexpected error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-brand-purple">Loading campaign data...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{id ? "Edit" : "Create"} Campaign</h1>
        <p className="text-gray-600">
          {id ? "Update campaign details" : "Set up a new outreach campaign"}
        </p>
      </div>

      {error && (
        <div className="bg-brand-red/10 border border-brand-red/20 text-brand-red px-6 py-4 rounded-xl mb-6 flex items-center backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="font-medium">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-brand-red hover:text-brand-red/80 transition-colors"
            aria-label="Dismiss"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-brand-gray-700 mb-1">Campaign Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple"
              placeholder="Enter campaign name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple"
              placeholder="Enter campaign description"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-brand-gray-50 rounded-lg border border-brand-gray-200">
            <div>
              <h3 className="font-medium">Active Status</h3>
              <p className="text-sm text-brand-gray-600">Set the campaign as active or inactive</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={handleToggleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-purple/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-gray-700 mb-1">Leads</label>
            <textarea
              name="leads"
              value={formData.leads}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple"
              placeholder="Enter LinkedIn profile URLs, separated by commas"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-gray-700 mb-1">Account IDs</label>
            <input
              type="text"
              name="accountIDs"
              value={formData.accountIDs}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple"
              placeholder="Enter account IDs, separated by commas"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-400 text-white font-medium rounded-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 shadow-md transform hover:-translate-y-0.5"
            >
              {loading ? "Saving..." : id ? "Update Campaign" : "Create Campaign"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-white text-brand-gray-700 border border-brand-gray-300 rounded hover:bg-brand-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CampaignFormPage;
