import { useState } from "react";
import "./ContactForm.css";

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("enviando");

    const res = await fetch("http://localhost:3000/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setStatus(data.success ? "enviado" : "error");
    if (data.success) setForm({ name: "", email: "", message: "" });
  };

  return (
    <section className="contact-form">
      <h2>📩 Contáctame</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Tu nombre"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Tu correo"
          value={form.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Tu mensaje"
          rows="5"
          value={form.message}
          onChange={handleChange}
          required
        />
        <button type="submit">Enviar mensaje</button>
      </form>
      {status === "enviando" && <p>Enviando mensaje...</p>}
      {status === "enviado" && <p className="success">¡Mensaje enviado! ✅</p>}
      {status === "error" && (
        <p className="error">Hubo un error. Intenta nuevamente.</p>
      )}
    </section>
  );
}

export default ContactForm;
