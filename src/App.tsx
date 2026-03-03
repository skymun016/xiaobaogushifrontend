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
import PlaceholderPage from "./components/PlaceholderPage";

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
            <Route path="products" element={<PlaceholderPage title="商品中心" description="商品列表、分类管理、SKU管理" />} />
            <Route path="inventory" element={<PlaceholderPage title="库存中心" description="库存总览、入库出库、盘点调整" />} />
            <Route path="suppliers" element={<PlaceholderPage title="供应商中心" description="供应商管理、商品绑定" />} />
            <Route path="procurement" element={<PlaceholderPage title="采购单中心" description="待拆分池、采购单管理、回执录入" />} />
            <Route path="fulfillment" element={<PlaceholderPage title="履约配送" description="出库任务、拣货发货、签收管理" />} />
            <Route path="finance" element={<PlaceholderPage title="财务中心" description="收款对账、毛利报表、退款管理" />} />
            <Route path="notifications" element={<PlaceholderPage title="通知系统" description="通知模板、通知日志" />} />
            <Route path="settings" element={<PlaceholderPage title="系统设置" description="参数配置、角色权限、用户管理" />} />
          </Route>

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
            <Route path="issues" element={<PlaceholderPage title="异常上报" description="采购异常、配送异常上报处理" />} />
            <Route path="delivery" element={<PlaceholderPage title="配送跟踪" description="配送状态跟踪、签收确认" />} />
            <Route path="profile" element={<PlaceholderPage title="个人中心" />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
