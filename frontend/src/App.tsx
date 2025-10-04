import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ChatBot } from "./components/ChatBot";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProfileSettings from "./pages/ProfileSettings";
import Explore from "./pages/Explore";
import Book from "./pages/Book";
import Community from "./pages/Community";
import Payment from "./pages/Payment";
import BrowseByCategory from "./pages/BrowseByCategory";
import PopularDestinations from "./pages/PopularDestinations";
import DestinationDetail from "./pages/DestinationDetail";
import RoutePlanner from "./pages/RoutePlanner";
import AuthRedirectUpdate from "./pages/AuthRedirectUpdate";
import CommunityFeaturesDoc from "./pages/CommunityFeaturesDoc";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile-settings" element={<ProfileSettings />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/book" element={<Book />} />
            <Route path="/community" element={<Community />} />
            <Route path="/categories" element={<BrowseByCategory />} />
            <Route path="/destinations" element={<PopularDestinations />} />
            <Route path="/:lang/destinations/:destinationId" element={<DestinationDetail />} />
            <Route path="/:lang/destinos/:destinationId" element={<DestinationDetail />} />
            <Route path="/:lang/ziele/:destinationId" element={<DestinationDetail />} />
            <Route path="/destination/:destinationName" element={<DestinationDetail />} />
            <Route path="/route-planner" element={<RoutePlanner />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/auth-redirect-update" element={<AuthRedirectUpdate />} />
            <Route path="/community-features-doc" element={<CommunityFeaturesDoc />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatBot />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;