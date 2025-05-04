import { useState, useEffect } from "react";

function AdminPanel() {
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState("");
  const [files, setFiles] = useState([]);
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState("");

  const checkAccess = () => {
    if (password === "Martin0412") {
      setAuth(true);
    } else {
      alert("Contraseña incorrecta");
    }
  };

  const fetchFiles = () => {
    Promise.all([
      fetch("http://localhost:3000/media").then((res) => res.json()),
      fetch("http://localhost:3000/profile")
        .then((res) => res.json())
        .catch(() => ({})),
    ])
      .then(([mediaData, profile]) => {
        const avatar = profile?.avatar;
        const filtered = mediaData.files.filter((file) => file !== avatar); // 👈 excluye avatar
        setFiles(filtered);
      })
      .catch((err) => console.error("Error cargando archivos:", err));
  };

  useEffect(() => {
    if (auth) fetchFiles();
  }, [auth]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("tags", tags);

    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      alert(result.message);
      setFile(null);
      setTags("");
      fetchFiles();
    } catch (error) {
      console.error("Error al subir archivo:", error);
    }
  };

  const handleDelete = async (filename) => {
    const confirm = window.confirm(`¿Eliminar ${filename}?`);
    if (!confirm) return;

    try {
      const response = await fetch(
        `http://localhost:3000/delete/${encodeURIComponent(filename)}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (data.success) {
        alert("Archivo eliminado");
        fetchFiles();
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  if (!auth) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>🔐 Iniciar sesión de administrador</h2>
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "1rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <br />
        <br />
        <button
          onClick={checkAccess}
          style={{ padding: "10px 20px", fontSize: "1rem" }}
        >
          Entrar
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2>🛠️ Panel de Administración</h2>

      {/* Subida de archivos normales */}
      <form onSubmit={handleUpload}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <br />
        <br />
        <input
          type="text"
          placeholder="Etiquetas separadas por comas"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />
        <br />
        <br />
        <button type="submit" style={{ padding: "8px 16px" }}>
          Subir archivo
        </button>
      </form>

      <hr style={{ margin: "40px 0" }} />
      <h3>Archivos subidos:</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {files.map((filename, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            {filename}
            <button
              onClick={() => handleDelete(filename)}
              style={{
                marginLeft: "10px",
                padding: "4px 10px",
                background: "#f44336",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      {/* Actualización del perfil */}
      <hr style={{ margin: "40px 0" }} />
      <h3>Actualizar perfil público:</h3>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target;
          const formData = new FormData(form);

          const res = await fetch("http://localhost:3000/profile", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();
          alert(data.success ? "Perfil actualizado" : "Error");
          form.reset();
        }}
      >
        <input type="text" name="name" placeholder="Nombre" required />
        <br />
        <br />
        <textarea
          name="bio"
          placeholder="Tu descripción..."
          rows="4"
          required
          style={{ width: "100%" }}
        />
        <br />
        <br />
        <input type="text" name="instagram" placeholder="Link de Instagram" />
        <br />
        <br />
        <input type="text" name="linkedin" placeholder="Link de LinkedIn" />
        <br />
        <br />
        <input type="email" name="email" placeholder="Correo" />
        <br />
        <br />
        <input type="file" name="avatar" accept="image/*" />
        <br />
        <br />
        <button type="submit">Guardar perfil</button>
      </form>
    </div>
  );
}

export default AdminPanel;
