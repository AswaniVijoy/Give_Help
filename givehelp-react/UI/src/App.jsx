import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Explore from "./pages/Explore"
import CampaignDetail from "./pages/CampaignDetail"
import Donate from "./pages/Donate"
import Profile from "./pages/Profile"
import AdminDashboard from "./admin/AdminDashboard"
import AdminDonations from "./admin/AdminDonations"
import AdminCampaigns from "./admin/AdminCampaigns"
import CreateCampaign from "./admin/CreateCampaign"
import EditCampaign from "./admin/EditCampaign"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/campaign/:id" element={<CampaignDetail />} />
        <Route path="/donate/:id" element={<Donate />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/campaigns" element={<AdminCampaigns />} />
        <Route path="/admin/donations" element={<AdminDonations />} />
        <Route path="/admin/create-campaign" element={<CreateCampaign />} />
        <Route path="/admin/edit-campaign/:id" element={<EditCampaign />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
