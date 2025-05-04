import { useEffect, useState } from "react";
import Slider from "react-slick";
import "./WebProjects.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import WebCard from "./WebCard";

function WebProjects() {
  const [files, setFiles] = useState([]);
  const [metadata, setMetadata] = useState({});
  const [lightboxImage, setLightboxImage] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3000/media").then((res) => res.json()),
      fetch("http://localhost:3000/uploads/metadata.json").then((res) =>
        res.json()
      ),
    ])
      .then(([mediaData, meta]) => {
        const webFiles = mediaData.files.filter((file) =>
          meta[file]?.tags.includes("Páginas Web")
        );
        setFiles(webFiles);
        setMetadata(meta);
      })
      .catch((err) => console.error("Error cargando páginas web:", err));
  }, []);

  const grouped = {};
  files.forEach((file) => {
    const tags = metadata[file]?.tags || [];
    const projectName = tags[1] || "Sin nombre";
    if (!grouped[projectName]) grouped[projectName] = [];
    grouped[projectName].push(file);
  });

  const carouselSettings = {
    dots: true,
    infinite: false,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
  };

  return (
    <div className="web-projects">
      <h2 style={{ textAlign: "center" }}>🌐 Proyectos Web</h2>

      {Object.entries(grouped).map(([project, images], idx) => (
        <div key={idx} className="web-section">
          <h3>{project}</h3>

          {isMobile ? (
            <Slider {...carouselSettings}>
              {images.map((file, i) => {
                const tags = metadata[file]?.tags || [];
                const link = metadata[file]?.link || "";
                const imageUrl = `http://localhost:3000/uploads/${file}`;
                const technologies = tags.slice(2);
                return (
                  <WebCard
                    key={i}
                    image={imageUrl}
                    url={link}
                    technologies={technologies}
                    onClick={() => setLightboxImage(imageUrl)}
                  />
                );
              })}
            </Slider>
          ) : (
            <div className="web-carousel">
              {images.map((file, i) => {
                const tags = metadata[file]?.tags || [];
                const link = metadata[file]?.link || "";
                const imageUrl = `http://localhost:3000/uploads/${file}`;
                const technologies = tags.slice(2);
                return (
                  <WebCard
                    key={i}
                    image={imageUrl}
                    url={link}
                    technologies={technologies}
                    onClick={() => setLightboxImage(imageUrl)}
                  />
                );
              })}
            </div>
          )}
        </div>
      ))}

      {lightboxImage && (
        <div className="web-lightbox" onClick={() => setLightboxImage(null)}>
          <img src={lightboxImage} alt="Vista ampliada" />
        </div>
      )}
    </div>
  );
}

export default WebProjects;
