import { useState } from "react";

function UploadForm() {
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState("");
  const [link, setLink] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMensaje("Por favor selecciona un archivo.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("tags", tags);
    formData.append("link", link);

    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setMensaje(data.message);
      setFile(null);
      setTags("");
      setLink("");
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      setMensaje("Error al subir archivo");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input type="file" onChange={handleFileChange} />
      <br />
      <input
        type="text"
        placeholder='Etiquetas separadas por coma: "Páginas Web, Cliente X, React"'
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        style={{ width: "80%", marginTop: "10px", padding: "6px" }}
      />
      <br />
      <input
        type="text"
        placeholder="Link del sitio web (opcional)"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        style={{ width: "80%", marginTop: "10px", padding: "6px" }}
        name="link"
      />
      <br />
      <button type="submit" style={{ marginTop: "10px" }}>
        Subir Archivo
      </button>
      {mensaje && <p>{mensaje}</p>}
    </form>
  );
}

export default UploadForm;
