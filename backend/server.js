const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config({ override: true });

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.get("/", (req, res) => {
  res.json({
    mensaje: "Backend INGEDATA funcionando correctamente",
  });
});

app.get("/productos", async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT 
        id,
        categoria,
        marca,
        nombre,
        precio,
        rating,
        reviews,
        etiqueta,
        imagen
      FROM productos
      WHERE activo = true
      ORDER BY id ASC
    `);

    const productos = resultado.rows.map((p) => ({
      id: p.id,
      cat: p.categoria,
      brand: p.marca,
      nombre: p.nombre,
      precio: Number(p.precio),
      rate: Number(p.rating),
      rev: Number(p.reviews),
      tag: p.etiqueta,
      imagenes: [p.imagen],
    }));

    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({
      error: "Error al obtener productos",
      detalle: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`Conectando a Supabase host: ${process.env.DB_HOST}`);
});