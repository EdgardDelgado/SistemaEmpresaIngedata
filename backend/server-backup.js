const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config({ override: true });

const app = express();

// =========================================================
// MIDDLEWARES
// =========================================================

app.use(cors());
app.use(express.json());

// =========================================================
// CONEXIÓN POSTGRESQL / SUPABASE
// =========================================================

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
// INICIALIZAR BASE DE DATOS
// =========================================================

async function inicializarBaseDatos() {

    // =====================================================
    // CLIENTES
    // =====================================================

    await pool.query(`
        CREATE TABLE IF NOT EXISTS clientes (
            id BIGSERIAL PRIMARY KEY
        );
    `);

    await pool.query(`
        ALTER TABLE clientes
        ADD COLUMN IF NOT EXISTS tipo_cliente VARCHAR(20);
    `);

    await pool.query(`
        ALTER TABLE clientes
        ADD COLUMN IF NOT EXISTS nombres VARCHAR(100);
    `);

    await pool.query(`
        ALTER TABLE clientes
        ADD COLUMN IF NOT EXISTS apellidos VARCHAR(100);
    `);

    await pool.query(`
        ALTER TABLE clientes
        ADD COLUMN IF NOT EXISTS dni VARCHAR(8);
    `);

    await pool.query(`
        ALTER TABLE clientes
        ADD COLUMN IF NOT EXISTS razon_social VARCHAR(150);
    `);

    await pool.query(`
        ALTER TABLE clientes
        ADD COLUMN IF NOT EXISTS ruc VARCHAR(11);
    `);

    await pool.query(`
        ALTER TABLE clientes
        ADD COLUMN IF NOT EXISTS telefono VARCHAR(20);
    `);

    await pool.query(`
        ALTER TABLE clientes
        ADD COLUMN IF NOT EXISTS correo VARCHAR(150);
    `);

    await pool.query(`
        ALTER TABLE clientes
        ADD COLUMN IF NOT EXISTS direccion TEXT;
    `);

    await pool.query(`
        ALTER TABLE clientes
        ADD COLUMN IF NOT EXISTS fecha_registro TIMESTAMPTZ DEFAULT NOW();
    `);

    await pool.query(`
        ALTER TABLE clientes
        ADD COLUMN IF NOT EXISTS estado VARCHAR(20) DEFAULT 'ACTIVO';
    `);

    // =====================================================
    // COMPATIBILIDAD CON CLIENTES ANTIGUOS
    // =====================================================

    await pool.query(`
        DO $$
        BEGIN
            IF EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_schema = 'public'
                  AND table_name = 'clientes'
                  AND column_name = 'nombre'
            ) THEN
                ALTER TABLE clientes
                ALTER COLUMN nombre DROP NOT NULL;
            END IF;
        END $$;
    `);

    await pool.query(`
        DO $$
        BEGIN
            IF EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_schema = 'public'
                  AND table_name = 'clientes'
                  AND column_name = 'email'
            ) THEN
                ALTER TABLE clientes
                ALTER COLUMN email DROP NOT NULL;
            END IF;
        END $$;
    `);

    await pool.query(`
        UPDATE clientes
        SET estado = 'ACTIVO'
        WHERE estado IS NULL;
    `);

    await pool.query(`
        UPDATE clientes
        SET fecha_registro = NOW()
        WHERE fecha_registro IS NULL;
    `);

    // =====================================================
    // ÍNDICES CLIENTES
    // =====================================================

    await pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_clientes_dni
        ON clientes(dni)
        WHERE dni IS NOT NULL;
    `);

    await pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_clientes_ruc
        ON clientes(ruc)
        WHERE ruc IS NOT NULL;
    `);

    await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_clientes_correo
        ON clientes(correo);
    `);

    await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_clientes_fecha_registro
        ON clientes(fecha_registro);
    `);

    console.log(
        "Tabla clientes verificada y actualizada correctamente"
    );

    // =====================================================
    // COTIZACIONES
    // =====================================================

    await pool.query(`
        CREATE TABLE IF NOT EXISTS cotizaciones (
            id BIGSERIAL PRIMARY KEY,
            cliente_id BIGINT,
            codigo VARCHAR(60),
            estado VARCHAR(20) DEFAULT 'PENDIENTE',
            observaciones TEXT,
            fecha_solicitud TIMESTAMPTZ DEFAULT NOW(),
            fecha_actualizacion TIMESTAMPTZ DEFAULT NOW()
        );
    `);

    // =====================================================
    // ACTUALIZAR COTIZACIONES EXISTENTES
    // =====================================================

    await pool.query(`
        ALTER TABLE cotizaciones
        ADD COLUMN IF NOT EXISTS cliente_id BIGINT;
    `);

    await pool.query(`
        ALTER TABLE cotizaciones
        ADD COLUMN IF NOT EXISTS codigo VARCHAR(60);
    `);

    await pool.query(`
        ALTER TABLE cotizaciones
        ADD COLUMN IF NOT EXISTS estado VARCHAR(20) DEFAULT 'PENDIENTE';
    `);

    await pool.query(`
        ALTER TABLE cotizaciones
        ADD COLUMN IF NOT EXISTS observaciones TEXT;
    `);

    await pool.query(`
        ALTER TABLE cotizaciones
        ADD COLUMN IF NOT EXISTS fecha_solicitud TIMESTAMPTZ DEFAULT NOW();
    `);

    await pool.query(`
        ALTER TABLE cotizaciones
        ADD COLUMN IF NOT EXISTS fecha_actualizacion TIMESTAMPTZ DEFAULT NOW();
    `);

    // =====================================================
    // COMPATIBILIDAD CON COTIZACIONES ANTIGUAS
    // =====================================================

    await pool.query(`
        DO $$
        BEGIN
            IF EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_schema = 'public'
                  AND table_name = 'cotizaciones'
                  AND column_name = 'subtotal'
            ) THEN
                ALTER TABLE cotizaciones
                ALTER COLUMN subtotal DROP NOT NULL;
            END IF;
        END $$;
    `);

    await pool.query(`
        DO $$
        BEGIN
            IF EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_schema = 'public'
                  AND table_name = 'cotizaciones'
                  AND column_name = 'total'
            ) THEN
                ALTER TABLE cotizaciones
                ALTER COLUMN total DROP NOT NULL;
            END IF;
        END $$;
    `);

    await pool.query(`
        DO $$
        BEGIN
            IF EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_schema = 'public'
                  AND table_name = 'cotizaciones'
                  AND column_name = 'precio'
            ) THEN
                ALTER TABLE cotizaciones
                ALTER COLUMN precio DROP NOT NULL;
            END IF;
        END $$;
    `);

    await pool.query(`
        DO $$
        BEGIN
            IF EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_schema = 'public'
                  AND table_name = 'cotizaciones'
                  AND column_name = 'igv'
            ) THEN
                ALTER TABLE cotizaciones
                ALTER COLUMN igv DROP NOT NULL;
            END IF;
        END $$;
    `);

    await pool.query(`
        UPDATE cotizaciones
        SET estado = 'PENDIENTE'
        WHERE estado IS NULL;
    `);

    await pool.query(`
        UPDATE cotizaciones
        SET fecha_solicitud = NOW()
        WHERE fecha_solicitud IS NULL;
    `);

    await pool.query(`
        UPDATE cotizaciones
        SET fecha_actualizacion = NOW()
        WHERE fecha_actualizacion IS NULL;
    `);

    // =====================================================
    // RELACIÓN COTIZACIÓN -> CLIENTE
    // =====================================================

    await pool.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1
                FROM pg_constraint
                WHERE conname = 'fk_cotizaciones_cliente'
            ) THEN
                ALTER TABLE cotizaciones
                ADD CONSTRAINT fk_cotizaciones_cliente
                FOREIGN KEY (cliente_id)
                REFERENCES clientes(id)
                ON DELETE RESTRICT;
            END IF;
        END $$;
    `);

    // =====================================================
    // CÓDIGO ÚNICO COTIZACIÓN
    // =====================================================

    await pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_cotizaciones_codigo
        ON cotizaciones(codigo)
        WHERE codigo IS NOT NULL;
    `);

    // =====================================================
    // DETALLE COTIZACIÓN
    // =====================================================

    await pool.query(`
        CREATE TABLE IF NOT EXISTS detalle_cotizacion (
            id BIGSERIAL PRIMARY KEY,
            cotizacion_id BIGINT,
            producto_id BIGINT,
            cantidad INTEGER,
            precio_unitario NUMERIC(12,2),
            subtotal NUMERIC(12,2)
        );
    `);

    await pool.query(`
        ALTER TABLE detalle_cotizacion
        ADD COLUMN IF NOT EXISTS cotizacion_id BIGINT;
    `);

    await pool.query(`
        ALTER TABLE detalle_cotizacion
        ADD COLUMN IF NOT EXISTS producto_id BIGINT;
    `);

    await pool.query(`
        ALTER TABLE detalle_cotizacion
        ADD COLUMN IF NOT EXISTS cantidad INTEGER;
    `);

    await pool.query(`
        ALTER TABLE detalle_cotizacion
        ADD COLUMN IF NOT EXISTS precio_unitario NUMERIC(12,2);
    `);

    await pool.query(`
        ALTER TABLE detalle_cotizacion
        ADD COLUMN IF NOT EXISTS subtotal NUMERIC(12,2);
    `);

    // =====================================================
    // COMPATIBILIDAD CON DETALLE ANTIGUO
    // =====================================================

    // El cliente todavía no conoce el precio.
    await pool.query(`
        DO $$
        BEGIN
            IF EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_schema = 'public'
                  AND table_name = 'detalle_cotizacion'
                  AND column_name = 'precio_unitario'
            ) THEN
                ALTER TABLE detalle_cotizacion
                ALTER COLUMN precio_unitario DROP NOT NULL;
            END IF;
        END $$;
    `);

    // El subtotal se calcula después cuando INGEDATA cotiza.
    await pool.query(`
        DO $$
        BEGIN
            IF EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_schema = 'public'
                  AND table_name = 'detalle_cotizacion'
                  AND column_name = 'subtotal'
            ) THEN
                ALTER TABLE detalle_cotizacion
                ALTER COLUMN subtotal DROP NOT NULL;
            END IF;
        END $$;
    `);

    // =====================================================
    // RELACIÓN DETALLE -> COTIZACIÓN
    // =====================================================

    await pool.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1
                FROM pg_constraint
                WHERE conname = 'fk_detalle_cotizacion'
            ) THEN
                ALTER TABLE detalle_cotizacion
                ADD CONSTRAINT fk_detalle_cotizacion
                FOREIGN KEY (cotizacion_id)
                REFERENCES cotizaciones(id)
                ON DELETE CASCADE;
            END IF;
        END $$;
    `);

    // =====================================================
    // RELACIÓN DETALLE -> PRODUCTO
    // =====================================================

    await pool.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1
                FROM pg_constraint
                WHERE conname = 'fk_detalle_producto'
            ) THEN
                ALTER TABLE detalle_cotizacion
                ADD CONSTRAINT fk_detalle_producto
                FOREIGN KEY (producto_id)
                REFERENCES productos(id)
                ON DELETE RESTRICT;
            END IF;
        END $$;
    `);

    // =====================================================
    // VALIDAR CANTIDAD
    // =====================================================

    await pool.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1
                FROM pg_constraint
                WHERE conname = 'chk_detalle_cantidad'
            ) THEN
                ALTER TABLE detalle_cotizacion
                ADD CONSTRAINT chk_detalle_cantidad
                CHECK (cantidad > 0);
            END IF;
        END $$;
    `);

    // =====================================================
    // ÍNDICES COTIZACIONES
    // =====================================================

    await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_cotizaciones_cliente
        ON cotizaciones(cliente_id);
    `);

    await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_cotizaciones_estado
        ON cotizaciones(estado);
    `);

    await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_cotizaciones_fecha
        ON cotizaciones(fecha_solicitud);
    `);

    await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_detalle_cotizacion_id
        ON detalle_cotizacion(cotizacion_id);
    `);

    await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_detalle_producto_id
        ON detalle_cotizacion(producto_id);
    `);

    console.log(
        "Tablas de cotizaciones verificadas correctamente"
    );
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
        console.error(
            "Error al obtener productos:",
            error
        );

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

        const tipo = String(
            tipo_cliente || ""
        )
            .trim()
            .toUpperCase();

        const telefonoLimpio =
            String(
                telefono || ""
            ).trim();

        const correoLimpio =
            String(
                correo || ""
            )
                .trim()
                .toLowerCase();

        if (
            !["PERSONA", "EMPRESA"]
                .includes(tipo)
        ) {
            return res.status(400).json({
                error:
                    "Tipo de cliente inválido",
                detalle:
                    "Debe ser PERSONA o EMPRESA",
            });
        }

        if (!telefonoLimpio) {
            return res.status(400).json({
                error:
                    "El teléfono es obligatorio",
            });
        }

        if (!correoLimpio) {
            return res.status(400).json({
                error:
                    "El correo electrónico es obligatorio",
            });
        }

        const formatoCorreo =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !formatoCorreo.test(
                correoLimpio
            )
        ) {
            return res.status(400).json({
                error:
                    "Correo electrónico inválido",
            });
        }

        let nombresFinal = null;
        let apellidosFinal = null;
        let dniFinal = null;

        let razonSocialFinal = null;
        let rucFinal = null;

        // =================================================
        // PERSONA
        // =================================================

        if (tipo === "PERSONA") {
            nombresFinal =
                String(
                    nombres || ""
                ).trim();

            apellidosFinal =
                String(
                    apellidos || ""
                ).trim();

            dniFinal =
                String(
                    dni || ""
                ).trim();

            if (!nombresFinal) {
                return res.status(400).json({
                    error:
                        "Los nombres son obligatorios",
                });
            }

            if (!apellidosFinal) {
                return res.status(400).json({
                    error:
                        "Los apellidos son obligatorios",
                });
            }

            if (
                !/^\d{8}$/.test(
                    dniFinal
                )
            ) {
                return res.status(400).json({
                    error:
                        "El DNI debe contener 8 dígitos",
                });
            }

            const existeDni =
                await pool.query(
                    `
                    SELECT id
                    FROM clientes
                    WHERE dni = $1
                    LIMIT 1
                    `,
                    [dniFinal]
                );

            if (
                existeDni.rowCount > 0
            ) {
                return res.status(409).json({
                    error:
                        "Ya existe un cliente registrado con ese DNI",
                });
            }
        }

        // =================================================
        // EMPRESA
        // =================================================

        if (tipo === "EMPRESA") {
            razonSocialFinal =
                String(
                    razon_social || ""
                ).trim();

            rucFinal =
                String(
                    ruc || ""
                ).trim();

            if (!razonSocialFinal) {
                return res.status(400).json({
                    error:
                        "La razón social es obligatoria",
                });
            }

            if (
                !/^\d{11}$/.test(
                    rucFinal
                )
            ) {
                return res.status(400).json({
                    error:
                        "El RUC debe contener 11 dígitos",
                });
            }

            const existeRuc =
                await pool.query(
                    `
                    SELECT id
                    FROM clientes
                    WHERE ruc = $1
                    LIMIT 1
                    `,
                    [rucFinal]
                );

            if (
                existeRuc.rowCount > 0
            ) {
                return res.status(409).json({
                    error:
                        "Ya existe un cliente registrado con ese RUC",
                });
            }
        }

        // =================================================
        // INSERTAR CLIENTE
        // =================================================

        const resultado =
            await pool.query(
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
                    String(
                        direccion || ""
                    ).trim() || null,
                ]
            );

        res.status(201).json({
            mensaje:
                "Cliente registrado correctamente",
            cliente:
                resultado.rows[0],
        });

    } catch (error) {
        console.error(
            "Error al registrar cliente:",
            error
        );

        if (
            error.code === "23505"
        ) {
            return res.status(409).json({
                error:
                    "El cliente ya se encuentra registrado",
            });
        }

        res.status(500).json({
            error:
                "Error al registrar cliente",
            detalle:
                error.message,
        });
    }
});

