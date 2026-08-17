import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { LandingPage } from "@/pages/LandingPage";
import { AuthPage } from "@/pages/auth/AuthPage";
import { DeportesPage } from "@/pages/DeportesPage";
import { DeporteDetailPage } from "@/pages/DeporteDetailPage";
import { LigasPage } from "@/pages/LigasPage";
import { LigaDetailPage } from "@/pages/LigaDetailPage";
import { CreateLeaguePage } from "@/pages/CreateLeaguePage";
import { BoxPage } from "@/pages/BoxPage";
import { JugadorPage } from "@/pages/JugadorPage";
import { AdminDashboard } from "@/pages/dashboard/AdminDashboard";
import { OwnerDashboard } from "@/pages/dashboard/OwnerDashboard";
import { PlayerDashboard } from "@/pages/dashboard/PlayerDashboard";
import { DashboardHome } from "@/pages/dashboard/DashboardHome";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/deportes" element={<DeportesPage />} />
          <Route path="/deportes/:sport" element={<DeporteDetailPage />} />
          <Route path="/ligas" element={<LigasPage />} />
          <Route path="/liga/:idOrSlug" element={<LigaDetailPage />} />
          <Route path="/crear-liga" element={<CreateLeaguePage />} />
          <Route path="/box" element={<BoxPage />} />
          <Route path="/jugador/:id" element={<JugadorPage />} />
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/dueno" element={<OwnerDashboard />} />
          <Route path="/dashboard/jugador" element={<PlayerDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
