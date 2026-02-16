import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "@/components/ScrollToTop"; // We'll create this inline component below

// Pages
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import Booking from "@/pages/Booking";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";
import CGV from "@/pages/CGV";
import AdminExport from "@/pages/AdminExport";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/services" component={Services} />
      <Route path="/booking" component={Booking} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/cgv" component={CGV} />
      <Route path="/admin-export-emails" component={AdminExport} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ScrollToTopWrapper />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

// Helper to scroll to top on route change
import { useEffect } from "react";
import { useLocation } from "wouter";

function ScrollToTopWrapper() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

export default App;
