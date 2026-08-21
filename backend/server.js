const express = require("express");
const PDFDocument = require("pdfkit");
const cors = require("cors");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
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
// MIDDLEWARE - AUTENTICACIÓN ADMINISTRADOR
// =========================================================

function verificarAdmin(req, res, next) {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            return res.status(401).json({
                error: "Acceso no autorizado",
                detalle: "Debes iniciar sesión como administrador",
            });
        }

        const partes = authorization.split(" ");

        if (
            partes.length !== 2 ||
            partes[0] !== "Bearer" ||
            !partes[1]
        ) {
            return res.status(401).json({
                error: "Token inválido",
            });
        }

        const token = partes[1];

        const datos = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (datos.tipo !== "ADMIN") {
            return res.status(403).json({
                error: "Acceso denegado",
            });
        }

        req.admin = datos;

        next();

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                error: "La sesión ha expirado",
            });
        }

        return res.status(401).json({
            error: "Token inválido o sesión no autorizada",
        });
    }
}

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
    await pool.query(`
    ALTER TABLE cotizaciones
    ADD COLUMN IF NOT EXISTS subtotal NUMERIC(12,2);
`);

    await pool.query(`
    ALTER TABLE cotizaciones
    ADD COLUMN IF NOT EXISTS igv NUMERIC(12,2);
`);

    await pool.query(`
    ALTER TABLE cotizaciones
    ADD COLUMN IF NOT EXISTS total NUMERIC(12,2);
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
    // =====================================================
    // ADMINISTRADORES
    // =====================================================

    await pool.query(`
    CREATE TABLE IF NOT EXISTS administradores (
        id BIGSERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        correo VARCHAR(150) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
        fecha_registro TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
`);

    console.log("Tabla administradores verificada correctamente");

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
    // =====================================================
    // PEDIDOS
    // =====================================================

    await pool.query(`
        CREATE TABLE IF NOT EXISTS pedidos (
            id BIGSERIAL PRIMARY KEY,
            cotizacion_id BIGINT NOT NULL,
            cliente_id BIGINT NOT NULL,
            codigo VARCHAR(60) NOT NULL,
            estado VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE',
            subtotal NUMERIC(12,2) NOT NULL,
            igv NUMERIC(12,2) NOT NULL,
            total NUMERIC(12,2) NOT NULL,
            observaciones TEXT,
            fecha_pedido TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    `);

    // =====================================================
    // EVITAR DOS PEDIDOS DE UNA MISMA COTIZACIÓN
    // =====================================================

    await pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_pedidos_cotizacion
        ON pedidos(cotizacion_id);
    `);

    await pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_pedidos_codigo
        ON pedidos(codigo);
    `);

    // =====================================================
    // RELACIÓN PEDIDO -> COTIZACIÓN
    // =====================================================

    await pool.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1
                FROM pg_constraint
                WHERE conname = 'fk_pedidos_cotizacion'
            ) THEN
                ALTER TABLE pedidos
                ADD CONSTRAINT fk_pedidos_cotizacion
                FOREIGN KEY (cotizacion_id)
                REFERENCES cotizaciones(id)
                ON DELETE RESTRICT;
            END IF;
        END $$;
    `);

    // =====================================================
    // RELACIÓN PEDIDO -> CLIENTE
    // =====================================================

    await pool.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1
                FROM pg_constraint
                WHERE conname = 'fk_pedidos_cliente'
            ) THEN
                ALTER TABLE pedidos
                ADD CONSTRAINT fk_pedidos_cliente
                FOREIGN KEY (cliente_id)
                REFERENCES clientes(id)
                ON DELETE RESTRICT;
            END IF;
        END $$;
    `);

    // =====================================================
    // DETALLE DEL PEDIDO
    // =====================================================

    await pool.query(`
        CREATE TABLE IF NOT EXISTS detalle_pedido (
            id BIGSERIAL PRIMARY KEY,
            pedido_id BIGINT NOT NULL,
            producto_id BIGINT NOT NULL,
            cantidad INTEGER NOT NULL,
            precio_unitario NUMERIC(12,2) NOT NULL,
            subtotal NUMERIC(12,2) NOT NULL
        );
    `);

    // =====================================================
    // RELACIÓN DETALLE PEDIDO -> PEDIDO
    // =====================================================

    await pool.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1
                FROM pg_constraint
                WHERE conname = 'fk_detalle_pedido'
            ) THEN
                ALTER TABLE detalle_pedido
                ADD CONSTRAINT fk_detalle_pedido
                FOREIGN KEY (pedido_id)
                REFERENCES pedidos(id)
                ON DELETE CASCADE;
            END IF;
        END $$;
    `);

    // =====================================================
    // RELACIÓN DETALLE PEDIDO -> PRODUCTO
    // =====================================================

    await pool.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1
                FROM pg_constraint
                WHERE conname = 'fk_detalle_pedido_producto'
            ) THEN
                ALTER TABLE detalle_pedido
                ADD CONSTRAINT fk_detalle_pedido_producto
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
                WHERE conname = 'chk_detalle_pedido_cantidad'
            ) THEN
                ALTER TABLE detalle_pedido
                ADD CONSTRAINT chk_detalle_pedido_cantidad
                CHECK (cantidad > 0);
            END IF;
        END $$;
    `);

    // =====================================================
    // ÍNDICES PEDIDOS
    // =====================================================

    await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_pedidos_cliente
        ON pedidos(cliente_id);
    `);

    await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_pedidos_estado
        ON pedidos(estado);
    `);

    await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_pedidos_fecha
        ON pedidos(fecha_pedido);
    `);

    await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_detalle_pedido_id
        ON detalle_pedido(pedido_id);
    `);

    await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_detalle_pedido_producto
        ON detalle_pedido(producto_id);
    `);

    console.log(
        "Tablas de pedidos verificadas correctamente"
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
// ADMIN - GENERAR PEDIDO DESDE COTIZACIÓN
// =========================================================

app.post(
    "/admin/cotizaciones/:id/generar-pedido",
    verificarAdmin,
    async (req, res) => {
        let conexion;

        try {
            conexion = await pool.connect();

            const cotizacionId = Number(req.params.id);

            // =============================================
            // VALIDAR ID
            // =============================================

            if (
                !Number.isInteger(cotizacionId) ||
                cotizacionId <= 0
            ) {
                return res.status(400).json({
                    error: "ID de cotización inválido",
                });
            }

            await conexion.query("BEGIN");

            // =============================================
            // CONSULTAR COTIZACIÓN
            // =============================================

            const resultadoCotizacion =
                await conexion.query(
                    `
                    SELECT
                        id,
                        cliente_id,
                        codigo,
                        estado,
                        subtotal,
                        igv,
                        total,
                        observaciones
                    FROM cotizaciones
                    WHERE id = $1
                    LIMIT 1
                    FOR UPDATE
                    `,
                    [cotizacionId]
                );

            if (
                resultadoCotizacion.rowCount === 0
            ) {
                await conexion.query("ROLLBACK");

                return res.status(404).json({
                    error:
                        "Cotización no encontrada",
                });
            }

            const cotizacion =
                resultadoCotizacion.rows[0];

            // =============================================
            // VALIDAR ESTADO
            // =============================================

            if (
                String(
                    cotizacion.estado || ""
                ).toUpperCase() !== "APROBADA"
            ) {
                await conexion.query("ROLLBACK");

                return res.status(400).json({
                    error:
                        "La cotización todavía no puede generar un pedido",
                    detalle:
                        "Solo las cotizaciones APROBADAS pueden convertirse en pedido",
                    estado_actual:
                        cotizacion.estado,
                });
            }

            // =============================================
            // VALIDAR IMPORTES
            // =============================================

            if (
                cotizacion.subtotal === null ||
                cotizacion.igv === null ||
                cotizacion.total === null
            ) {
                await conexion.query("ROLLBACK");

                return res.status(400).json({
                    error:
                        "La cotización no contiene importes completos",
                });
            }

            // =============================================
            // EVITAR PEDIDO DUPLICADO
            // =============================================

            const pedidoExistente =
                await conexion.query(
                    `
                    SELECT
                        id,
                        codigo,
                        estado
                    FROM pedidos
                    WHERE cotizacion_id = $1
                    LIMIT 1
                    `,
                    [cotizacionId]
                );

            if (
                pedidoExistente.rowCount > 0
            ) {
                await conexion.query("ROLLBACK");

                return res.status(409).json({
                    error:
                        "Esta cotización ya tiene un pedido generado",
                    pedido:
                        pedidoExistente.rows[0],
                });
            }

            // =============================================
            // CONSULTAR PRODUCTOS DE LA COTIZACIÓN
            // =============================================

            const resultadoDetalles =
                await conexion.query(
                    `
                    SELECT
                        id,
                        producto_id,
                        cantidad,
                        precio_unitario,
                        subtotal
                    FROM detalle_cotizacion
                    WHERE cotizacion_id = $1
                    ORDER BY id ASC
                    `,
                    [cotizacionId]
                );

            if (
                resultadoDetalles.rowCount === 0
            ) {
                await conexion.query("ROLLBACK");

                return res.status(400).json({
                    error:
                        "La cotización no contiene productos",
                });
            }

            // =============================================
            // VALIDAR PRODUCTOS COTIZADOS
            // =============================================

            for (
                const detalle
                of resultadoDetalles.rows
            ) {
                if (
                    detalle.precio_unitario === null ||
                    detalle.subtotal === null
                ) {
                    await conexion.query("ROLLBACK");

                    return res.status(400).json({
                        error:
                            "La cotización contiene productos sin precio",
                    });
                }
            }

            // =============================================
            // GENERAR CÓDIGO DEL PEDIDO
            // =============================================

            const anio =
                new Date().getFullYear();

            const timestamp =
                Date.now();

            const aleatorio =
                Math.floor(
                    Math.random() * 900 + 100
                );

            const codigoPedido =
                `PED-${anio}-${timestamp}-${aleatorio}`;

            // =============================================
            // CREAR PEDIDO
            // =============================================

            const resultadoPedido =
                await conexion.query(
                    `
                    INSERT INTO pedidos (
                        cotizacion_id,
                        cliente_id,
                        codigo,
                        estado,
                        subtotal,
                        igv,
                        total,
                        observaciones,
                        fecha_pedido,
                        fecha_actualizacion
                    )
                    VALUES (
                        $1,
                        $2,
                        $3,
                        'PENDIENTE',
                        $4,
                        $5,
                        $6,
                        $7,
                        NOW(),
                        NOW()
                    )
                    RETURNING
                        id,
                        cotizacion_id,
                        cliente_id,
                        codigo,
                        estado,
                        subtotal,
                        igv,
                        total,
                        observaciones,
                        fecha_pedido,
                        fecha_actualizacion
                    `,
                    [
                        cotizacion.id,
                        cotizacion.cliente_id,
                        codigoPedido,
                        cotizacion.subtotal,
                        cotizacion.igv,
                        cotizacion.total,
                        cotizacion.observaciones,
                    ]
                );

            const pedido =
                resultadoPedido.rows[0];

            // =============================================
            // COPIAR DETALLE DE LA COTIZACIÓN
            // =============================================

            const productosPedido = [];

            for (
                const detalle
                of resultadoDetalles.rows
            ) {
                const resultadoDetallePedido =
                    await conexion.query(
                        `
                        INSERT INTO detalle_pedido (
                            pedido_id,
                            producto_id,
                            cantidad,
                            precio_unitario,
                            subtotal
                        )
                        VALUES (
                            $1,
                            $2,
                            $3,
                            $4,
                            $5
                        )
                        RETURNING
                            id,
                            pedido_id,
                            producto_id,
                            cantidad,
                            precio_unitario,
                            subtotal
                        `,
                        [
                            pedido.id,
                            detalle.producto_id,
                            detalle.cantidad,
                            detalle.precio_unitario,
                            detalle.subtotal,
                        ]
                    );

                productosPedido.push({
                    ...resultadoDetallePedido
                        .rows[0],

                    precio_unitario:
                        Number(
                            resultadoDetallePedido
                                .rows[0]
                                .precio_unitario
                        ),

                    subtotal:
                        Number(
                            resultadoDetallePedido
                                .rows[0]
                                .subtotal
                        ),
                });
            }

            await conexion.query("COMMIT");

            // =============================================
            // RESPUESTA
            // =============================================

            res.status(201).json({
                mensaje:
                    "Pedido generado correctamente",

                pedido: {
                    ...pedido,

                    subtotal:
                        Number(
                            pedido.subtotal
                        ),

                    igv:
                        Number(
                            pedido.igv
                        ),

                    total:
                        Number(
                            pedido.total
                        ),

                    productos:
                        productosPedido,
                },
            });

        } catch (error) {
            if (conexion) {
                try {
                    await conexion.query(
                        "ROLLBACK"
                    );
                } catch (rollbackError) {
                    console.error(
                        "Error al realizar rollback:",
                        rollbackError
                    );
                }
            }

            console.error(
                "Error al generar pedido:",
                error
            );

            if (
                error.code === "23505"
            ) {
                return res.status(409).json({
                    error:
                        "Esta cotización ya tiene un pedido generado",
                });
            }

            res.status(500).json({
                error:
                    "Error al generar pedido",
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
// ADMIN - LISTAR PEDIDOS
// =========================================================

app.get(
    "/admin/pedidos",
    verificarAdmin,
    async (req, res) => {
        try {
            const resultado = await pool.query(`
                SELECT
                    p.id,
                    p.cotizacion_id,
                    p.cliente_id,
                    p.codigo,
                    p.estado,
                    p.subtotal,
                    p.igv,
                    p.total,
                    p.observaciones,
                    p.fecha_pedido,
                    p.fecha_actualizacion,

                    c.tipo_cliente,
                    c.nombres,
                    c.apellidos,
                    c.dni,
                    c.razon_social,
                    c.ruc,
                    c.telefono,
                    c.correo,
                    c.direccion,

                    COUNT(dp.id) AS cantidad_items,
                    COALESCE(SUM(dp.cantidad), 0) AS cantidad_productos

                FROM pedidos p

                INNER JOIN clientes c
                    ON c.id = p.cliente_id

                LEFT JOIN detalle_pedido dp
                    ON dp.pedido_id = p.id

                GROUP BY
                    p.id,
                    p.cotizacion_id,
                    p.cliente_id,
                    p.codigo,
                    p.estado,
                    p.subtotal,
                    p.igv,
                    p.total,
                    p.observaciones,
                    p.fecha_pedido,
                    p.fecha_actualizacion,

                    c.tipo_cliente,
                    c.nombres,
                    c.apellidos,
                    c.dni,
                    c.razon_social,
                    c.ruc,
                    c.telefono,
                    c.correo,
                    c.direccion

                ORDER BY p.fecha_pedido DESC;
            `);

            const pedidos = resultado.rows.map((pedido) => {
                const nombreCliente =
                    pedido.tipo_cliente === "EMPRESA"
                        ? pedido.razon_social
                        : `${pedido.nombres || ""} ${pedido.apellidos || ""}`.trim();

                const documento =
                    pedido.tipo_cliente === "EMPRESA"
                        ? pedido.ruc
                        : pedido.dni;

                return {
                    id: pedido.id,
                    cotizacion_id: pedido.cotizacion_id,
                    codigo: pedido.codigo,
                    estado: pedido.estado,

                    subtotal:
                        pedido.subtotal === null
                            ? null
                            : Number(pedido.subtotal),

                    igv:
                        pedido.igv === null
                            ? null
                            : Number(pedido.igv),

                    total:
                        pedido.total === null
                            ? null
                            : Number(pedido.total),

                    observaciones: pedido.observaciones,
                    fecha_pedido: pedido.fecha_pedido,
                    fecha_actualizacion: pedido.fecha_actualizacion,

                    cliente: {
                        id: pedido.cliente_id,
                        tipo_cliente: pedido.tipo_cliente,
                        nombre: nombreCliente,
                        documento,
                        telefono: pedido.telefono,
                        correo: pedido.correo,
                        direccion: pedido.direccion,
                    },

                    cantidad_items:
                        Number(pedido.cantidad_items),

                    cantidad_productos:
                        Number(pedido.cantidad_productos),
                };
            });

            res.json(pedidos);

        } catch (error) {
            console.error(
                "Error al listar pedidos:",
                error
            );

            res.status(500).json({
                error:
                    "Error al listar pedidos",
                detalle:
                    error.message,
            });
        }
    }
);
// =========================================================
// ADMIN - OBTENER DETALLE DE PEDIDO
// =========================================================

app.get(
    "/admin/pedidos/:id",
    verificarAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;

            if (!/^\d+$/.test(id)) {
                return res.status(400).json({
                    error: "ID de pedido inválido",
                });
            }

            const resultadoPedido = await pool.query(
                `
                SELECT
                    p.id,
                    p.cotizacion_id,
                    p.cliente_id,
                    p.codigo,
                    p.estado,
                    p.subtotal,
                    p.igv,
                    p.total,
                    p.observaciones,
                    p.fecha_pedido,
                    p.fecha_actualizacion,

                    c.tipo_cliente,
                    c.nombres,
                    c.apellidos,
                    c.dni,
                    c.razon_social,
                    c.ruc,
                    c.telefono,
                    c.correo,
                    c.direccion

                FROM pedidos p

                INNER JOIN clientes c
                    ON c.id = p.cliente_id

                WHERE p.id = $1
                `,
                [id]
            );

            if (resultadoPedido.rows.length === 0) {
                return res.status(404).json({
                    error: "Pedido no encontrado",
                });
            }

            const pedido = resultadoPedido.rows[0];

            const resultadoDetalles = await pool.query(
                `
                SELECT
                    dp.id,
                    dp.producto_id,
                    dp.cantidad,
                    dp.precio_unitario,
                    dp.subtotal,

                    pr.nombre,
                    pr.marca

                FROM detalle_pedido dp

                INNER JOIN productos pr
                    ON pr.id = dp.producto_id

                WHERE dp.pedido_id = $1

                ORDER BY dp.id ASC
                `,
                [id]
            );

            const nombreCliente =
                pedido.tipo_cliente === "EMPRESA"
                    ? pedido.razon_social
                    : `${pedido.nombres || ""} ${pedido.apellidos || ""}`.trim();

            const documento =
                pedido.tipo_cliente === "EMPRESA"
                    ? pedido.ruc
                    : pedido.dni;

            const respuesta = {
                id: pedido.id,
                cotizacion_id: pedido.cotizacion_id,
                codigo: pedido.codigo,
                estado: pedido.estado,

                subtotal:
                    pedido.subtotal === null
                        ? null
                        : Number(pedido.subtotal),

                igv:
                    pedido.igv === null
                        ? null
                        : Number(pedido.igv),

                total:
                    pedido.total === null
                        ? null
                        : Number(pedido.total),

                observaciones: pedido.observaciones,
                fecha_pedido: pedido.fecha_pedido,
                fecha_actualizacion: pedido.fecha_actualizacion,

                cliente: {
                    id: pedido.cliente_id,
                    tipo_cliente: pedido.tipo_cliente,
                    nombre: nombreCliente,
                    documento,
                    telefono: pedido.telefono,
                    correo: pedido.correo,
                    direccion: pedido.direccion,
                },

                productos: resultadoDetalles.rows.map((detalle) => ({
                    id: detalle.id,
                    producto_id: detalle.producto_id,
                    nombre: detalle.nombre,
                    marca: detalle.marca,
                    cantidad: Number(detalle.cantidad),

                    precio_unitario:
                        detalle.precio_unitario === null
                            ? null
                            : Number(detalle.precio_unitario),

                    subtotal:
                        detalle.subtotal === null
                            ? null
                            : Number(detalle.subtotal),
                })),
            };

            res.json(respuesta);

        } catch (error) {
            console.error(
                "Error al obtener detalle del pedido:",
                error
            );

            res.status(500).json({
                error: "Error al obtener detalle del pedido",
                detalle: error.message,
            });
        }
    }
);
// =========================================================
// ADMIN - CAMBIAR ESTADO DE PEDIDO
// =========================================================

app.patch(
    "/admin/pedidos/:id/estado",
    verificarAdmin,
    async (req, res) => {
        try {
            const pedidoId = Number(req.params.id);

            const nuevoEstado = String(
                req.body.estado || ""
            )
                .trim()
                .toUpperCase();

            // =============================================
            // VALIDAR ID
            // =============================================

            if (
                !Number.isInteger(pedidoId) ||
                pedidoId <= 0
            ) {
                return res.status(400).json({
                    error: "ID de pedido inválido",
                });
            }

            // =============================================
            // VALIDAR ESTADO
            // =============================================

            const estadosPermitidos = [
                "PENDIENTE",
                "EN_PROCESO",
                "COMPLETADO",
                "CANCELADO",
            ];

            if (
                !estadosPermitidos.includes(
                    nuevoEstado
                )
            ) {
                return res.status(400).json({
                    error: "Estado inválido",
                    detalle:
                        "Los estados permitidos son PENDIENTE, EN_PROCESO, COMPLETADO o CANCELADO",
                });
            }

            // =============================================
            // BUSCAR PEDIDO
            // =============================================

            const resultadoActual =
                await pool.query(
                    `
                    SELECT
                        id,
                        codigo,
                        estado,
                        subtotal,
                        igv,
                        total
                    FROM pedidos
                    WHERE id = $1
                    LIMIT 1
                    `,
                    [pedidoId]
                );

            if (
                resultadoActual.rowCount === 0
            ) {
                return res.status(404).json({
                    error: "Pedido no encontrado",
                });
            }

            const pedidoActual =
                resultadoActual.rows[0];

            const estadoActual = String(
                pedidoActual.estado || ""
            ).toUpperCase();

            // =============================================
            // EVITAR CAMBIAR PEDIDOS FINALIZADOS
            // =============================================

            if (
                ["COMPLETADO", "CANCELADO"].includes(
                    estadoActual
                )
            ) {
                return res.status(400).json({
                    error:
                        "El pedido ya está finalizado",
                    detalle:
                        `El pedido se encuentra en estado ${estadoActual}`,
                });
            }

            // =============================================
            // VALIDAR TRANSICIONES
            // =============================================

            const transicionesPermitidas = {
                PENDIENTE: [
                    "EN_PROCESO",
                    "CANCELADO",
                ],

                EN_PROCESO: [
                    "COMPLETADO",
                    "CANCELADO",
                ],
            };

            const posibles =
                transicionesPermitidas[
                estadoActual
                ] || [];

            if (
                !posibles.includes(
                    nuevoEstado
                )
            ) {
                return res.status(400).json({
                    error:
                        "Cambio de estado no permitido",

                    detalle:
                        `No se puede cambiar de ${estadoActual} a ${nuevoEstado}`,
                });
            }

            // =============================================
            // ACTUALIZAR PEDIDO
            // =============================================

            const resultado =
                await pool.query(
                    `
                    UPDATE pedidos
                    SET
                        estado = $1,
                        fecha_actualizacion = NOW()
                    WHERE id = $2
                    RETURNING
                        id,
                        cotizacion_id,
                        cliente_id,
                        codigo,
                        estado,
                        subtotal,
                        igv,
                        total,
                        observaciones,
                        fecha_pedido,
                        fecha_actualizacion
                    `,
                    [
                        nuevoEstado,
                        pedidoId,
                    ]
                );

            const pedido =
                resultado.rows[0];

            res.json({
                mensaje:
                    "Estado del pedido actualizado correctamente",

                pedido: {
                    ...pedido,

                    subtotal:
                        Number(
                            pedido.subtotal
                        ),

                    igv:
                        Number(
                            pedido.igv
                        ),

                    total:
                        Number(
                            pedido.total
                        ),
                },
            });

        } catch (error) {
            console.error(
                "Error al cambiar estado del pedido:",
                error
            );

            res.status(500).json({
                error:
                    "Error al cambiar estado del pedido",
                detalle:
                    error.message,
            });
        }
    }
);
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
                        c.subtotal,
                        c.igv,
                        c.total,
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
// SOLICITUDES DE PROFORMA - PÚBLICO
// =========================================================

app.post("/solicitudes-proforma", async (req, res) => {
    let conexion;

    try {
        conexion = await pool.connect();

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
            observaciones,
            productos,
        } = req.body;

        const tipo = String(tipo_cliente || "")
            .trim()
            .toUpperCase();

        const telefonoLimpio = String(telefono || "").trim();

        const correoLimpio = String(correo || "")
            .trim()
            .toLowerCase();

        // =================================================
        // VALIDACIONES GENERALES
        // =================================================

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

        if (!Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({
                error: "La solicitud debe contener productos",
            });
        }

        await conexion.query("BEGIN");

        let cliente;

        // =================================================
        // PERSONA
        // =================================================

        if (tipo === "PERSONA") {
            const nombresFinal = String(nombres || "").trim();
            const apellidosFinal = String(apellidos || "").trim();
            const dniFinal = String(dni || "").trim();

            if (!nombresFinal) {
                await conexion.query("ROLLBACK");

                return res.status(400).json({
                    error: "Los nombres son obligatorios",
                });
            }

            if (!apellidosFinal) {
                await conexion.query("ROLLBACK");

                return res.status(400).json({
                    error: "Los apellidos son obligatorios",
                });
            }

            if (!/^\d{8}$/.test(dniFinal)) {
                await conexion.query("ROLLBACK");

                return res.status(400).json({
                    error: "El DNI debe contener 8 dígitos",
                });
            }

            const existeCliente = await conexion.query(
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
                    estado
                FROM clientes
                WHERE dni = $1
                LIMIT 1
                `,
                [dniFinal]
            );

            if (existeCliente.rowCount > 0) {
                const actualizado = await conexion.query(
                    `
                    UPDATE clientes
                    SET
                        nombres = $1,
                        apellidos = $2,
                        telefono = $3,
                        correo = $4,
                        direccion = $5,
                        estado = 'ACTIVO'
                    WHERE id = $6
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
                        estado
                    `,
                    [
                        nombresFinal,
                        apellidosFinal,
                        telefonoLimpio,
                        correoLimpio,
                        String(direccion || "").trim() || null,
                        existeCliente.rows[0].id,
                    ]
                );

                cliente = actualizado.rows[0];
            } else {
                const nuevoCliente = await conexion.query(
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
                        direccion,
                        estado,
                        fecha_registro
                    )
                    VALUES (
                        'PERSONA',
                        $1,
                        $2,
                        $3,
                        NULL,
                        NULL,
                        $4,
                        $5,
                        $6,
                        'ACTIVO',
                        NOW()
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
                        estado
                    `,
                    [
                        nombresFinal,
                        apellidosFinal,
                        dniFinal,
                        telefonoLimpio,
                        correoLimpio,
                        String(direccion || "").trim() || null,
                    ]
                );

                cliente = nuevoCliente.rows[0];
            }
        }

        // =================================================
        // EMPRESA
        // =================================================

        if (tipo === "EMPRESA") {
            const razonSocialFinal = String(razon_social || "").trim();
            const rucFinal = String(ruc || "").trim();

            if (!razonSocialFinal) {
                await conexion.query("ROLLBACK");

                return res.status(400).json({
                    error: "La razón social es obligatoria",
                });
            }

            if (!/^\d{11}$/.test(rucFinal)) {
                await conexion.query("ROLLBACK");

                return res.status(400).json({
                    error: "El RUC debe contener 11 dígitos",
                });
            }

            const existeCliente = await conexion.query(
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
                    estado
                FROM clientes
                WHERE ruc = $1
                LIMIT 1
                `,
                [rucFinal]
            );

            if (existeCliente.rowCount > 0) {
                const actualizado = await conexion.query(
                    `
                    UPDATE clientes
                    SET
                        razon_social = $1,
                        telefono = $2,
                        correo = $3,
                        direccion = $4,
                        estado = 'ACTIVO'
                    WHERE id = $5
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
                        estado
                    `,
                    [
                        razonSocialFinal,
                        telefonoLimpio,
                        correoLimpio,
                        String(direccion || "").trim() || null,
                        existeCliente.rows[0].id,
                    ]
                );

                cliente = actualizado.rows[0];
            } else {
                const nuevoCliente = await conexion.query(
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
                        direccion,
                        estado,
                        fecha_registro
                    )
                    VALUES (
                        'EMPRESA',
                        NULL,
                        NULL,
                        NULL,
                        $1,
                        $2,
                        $3,
                        $4,
                        $5,
                        'ACTIVO',
                        NOW()
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
                        estado
                    `,
                    [
                        razonSocialFinal,
                        rucFinal,
                        telefonoLimpio,
                        correoLimpio,
                        String(direccion || "").trim() || null,
                    ]
                );

                cliente = nuevoCliente.rows[0];
            }
        }

        // =================================================
        // VALIDAR Y AGRUPAR PRODUCTOS
        // =================================================

        const cantidadesPorProducto = new Map();

        for (const item of productos) {
            const productoId = Number(item.producto_id);
            const cantidad = Number(item.cantidad);

            if (!Number.isInteger(productoId) || productoId <= 0) {
                await conexion.query("ROLLBACK");

                return res.status(400).json({
                    error: "Producto inválido",
                });
            }

            if (!Number.isInteger(cantidad) || cantidad <= 0) {
                await conexion.query("ROLLBACK");

                return res.status(400).json({
                    error: "Cantidad inválida",
                    detalle: "La cantidad debe ser mayor a 0",
                });
            }

            const actual = cantidadesPorProducto.get(productoId) || 0;

            cantidadesPorProducto.set(
                productoId,
                actual + cantidad
            );
        }

        const productosProcesados = [];

        for (const [productoId, cantidad] of cantidadesPorProducto.entries()) {
            const resultadoProducto = await conexion.query(
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

            if (resultadoProducto.rowCount === 0) {
                await conexion.query("ROLLBACK");

                return res.status(404).json({
                    error: "Producto no encontrado",
                    detalle: `No existe el producto con ID ${productoId}`,
                });
            }

            const producto = resultadoProducto.rows[0];

            if (!producto.activo) {
                await conexion.query("ROLLBACK");

                return res.status(400).json({
                    error: "Producto no disponible",
                    detalle: `El producto ${producto.nombre} no se encuentra activo`,
                });
            }

            productosProcesados.push({
                producto_id: producto.id,
                nombre: producto.nombre,
                marca: producto.marca,
                cantidad,
            });
        }

        // =================================================
        // GENERAR CÓDIGO DE COTIZACIÓN
        // =================================================

        const anio = new Date().getFullYear();
        const timestamp = Date.now();
        const aleatorio = Math.floor(Math.random() * 900 + 100);

        const codigo = `COT-${anio}-${timestamp}-${aleatorio}`;

        // =================================================
        // CREAR COTIZACIÓN
        // =================================================

        const resultadoCotizacion = await conexion.query(
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
                cliente.id,
                codigo,
                String(observaciones || "").trim() || null,
            ]
        );

        const cotizacion = resultadoCotizacion.rows[0];

        // =================================================
        // GUARDAR DETALLE DE COTIZACIÓN
        // =================================================

        const detalles = [];

        for (const producto of productosProcesados) {
            const resultadoDetalle = await conexion.query(
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
                ...resultadoDetalle.rows[0],
                nombre: producto.nombre,
                marca: producto.marca,
            });
        }

        await conexion.query("COMMIT");

        // =================================================
        // RESPUESTA
        // =================================================

        res.status(201).json({
            mensaje: "Solicitud de proforma registrada correctamente",

            solicitud: {
                codigo: cotizacion.codigo,
                estado: cotizacion.estado,
                fecha_solicitud: cotizacion.fecha_solicitud,

                cliente:
                    cliente.tipo_cliente === "EMPRESA"
                        ? {
                            id: cliente.id,
                            tipo_cliente: "EMPRESA",
                            razon_social: cliente.razon_social,
                            ruc: cliente.ruc,
                            telefono: cliente.telefono,
                            correo: cliente.correo,
                        }
                        : {
                            id: cliente.id,
                            tipo_cliente: "PERSONA",
                            nombres: cliente.nombres,
                            apellidos: cliente.apellidos,
                            dni: cliente.dni,
                            telefono: cliente.telefono,
                            correo: cliente.correo,
                        },

                productos: detalles,
            },
        });

    } catch (error) {
        if (conexion) {
            try {
                await conexion.query("ROLLBACK");
            } catch (rollbackError) {
                console.error(
                    "Error al realizar rollback:",
                    rollbackError
                );
            }
        }

        console.error(
            "Error al registrar solicitud de proforma:",
            error
        );

        res.status(500).json({
            error: "Error al registrar solicitud de proforma",
            detalle: error.message,
        });

    } finally {
        if (conexion) {
            conexion.release();
        }
    }
});
// =========================================================
// ADMIN - LOGIN
// =========================================================

