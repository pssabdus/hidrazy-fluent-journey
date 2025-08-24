import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import Premium from "./pages/Premium";
import Subscription from "./pages/Subscription";
import OfflineLearning from "./pages/OfflineLearning";
import IELTSMastery from "./pages/IELTSMastery";
import AIContentStudio from "./pages/AIContentStudio";
import { PricingPage } from '@/components/subscription/PricingPage';
import { PaymentSuccess } from '@/components/subscription/PaymentSuccess';
import { SubscriptionManagement } from '@/components/subscription/SubscriptionManagement';


const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/premium" element={<Premium />} />
      <Route path="/subscription" element={<Subscription />} />
      <Route path="/offline-learning" element={<OfflineLearning />} />
      <Route path="/ielts-mastery" element={<IELTSMastery />} />
      <Route path="/ai-content-studio" element={<AIContentStudio />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/subscription-management" element={<SubscriptionManagement />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </TooltipProvider>
);

export default App;
