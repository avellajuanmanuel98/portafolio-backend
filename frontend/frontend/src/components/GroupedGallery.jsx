import { useState, useEffect } from "react";
import "./Gallery.css";
import { API_BASE_URL } from "../config";

function GroupedGallery() {
  const [files, setFiles] = useState([]);
  const [metadata, setMetadata] = useState({});
  const [profile, setProfile] = useState({});
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/media`).then((res) => res.json()),
      fetch(`${API_BASE_URL}/uploads/metadata.json`)
        .then((res) => res.json())
        .catch(() => ({})),
      fetch(`${API_BASE_URL}/profile`)
        .then((res) => res.json())
        .catch(() => ({})),
    ])
      .then(([mediaData, metadataRes, profileRes]) => {
        setMetadata(metadataRes);
        setProfile(profileRes);

        const avatarList = profileRes.avatar_history || [];

        const filtered = mediaData.files
          .filter((file) => !avatarList.includes(file))
          .filter((file) => {
            const tags = metadataRes[file]?.tags || [];
            return !tags.includes("Páginas Web");
          })
          .map((file) => ({
            name: file,
            tags: metadataRes[file]?.tags || [],
          }));

        setFiles(filtered);
      })
      .catch((error) => {
        console.error("Error al cargar archivos:", error);
      });
  }, []);

  const groupByCategoryAndProject = () => {
    const groups = {};

    files.forEach((file) => {
      const tags = file.tags;
      const category = tags[0] || "Otros";
      const project = tags[1] || "Sin Proyecto";

      if (!groups[category]) groups[category] = {};
      if (!groups[category][project]) groups[category][project] = [];

      groups[category][project].push(file);
    });

    return groups;
  };

  const emojiForCategory = (category) => {
    const map = {
      branding: "🎨",
      "social media": "📱",
      fotografía: "📷",
      video: "🎥",
      flyer: "📰",
      reel: "📽️",
      "diseño gráfico": "🖌️",
      otros: "🗂️",
    };
    return map[category.toLowerCase()] || "📁";
  };

  const grouped = groupByCategoryAndProject();

  const isImage = (ext) => ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
  const isVideo = (ext) => ["mp4", "webm", "mov"].includes(ext);

  const renderMedia = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    const fileUrl = `${API_BASE_URL}/uploads/${fileName}`;

    if (isImage(ext)) {
      return (
        <img
          src={fileUrl}
          alt={fileName}
          className="gallery-item"
          onClick={() => setLightbox(fileUrl)}
        />
      );
    } else if (isVideo(ext)) {
      return (
        <video controls className="gallery-item">
          <source src={fileUrl} type={`video/${ext}`} />
        </video>
      );
    } else {
      return null;
    }
  };

  return (
    <div className="gallery-page">
      <h2 style={{ textAlign: "center" }}>🗂️ Portafolio por Categoría</h2>

      {Object.entries(grouped).map(([category, projects], idx1) => (
        <div
          key={idx1}
          className={`project-block ${category
            .toLowerCase()
            .replace(/\s/g, "-")}-bg`}
        >
          <div className="section-container">
            <h2 style={{ marginTop: idx1 === 0 ? "0" : "20px" }}>
              {emojiForCategory(category)} {category}
            </h2>
            {Object.entries(projects).map(([project, items], idx2) => (
              <div key={idx2}>
                <h3>{project}</h3>
                <div className="horizontal-scroll">
                  {items.map((file, idx3) => (
                    <div key={idx3} className="gallery-card">
                      {renderMedia(file.name)}
                      <div className="tags">
                        {file.tags.map((tag, i) => (
                          <span key={i} className="tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="ampliado" />
        </div>
      )}
    </div>
  );
}

export default GroupedGallery;