app.post("/admin/login", async (req, res) => {
    try {
        const correo = String(req.body.correo || "")
            .trim()
            .toLowerCase();

        const password = String(req.body.password || "");

        if (!correo || !password) {
            return res.status(400).json({
                error: "Correo y contraseña son obligatorios",
            });
        }

        const resultado = await pool.query(
            `
            SELECT
                id,
                nombre,
                correo,
                password_hash,
                estado
            FROM administradores
            WHERE LOWER(correo) = LOWER($1)
            LIMIT 1
            `,
            [correo]
        );

        if (resultado.rowCount === 0) {
            return res.status(401).json({
                error: "Credenciales incorrectas",
            });
        }

        const administrador = resultado.rows[0];

        if (administrador.estado !== "ACTIVO") {
            return res.status(403).json({
                error: "Administrador inactivo",
            });
        }

        const passwordCorrecta = await bcrypt.compare(
            password,
            administrador.password_hash
        );

        if (!passwordCorrecta) {
            return res.status(401).json({
                error: "Credenciales incorrectas",
            });
        }

        const token = jwt.sign(
            {
                id: administrador.id,
                correo: administrador.correo,
                tipo: "ADMIN",
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "8h",
            }
        );

        res.json({
            mensaje: "Inicio de sesión correcto",

            administrador: {
                id: administrador.id,
                nombre: administrador.nombre,
                correo: administrador.correo,
            },

            token,
        });

    } catch (error) {
        console.error("Error al iniciar sesión:", error);

        res.status(500).json({
            error: "Error al iniciar sesión",
            detalle: error.message,
        });
    }
});
// =========================================================
// ADMIN - LISTAR COTIZACIONES
// =========================================================

