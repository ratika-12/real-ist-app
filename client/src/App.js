import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/Auth";
import { SearchProvider } from "./context/Search";
import Menu from "./component/nav/menu";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ActivateAccount from "./pages/auth/ActivateAccount";
import ForgotPassword from "./pages/auth/ForgotPassword";
import AccessAccount from "./pages/auth/AccessAccount";
import Dashboard from "./pages/user/Dashboard";
import AdCreate from "./pages/user/ad/AdCreate";
import PrivateRoute from "./component/routes/PrivateRoute";
import SellHouse from "./pages/user/ad/SellHouse";
import SellLand from "./pages/user/ad/SellLand";
import RentHouse from "./pages/user/ad/RentHouse";
import RentLand from "./pages/user/ad/RentLand";
import AdView from "./pages/AdView";
import Footer from "./component/Footer";
import Profile from "./pages/user/Profile";
import Settings from "./pages/user/Settings";
import AdEdit from "./pages/user/ad/AdEdit";
import Wishlist from "./pages/user/Wishlist";
import Enquiries from "./pages/user/Enquiries"
import Agents from "./pages/Agents";
import PublicProfile from "./pages/user/PublicProfile";
import Buy from "./pages/Buy";
import Rent from "./pages/Rent";
import Search from "./pages/Search";



export default function App() {
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <SearchProvider>
          <Menu />
          <Toaster />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/auth/activate-account/:token"
              element={<ActivateAccount />}
            />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/auth/access-account/:token"
              element={<AccessAccount />}
            />
            <Route path="/" element={<PrivateRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="ad/create" element={<AdCreate />} />
              <Route path="ad/create/sell/house" element={<SellHouse />} />
              <Route path="ad/create/sell/land" element={<SellLand />} />
              <Route path="ad/create/rent/house" element={<RentHouse />} />
              <Route path="ad/create/rent/land" element={<RentLand />} />
              <Route path="user/profile" element={<Profile />} />
              <Route path="user/settings" element={<Settings />} />
              <Route path="user/ad/:slug" element={<AdEdit />}></Route>
              <Route path="user/wishlist" element={<Wishlist />} />
              <Route path="user/enquiries" element={<Enquiries />} />
            </Route>
            <Route path="/ad/:slug" element={<AdView />}></Route>
            <Route path="/agents" element={<Agents />}></Route>
            <Route path="/user/:username" element={<PublicProfile />} />
            <Route path="/buy" element={<Buy />} />
            <Route path="/rent" element={<Rent />} />
            <Route path="/search" element={<Search/>}/>

          </Routes>
          <Footer />
          </SearchProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}
