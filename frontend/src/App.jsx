import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";

import GroupedGallery from "./components/GroupedGallery";
import UploadForm from "./components/UploadForm";
import AdminPanel from "./components/AdminPanel";
import WebProjects from "./components/WebProjects";
import Profile from "./components/Profile";
import ContactForm from "./components/ContactForm";

function App() {
  // 👉 Activa modo oscuro
  useEffect(() => {
    document.body.classList.add("dark-mode");
    return () => document.body.classList.remove("dark-mode");
  }, []);

  function PublicView() {
    return (
      <>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            marginTop: "40px",
          }}
        >
          {/* <img
            src="/src/assets/Logo.png"
            alt="Logo"
            style={{ height: "55px" }}
          /> */}
          <h1 style={{ margin: 0 }}>Diseñador UX/UI - Desarrollador Web</h1>
        </div>
        <Profile />
        <WebProjects />
        <GroupedGallery />
        <ContactForm />
      </>
    );
  }

  function AdminView() {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h1>Panel de Administración 🛠️</h1>
        <UploadForm />
        <AdminPanel />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicView />} />
        <Route path="/admin" element={<AdminView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/webs" element={<WebProjects />} />
      </Routes>
    </Router>
  );
}

export default App;
