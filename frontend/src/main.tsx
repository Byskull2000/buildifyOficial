import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./pages/App.tsx";
import ImagenPrueba from "./pages/ImagenPrueba.tsx";
import Login from "./pages/Login.tsx";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register.tsx";
import RegistroRapido from "./pages/RegistroRapido.tsx";
import EditProfile from "./pages/EditProfile.tsx";
import Profile from "./pages/Profile.tsx";
import PublicProfile from "./pages/PublicProfile.tsx";
import InterestList from "./components/InteresList.tsx";
import SubirImagenes from "./components/subirImagenes.tsx";
import Galeria from "./components/galeria.tsx";
import Buscar from "./pages/Buscar.tsx";
import MatRegister from "./pages/MatRegister.tsx";
import MaterialesFiltrados from "./pages/MaterialesFiltrados.tsx"; // Importamos MaterialesFiltrados
import Material from "./pages/Material.tsx";
import Propios from "./pages/Propios.tsx";
import EditarMaterial from "./pages/EditarMaterial.tsx";
import MaterialesRecomendados from "./pages/materiales/MaterialesRecomendados.tsx";
import CarritoCompras from "./pages/CarritoCompras.tsx";
import ListaGuardados from "./pages/materiales/ListaGuardados.tsx";
import ConfirmarPedido from "./pages/ConfirmarPedido.tsx";
import PagoConTarjeta from "./pages/PagoConTarjeta.tsx";
import PagoConQR from "./pages/PagoConQR.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {
      //    <GoogleOAuthProvider clientId='707624544355-tt3o1jqfblee1ciqmcvu2plhuitc26b7.apps.googleusercontent.com'>
    }

    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/registroRapido" element={<RegistroRapido />} />
        <Route path="/imagenprueba" element={<ImagenPrueba />} />
        <Route path="/editProfile" element={<EditProfile />} />
        <Route path="/listaInteres" element={<InterestList />} />
        <Route path="/publicProfile" element={<PublicProfile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/subirImagenes" element={<SubirImagenes />} />
        <Route path="/galeria" element={<Galeria />} />
        <Route path="/buscar" element={<Buscar />} />
        <Route path="/matRegister" element={<MatRegister />} />
        <Route path="/materiales" element={<MaterialesFiltrados />} />
        <Route path="/guardados" element={<ListaGuardados />} />
        <Route
          path="/materiales/recomendados"
          element={<MaterialesRecomendados />}
        />
        <Route path="/material/:id" element={<Material />} />
        <Route path="/propios" element={<Propios />} />
        <Route
          path="/editarMaterial/:id_material"
          element={<EditarMaterial />}
        />
        <Route path="/carrito" element={<CarritoCompras />} />
        <Route path="/confirmar-pedido" element={<ConfirmarPedido />} />
        <Route path="/pago-tarjeta" element={<PagoConTarjeta />} />
        <Route path="/pago-qr" element={<PagoConQR />} />
      </Routes>
    </Router>
    {
      //</GoogleOAuthProvider>
    }
  </StrictMode>
);
