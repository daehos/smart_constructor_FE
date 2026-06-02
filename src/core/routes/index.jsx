import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../../App";
import { MainLayout } from "../../components/MainLayout";
import { RequireAuth } from "./RequireAuth";
import AuthShell from "../../modules/auth/AuthShell";
import LoginPage from "../../modules/auth/LoginPage";
import RegisterPage from "../../modules/auth/RegisterPage";
import VerifyOtpPage from "../../modules/auth/VerifyOtpPage";
import HomePage from "../../modules/home/HomePage";
import ClockInMapPage from "../../modules/home/ClockInMapPage";
import MasterDataLayout from "../../modules/master-data/MasterDataLayout";
import VendorListPage from "../../modules/master-data/VendorListPage";
import VendorCreatePage from "../../modules/master-data/VendorCreatePage";
import VendorDetailPage from "../../modules/master-data/VendorDetailPage";
import VendorEditPage from "../../modules/master-data/VendorEditPage";
import WorkerListPage from "../../modules/master-data/WorkerListPage";
import ProcurementLayout from "../../modules/procurement/ProcurementLayout";
import PriceComparisonPage from "../../modules/procurement/PriceComparisonPage";
import GoodsOrderPage from "../../modules/procurement/GoodsOrderPage";
import OrderFormPage from "../../modules/procurement/OrderFormPage";
import OrderHistoryPage from "../../modules/procurement/OrderHistoryPage";
import OrderDetailPage from "../../modules/procurement/OrderDetailPage";
import ProductListPage from "../../modules/procurement/ProductListPage";
import OrderReviewPage from "../../modules/procurement/OrderReviewPage";
import PayrollPage from "../../modules/payroll/PayrollPage";
import LogActivityPage from "../../modules/log-activity/LogActivityPage";
import SettingsPage from "../../modules/settings/SettingsPage";
import ExpenseManagementLayout from "../../modules/expense-management/ExpenseManagementLayout";
import ExpenseListPage from "../../modules/expense-management/ExpenseListPage";
import ExpenseReportPage from "../../modules/expense-management/ExpenseReportPage";
import ExpenseManualInputPage from "../../modules/expense-management/ExpenseManualInputPage";
import ExpenseUploadReceiptPage from "../../modules/expense-management/ExpenseUploadReceiptPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      {
        element: <AuthShell />,
        children: [
          { path: "login", element: <LoginPage /> },
          { path: "register", element: <RegisterPage /> },
          { path: "verify-otp", element: <VerifyOtpPage /> },
        ],
      },
      {
        element: (
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        ),
        children: [
          { path: "home", element: <HomePage /> },
          { path: "home/clock-in", element: <ClockInMapPage /> },
          { path: "master-data", element: <Navigate to="/master-data/vendor" replace /> },
          {
            path: "master-data",
            element: <MasterDataLayout />,
            children: [
              { path: "vendor", element: <VendorListPage /> },
              { path: "vendor/new", element: <VendorCreatePage /> },
              { path: "vendor/:id", element: <VendorDetailPage /> },
              { path: "vendor/:id/edit", element: <VendorEditPage /> },
              { path: "worker", element: <WorkerListPage /> },
            ],
          },
          { path: "procurement", element: <Navigate to="/procurement/ordering" replace /> },
          {
            path: "procurement",
            element: <ProcurementLayout />,
            children: [
              { path: "comparison", element: <PriceComparisonPage /> },
              { path: "ordering", element: <GoodsOrderPage /> },
              { path: "order/:vendorId", element: <OrderFormPage /> },
              { path: "history", element: <OrderHistoryPage /> },
              { path: "history/:orderId", element: <OrderDetailPage /> },
            ],
          },
          { path: "payroll", element: <PayrollPage /> },
          { path: "log-activity", element: <LogActivityPage /> },
          { path: "settings", element: <SettingsPage /> },
          {
            path: "expense-management",
            element: <Navigate to="/expense-management/list" replace />,
          },
          {
            path: "expense-management",
            element: <ExpenseManagementLayout />,
            children: [
              { path: "list", element: <ExpenseListPage /> },
              { path: "report", element: <ExpenseReportPage /> },
            ],
          },
          { path: "expense-management/manual", element: <ExpenseManualInputPage /> },
          { path: "expense-management/upload", element: <ExpenseUploadReceiptPage /> },
          { path: "procurement/products", element: <ProductListPage /> },
          { path: "procurement/review", element: <OrderReviewPage /> },
        ],
      },
      { path: "*", element: <Navigate to="/login" replace /> },
    ],
  },
]);
