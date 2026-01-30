import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { TicketsProvider } from "@/contexts/TicketsContext";
import { ClientAuthProvider } from "@/client/contexts/ClientAuthContext";

// User Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import EstablishmentPage from "./pages/EstablishmentPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Tickets from "./pages/Tickets";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Client Pages
import ClientLogin from "./client/pages/ClientLogin";
import ClientSignup from "./client/pages/ClientSignup";
import ClientDashboard from "./client/pages/ClientDashboard";
import ClientSettings from "./client/pages/ClientSettings";
import ClientMenu from "./client/pages/ClientMenu";
import ClientOperational from "./client/pages/ClientOperational";
import ClientCustomers from "./client/pages/ClientCustomers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <CartProvider>
          <TicketsProvider>
            <ClientAuthProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    {/* User Routes */}
                    <Route path="/" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/establishment/:id" element={<EstablishmentPage />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/tickets" element={<Tickets />} />
                    <Route path="/profile" element={<Profile />} />

                    {/* Client Routes */}
                    <Route path="/client" element={<ClientLogin />} />
                    <Route path="/client/signup" element={<ClientSignup />} />
                    <Route path="/client/dashboard" element={<ClientDashboard />} />
                    <Route path="/client/settings" element={<ClientSettings />} />
                    <Route path="/client/menu" element={<ClientMenu />} />
                    <Route path="/client/menu/categories" element={<ClientMenu />} />
                    <Route path="/client/menu/products" element={<ClientMenu />} />
                    <Route path="/client/operational" element={<ClientOperational />} />
                    <Route path="/client/operational/pending" element={<ClientOperational />} />
                    <Route path="/client/operational/cashier" element={<ClientOperational />} />
                    <Route path="/client/customers" element={<ClientCustomers />} />

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </ClientAuthProvider>
          </TicketsProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