app.get("/admin/cotizaciones", verificarAdmin, async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT
                c.id,
                c.codigo,
                c.estado,
                c.observaciones,
                c.fecha_solicitud,
                c.fecha_actualizacion,

                cl.id AS cliente_id,
                cl.tipo_cliente,
                cl.nombres,
                cl.apellidos,
                cl.dni,
                cl.razon_social,
                cl.ruc,
                cl.telefono,
                cl.correo,
                cl.direccion,

                COUNT(dc.id)::INTEGER AS cantidad_items,
                COALESCE(SUM(dc.cantidad), 0)::INTEGER AS cantidad_productos

            FROM cotizaciones c

            INNER JOIN clientes cl
                ON cl.id = c.cliente_id

            LEFT JOIN detalle_cotizacion dc
                ON dc.cotizacion_id = c.id

            GROUP BY
                c.id,
                c.codigo,
                c.estado,
                c.observaciones,
                c.fecha_solicitud,
                c.fecha_actualizacion,

                cl.id,
                cl.tipo_cliente,
                cl.nombres,
                cl.apellidos,
                cl.dni,
                cl.razon_social,
                cl.ruc,
                cl.telefono,
                cl.correo,
                cl.direccion

            ORDER BY c.fecha_solicitud DESC
        `);

        const cotizaciones = resultado.rows.map((item) => ({
            id: item.id,
            codigo: item.codigo,
            estado: item.estado,
            observaciones: item.observaciones,
            fecha_solicitud: item.fecha_solicitud,
            fecha_actualizacion: item.fecha_actualizacion,

            cliente: {
                id: item.cliente_id,
                tipo_cliente: item.tipo_cliente,

                nombre:
                    item.tipo_cliente === "EMPRESA"
                        ? item.razon_social
                        : `${item.nombres || ""} ${item.apellidos || ""}`.trim(),

                documento:
                    item.tipo_cliente === "EMPRESA"
                        ? item.ruc
                        : item.dni,

                telefono: item.telefono,
                correo: item.correo,
                direccion: item.direccion,
            },

            cantidad_items: item.cantidad_items,
            cantidad_productos: item.cantidad_productos,
        }));

        res.json(cotizaciones);

    } catch (error) {
        console.error(
            "Error al obtener cotizaciones del administrador:",
            error
        );

        res.status(500).json({
            error: "Error al obtener cotizaciones",
            detalle: error.message,
        });
    }
});

// =========================================================
// ADMIN - VER DETALLE DE COTIZACIÓN
// =========================================================

app.get("/admin/cotizaciones/:id", verificarAdmin, async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "ID de cotización inválido",
            });
        }

        const resultadoCotizacion = await pool.query(
            `
            SELECT
                c.id,
                c.codigo,
                c.estado,
                c.observaciones,
                c.fecha_solicitud,
                c.fecha_actualizacion,

                cl.id AS cliente_id,
                cl.tipo_cliente,
                cl.nombres,
                cl.apellidos,
                cl.dni,
                cl.razon_social,
                cl.ruc,
                cl.telefono,
                cl.correo,
                cl.direccion

            FROM cotizaciones c

            INNER JOIN clientes cl
                ON cl.id = c.cliente_id

            WHERE c.id = $1

            LIMIT 1
            `,
            [id]
        );

        if (resultadoCotizacion.rowCount === 0) {
            return res.status(404).json({
                error: "Cotización no encontrada",
            });
        }

        const datos = resultadoCotizacion.rows[0];

        const resultadoProductos = await pool.query(
            `
            SELECT
                dc.id,
                dc.producto_id,
                p.nombre,
                p.marca,
                p.categoria,
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
            id: datos.id,
            codigo: datos.codigo,
            estado: datos.estado,
            observaciones: datos.observaciones,
            fecha_solicitud: datos.fecha_solicitud,
            fecha_actualizacion: datos.fecha_actualizacion,

            cliente: {
                id: datos.cliente_id,
                tipo_cliente: datos.tipo_cliente,

                nombres: datos.nombres,
                apellidos: datos.apellidos,
                dni: datos.dni,

                razon_social: datos.razon_social,
                ruc: datos.ruc,

                telefono: datos.telefono,
                correo: datos.correo,
                direccion: datos.direccion,
            },

            productos: resultadoProductos.rows.map((producto) => ({
                id: producto.id,
                producto_id: producto.producto_id,
                nombre: producto.nombre,
                marca: producto.marca,
                categoria: producto.categoria,
                cantidad: producto.cantidad,

                precio_unitario:
                    producto.precio_unitario === null
                        ? null
                        : Number(producto.precio_unitario),

                subtotal:
                    producto.subtotal === null
                        ? null
                        : Number(producto.subtotal),
            })),
        });

    } catch (error) {
        console.error(
            "Error al obtener detalle de cotización:",
            error
        );

        res.status(500).json({
            error: "Error al obtener detalle de cotización",
            detalle: error.message,
        });
    }
});
// =========================================================
// ADMIN - COTIZAR SOLICITUD
// =========================================================

