import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import EntryPage from "./pages/EntryPage";
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import OrderList from "./pages/admin/orders/OrderList";
import OrderDetail from "./pages/admin/orders/OrderDetail";
import ProductList from "./pages/admin/products/ProductList";
import InventoryCenter from "./pages/admin/inventory/InventoryCenter";
import SupplierCenter from "./pages/admin/suppliers/SupplierCenter";
import ProcurementCenter from "./pages/admin/procurement/ProcurementCenter";
import FinanceCenter from "./pages/admin/finance/FinanceCenter";
import NotificationCenter from "./pages/admin/notifications/NotificationCenter";
import SettingsCenter from "./pages/admin/settings/SettingsCenter";
import MiniProgramCenter from "./pages/admin/miniprogram/MiniProgramCenter";
import MobileLayout from "./layouts/MobileLayout";
import StoreHome from "./pages/store/StoreHome";
import StoreCategories from "./pages/store/StoreCategories";
import StoreCart from "./pages/store/StoreCart";
import StoreOrders from "./pages/store/StoreOrders";
import StoreOrderDetail from "./pages/store/StoreOrderDetail";
import StoreProfile from "./pages/store/StoreProfile";
import ManagerLayout from "./layouts/ManagerLayout";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ManagerApplications from "./pages/manager/ManagerApplications";
import ManagerIssues from "./pages/manager/ManagerIssues";
import ManagerProfile from "./pages/manager/ManagerProfile";
import MobileLogin from "./pages/mobile/MobileLogin";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Entry */}
          <Route path="/" element={<EntryPage />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="products" element={<ProductList />} />
            <Route path="inventory" element={<InventoryCenter />} />
            <Route path="suppliers" element={<SupplierCenter />} />
            <Route path="procurement" element={<ProcurementCenter />} />
            <Route path="finance" element={<FinanceCenter />} />
            <Route path="notifications" element={<NotificationCenter />} />
            <Route path="settings" element={<SettingsCenter />} />
            <Route path="miniprogram" element={<MiniProgramCenter />} />
          </Route>

          {/* Mobile login */}
          <Route path="/mobile/login" element={<MobileLogin />} />

          {/* Store mobile */}
          <Route path="/store" element={<MobileLayout />}>
            <Route index element={<StoreHome />} />
            <Route path="categories" element={<StoreCategories />} />
            <Route path="cart" element={<StoreCart />} />
            <Route path="orders" element={<StoreOrders />} />
            <Route path="orders/:id" element={<StoreOrderDetail />} />
            <Route path="profile" element={<StoreProfile />} />
          </Route>

          {/* Manager mobile */}
          <Route path="/manager" element={<ManagerLayout />}>
            <Route index element={<ManagerDashboard />} />
            <Route path="applications" element={<ManagerApplications />} />
            <Route path="issues" element={<ManagerIssues />} />
            <Route path="profile" element={<ManagerProfile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
