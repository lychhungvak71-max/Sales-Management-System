// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import CustomerLayout from './layouts/CustomerLayout';

// Components & Pages
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Sales from './pages/Sales';
import SaleForm from './pages/SaleForm';

import EditProfile from './components/EditProfile';
import ChangePassword from './components/ChangePassword';
import UserList from './components/UserList';

import UserRoleList from './components/UserRoleList';
import UserRoleAdd from './components/UserRoleAdd';
import UserRoleUpdate from './components/UserRoleUpdate';
import UserRoleDelete from './components/UserRoleDelete';
import UserPositionAdd from './components/UserPositionAdd';
import UserPositionList from './components/UserPositionList';
import UserPositionUpdate from './components/UserPositionUpdate';
import UserPositionDelete from './components/UserPositionDelete';

import ProductCategoryAdd from './components/ProductCategoryAdd';
import ProductCategoryList from './components/ProductCategoryList';
import ProductCategoryUpdate from './components/ProductCategoryUpdate';
import ProductCategoryDelete from './components/ProductCategoryDelete';

import ProductAdd from './components/ProductAdd';
import ProductList from './components/ProductList';
import ProductUpdate from './components/ProductUpdate';
import ProductDelete from './components/ProductDelete';
import CustomerList from './components/CustomerList';
import CustomerAdd from './components/CustomerAdd';
import CustomerUpdate from './components/CustomerUpdate';
import CustomerDelete from './components/CustomerDelete';
import POSCheckout from './components/POSCheckout';
import OrderHistory from './components/OrderHistory';
import UserPermissionsControl from './components/UserPermissionsControl';
import UserPermissionsList from './components/UserPermissionsList';
import UserPermissionsAdd from './components/UserPermissionsAdd';
import UserPermissionsUpdate from './components/UserPermissionsUpdate';
import UserPermissionsDelete from './components/UserPermissionsDelete';
import Test from './components/Test';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ១. Public Routes (មិនបាច់ Login ក៏ចូលបាន) */}
        <Route path="/login" element={<Login />} />

        {/* ២. Customer Routes */}
        <Route element={<CustomerLayout />}>
          {/* <Route path="/" element={<Home />} /> */}
        </Route>

        {/* ៣. Protected Admin Routes (ត្រូវមានសិទ្ធិទើបចូលបាន) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Dashboard Route */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute permissionKey="dashboard">
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Sales Routes */}
            <Route
              path="/sales"
              element={
                <ProtectedRoute permissionKey="sales_list">
                  <Sales />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales/create"
              element={
                <ProtectedRoute permissionKey="sales_list">
                  <SaleForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales/edit/:id"
              element={
                <ProtectedRoute permissionKey="sales_list">
                  <SaleForm />
                </ProtectedRoute>
              }
            />

            {/* User Role Routes */}
            <Route
              path="/user-role-list"
              element={
                <ProtectedRoute permissionKey="user_role_form">
                  <UserRoleList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-role-add"
              element={
                <ProtectedRoute permissionKey="user_role_form">
                  <UserRoleAdd />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-role-update"
              element={
                <ProtectedRoute permissionKey="user_role_form">
                  <UserRoleUpdate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-role-delete"
              element={
                <ProtectedRoute permissionKey="user_role_form">
                  <UserRoleDelete />
                </ProtectedRoute>
              }
            />

            {/* Product Categories Routes */}
            <Route
              path="/product-category-list"
              element={
                <ProtectedRoute permissionKey="categories">
                  <ProductCategoryList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-category-add"
              element={
                <ProtectedRoute permissionKey="categories">
                  <ProductCategoryAdd />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-category-update"
              element={
                <ProtectedRoute permissionKey="categories">
                  <ProductCategoryUpdate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-category-delete"
              element={
                <ProtectedRoute permissionKey="categories">
                  <ProductCategoryDelete />
                </ProtectedRoute>
              }
            />

            {/* Products Routes */}
            <Route
              path="/product-list"
              element={
                <ProtectedRoute permissionKey="products">
                  <ProductList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-add"
              element={
                <ProtectedRoute permissionKey="products">
                  <ProductAdd />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-update"
              element={
                <ProtectedRoute permissionKey="products">
                  <ProductUpdate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-delete"
              element={
                <ProtectedRoute permissionKey="products">
                  <ProductDelete />
                </ProtectedRoute>
              }
            />

            {/* User Positions Routes */}
            <Route
              path="/user-position-list"
              element={
                <ProtectedRoute permissionKey="add_position">
                  <UserPositionList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-position-add"
              element={
                <ProtectedRoute permissionKey="add_position">
                  <UserPositionAdd />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-position-update"
              element={
                <ProtectedRoute permissionKey="add_position">
                  <UserPositionUpdate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-position-delete"
              element={
                <ProtectedRoute permissionKey="add_position">
                  <UserPositionDelete />
                </ProtectedRoute>
              }
            />

            <Route path="/test" element={<Test />} />

            {/* User Permissions Routes */}
            <Route
              path="/user-permission-list"
              element={
                <ProtectedRoute permissionKey="user_permissions">
                  <UserPermissionsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-permission-add"
              element={
                <ProtectedRoute permissionKey="user_permissions">
                  <UserPermissionsAdd />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-permission-update"
              element={
                <ProtectedRoute permissionKey="user_permissions">
                  <UserPermissionsUpdate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-permission-delete"
              element={
                <ProtectedRoute permissionKey="user_permissions">
                  <UserPermissionsDelete />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-permission-control"
              element={
                <ProtectedRoute permissionKey="user_permissions">
                  <UserPermissionsControl />
                </ProtectedRoute>
              }
            />

            {/* Customers Routes */}
            <Route
              path="/customer-list"
              element={
                <ProtectedRoute permissionKey="customers">
                  <CustomerList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer-add"
              element={
                <ProtectedRoute permissionKey="customers">
                  <CustomerAdd />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer-update"
              element={
                <ProtectedRoute permissionKey="customers">
                  <CustomerUpdate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer-delete"
              element={
                <ProtectedRoute permissionKey="customers">
                  <CustomerDelete />
                </ProtectedRoute>
              }
            />

            {/* POS & Order History Routes */}
            <Route
              path="/pos-checkout"
              element={
                <ProtectedRoute permissionKey="pos_checkout">
                  <POSCheckout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-history"
              element={
                <ProtectedRoute permissionKey="order_history">
                  <OrderHistory />
                </ProtectedRoute>
              }
            />

            {/* User Profile & Management Routes */}
            <Route
              path="/edit-profile"
              element={
                <ProtectedRoute permissionKey="edit_profile">
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/change-password"
              element={
                <ProtectedRoute permissionKey="change_password">
                  <ChangePassword />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-list"
              element={
                <ProtectedRoute permissionKey="user_manager_list">
                  <UserList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/register"
              element={
                <ProtectedRoute permissionKey="register_user_login">
                  <SignUp />
                </ProtectedRoute>
              }
            />
          </Route>
        </Route>

        {/* ៤. Fallback Route: បើគ្មាន Link ទាំងនោះ ឱ្យ Redirect ទៅ Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}