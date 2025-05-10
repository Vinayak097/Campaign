import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import CampaignsPage from './pages/CampaignsPage';
import CampaignFormPage from './pages/CampaignFormPage';
import MessageGeneratorPage from './pages/MessageGeneratorPage';

// Apple-inspired modern layout component with navigation
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-brand-gray-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-brand-gray-100 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">CM</span>
              </div>
              <h1 className="text-2xl font-semibold bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent">
                Campaign Manager
              </h1>
            </Link>
            <nav className="flex space-x-2">
              <Link
                to="/"
                className="px-4 py-2 rounded-full text-brand-gray-800 hover:bg-brand-gray-100 transition-all duration-200 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 text-brand-blue" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                Campaigns
              </Link>
              <Link
                to="/campaigns/new"
                className="px-4 py-2 rounded-full text-brand-gray-800 hover:bg-brand-gray-100 transition-all duration-200 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 text-brand-green" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                New Campaign
              </Link>
              <Link
                to="/message-generator"
                className="px-4 py-2 rounded-full text-brand-gray-800 hover:bg-brand-gray-100 transition-all duration-200 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 text-brand-purple" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
                Message Generator
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
      <footer className="bg-white border-t border-brand-gray-100 py-6 mt-auto">
        <div className="container mx-auto px-6 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center">
              <span className="text-white font-bold text-xs">CM</span>
            </div>
            <p className="text-brand-gray-500 text-sm">
              Campaign Management System © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Layout>
            <CampaignsPage />
          </Layout>
        } />
        <Route path="/campaigns/new" element={
          <Layout>
            <CampaignFormPage />
          </Layout>
        } />
        <Route path="/campaigns/edit/:id" element={
          <Layout>
            <CampaignFormPage />
          </Layout>
        } />
        <Route path="/message-generator" element={
          <Layout>
            <MessageGeneratorPage />
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;