// =========================================================
// CLIENTES - LISTAR
// =========================================================

app.get("/clientes", async (req, res) => {
    try {
        const resultado =
            await pool.query(`
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

        res.json(
            resultado.rows
        );

    } catch (error) {
        console.error(
            "Error al obtener clientes:",
            error
        );

        res.status(500).json({
            error:
                "Error al obtener clientes",
            detalle:
                error.message,
        });
    }
});

// =========================================================
// CLIENTES - OBTENER POR ID
// =========================================================

app.get(
    "/clientes/:id",
    async (req, res) => {
        try {
            const id =
                Number(
                    req.params.id
                );

            if (
                !Number.isInteger(id) ||
                id <= 0
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            "ID de cliente inválido",
                    });
            }

            const resultado =
                await pool.query(
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

            if (
                resultado.rowCount === 0
            ) {
                return res
                    .status(404)
                    .json({
                        error:
                            "Cliente no encontrado",
                    });
            }

            res.json(
                resultado.rows[0]
            );

        } catch (error) {
            console.error(
                "Error al obtener cliente:",
                error
            );

            res.status(500).json({
                error:
                    "Error al obtener cliente",
                detalle:
                    error.message,
            });
        }
    }
);

// =========================================================
// COTIZACIONES - REGISTRAR
// =========================================================

app.post(
    "/cotizaciones",
    async (req, res) => {
        let conexion;

        try {
            conexion =
                await pool.connect();

            const {
                cliente_id,
                observaciones,
                productos,
            } = req.body;

            const clienteId =
                Number(
                    cliente_id
                );

            // =============================================
            // VALIDAR CLIENTE
            // =============================================

            if (
                !Number.isInteger(
                    clienteId
                ) ||
                clienteId <= 0
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            "Cliente inválido",
                        detalle:
                            "Debe enviar un cliente_id válido",
                    });
            }

            // =============================================
            // VALIDAR PRODUCTOS
            // =============================================

            if (
                !Array.isArray(
                    productos
                ) ||
                productos.length === 0
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            "La cotización debe contener productos",
                    });
            }

            await conexion.query(
                "BEGIN"
            );

            // =============================================
            // CONSULTAR CLIENTE
            // =============================================

            const resultadoCliente =
                await conexion.query(
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
                        estado
                    FROM clientes
                    WHERE id = $1
                    LIMIT 1
                    `,
                    [clienteId]
                );

            if (
                resultadoCliente
                    .rowCount === 0
            ) {
                await conexion.query(
                    "ROLLBACK"
                );

                return res
                    .status(404)
                    .json({
                        error:
                            "Cliente no encontrado",
                    });
            }

            const cliente =
                resultadoCliente
                    .rows[0];

            if (
                String(
                    cliente.estado || ""
                ).toUpperCase() !==
                "ACTIVO"
            ) {
                await conexion.query(
                    "ROLLBACK"
                );

                return res
                    .status(400)
                    .json({
                        error:
                            "El cliente no se encuentra activo",
                    });
            }

            // =============================================
            // AGRUPAR PRODUCTOS
            // =============================================

            const cantidadesPorProducto =
                new Map();

            for (
                const item
                of productos
            ) {
                const productoId =
                    Number(
                        item.producto_id
                    );

                const cantidad =
                    Number(
                        item.cantidad
                    );

                if (
                    !Number.isInteger(
                        productoId
                    ) ||
                    productoId <= 0
                ) {
                    await conexion.query(
                        "ROLLBACK"
                    );

                    return res
                        .status(400)
                        .json({
                            error:
                                "Producto inválido",
                        });
                }

                if (
                    !Number.isInteger(
                        cantidad
                    ) ||
                    cantidad <= 0
                ) {
                    await conexion.query(
                        "ROLLBACK"
                    );

                    return res
                        .status(400)
                        .json({
                            error:
                                "Cantidad inválida",
                            detalle:
                                "La cantidad debe ser mayor a 0",
                        });
                }

                const cantidadActual =
                    cantidadesPorProducto.get(
                        productoId
                    ) || 0;

                cantidadesPorProducto.set(
                    productoId,
                    cantidadActual +
                    cantidad
                );
            }

            // =============================================
            // COMPROBAR PRODUCTOS
            // =============================================

            const productosProcesados =
                [];

            for (
                const [
                    productoId,
                    cantidad,
                ]
                of cantidadesPorProducto.entries()
            ) {
                const resultadoProducto =
                    await conexion.query(
                        `
                        SELECT
                            id,
                            nombre,
                            marca,
                            activo
                        FROM productos
                        WHERE id = $1
                        LIMIT 1
                        `,
                        [productoId]
                    );

                if (
                    resultadoProducto
                        .rowCount === 0
                ) {
                    await conexion.query(
                        "ROLLBACK"
                    );

                    return res
                        .status(404)
                        .json({
                            error:
                                "Producto no encontrado",
                            detalle:
                                `No existe el producto con ID ${productoId}`,
                        });
                }

                const producto =
                    resultadoProducto
                        .rows[0];

                if (!producto.activo) {
                    await conexion.query(
                        "ROLLBACK"
                    );

                    return res
                        .status(400)
                        .json({
                            error:
                                "Producto no disponible",
                            detalle:
                                `El producto ${producto.nombre} no se encuentra activo`,
                        });
                }

                productosProcesados.push({
                    producto_id:
                        producto.id,
                    nombre:
                        producto.nombre,
                    marca:
                        producto.marca,
                    cantidad,
                });
            }

            // =============================================
            // GENERAR CÓDIGO
            // =============================================

            const anio =
                new Date()
                    .getFullYear();

            const timestamp =
                Date.now();

            const aleatorio =
                Math.floor(
                    Math.random() *
                    900 +
                    100
                );

            const codigo =
                `COT-${anio}-${timestamp}-${aleatorio}`;

            // =============================================
            // INSERTAR COTIZACIÓN
            // =============================================

            const resultadoCotizacion =
                await conexion.query(
                    `
                    INSERT INTO cotizaciones (
                        cliente_id,
                        codigo,
                        estado,
                        observaciones,
                        fecha_solicitud,
                        fecha_actualizacion
                    )
                    VALUES (
                        $1,
                        $2,
                        'PENDIENTE',
                        $3,
                        NOW(),
                        NOW()
                    )
                    RETURNING
                        id,
                        cliente_id,
                        codigo,
                        estado,
                        observaciones,
                        fecha_solicitud,
                        fecha_actualizacion
                    `,
                    [
                        clienteId,
                        codigo,
                        String(
                            observaciones ||
                            ""
                        ).trim() || null,
                    ]
                );

            const cotizacion =
                resultadoCotizacion
                    .rows[0];

            // =============================================
            // INSERTAR DETALLE
            // =============================================

            const detalles = [];

            for (
                const producto
                of productosProcesados
            ) {
                const resultadoDetalle =
                    await conexion.query(
                        `
                        INSERT INTO detalle_cotizacion (
                            cotizacion_id,
                            producto_id,
                            cantidad,
                            precio_unitario,
                            subtotal
                        )
                        VALUES (
                            $1,
                            $2,
                            $3,
                            NULL,
                            NULL
                        )
                        RETURNING
                            id,
                            cotizacion_id,
                            producto_id,
                            cantidad,
                            precio_unitario,
                            subtotal
                        `,
                        [
                            cotizacion.id,
                            producto.producto_id,
                            producto.cantidad,
                        ]
                    );

                detalles.push({
                    ...resultadoDetalle
                        .rows[0],

                    nombre:
                        producto.nombre,

                    marca:
                        producto.marca,
                });
            }

            await conexion.query(
                "COMMIT"
            );

            // =============================================
            // DATOS DEL CLIENTE
            // =============================================

            let datosCliente;

            if (
                cliente.tipo_cliente ===
                "EMPRESA"
            ) {
                datosCliente = {
                    id:
                        cliente.id,

                    tipo_cliente:
                        "EMPRESA",

                    razon_social:
                        cliente.razon_social,

                    ruc:
                        cliente.ruc,

                    telefono:
                        cliente.telefono,

                    correo:
                        cliente.correo,
                };
            } else {
                datosCliente = {
                    id:
                        cliente.id,

                    tipo_cliente:
                        "PERSONA",

                    nombres:
                        cliente.nombres,

                    apellidos:
                        cliente.apellidos,

                    dni:
                        cliente.dni,

                    telefono:
                        cliente.telefono,

                    correo:
                        cliente.correo,
                };
            }

            // =============================================
            // RESPUESTA
            // =============================================

            res.status(201).json({
                mensaje:
                    "Solicitud de cotización registrada correctamente",

                cotizacion: {
                    ...cotizacion,

                    cliente:
                        datosCliente,

                    productos:
                        detalles,
                },
            });

        } catch (error) {
            if (conexion) {
                try {
                    await conexion.query(
                        "ROLLBACK"
                    );
                } catch (
                rollbackError
                ) {
                    console.error(
                        "Error al realizar rollback:",
                        rollbackError
                    );
                }
            }

            console.error(
                "Error al registrar cotización:",
                error
            );

            res.status(500).json({
                error:
                    "Error al registrar cotización",
                detalle:
                    error.message,
            });

        } finally {
            if (conexion) {
                conexion.release();
            }
        }
    }
);

