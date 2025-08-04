import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Login from "./pages/Login";
import { SideMenu } from "./components/SideMenu";
import Register from "./pages/register/Register";
import Users from "./pages/register/Users";
import Stocks from "./pages/register/Stocks";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import StockDetail from "./pages/register/StockDetail";
import Items from "./pages/register/Items";
import { ProfileProvider } from "./context/ProfileProvider";
import Profile from "./pages/Profile";
import Stock from "./pages/stock/Stock";
import Purchases from "./pages/stock/Purchases";
import NewPurchase from "./pages/stock/NewPurchase";
import PurchaseDetail from "./pages/stock/PurchaseDetail";
import StockItems from "./pages/stock/Items";
import Dashboard from "./pages/dashboard/Dashboard";
import AllSales from "./pages/dashboard/AllSales";
import Pending from "./pages/dashboard/Pending";
import Separation from "./pages/dashboard/Separation";
import Review from "./pages/dashboard/Review";
import Transit from "./pages/dashboard/Transit";
import Delivered from "./pages/dashboard/Delivered";
import SeparationDetail from "./pages/dashboard/SeparationDetail";
import ReviewDetail from "./pages/dashboard/ReviewDetail";
import Clients from "./pages/register/Clients";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Sales from "./pages/sales/Sales";
import OrderDetail from "./pages/OrderDetail";
import { LoadingMain } from "./components/loadingMain";
import { StockLayout } from "./components/StockLayout";
import Categories from "./pages/register/Categories";
import Docks from "./pages/register/Docks";
import PendingOrderDetail from "./pages/dashboard/PendingOrderDetail";
import OrderDocks from "./pages/dashboard/Docks";
import Taxes from "./pages/register/Taxes";
import InPaymentOrders from "./pages/dashboard/Payment";
import PaymentDetail from "./pages/dashboard/PaymentDetail";
import UserRoles from "./pages/register/UserRoles";
import { ReportOrders } from "./pages/report/reportOrders";
import Report from "./pages/report/Report";
import { ReportItems } from "./pages/report/reportItems";
import { ConfigProvider } from "antd";
import ptBR from "antd/locale/pt_BR";
import ReportNcm from "./pages/report/reportNcm";
import ReportSold from "./pages/report/ReportSold";
import ReportItemPerSeller from "./pages/report/ReportItemPerSeller";
import ReportCost from "./pages/report/ReportCost";
import Traceability from "./pages/traceability/Traceability";
import UserLogs from "./pages/traceability/UserLogs";
import ItemLogs from "./pages/traceability/ItemLogs";
import CommissionReport from "./pages/report/CommissionReport";
import MonthlyReport from "./pages/report/MonthlyReport";
import CategoryLogs from "./pages/traceability/CategoryLogs";
import ClientLogs from "./pages/traceability/ClientLogs";
import DockLogs from "./pages/traceability/DockLogs";
import OrderLogs from "./pages/traceability/OrderLogs";
import StockLogs from "./pages/traceability/StockLogs";
import TaxLogs from "./pages/traceability/TaxLogs";
import ReservedItems from "./pages/stock/ReservedItems";
import StockedItemLogs from "./pages/traceability/StockedItemLogs";
import DailyReport from "./pages/report/DailyReport";

const queryClient = new QueryClient();

export default function App() {
  return (
    <main className="3xl:flex 3xl:justify-center">
      <QueryClientProvider client={queryClient}>
        <ConfigProvider locale={ptBR}>
          <BrowserRouter>
            <LoadingMain />
            <ToastContainer
              autoClose={2000}
              transition={Slide}
              closeOnClick
              theme="colored"
            />
            <ProfileProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<SideMenu />}>
                  <Route path="/register" element={<Register />}>
                    <Route path="users" element={<Users />} />
                    <Route path="users/:id" element={<UserRoles />} />
                    <Route path="items" element={<Items />} />
                    <Route path="clients" element={<Clients />} />
                    <Route path="stocks" element={<Stocks />} />
                    <Route path="stocks/:id" element={<StockDetail />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="docks" element={<Docks />} />
                    <Route path="taxes" element={<Taxes />} />
                  </Route>

                  <Route path="/traceability" element={<Traceability />}>
                    <Route path="users" element={<UserLogs />} />
                    <Route path="items" element={<ItemLogs />} />
                    <Route path="stocked-items" element={<StockedItemLogs />} />
                    <Route path="categories" element={<CategoryLogs />} />
                    <Route path="clients" element={<ClientLogs />} />
                    <Route path="docks" element={<DockLogs />} />
                    <Route path="orders" element={<OrderLogs />} />
                    <Route path="stocks" element={<StockLogs />} />
                    <Route path="taxes" element={<TaxLogs />} />
                  </Route>

                  <Route path="/report" element={<Report />} />
                  <Route path="/report/orders" element={<ReportOrders />} />
                  <Route path="/report/items" element={<ReportItems />} />
                  <Route path="/report/ncm" element={<ReportNcm />} />
                  <Route path="/report/sold" element={<ReportSold />} />
                  <Route path="/report/sold/:id" element={<ReportItemPerSeller />} />
                  <Route path="/report/cost" element={<ReportCost />} />
                  <Route path="/report/daily-report" element={<DailyReport />} />
                  <Route path="/report/commission-seller" element={<CommissionReport />} />
                  <Route path="/report/monthly-report" element={<MonthlyReport />} />

                  <Route path="/dashboard" element={<Dashboard />}>
                    <Route path="all" element={<AllSales />} />
                    <Route path="pending" element={<Pending />} />
                    <Route path="separation" element={<Separation />} />
                    <Route path="review" element={<Review />} />
                    <Route path="transit" element={<Transit />} />
                    <Route path="delivered" element={<Delivered />} />
                    <Route path="docks" element={<OrderDocks />} />
                    <Route path="in-payment" element={<InPaymentOrders />} />
                  </Route>
                  <Route path="/dashboard/in-payment/:id" element={<PaymentDetail />} />
                  <Route path="/dashboard/separation/:id" element={<SeparationDetail />} />
                  <Route path="/dashboard/review/:id" element={<ReviewDetail />} />
                  <Route element={<StockLayout />}>
                    <Route path="/stock" element={<Stock />} />
                    <Route path="/stock/purchases" element={<Purchases />} />
                    <Route path="/stock/items" element={<StockItems />} />
                    <Route path="/stock/reserved-items" element={<ReservedItems />} />
                  </Route>
                  <Route path="/stock/purchases/new-purchase" element={<NewPurchase />} />
                  <Route path="/stock/purchases/:id" element={<PurchaseDetail />} />
                  <Route path="/dashboard/pending/:id" element={<PendingOrderDetail />} />
                  <Route path="/sales/:id" element={<OrderDetail />} />
                  <Route path="/sales" element={<Sales />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>
                <Route path="/" element={<Home />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ProfileProvider>
          </BrowserRouter>
        </ConfigProvider>
      </QueryClientProvider>
    </main>
  );
}
