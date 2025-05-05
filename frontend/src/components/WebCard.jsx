import "./WebCard.css";

function WebCard({ image, url, technologies = [], onClick }) {
  return (
    <div className="web-card-wrapper">
      <div className="web-card" onClick={onClick}>
        <img src={image} alt="Vista previa" className="web-thumb" />
        {technologies.length > 0 && (
          <div className="web-tags">
            {technologies.map((tech, i) => (
              <span key={i} className="web-tag">
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {url && (
        <a
          href={url}
          className="web-button"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          🔗 Ver sitio
        </a>
      )}
    </div>
  );
}

export default WebCard;
