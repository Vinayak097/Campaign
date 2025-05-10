import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCampaigns, deleteCampaign } from "../services/api";
import type { Campaign } from "../types";

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Fetch campaigns on component mount
  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await getCampaigns();
      if (response.data) {
        setCampaigns(response.data);
      } else {
        setError(response.error || "Failed to fetch campaigns");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Function to handle campaign deletion
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) {
      return;
    }

    setDeleteLoading(id);
    try {
      const response = await deleteCampaign(id);
      if (response.message) {
        // Refresh the campaigns list
        fetchCampaigns();
      } else {
        setError(response.error || "Failed to delete campaign");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setDeleteLoading(null);
    }
  };

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "active":
        return "bg-brand-green/10 text-brand-green border-brand-green/20";
      case "inactive":
        return "bg-brand-gray-100 text-brand-gray-600 border-brand-gray-200";
      case "deleted":
        return "bg-brand-red/10 text-brand-red border-brand-red/20";
      default:
        return "bg-brand-blue/10 text-brand-blue border-brand-blue/20";
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-semibold text-brand-gray-800">
            Campaigns
          </h1>
          <p className="text-brand-gray-500 mt-2 text-lg">
            Manage your outreach campaigns and track their performance
          </p>
        </div>
        <Link
          to="/campaigns/new"
          className="px-6 py-3 bg-brand-blue text-black rounded-full hover:bg-brand-darkBlue transition-all duration-300 flex items-center justify-center md:justify-start w-full md:w-auto shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Create Campaign
        </Link>
      </div>

      {error && (
        <div className="bg-brand-red/10 border border-brand-red/20 text-brand-red px-6 py-4 rounded-xl mb-8 flex items-center backdrop-blur-sm">
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

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 min-h-[400px]">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-brand-gray-100"></div>
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-brand-blue border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          </div>
          <p className="text-brand-gray-500 text-lg">Loading campaigns...</p>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white rounded-apple shadow-apple-md p-12 text-center min-h-[400px] flex flex-col justify-center">
          <div className="w-20 h-20 mx-auto bg-brand-gray-50 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-brand-gray-800 mb-3">No campaigns yet</h2>
          <p className="text-brand-gray-500 mb-8 max-w-md mx-auto">Create your first campaign to start managing your outreach efforts</p>
          <Link
            to="/campaigns/new"
            className="px-8 py-4 bg-gradient-to-r from-brand-blue to-brand-purple text-white rounded-full hover:shadow-lg transition-all duration-300 inline-flex items-center shadow-md transform hover:-translate-y-0.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Create Your First Campaign
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-apple shadow-apple-md overflow-hidden min-h-[400px]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-brand-gray-100">
              <thead className="bg-brand-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">Leads</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-brand-gray-100">
                {campaigns.map((campaign) => (
                  <tr key={campaign._id} className="hover:bg-brand-gray-50 transition-all duration-200">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-medium text-brand-gray-800">{campaign.name}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-brand-gray-600 line-clamp-2 max-w-xs">{campaign.description}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-brand-gray-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-brand-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                        {campaign.leads.length} leads
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-4">
                        <Link
                          to={`/campaigns/edit/${campaign._id}`}
                          className="text-brand-blue hover:text-brand-darkBlue transition-colors flex items-center group"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(campaign._id!)}
                          disabled={deleteLoading === campaign._id}
                          className="text-brand-red hover:text-brand-red/80 transition-colors flex items-center group"
                        >
                          {deleteLoading === campaign._id ? (
                            <div className="flex items-center">
                              <svg className="animate-spin h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Deleting...
                            </div>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              Delete
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignsPage;
