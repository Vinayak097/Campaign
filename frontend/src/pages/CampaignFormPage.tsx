import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCampaignById, createCampaign, updateCampaign } from "../services/api";
import type { Campaign } from "../types";

const CampaignFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
    leads: "",
    accountIDs: ""
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
            isActive: campaign.status === "ACTIVE",
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
        alert(id ? "Campaign updated successfully" : "Campaign created successfully");
        navigate("/");
      } else {
        setError(response.error || `Failed to ${id ? "update" : "create"} campaign`);
      }
    } catch (error) {
      setError("An unexpected error occurred");
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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
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

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <h3 className="font-medium">Active Status</h3>
              <p className="text-sm text-gray-600">Set the campaign as active or inactive</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Leads</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Account IDs</label>
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
              className="px-4 py-2 bg-brand-purple text-white rounded hover:bg-brand-darkPurple transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : id ? "Update Campaign" : "Create Campaign"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
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
