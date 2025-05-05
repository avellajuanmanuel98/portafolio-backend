require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  "http://localhost:5173", // para desarrollo local
  "https://frontend-one-kohl-86.vercel.app/", // 👈 reemplaza con tu dominio exacto de Vercel
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

const uploadsDir = path.join(__dirname, "uploads");
const metadataPath = path.join(uploadsDir, "metadata.json");
const profilePath = path.join(uploadsDir, "profile.json");

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(metadataPath)) fs.writeFileSync(metadataPath, "{}");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

function loadMetadata() {
  return JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
}

function saveMetadata(metadata) {
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
}

// Subida de archivos generales
app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  const tags = req.body.tags
    ? req.body.tags.split(",").map((t) => t.trim())
    : [];

  const metadata = loadMetadata();

  metadata[file.filename] = {
    tags,
    link: req.body.link || "",
  };

  saveMetadata(metadata);

  res.json({ message: "Archivo subido correctamente", file: file.filename });
});

// Listado de archivos
app.get("/media", (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) return res.status(500).json({ message: "Error leyendo archivos" });
    const filtered = files.filter(
      (f) => f !== "metadata.json" && f !== "profile.json"
    );
    res.json({ files: filtered });
  });
});

// Eliminar archivo
app.delete("/delete/:filename", (req, res) => {
  const filePath = path.join(uploadsDir, req.params.filename);
  const metadata = loadMetadata();

  fs.unlink(filePath, (err) => {
    if (err) return res.status(500).json({ success: false });
    delete metadata[req.params.filename];
    saveMetadata(metadata);
    res.json({ success: true });
  });
});

// Servir archivos estáticos
app.use("/uploads", express.static(uploadsDir));

// Obtener perfil
app.get("/profile", (req, res) => {
  if (!fs.existsSync(profilePath)) return res.json({});
  const profile = JSON.parse(fs.readFileSync(profilePath, "utf-8"));
  res.json(profile);
});

// Guardar perfil
app.post("/profile", upload.single("avatar"), (req, res) => {
  const { name, bio, instagram, linkedin, email } = req.body;

  let previousProfile = {};
  if (fs.existsSync(profilePath)) {
    previousProfile = JSON.parse(fs.readFileSync(profilePath, "utf-8"));
  }

  const newAvatar = req.file?.filename || previousProfile.avatar || null;
  const avatarHistory = previousProfile.avatar_history || [];

  if (req.file?.filename && !avatarHistory.includes(req.file.filename)) {
    avatarHistory.push(req.file.filename);
  }

  const profile = {
    name,
    bio,
    avatar: newAvatar,
    avatar_history: avatarHistory,
    links: { instagram, linkedin, email },
  };

  fs.writeFileSync(profilePath, JSON.stringify(profile, null, 2));
  res.json({ success: true });
});

// Ruta para enviar mensajes desde formulario de contacto
const nodemailer = require("nodemailer");

app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, message: "Campos incompletos" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Contacto Portafolio" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_USER,
      subject: `Mensaje de ${name}`,
      html: `<p><strong>Email:</strong> ${email}</p><p>${message}</p>`,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Error enviando correo:", err);
    res.status(500).json({ success: false, message: "Error enviando correo" });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
