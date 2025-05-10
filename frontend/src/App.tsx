import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import CampaignsPage from './pages/CampaignsPage';
import CampaignFormPage from './pages/CampaignFormPage';
import MessageGeneratorPage from './pages/MessageGeneratorPage';
import { ToastProvider } from './components/Toast';

// Modern futuristic layout component with navigation
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-white/70 backdrop-blur-xl border-b border-indigo-100/30 sticky top-0 z-10 shadow-sm shadow-indigo-200/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-400 items-center justify-center shadow-lg shadow-blue-200/50 transition-all duration-300 group-hover:shadow-blue-300/50 group-hover:scale-105">
                <span className="text-white font-bold text-lg">CM</span>
              </div>
              <div className='block'>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">
                  <span className="hidden sm:inline">Campaign Manager</span>
                  <span className="sm:hidden">CM</span>
                </h1>
                <span className="hidden sm:inline text-xs text-slate-500">Next-Gen Outreach</span>
              </div>
            </Link>
            <nav className="flex space-x-2 bg-white/50 p-1 rounded-full shadow-inner shadow-indigo-100">
              <Link
                to="/"
                className={`px-3 sm:px-4 py-2.5 rounded-full transition-all duration-300 flex items-center ${
                  location.pathname === '/'
                    ? 'bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-400 text-white shadow-md shadow-blue-200/50'
                    : 'text-slate-700 hover:bg-white hover:shadow-sm'
                }`}
                title="Campaigns"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                <span className="hidden sm:inline">Campaigns</span>
              </Link>
              <Link
                to="/campaigns/new"
                className={`px-3 sm:px-4 py-2.5 rounded-full transition-all duration-300 flex items-center ${
                  location.pathname === '/campaigns/new'
                    ? 'bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-400 text-white shadow-md shadow-blue-200/50'
                    : 'text-slate-700 hover:bg-white hover:shadow-sm'
                }`}
                title="New Campaign"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline">New Campaign</span>
              </Link>
              <Link
                to="/message-generator"
                className={`px-3 sm:px-4 py-2.5 rounded-full transition-all duration-300 flex items-center ${
                  location.pathname === '/message-generator'
                    ? 'bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-400 text-white shadow-md shadow-blue-200/50'
                    : 'text-slate-700 hover:bg-white hover:shadow-sm'
                }`}
                title="Message Generator"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
                <span className="hidden sm:inline">Message Generator</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-purple-50/30 to-transparent pointer-events-none h-64"></div>
        <main className="container mx-auto px-6 py-10 flex-grow relative">
          {children}
        </main>
      </div>
      <footer className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-400 mt-auto relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjxwYXRoIGQ9Ik0xNiAxNmMyLjIgMCA0IDEuOCA0IDRzLTEuOCA0LTQgNC00LTEuOC00LTQgMS44LTQgNC00em0xNiAwYzIuMiAwIDQgMS44IDQgNHMtMS44IDQtNCA0LTQtMS44LTQtNCAxLjgtNCA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="container mx-auto px-6 py-8 text-center relative z-10">
          <div className="flex flex-col items-center justify-center space-y-5">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">CM</span>
            </div>
            <div className="space-y-2">
              <p className="text-white font-medium">
                Campaign Management System
              </p>
              <p className="text-white/70 text-sm">
                © {new Date().getFullYear()} • Next-Generation Outreach Platform
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <ToastProvider>
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
    </ToastProvider>
  );
}

export default App;