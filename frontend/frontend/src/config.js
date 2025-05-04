const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://portafolio-backend-86xp.onrender.com"; // cambia por tu URL de Render si es diferente

export { API_BASE_URL };
