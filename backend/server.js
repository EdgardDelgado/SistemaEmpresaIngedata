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

// =========================================================
// CREAR TABLAS NECESARIAS
// =========================================================

async function inicializarBaseDatos() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS clientes (
      id BIGSERIAL PRIMARY KEY,

      tipo_cliente VARCHAR(20) NOT NULL,

      nombres VARCHAR(100),
      apellidos VARCHAR(100),
      dni VARCHAR(8) UNIQUE,

      razon_social VARCHAR(150),
      ruc VARCHAR(11) UNIQUE,

      telefono VARCHAR(20) NOT NULL,
      correo VARCHAR(150) NOT NULL,
      direccion TEXT,

      fecha_registro TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',

      CONSTRAINT chk_tipo_cliente
        CHECK (tipo_cliente IN ('PERSONA', 'EMPRESA')),

      CONSTRAINT chk_estado_cliente
        CHECK (estado IN ('ACTIVO', 'INACTIVO'))
    );
  `);

    console.log("Tabla clientes verificada correctamente");
}

// =========================================================
// RUTA PRINCIPAL
// =========================================================

app.get("/", (req, res) => {
    res.json({
        mensaje: "Backend INGEDATA funcionando correctamente",
    });
});

// =========================================================
// PRODUCTOS
// =========================================================

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

// =========================================================
// CLIENTES - REGISTRAR
// =========================================================

app.post("/clientes", async (req, res) => {
    try {
        const {
            tipo_cliente,
            nombres,
            apellidos,
            dni,
            razon_social,
            ruc,
            telefono,
            correo,
            direccion,
        } = req.body;

        const tipo = String(tipo_cliente || "")
            .trim()
            .toUpperCase();

        const telefonoLimpio = String(telefono || "").trim();
        const correoLimpio = String(correo || "")
            .trim()
            .toLowerCase();

        if (!["PERSONA", "EMPRESA"].includes(tipo)) {
            return res.status(400).json({
                error: "Tipo de cliente inválido",
                detalle: "Debe ser PERSONA o EMPRESA",
            });
        }

        if (!telefonoLimpio) {
            return res.status(400).json({
                error: "El teléfono es obligatorio",
            });
        }

        if (!correoLimpio) {
            return res.status(400).json({
                error: "El correo electrónico es obligatorio",
            });
        }

        const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formatoCorreo.test(correoLimpio)) {
            return res.status(400).json({
                error: "Correo electrónico inválido",
            });
        }

        let nombresFinal = null;
        let apellidosFinal = null;
        let dniFinal = null;

        let razonSocialFinal = null;
        let rucFinal = null;

        // =====================================================
        // PERSONA
        // =====================================================

        if (tipo === "PERSONA") {
            nombresFinal = String(nombres || "").trim();
            apellidosFinal = String(apellidos || "").trim();
            dniFinal = String(dni || "").trim();

            if (!nombresFinal) {
                return res.status(400).json({
                    error: "Los nombres son obligatorios",
                });
            }

            if (!apellidosFinal) {
                return res.status(400).json({
                    error: "Los apellidos son obligatorios",
                });
            }

            if (!/^\d{8}$/.test(dniFinal)) {
                return res.status(400).json({
                    error: "El DNI debe contener 8 dígitos",
                });
            }

            const existeDni = await pool.query(
                `
        SELECT id
        FROM clientes
        WHERE dni = $1
        LIMIT 1
        `,
                [dniFinal]
            );

            if (existeDni.rowCount > 0) {
                return res.status(409).json({
                    error: "Ya existe un cliente registrado con ese DNI",
                });
            }
        }

        // =====================================================
        // EMPRESA
        // =====================================================

        if (tipo === "EMPRESA") {
            razonSocialFinal = String(razon_social || "").trim();
            rucFinal = String(ruc || "").trim();

            if (!razonSocialFinal) {
                return res.status(400).json({
                    error: "La razón social es obligatoria",
                });
            }

            if (!/^\d{11}$/.test(rucFinal)) {
                return res.status(400).json({
                    error: "El RUC debe contener 11 dígitos",
                });
            }

            const existeRuc = await pool.query(
                `
        SELECT id
        FROM clientes
        WHERE ruc = $1
        LIMIT 1
        `,
                [rucFinal]
            );

            if (existeRuc.rowCount > 0) {
                return res.status(409).json({
                    error: "Ya existe un cliente registrado con ese RUC",
                });
            }
        }

        // =====================================================
        // INSERTAR
        // =====================================================

        const resultado = await pool.query(
            `
      INSERT INTO clientes (
        tipo_cliente,
        nombres,
        apellidos,
        dni,
        razon_social,
        ruc,
        telefono,
        correo,
        direccion
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9
      )
      RETURNING
        id,
        tipo_cliente,
        nombres,
        apellidos,
        dni,
        razon_social,
        ruc,
        telefono,
        correo,
        direccion,
        fecha_registro,
        estado
      `,
            [
                tipo,
                nombresFinal,
                apellidosFinal,
                dniFinal,
                razonSocialFinal,
                rucFinal,
                telefonoLimpio,
                correoLimpio,
                String(direccion || "").trim() || null,
            ]
        );

        res.status(201).json({
            mensaje: "Cliente registrado correctamente",
            cliente: resultado.rows[0],
        });
    } catch (error) {
        console.error("Error al registrar cliente:", error);

        res.status(500).json({
            error: "Error al registrar cliente",
            detalle: error.message,
        });
    }
});

// =========================================================
// CLIENTES - LISTAR
// =========================================================

app.get("/clientes", async (req, res) => {
    try {
        const resultado = await pool.query(`
      SELECT
        id,
        tipo_cliente,
        nombres,
        apellidos,
        dni,
        razon_social,
        ruc,
        telefono,
        correo,
        direccion,
        fecha_registro,
        estado
      FROM clientes
      ORDER BY fecha_registro DESC
    `);

        res.json(resultado.rows);
    } catch (error) {
        console.error("Error al obtener clientes:", error);

        res.status(500).json({
            error: "Error al obtener clientes",
            detalle: error.message,
        });
    }
});

// =========================================================
// CLIENTES - OBTENER POR ID
// =========================================================

app.get("/clientes/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "ID de cliente inválido",
            });
        }

        const resultado = await pool.query(
            `
      SELECT
        id,
        tipo_cliente,
        nombres,
        apellidos,
        dni,
        razon_social,
        ruc,
        telefono,
        correo,
        direccion,
        fecha_registro,
        estado
      FROM clientes
      WHERE id = $1
      LIMIT 1
      `,
            [id]
        );

        if (resultado.rowCount === 0) {
            return res.status(404).json({
                error: "Cliente no encontrado",
            });
        }

        res.json(resultado.rows[0]);
    } catch (error) {
        console.error("Error al obtener cliente:", error);

        res.status(500).json({
            error: "Error al obtener cliente",
            detalle: error.message,
        });
    }
});

// =========================================================
// INICIAR SERVIDOR
// =========================================================

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
    try {
        await pool.query("SELECT NOW()");

        console.log("Conexión con PostgreSQL/Supabase correcta");

        await inicializarBaseDatos();

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Servidor backend corriendo en puerto ${PORT}`);
        });
    } catch (error) {
        console.error("Error al iniciar el backend:", error);
        process.exit(1);
    }
}

iniciarServidor();