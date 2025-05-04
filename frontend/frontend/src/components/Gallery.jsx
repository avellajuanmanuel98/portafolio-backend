import { useEffect, useState } from "react";
import "./Gallery.css";

function Gallery() {
  const [files, setFiles] = useState([]);
  const [metadata, setMetadata] = useState({});
  const [profile, setProfile] = useState({});

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3000/media").then((res) => res.json()),
      fetch("http://localhost:3000/uploads/metadata.json")
        .then((res) => res.json())
        .catch(() => ({})),
      fetch("http://localhost:3000/profile")
        .then((res) => res.json())
        .catch(() => ({})),
    ])
      .then(([mediaData, metadataRes, profileRes]) => {
        setMetadata(metadataRes);
        setProfile(profileRes);

        const avatarList = profileRes.avatar_history || [];

        const filtered = mediaData.files
          .filter((file) => !avatarList.includes(file)) // ❌ Excluye avatares
          .filter((file) => {
            const tags = metadataRes[file]?.tags || [];
            return !tags.includes("Páginas Web"); // ❌ Excluye los web
          });

        setFiles(filtered);
      })
      .catch((error) => {
        console.error("Error al cargar galería:", error);
      });
  }, []);

  const groupedByProject = {};
  files.forEach((file) => {
    const tags = metadata[file] ? metadata[file].tags : [];
    const project = tags[1] || "Sin Proyecto";
    if (!groupedByProject[project]) groupedByProject[project] = [];
    groupedByProject[project].push(file);
  });

  const isImage = (ext) => ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
  const isVideo = (ext) => ["mp4", "webm", "mov"].includes(ext);
  const isAudio = (ext) => ["mp3", "wav", "ogg"].includes(ext);

  const renderMedia = (fileUrl, fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (isImage(ext)) {
      return <img src={fileUrl} alt={fileName} className="gallery-item" />;
    } else if (isVideo(ext)) {
      return (
        <video controls className="gallery-item">
          <source src={fileUrl} type={`video/${ext}`} />
        </video>
      );
    } else if (isAudio(ext)) {
      return (
        <audio controls className="gallery-audio">
          <source src={fileUrl} type={`audio/${ext}`} />
        </audio>
      );
    } else {
      return <p>Archivo no soportado</p>;
    }
  };

  return (
    <div className="gallery-container">
      <h2 style={{ textAlign: "center" }}>🎨 Galería de Proyectos</h2>

      {Object.entries(groupedByProject).map(([projectName, files]) => (
        <div key={projectName} className="project-block">
          <h3>{projectName}</h3>
          <div className="project-gallery">
            {files.map((file, idx) => {
              const fileUrl = `http://localhost:3000/uploads/${file}`;
              const tags = metadata[file]?.tags || [];

              return (
                <div key={idx} className="gallery-card">
                  {renderMedia(fileUrl, file)}
                  <p className="file-name">{file}</p>
                  <div className="tags">
                    {tags.map((tag, i) => (
                      <span key={i} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Gallery;
