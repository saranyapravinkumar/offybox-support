import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { TenantListPage } from './pages/TenantListPage';
import { TenantCreatePage } from './pages/TenantCreatePage';
import { TenantMappingPage } from './pages/TenantMappingPage';
import { CountryListPage } from './pages/CountryListPage';
import { CountryCreatePage } from './pages/CountryCreatePage';
import { StateListPage } from './pages/StateListPage';
import { StateCreatePage } from './pages/StateCreatePage';
import { CityListPage } from './pages/CityListPage';
import { CityCreatePage } from './pages/CityCreatePage';
import { AreaListPage } from './pages/AreaListPage';
import { AreaCreatePage } from './pages/AreaCreatePage';
import { ModuleListPage } from './pages/ModuleListPage';
import { ModuleCreatePage } from './pages/ModuleCreatePage';
import { TicketListPage } from './pages/TicketListPage';
import { TicketCreatePage } from './pages/TicketCreatePage';
import { Layout } from './components/Layout';
import { useAuthStore } from './store/authStore';
import './App.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tenants" element={<TenantListPage />} />
          <Route path="/tenants/create" element={<TenantCreatePage />} />
          <Route path="/tenants/:id/edit" element={<TenantCreatePage />} />
          <Route path="/tenants/mapping" element={<TenantMappingPage />} />

          {/* Location Module Routes */}
          <Route path="/countries" element={<CountryListPage />} />
          <Route path="/countries/create" element={<CountryCreatePage />} />
          <Route path="/countries/:id/edit" element={<CountryCreatePage />} />

          <Route path="/states" element={<StateListPage />} />
          <Route path="/states/create" element={<StateCreatePage />} />
          <Route path="/states/:id/edit" element={<StateCreatePage />} />

          <Route path="/cities" element={<CityListPage />} />
          <Route path="/cities/create" element={<CityCreatePage />} />
          <Route path="/cities/:id/edit" element={<CityCreatePage />} />

          <Route path="/areas" element={<AreaListPage />} />
          <Route path="/areas/create" element={<AreaCreatePage />} />
          <Route path="/areas/:id/edit" element={<AreaCreatePage />} />

          {/* Module Routes */}
          <Route path="/modules" element={<ModuleListPage />} />
          <Route path="/modules/create" element={<ModuleCreatePage />} />
          <Route path="/modules/:id/edit" element={<ModuleCreatePage />} />

          {/* Ticket Routes */}
          <Route path="/tickets" element={<TicketListPage />} />
          <Route path="/tickets/create" element={<TicketCreatePage />} />
          <Route path="/tickets/:id/edit" element={<TicketCreatePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
