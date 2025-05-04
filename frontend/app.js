console.log("Frontend conectado.");

// Hacer un fetch al backend
fetch("http://localhost:3000/ping")
  .then((response) => response.json())
  .then((data) => {
    console.log("Respuesta del servidor:", data.message);
    // Opcional: mostrarlo en la página
    const root = document.getElementById("root");
    root.innerHTML = `<h1>${data.message}</h1>`;
  })
  .catch((error) => {
    console.error("Error al contactar el servidor:", error);
  });