app.put(
    "/admin/cotizaciones/:id/cotizar",
    verificarAdmin,
    async (req, res) => {
        let conexion;

        try {
            conexion = await pool.connect();

            const cotizacionId = Number(req.params.id);
            const { productos } = req.body;

            // =============================================
            // VALIDAR ID
            // =============================================

            if (
                !Number.isInteger(cotizacionId) ||
                cotizacionId <= 0
            ) {
                return res.status(400).json({
                    error: "ID de cotización inválido",
                });
            }

            // =============================================
            // VALIDAR PRODUCTOS
            // =============================================

            if (
                !Array.isArray(productos) ||
                productos.length === 0
            ) {
                return res.status(400).json({
                    error:
                        "Debe enviar los productos con sus precios",
                });
            }

            await conexion.query("BEGIN");

            // =============================================
            // VERIFICAR COTIZACIÓN
            // =============================================

            const resultadoCotizacion =
                await conexion.query(
                    `
                    SELECT
                        id,
                        codigo,
                        estado
                    FROM cotizaciones
                    WHERE id = $1
                    LIMIT 1
                    `,
                    [cotizacionId]
                );

            if (
                resultadoCotizacion.rowCount === 0
            ) {
                await conexion.query("ROLLBACK");

                return res.status(404).json({
                    error:
                        "Cotización no encontrada",
                });
            }

            const cotizacion =
                resultadoCotizacion.rows[0];

            // =============================================
            // VALIDAR ESTADO
            // =============================================

            if (
                !["PENDIENTE", "COTIZADA"].includes(
                    String(cotizacion.estado || "")
                        .toUpperCase()
                )
            ) {
                await conexion.query("ROLLBACK");

                return res.status(400).json({
                    error:
                        "La cotización no puede ser modificada en su estado actual",
                    estado: cotizacion.estado,
                });
            }

            // =============================================
            // CONSULTAR DETALLES EXISTENTES
            // =============================================

            const resultadoDetalles =
                await conexion.query(
                    `
                    SELECT
                        id,
                        producto_id,
                        cantidad
                    FROM detalle_cotizacion
                    WHERE cotizacion_id = $1
                    ORDER BY id ASC
                    `,
                    [cotizacionId]
                );

            if (
                resultadoDetalles.rowCount === 0
            ) {
                await conexion.query("ROLLBACK");

                return res.status(400).json({
                    error:
                        "La cotización no contiene productos",
                });
            }

            const detallesBD =
                resultadoDetalles.rows;

            // =============================================
            // VALIDAR QUE TODOS LOS DETALLES LLEGUEN
            // =============================================

            if (
                productos.length !==
                detallesBD.length
            ) {
                await conexion.query("ROLLBACK");

                return res.status(400).json({
                    error:
                        "Debe asignar precio a todos los productos de la cotización",
                });
            }

            let subtotalGeneral = 0;
            const productosActualizados = [];

            // =============================================
            // ACTUALIZAR PRECIOS
            // =============================================

            for (const item of productos) {
                const detalleId =
                    Number(item.detalle_id);

                const precioUnitario =
                    Number(item.precio_unitario);

                if (
                    !Number.isInteger(detalleId) ||
                    detalleId <= 0
                ) {
                    await conexion.query(
                        "ROLLBACK"
                    );

                    return res.status(400).json({
                        error:
                            "detalle_id inválido",
                    });
                }

                if (
                    !Number.isFinite(
                        precioUnitario
                    ) ||
                    precioUnitario <= 0
                ) {
                    await conexion.query(
                        "ROLLBACK"
                    );

                    return res.status(400).json({
                        error:
                            "Precio unitario inválido",
                        detalle:
                            "El precio debe ser mayor a 0",
                    });
                }

                const detalleExistente =
                    detallesBD.find(
                        (detalle) =>
                            Number(detalle.id) ===
                            detalleId
                    );

                if (!detalleExistente) {
                    await conexion.query(
                        "ROLLBACK"
                    );

                    return res.status(400).json({
                        error:
                            "El detalle no pertenece a esta cotización",
                        detalle_id:
                            detalleId,
                    });
                }

                const cantidad =
                    Number(
                        detalleExistente.cantidad
                    );

                const subtotalProducto =
                    Number(
                        (
                            cantidad *
                            precioUnitario
                        ).toFixed(2)
                    );

                subtotalGeneral +=
                    subtotalProducto;

                const resultadoActualizacion =
                    await conexion.query(
                        `
                        UPDATE detalle_cotizacion
                        SET
                            precio_unitario = $1,
                            subtotal = $2
                        WHERE id = $3
                          AND cotizacion_id = $4
                        RETURNING
                            id,
                            producto_id,
                            cantidad,
                            precio_unitario,
                            subtotal
                        `,
                        [
                            precioUnitario,
                            subtotalProducto,
                            detalleId,
                            cotizacionId,
                        ]
                    );

                productosActualizados.push({
                    ...resultadoActualizacion
                        .rows[0],

                    precio_unitario:
                        Number(
                            resultadoActualizacion
                                .rows[0]
                                .precio_unitario
                        ),

                    subtotal:
                        Number(
                            resultadoActualizacion
                                .rows[0]
                                .subtotal
                        ),
                });
            }

            // =============================================
            // CALCULAR SUBTOTAL
            // =============================================

            subtotalGeneral =
                Number(
                    subtotalGeneral.toFixed(2)
                );

            // =============================================
            // CALCULAR IGV 18%
            // =============================================

            const igv =
                Number(
                    (
                        subtotalGeneral * 0.18
                    ).toFixed(2)
                );

            // =============================================
            // CALCULAR TOTAL
            // =============================================

            const total =
                Number(
                    (
                        subtotalGeneral + igv
                    ).toFixed(2)
                );

            // =============================================
            // ACTUALIZAR COTIZACIÓN
            // =============================================

            const resultadoFinal =
                await conexion.query(
                    `
                    UPDATE cotizaciones
                    SET
                        subtotal = $1,
                        igv = $2,
                        total = $3,
                        estado = 'COTIZADA',
                        fecha_actualizacion = NOW()
                    WHERE id = $4
                    RETURNING
                        id,
                        codigo,
                        estado,
                        subtotal,
                        igv,
                        total,
                        fecha_solicitud,
                        fecha_actualizacion
                    `,
                    [
                        subtotalGeneral,
                        igv,
                        total,
                        cotizacionId,
                    ]
                );

            await conexion.query(
                "COMMIT"
            );

            // =============================================
            // RESPUESTA
            // =============================================

            res.json({
                mensaje:
                    "Cotización actualizada correctamente",

                cotizacion: {
                    ...resultadoFinal
                        .rows[0],

                    subtotal:
                        Number(
                            resultadoFinal
                                .rows[0]
                                .subtotal
                        ),

                    igv:
                        Number(
                            resultadoFinal
                                .rows[0]
                                .igv
                        ),

                    total:
                        Number(
                            resultadoFinal
                                .rows[0]
                                .total
                        ),

                    productos:
                        productosActualizados,
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
                "Error al cotizar solicitud:",
                error
            );

            res.status(500).json({
                error:
                    "Error al cotizar solicitud",
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
// ADMIN - CAMBIAR ESTADO DE COTIZACIÓN
// =========================================================

app.patch(
    "/admin/cotizaciones/:id/estado",
    verificarAdmin,
    async (req, res) => {
        try {
            const cotizacionId = Number(req.params.id);

            const nuevoEstado = String(
                req.body.estado || ""
            )
                .trim()
                .toUpperCase();

            // =============================================
            // VALIDAR ID
            // =============================================

            if (
                !Number.isInteger(cotizacionId) ||
                cotizacionId <= 0
            ) {
                return res.status(400).json({
                    error: "ID de cotización inválido",
                });
            }

            // =============================================
            // VALIDAR NUEVO ESTADO
            // =============================================

            const estadosPermitidos = [
                "APROBADA",
                "RECHAZADA",
            ];

            if (
                !estadosPermitidos.includes(
                    nuevoEstado
                )
            ) {
                return res.status(400).json({
                    error: "Estado inválido",
                    detalle:
                        "El estado debe ser APROBADA o RECHAZADA",
                });
            }

            // =============================================
            // CONSULTAR COTIZACIÓN
            // =============================================

            const resultadoActual =
                await pool.query(
                    `
                    SELECT
                        id,
                        codigo,
                        estado,
                        subtotal,
                        igv,
                        total
                    FROM cotizaciones
                    WHERE id = $1
                    LIMIT 1
                    `,
                    [cotizacionId]
                );

            if (
                resultadoActual.rowCount === 0
            ) {
                return res.status(404).json({
                    error: "Cotización no encontrada",
                });
            }

            const cotizacionActual =
                resultadoActual.rows[0];

            const estadoActual = String(
                cotizacionActual.estado || ""
            ).toUpperCase();

            // =============================================
            // VALIDAR TRANSICIÓN
            // =============================================

            if (estadoActual !== "COTIZADA") {
                return res.status(400).json({
                    error:
                        "No se puede cambiar el estado de esta cotización",
                    detalle:
                        "Solo una cotización en estado COTIZADA puede ser APROBADA o RECHAZADA",
                    estado_actual:
                        estadoActual,
                });
            }

            // =============================================
            // VALIDAR QUE TENGA TOTALES
            // =============================================

            if (
                cotizacionActual.subtotal === null ||
                cotizacionActual.igv === null ||
                cotizacionActual.total === null
            ) {
                return res.status(400).json({
                    error:
                        "La cotización aún no tiene importes completos",
                    detalle:
                        "Primero debes guardar los precios de todos los productos",
                });
            }

            // =============================================
            // ACTUALIZAR ESTADO
            // =============================================

            const resultado =
                await pool.query(
                    `
                    UPDATE cotizaciones
                    SET
                        estado = $1,
                        fecha_actualizacion = NOW()
                    WHERE id = $2
                    RETURNING
                        id,
                        codigo,
                        estado,
                        subtotal,
                        igv,
                        total,
                        observaciones,
                        fecha_solicitud,
                        fecha_actualizacion
                    `,
                    [
                        nuevoEstado,
                        cotizacionId,
                    ]
                );

            const cotizacion =
                resultado.rows[0];

            res.json({
                mensaje:
                    nuevoEstado === "APROBADA"
                        ? "Cotización aprobada correctamente"
                        : "Cotización rechazada correctamente",

                cotizacion: {
                    ...cotizacion,

                    subtotal:
                        cotizacion.subtotal === null
                            ? null
                            : Number(cotizacion.subtotal),

                    igv:
                        cotizacion.igv === null
                            ? null
                            : Number(cotizacion.igv),

                    total:
                        cotizacion.total === null
                            ? null
                            : Number(cotizacion.total),
                },
            });

        } catch (error) {
            console.error(
                "Error al cambiar estado de cotización:",
                error
            );

            res.status(500).json({
                error:
                    "Error al cambiar estado de cotización",
                detalle:
                    error.message,
            });
        }
    }
);
// =========================================================
// ADMIN - GENERAR PEDIDO DESDE COTIZACIÓN APROBADA
// =========================================================

app.post(
    "/admin/cotizaciones/:id/generar-pedido",
    verificarAdmin,
    async (req, res) => {
        const conexion = await pool.connect();

        try {
            const cotizacionId = Number(req.params.id);

            if (!Number.isInteger(cotizacionId) || cotizacionId <= 0) {
                return res.status(400).json({
                    error: "ID de cotización inválido",
                });
            }

            await conexion.query("BEGIN");

            // =====================================================
            // OBTENER COTIZACIÓN
            // =====================================================

            const resultadoCotizacion = await conexion.query(
                `
                SELECT
                    id,
                    cliente_id,
                    codigo,
                    estado,
                    subtotal,
                    igv,
                    total,
                    observaciones
                FROM cotizaciones
                WHERE id = $1
                FOR UPDATE
                `,
                [cotizacionId]
            );

            if (resultadoCotizacion.rowCount === 0) {
                await conexion.query("ROLLBACK");

                return res.status(404).json({
                    error: "Cotización no encontrada",
                });
            }

            const cotizacion = resultadoCotizacion.rows[0];

            // =====================================================
            // VALIDAR QUE ESTÉ APROBADA
            // =====================================================

            if (
                String(cotizacion.estado || "").toUpperCase() !==
                "APROBADA"
            ) {
                await conexion.query("ROLLBACK");

                return res.status(400).json({
                    error:
                        "Solo se puede generar un pedido desde una cotización aprobada",
                });
            }

            // =====================================================
            // EVITAR PEDIDOS DUPLICADOS
            // =====================================================

            const pedidoExistente = await conexion.query(
                `
                SELECT
                    id,
                    codigo,
                    estado
                FROM pedidos
                WHERE cotizacion_id = $1
                LIMIT 1
                `,
                [cotizacionId]
            );

            if (pedidoExistente.rowCount > 0) {
                await conexion.query("COMMIT");

                return res.status(200).json({
                    mensaje:
                        "El pedido ya había sido generado anteriormente",
                    pedido: pedidoExistente.rows[0],
                    existente: true,
                });
            }

            // =====================================================
            // VALIDAR TOTALES
            // =====================================================

            if (
                cotizacion.subtotal === null ||
                cotizacion.igv === null ||
                cotizacion.total === null
            ) {
                await conexion.query("ROLLBACK");

                return res.status(400).json({
                    error:
                        "La cotización no tiene los importes calculados",
                });
            }

            // =====================================================
            // OBTENER PRODUCTOS COTIZADOS
            // =====================================================

            const resultadoProductos = await conexion.query(
                `
                SELECT
                    dc.producto_id,
                    dc.cantidad,
                    dc.precio_unitario,
                    dc.subtotal
                FROM detalle_cotizacion dc
                WHERE dc.cotizacion_id = $1
                ORDER BY dc.id ASC
                `,
                [cotizacionId]
            );

            if (resultadoProductos.rowCount === 0) {
                await conexion.query("ROLLBACK");

                return res.status(400).json({
                    error:
                        "La cotización no contiene productos",
                });
            }

            for (const producto of resultadoProductos.rows) {
                if (
                    producto.precio_unitario === null ||
                    producto.subtotal === null
                ) {
                    await conexion.query("ROLLBACK");

                    return res.status(400).json({
                        error:
                            "Todos los productos deben tener precio antes de generar el pedido",
                    });
                }
            }

            // =====================================================
            // CREAR CÓDIGO DEL PEDIDO
            // =====================================================

            const anio = new Date().getFullYear();
            const timestamp = Date.now();
            const aleatorio = Math.floor(
                Math.random() * 900 + 100
            );

            const codigoPedido =
                `PED-${anio}-${timestamp}-${aleatorio}`;

            // =====================================================
            // CREAR PEDIDO
            // =====================================================

            const resultadoPedido = await conexion.query(
                `
                INSERT INTO pedidos (
                    cotizacion_id,
                    cliente_id,
                    codigo,
                    estado,
                    subtotal,
                    igv,
                    total,
                    observaciones,
                    fecha_pedido,
                    fecha_actualizacion
                )
                VALUES (
                    $1,
                    $2,
                    $3,
                    'PENDIENTE',
                    $4,
                    $5,
                    $6,
                    $7,
                    NOW(),
                    NOW()
                )
                RETURNING
                    id,
                    cotizacion_id,
                    cliente_id,
                    codigo,
                    estado,
                    subtotal,
                    igv,
                    total,
                    observaciones,
                    fecha_pedido,
                    fecha_actualizacion
                `,
                [
                    cotizacion.id,
                    cotizacion.cliente_id,
                    codigoPedido,
                    cotizacion.subtotal,
                    cotizacion.igv,
                    cotizacion.total,
                    cotizacion.observaciones,
                ]
            );

            const pedido = resultadoPedido.rows[0];

            // =====================================================
            // COPIAR DETALLE DE COTIZACIÓN AL PEDIDO
            // =====================================================

            for (const producto of resultadoProductos.rows) {
                await conexion.query(
                    `
                    INSERT INTO detalle_pedido (
                        pedido_id,
                        producto_id,
                        cantidad,
                        precio_unitario,
                        subtotal
                    )
                    VALUES (
                        $1,
                        $2,
                        $3,
                        $4,
                        $5
                    )
                    `,
                    [
                        pedido.id,
                        producto.producto_id,
                        producto.cantidad,
                        producto.precio_unitario,
                        producto.subtotal,
                    ]
                );
            }

            await conexion.query("COMMIT");

            res.status(201).json({
                mensaje:
                    "Pedido generado correctamente",
                pedido: {
                    ...pedido,
                    subtotal: Number(pedido.subtotal),
                    igv: Number(pedido.igv),
                    total: Number(pedido.total),
                },
                existente: false,
            });

        } catch (error) {
            try {
                await conexion.query("ROLLBACK");
            } catch (rollbackError) {
                console.error(
                    "Error al realizar rollback:",
                    rollbackError
                );
            }

            console.error(
                "Error al generar pedido desde cotización:",
                error
            );

            res.status(500).json({
                error:
                    "Error al generar pedido desde la cotización",
                detalle: error.message,
            });

        } finally {
            conexion.release();
        }
    }
);
// =========================================================
// GENERAR PDF DE COTIZACIÓN
// =========================================================

function generarPdfCotizacion(cotizacion) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: "A4",
                margin: 45,
            });

            const partes = [];

            doc.on("data", (chunk) => partes.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(partes)));
            doc.on("error", reject);

            const dinero = (valor) =>
                `S/ ${Number(valor || 0).toFixed(2)}`;

            const cliente =
                cotizacion.tipo_cliente === "EMPRESA"
                    ? cotizacion.razon_social
                    : `${cotizacion.nombres || ""} ${cotizacion.apellidos || ""}`.trim();

            const documento =
                cotizacion.tipo_cliente === "EMPRESA"
                    ? cotizacion.ruc
                    : cotizacion.dni;

            // ENCABEZADO
            doc
                .fontSize(22)
                .font("Helvetica-Bold")
                .text("INGEDATA S.A.C.", {
                    align: "left",
                });

            doc
                .fontSize(10)
                .font("Helvetica")
                .fillColor("#4b5563")
                .text(
                    "Tecnología · Infraestructura · Ingeniería"
                )
                .text("RUC: 20613136054")
                .text(
                    "Correo: jdiego@ingedataa.com"
                );

            doc
                .moveDown()
                .fillColor("#000000")
                .fontSize(18)
                .font("Helvetica-Bold")
                .text("COTIZACIÓN / PROFORMA", {
                    align: "right",
                });

            doc
                .fontSize(11)
                .font("Helvetica")
                .text(
                    `Código: ${cotizacion.codigo}`,
                    { align: "right" }
                )
                .text(
                    `Fecha: ${new Date().toLocaleDateString(
                        "es-PE"
                    )}`,
                    { align: "right" }
                );

            doc.moveDown(2);

            // CLIENTE
            doc
                .fontSize(12)
                .font("Helvetica-Bold")
                .text("DATOS DEL CLIENTE");

            doc
                .fontSize(10)
                .font("Helvetica")
                .text(`Cliente: ${cliente}`)
                .text(`Documento: ${documento || "-"}`)
                .text(
                    `Correo: ${cotizacion.correo || "-"}`
                )
                .text(
                    `Teléfono: ${cotizacion.telefono || "-"}`
                )
                .text(
                    `Dirección: ${cotizacion.direccion || "-"}`
                );

            doc.moveDown(1.5);

            // PRODUCTOS
            doc
                .fontSize(12)
                .font("Helvetica-Bold")
                .text("DETALLE DE LA COTIZACIÓN");

            doc.moveDown(0.5);

            const xProducto = 45;
            const xCantidad = 330;
            const xPrecio = 400;
            const xSubtotal = 485;

            let y = doc.y;

            doc
                .fontSize(9)
                .font("Helvetica-Bold")
                .text("Producto", xProducto, y)
                .text("Cant.", xCantidad, y)
                .text("P. Unit.", xPrecio, y)
                .text("Subtotal", xSubtotal, y);

            y += 20;

            doc
                .moveTo(45, y - 5)
                .lineTo(550, y - 5)
                .strokeColor("#d1d5db")
                .stroke();

            for (const producto of cotizacion.productos) {
                if (y > 700) {
                    doc.addPage();
                    y = 50;
                }

                const subtotal =
                    Number(producto.precio_unitario) *
                    Number(producto.cantidad);

                doc
                    .fontSize(9)
                    .font("Helvetica")
                    .fillColor("#000000")
                    .text(
                        producto.nombre,
                        xProducto,
                        y,
                        {
                            width: 270,
                        }
                    )
                    .text(
                        String(producto.cantidad),
                        xCantidad,
                        y
                    )
                    .text(
                        dinero(producto.precio_unitario),
                        xPrecio,
                        y
                    )
                    .text(
                        dinero(subtotal),
                        xSubtotal,
                        y
                    );

                y += 32;
            }

            doc.y = y + 10;

            // TOTALES
            doc
                .fontSize(10)
                .font("Helvetica")
                .text(
                    `Subtotal: ${dinero(
                        cotizacion.subtotal
                    )}`,
                    {
                        align: "right",
                    }
                )
                .text(
                    `IGV (18%): ${dinero(
                        cotizacion.igv
                    )}`,
                    {
                        align: "right",
                    }
                );

            doc
                .fontSize(14)
                .font("Helvetica-Bold")
                .text(
                    `TOTAL: ${dinero(
                        cotizacion.total
                    )}`,
                    {
                        align: "right",
                    }
                );

            doc.moveDown(2);

            doc
                .fontSize(10)
                .font("Helvetica-Bold")
                .text("CONDICIONES COMERCIALES");

            doc
                .fontSize(9)
                .font("Helvetica")
                .text(
                    "• Cotización válida por 7 días calendario."
                )
                .text(
                    "• Precios expresados en soles e incluyen IGV."
                )
                .text(
                    "• Disponibilidad y plazo de entrega sujetos a confirmación."
                );

            if (cotizacion.observaciones) {
                doc.moveDown();

                doc
                    .font("Helvetica-Bold")
                    .text("Observaciones:");

                doc
                    .font("Helvetica")
                    .text(cotizacion.observaciones);
            }

            doc.moveDown(3);

            doc
                .fontSize(8)
                .fillColor("#6b7280")
                .text(
                    "Documento generado automáticamente por el sistema de cotizaciones de INGEDATA S.A.C.",
                    {
                        align: "center",
                    }
                );

            doc.end();

        } catch (error) {
            reject(error);
        }
    });
}


