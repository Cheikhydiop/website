import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Sakkanal from './pages/Sakkanal';
import SakkanalQualification from './pages/SakkanalQualification';
import SakkanalResults from './pages/SakkanalResults';
import AdminDashboard from './pages/AdminDashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import AdminLogin from './pages/AdminLogin';
import CatalogManagement from './pages/CatalogManagement';
import TrendsReport from './pages/TrendsReport';
import Expertise from './pages/Expertise';
import Contact from './pages/Contact';
import WhyUs from './pages/WhyUs';
import About from './pages/About';
import AOSInitializer from './components/AOSInitializer';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { useAnalyticsTracking } from './hooks/useAnalyticsTracking';
import './App.css';
import TrainingDashboard from './pages/TrainingDashboard';


// Composant pour initialiser le tracking
function AnalyticsTracker() {
  useAnalyticsTracking();
  return null;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <AOSInitializer />
          <AnalyticsTracker />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sakkanal" element={<Sakkanal />} />
            <Route path="/sakkanal/qualification" element={<SakkanalQualification />} />
            <Route path="/sakkanal/results" element={<SakkanalResults />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/trainer" element={<TrainingDashboard />} />


            
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute>
                  <AnalyticsDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/catalog"
              element={
                <ProtectedRoute>
                  <CatalogManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/trends"
              element={
                <ProtectedRoute>
                  <TrendsReport />
                </ProtectedRoute>
              }
            />
            <Route path="/expertise" element={<Expertise />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/why-us" element={<WhyUs />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;