// =========================================================
// COTIZACIONES - LISTAR
// =========================================================

app.get(
    "/cotizaciones",
    async (req, res) => {
        try {
            const resultado =
                await pool.query(`
                    SELECT
                        c.id,
                        c.codigo,
                        c.cliente_id,
                        c.estado,
                        c.observaciones,
                        c.fecha_solicitud,
                        c.fecha_actualizacion,

                        cl.tipo_cliente,
                        cl.nombres,
                        cl.apellidos,
                        cl.dni,
                        cl.razon_social,
                        cl.ruc,
                        cl.telefono,
                        cl.correo

                    FROM cotizaciones c

                    INNER JOIN clientes cl
                        ON cl.id = c.cliente_id

                    ORDER BY
                        c.fecha_solicitud DESC
                `);

            res.json(
                resultado.rows
            );

        } catch (error) {
            console.error(
                "Error al obtener cotizaciones:",
                error
            );

            res.status(500).json({
                error:
                    "Error al obtener cotizaciones",
                detalle:
                    error.message,
            });
        }
    }
);

// =========================================================
// COTIZACIONES - OBTENER POR ID
// =========================================================

app.get(
    "/cotizaciones/:id",
    async (req, res) => {
        try {
            const id =
                Number(
                    req.params.id
                );

            if (
                !Number.isInteger(id) ||
                id <= 0
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            "ID de cotización inválido",
                    });
            }

            const resultadoCotizacion =
                await pool.query(
                    `
                    SELECT
                        c.id,
                        c.codigo,
                        c.cliente_id,
                        c.estado,
                        c.observaciones,
                        c.fecha_solicitud,
                        c.fecha_actualizacion,

                        cl.tipo_cliente,
                        cl.nombres,
                        cl.apellidos,
                        cl.dni,
                        cl.razon_social,
                        cl.ruc,
                        cl.telefono,
                        cl.correo

                    FROM cotizaciones c

                    INNER JOIN clientes cl
                        ON cl.id = c.cliente_id

                    WHERE c.id = $1
                    LIMIT 1
                    `,
                    [id]
                );

            if (
                resultadoCotizacion
                    .rowCount === 0
            ) {
                return res
                    .status(404)
                    .json({
                        error:
                            "Cotización no encontrada",
                    });
            }

            const resultadoDetalle =
                await pool.query(
                    `
                    SELECT
                        dc.id,
                        dc.producto_id,
                        p.nombre,
                        p.marca,
                        dc.cantidad,
                        dc.precio_unitario,
                        dc.subtotal

                    FROM detalle_cotizacion dc

                    INNER JOIN productos p
                        ON p.id = dc.producto_id

                    WHERE dc.cotizacion_id = $1

                    ORDER BY dc.id ASC
                    `,
                    [id]
                );

            res.json({
                ...resultadoCotizacion
                    .rows[0],

                productos:
                    resultadoDetalle
                        .rows,
            });

        } catch (error) {
            console.error(
                "Error al obtener cotización:",
                error
            );

            res.status(500).json({
                error:
                    "Error al obtener cotización",
                detalle:
                    error.message,
            });
        }
    }
);

// =========================================================
// INICIAR SERVIDOR
// =========================================================

const PORT =
    process.env.PORT || 3000;

async function iniciarServidor() {
    try {
        await pool.query(
            "SELECT NOW()"
        );

        console.log(
            "Conexión con PostgreSQL/Supabase correcta"
        );

        await inicializarBaseDatos();

        app.listen(
            PORT,
            "0.0.0.0",
            () => {
                console.log(
                    `Servidor backend corriendo en puerto ${PORT}`
                );
            }
        );

    } catch (error) {
        console.error(
            "Error al iniciar el backend:",
            error
        );

        process.exit(1);
    }
}

iniciarServidor();