// =========================================================
// ADMIN - DESCARGAR PROFORMA PDF
// =========================================================

app.get(
    "/admin/cotizaciones/:id/pdf",
    verificarAdmin,
    async (req, res) => {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    error: "ID de cotización inválido",
                });
            }

            const resultadoCotizacion = await pool.query(
                `
                SELECT
                    c.id,
                    c.codigo,
                    c.estado,
                    c.subtotal,
                    c.igv,
                    c.total,
                    c.observaciones,

                    cl.tipo_cliente,
                    cl.nombres,
                    cl.apellidos,
                    cl.dni,
                    cl.razon_social,
                    cl.ruc,
                    cl.telefono,
                    cl.correo,
                    cl.direccion

                FROM cotizaciones c

                INNER JOIN clientes cl
                    ON cl.id = c.cliente_id

                WHERE c.id = $1

                LIMIT 1
                `,
                [id]
            );

            if (resultadoCotizacion.rowCount === 0) {
                return res.status(404).json({
                    error: "Cotización no encontrada",
                });
            }

            const cotizacion =
                resultadoCotizacion.rows[0];

            if (
                cotizacion.subtotal === null ||
                cotizacion.igv === null ||
                cotizacion.total === null
            ) {
                return res.status(400).json({
                    error:
                        "Primero debes guardar los precios de la cotización",
                });
            }

            const resultadoProductos = await pool.query(
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

            const datosPdf = {
                ...cotizacion,
                productos: resultadoProductos.rows,
            };

            const pdfBuffer =
                await generarPdfCotizacion(datosPdf);

            const nombreArchivo =
                `Cotizacion-${cotizacion.codigo}.pdf`;

            res.setHeader(
                "Content-Type",
                "application/pdf"
            );

            res.setHeader(
                "Content-Disposition",
                `attachment; filename="${nombreArchivo}"`
            );

            res.setHeader(
                "Content-Length",
                pdfBuffer.length
            );

            res.send(pdfBuffer);

        } catch (error) {
            console.error(
                "Error al generar PDF de cotización:",
                error
            );

            res.status(500).json({
                error:
                    "No se pudo generar la proforma PDF",
                detalle: error.message,
            });
        }
    }
);// =========================================================
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