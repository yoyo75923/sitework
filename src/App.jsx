import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/auth-provider';
import { CartProvider } from './components/cart-provider';
import { SearchProvider } from './components/search-provider';
import { QuizProvider } from './components/quiz-provider';
import Layout from './components/Layout';
import Home from './app/page';
import Cart from './app/cart/page';
import Category from './app/category/slug/page';
import CustomerDashboard from './app/customer/dashboard/page';
import CustomerOrders from './app/customer/orders/page';
import Ecosmart from './app/ecosmart/page';
import EcosmartDetails from './app/ecosmart/id/page';
import Learn from './app/learn/page';
import LearnTopic from './app/learn/id/page';
import Login from './app/login/page';
import Marketplace from './app/marketplace/page';
import MarketplaceCategory from './app/marketplace/category/slug/page';
import MarketplaceItem from './app/marketplace/item/id/page';
import Product from './app/product/id/page';
import Products from './app/products/page';
import Quiz from './app/quiz/page';
import QuizTopic from './app/quiz/id/page';
import Refurbished from './app/refurbished/page';
import RefurbishedCategory from './app/refurbished/category/slug/page';
import RefurbishedItem from './app/refurbished/item/id/page';
import Search from './app/search/page';
import SellerDashboard from './app/seller/dashboard/page';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <SearchProvider>
          <QuizProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="/login" />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/category/:slug" element={<Category />} />
                  <Route path="/customer/dashboard" element={<CustomerDashboard />} />
                  <Route path="/customer/orders" element={<CustomerOrders />} />
                  <Route path="/ecosmart" element={<Ecosmart />} />
                  <Route path="/ecosmart/:id" element={<EcosmartDetails />} />
                  <Route path="/learn" element={<Learn />} />
                  <Route path="/learn/:id" element={<LearnTopic />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/marketplace/category/:slug" element={<MarketplaceCategory />} />
                  <Route path="/marketplace/item/:id" element={<MarketplaceItem />} />
                  <Route path="/product/:id" element={<Product />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/quiz" element={<Quiz />} />
                  <Route path="/quiz/:id" element={<QuizTopic />} />
                  <Route path="/refurbished" element={<Refurbished />} />
                  <Route path="/refurbished/category/:slug" element={<RefurbishedCategory />} />
                  <Route path="/refurbished/item/:id" element={<RefurbishedItem />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/seller/dashboard" element={<SellerDashboard />} />
                </Routes>
              </Layout>
            </Router>
          </QuizProvider>
        </SearchProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App; 