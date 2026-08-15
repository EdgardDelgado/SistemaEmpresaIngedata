import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_PRODUCTOS = "https://ingedata-backend.onrender.com/productos";

const WHATSAPP_1 = "51986916557";
const WHATSAPP_2 = "51986913711";
const WHATSAPP_3 = "51934274601";

const DATOS_EMPRESA = {
    telefono1: "986 916 557",
    telefono2: "986 913 711",
    telefono3: "934 274 601",
    correo: "jdiego@ingedataa.com",
    correo2: "lpanduro@ingedataa.com",
    correo3: "falbornoz@ingedataa.com",
    ruc: "20613136054",
    titular: "INGEDATA S.A.C.",
};

const DATOS_BANCARIOS = {
    banco: "Interbank",
    titular: "INGEDATA S.A.C.",
    numeroCuenta: "200-3007318136",
    cci: "00320000300731813631",
    tipoCuenta: "Cuenta empresa",
    moneda: "Soles (PEN)",
    cuentaDetraccion: "00059194461",
};

const FALLBACK_LOGO = "/imagenes/logo ingedata.jpeg";

function img(nombre) {
    return `/imagenes/${nombre}`;
}

function normalizarTexto(valor = "") {
    return String(valor)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/,/g, ".")
        .replace(/\s+/g, " ")
        .trim();
}

function obtenerImagenesProducto(producto) {
    const nombre = normalizarTexto(producto?.nombre);

    // Fibra óptica
    if (nombre.includes("fibra optica monomodo")) {
        return ["/imagenes/Fibra óptica monomodo 12 hilos por metro.png"];
    }

    if (nombre.includes("fibra optica multimodo")) {
        // Imagen referencial hasta que se agregue una foto específica de multimodo.
        return ["/imagenes/Fibra óptica monomodo 12 hilos por metro.png"];
    }

    // Cables NH-90
    if (nombre.includes("nh-90") && nombre.includes("2.5 mm")) {
        return ["/imagenes/cable electrico amarillo indeco.jpg"];
    }

    if (nombre.includes("nh-90") && nombre.includes("4 mm")) {
        return ["/imagenes/cable electrico blanco indeco.jpg"];
    }

    if (nombre.includes("nh-90") && nombre.includes("6 mm")) {
        return ["/imagenes/cable electrico indeco.jpg"];
    }

    if (nombre.includes("nh-90") && nombre.includes("10 mm")) {
        return ["/imagenes/cable electrico 10mm.jpg"];
    }

    if (nombre.includes("nh-90") && nombre.includes("16 mm")) {
        return ["/imagenes/16 NH-90mm indeco.jpg"];
    }

    if (nombre.includes("nh-90") && nombre.includes("25 mm")) {
        return ["/imagenes/25mm nh-90 indeco.jpg"];
    }

    if (nombre.includes("nh-90") && nombre.includes("35 mm")) {
        return ["/imagenes/35mm nh-90 indeco.jpg"];
    }

    // Cables N2XOH
    // Usamos una imagen referencial N2XOH que está comprobado que existe
    // en public/imagenes. Así evitamos que aparezca el logo de fallback.
    if (nombre.includes("n2xoh")) {
        return ["/imagenes/16mm N2XOH indeco.jpg"];
    }

    // Otros cables eléctricos existentes
    if (nombre.includes("cable electrico amarillo")) {
        return ["/imagenes/cable electrico amarillo indeco.jpg"];
    }

    if (nombre.includes("cable electrico blanco")) {
        return ["/imagenes/cable electrico blanco indeco.jpg"];
    }

    if (nombre === "cable electrico indeco") {
        return ["/imagenes/cable electrico indeco.jpg"];
    }

    // Tomas y accesorios eléctricos
    if (nombre.includes("schuko")) {
        return ["/imagenes/toma schuko.jpg"];
    }

    if (nombre.includes("industrial") && nombre.includes("32a")) {
        return ["/imagenes/Tomacorriente industrial 32A.jpg"];
    }

    if (nombre.includes("tomas comerciales")) {
        return ["/imagenes/tomas comerciales.jpg"];
    }

    if (nombre.includes("tomas estabilizadas")) {
        return ["/imagenes/tomas estabilizadas.jpg"];
    }

    if (nombre.includes("interruptor termomagnetico")) {
        return ["/imagenes/Interruptor termomagnético 2x32A.jpg"];
    }

    if (nombre.includes("tablero de distribucion")) {
        return ["/imagenes/Tablero de distribución 12 polos.png"];
    }

    if (nombre.includes("tuberia emt")) {
        return ["/imagenes/Tubería EMT.jpg"];
    }

    // Energía
    if (nombre.includes("ups apc 1500va")) {
        return ["/imagenes/UPS APC 1500VA línea interactiva.jpg"];
    }

    if (nombre.includes("ups on-line 3000va")) {
        return ["/imagenes/UPS On-line 3000VA rack.jpg"];
    }

    if (nombre.includes("banco de baterias")) {
        return ["/imagenes/Banco de baterías externo para UPS.jpg"];
    }

    if (nombre.includes("grupo electrogeno")) {
        return ["/imagenes/Grupo electrógeno 6.5 kW a gasolina.jpg"];
    }

    if (nombre.includes("transformador de aislamiento")) {
        return ["/imagenes/Transformador de aislamiento 5 kVA.jpg"];
    }

    // Melamina
    if (nombre.includes("escritorios") && nombre.includes("estaciones")) {
        return ["/imagenes/escritorio melamina.webp"];
    }

    if (nombre.includes("muebles de oficina")) {
        return ["/imagenes/Fabricación de mobiliario en melamina por m².png"];
    }

    if (nombre.includes("gabinetes") && nombre.includes("almacenamiento")) {
        return ["/imagenes/gabinetes de almacenamiento melamine.png"];
    }

    if (nombre.includes("recepcion")) {
        return ["/imagenes/muebles de recepcion melamine.jpg"];
    }

    if (nombre.includes("kitchenette") || nombre.includes("mueble de cocina")) {
        return ["/imagenes/mueble de cocina melamine.jpg"];
    }

    if (nombre.includes("mobiliario personalizado")) {
        return ["/imagenes/mobiliario personalizado melamine.jpg"];
    }

    // Estructuras metálicas
    if (nombre.includes("coberturas metalicas")) {
        return ["/imagenes/coberturas metalicas.jpg"];
    }

    if (nombre.includes("escaleras metalicas")) {
        return ["/imagenes/escaleras metalicas.jpg"];
    }

    if (nombre.includes("barandas metalicas")) {
        return ["/imagenes/barandas metalicas.jpg"];
    }

    if (nombre.includes("mesas") && nombre.includes("metalicas")) {
        return ["/imagenes/mesas metalicas.jpg"];
    }

    if (nombre.includes("estructuras metalicas personalizadas")) {
        return ["/imagenes/estructuras metalicas personalizadas.jpg"];
    }

    // Servicios de fibra óptica
    if (nombre.includes("fibra optica") && nombre.includes("planta interna")) {
        return ["/imagenes/cableado fibra optica parte interna.png"];
    }

    if (nombre.includes("fibra optica") && nombre.includes("planta externa")) {
        return [
            "/imagenes/cableado fibra optica parte externa .png",
            "/imagenes/cableado fibra optica parte externa.png",
        ];
    }

    // Si no existe una regla especial, se usa lo que entrega el backend.
    if (Array.isArray(producto?.imagenes) && producto.imagenes.length > 0) {
        return producto.imagenes;
    }

    if (producto?.imagenes) {
        return [producto.imagenes];
    }

    if (producto?.imagen) {
        return [producto.imagen];
    }

    return [FALLBACK_LOGO];
}

function ImagenRecurso({ imagenes, alt, className }) {
    const lista =
        Array.isArray(imagenes) && imagenes.length > 0
            ? imagenes
            : imagenes
                ? [imagenes]
                : [FALLBACK_LOGO];

    const rutas = [...new Set([...lista, FALLBACK_LOGO])];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        setIndex(0);
    }, [JSON.stringify(lista)]);

    return (
        <img
            src={rutas[index]}
            alt={alt}
            className={className}
            onError={() => {
                setIndex((actual) =>
                    actual < rutas.length - 1 ? actual + 1 : actual
                );
            }}
        />
    );
}

const categorias = [
    { label: "Todos", value: "Todos" },
    { label: "Productos de cableado estructurado", value: "Red y datos" },
    { label: "Fibra óptica", value: "Fibra óptica" },
    { label: "Productos eléctricos", value: "Eléctricos" },
    { label: "Equipos de alimentación ininterrumpida", value: "Energía" },
    { label: "Fabricación e instalación de muebles en melamina", value: "Melamina" },
    { label: "Estructuras metálicas", value: "Estructuras metálicas" },
    { label: "Servicios", value: "Servicios" },
];

function App() {
    const [productos, setProductos] = useState([]);
    const [cargandoProductos, setCargandoProductos] = useState(true);
    const [errorProductos, setErrorProductos] = useState("");

    const [categoria, setCategoria] = useState("Todos");
    const [buscar, setBuscar] = useState("");
    const [orden, setOrden] = useState("default");
    const [carrito, setCarrito] = useState({});
    const [carritoAbierto, setCarritoAbierto] = useState(false);
    const [favoritos, setFavoritos] = useState({});
    const [toast, setToast] = useState("");
    const [comprobante, setComprobante] = useState("boleta");
    const [datosComprobante, setDatosComprobante] = useState({
        dni: "",
        nombres: "",
        ruc: "",
        razonSocial: "",
        direccionFiscal: "",
        correo: "",
    });

    useEffect(() => {
        async function cargarProductos() {
            try {
                setCargandoProductos(true);
                setErrorProductos("");

                const respuesta = await fetch(API_PRODUCTOS);

                if (!respuesta.ok) {
                    throw new Error("No se pudo conectar con el backend");
                }

                const data = await respuesta.json();

                if (!Array.isArray(data)) {
                    throw new Error("La respuesta del backend no es una lista de productos");
                }

                setProductos(data);
            } catch (error) {
                console.error("Error al cargar productos:", error);
                setErrorProductos(
                    "No se pudieron cargar los productos desde la base de datos."
                );
            } finally {
                setCargandoProductos(false);
            }
        }

        cargarProductos();
    }, []);

    const lista = useMemo(() => {
        let data = productos.filter((p) => {
            const okCategoria = categoria === "Todos" || p.cat === categoria;
            const texto = `${p.nombre || ""} ${p.brand || ""} ${p.cat || ""}`.toLowerCase();
            const okBuscar = texto.includes(buscar.toLowerCase().trim());
            return okCategoria && okBuscar;
        });

        if (orden === "asc") {
            data = [...data].sort((a, b) => Number(a.precio) - Number(b.precio));
        }

        if (orden === "desc") {
            data = [...data].sort((a, b) => Number(b.precio) - Number(a.precio));
        }

        if (orden === "az") {
            data = [...data].sort((a, b) =>
                String(a.nombre || "").localeCompare(String(b.nombre || ""))
            );
        }

        return data;
    }, [productos, categoria, buscar, orden]);

    const itemsCarrito = Object.entries(carrito)
        .map(([id, cantidad]) => {
            const producto = productos.find((p) => Number(p.id) === Number(id));
            return producto ? { ...producto, cantidad } : null;
        })
        .filter(Boolean);

    const subtotal = itemsCarrito.reduce(
        (acc, item) => acc + Number(item.precio || 0) * item.cantidad,
        0
    );

    const igv = subtotal * 0.18;
    const total = subtotal + igv;

    const cantidadTotal = itemsCarrito.reduce(
        (acc, item) => acc + item.cantidad,
        0
    );

    const textoCotizacion =
        itemsCarrito.length === 0
            ? "Hola, deseo solicitar una cotización con INGEDATA."
            : `Hola, deseo cotizar lo siguiente:\n\n${itemsCarrito
                .map(
                    (item) =>
                        `- ${item.nombre} x${item.cantidad} | S/ ${(
                            Number(item.precio || 0) * item.cantidad
                        ).toFixed(2)}`
                )
                .join("\n")}\n\nSubtotal: S/ ${subtotal.toFixed(
                    2
                )}\nIGV: S/ ${igv.toFixed(2)}\nTotal referencial: S/ ${total.toFixed(
                    2
                )}`;

    const whatsappCotizacion = `https://wa.me/${WHATSAPP_1}?text=${encodeURIComponent(
        textoCotizacion
    )}`;

    const whatsappGeneral = `https://wa.me/${WHATSAPP_2}?text=${encodeURIComponent(
        "Hola, deseo información sobre productos y servicios de INGEDATA."
    )}`;

    const mostrarToast = (mensaje) => {
        setToast(mensaje);
        setTimeout(() => setToast(""), 1800);
    };

    const agregar = (id) => {
        setCarrito((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
        mostrarToast("Producto agregado al carrito");
    };

    const cambiarCantidad = (id, cambio) => {
        setCarrito((prev) => {
            const nuevaCantidad = (prev[id] || 0) + cambio;
            const copia = { ...prev };

            if (nuevaCantidad <= 0) {
                delete copia[id];
            } else {
                copia[id] = nuevaCantidad;
            }

            return copia;
        });
    };

    const quitar = (id) => {
        setCarrito((prev) => {
            const copia = { ...prev };
            delete copia[id];
            return copia;
        });
    };

    const toggleFavorito = (id) => {
        setFavoritos((prev) => ({ ...prev, [id]: !prev[id] }));
        mostrarToast(favoritos[id] ? "Quitado de favoritos" : "Añadido a favoritos");
    };

    const cotizarProducto = (producto) => {
        const mensaje = `Hola, deseo solicitar una cotización del siguiente producto o servicio de INGEDATA:

Producto/Servicio: ${producto.nombre}
Categoría: ${producto.cat}
Marca: ${producto.brand || "INGEDATA"}

Por favor, indíqueme disponibilidad, precio y condiciones.`;

        const url = `https://wa.me/${WHATSAPP_1}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, "_blank", "noopener,noreferrer");
    };

    const copiarTexto = async (texto, etiqueta) => {
        try {
            await navigator.clipboard.writeText(texto);
            mostrarToast(`${etiqueta} copiado correctamente`);
        } catch {
            mostrarToast(`No se pudo copiar ${etiqueta.toLowerCase()}`);
        }
    };

    const actualizarDatoComprobante = (campo, valor) => {
        setDatosComprobante((prev) => ({
            ...prev,
            [campo]: valor,
        }));
    };

    const solicitarComprobante = () => {
        const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datosComprobante.correo.trim());

        if (comprobante === "boleta") {
            if (!/^\d{8}$/.test(datosComprobante.dni.trim())) {
                mostrarToast("Ingresa un DNI válido de 8 dígitos");
                return;
            }

            if (!datosComprobante.nombres.trim()) {
                mostrarToast("Ingresa nombres y apellidos");
                return;
            }
        } else {
            if (!/^\d{11}$/.test(datosComprobante.ruc.trim())) {
                mostrarToast("Ingresa un RUC válido de 11 dígitos");
                return;
            }

            if (!datosComprobante.razonSocial.trim()) {
                mostrarToast("Ingresa la razón social");
                return;
            }

            if (!datosComprobante.direccionFiscal.trim()) {
                mostrarToast("Ingresa la dirección fiscal");
                return;
            }
        }

        if (!correoValido) {
            mostrarToast("Ingresa un correo electrónico válido");
            return;
        }

        const mensaje =
            comprobante === "boleta"
                ? `Hola, deseo solicitar una BOLETA electrónica por mi compra o servicio con INGEDATA.

DNI: ${datosComprobante.dni.trim()}
Nombres y apellidos: ${datosComprobante.nombres.trim()}
Correo: ${datosComprobante.correo.trim()}

Por favor, confírmenme la emisión del comprobante.`
                : `Hola, deseo solicitar una FACTURA electrónica por mi compra o servicio con INGEDATA.

RUC: ${datosComprobante.ruc.trim()}
Razón social: ${datosComprobante.razonSocial.trim()}
Dirección fiscal: ${datosComprobante.direccionFiscal.trim()}
Correo: ${datosComprobante.correo.trim()}

Por favor, confírmenme la emisión del comprobante.`;

        window.open(
            `https://wa.me/${WHATSAPP_1}?text=${encodeURIComponent(mensaje)}`,
            "_blank",
            "noopener,noreferrer"
        );
    };

    return (
        <>
            <div className="topbar">
                <div className="wrap">
                    <div>
                        📞 {DATOS_EMPRESA.telefono1} / {DATOS_EMPRESA.telefono2}
                        <span className="dot">•</span> ✉️ {DATOS_EMPRESA.correo}
                    </div>
                    <div>
                        RUC {DATOS_EMPRESA.ruc} <span className="dot">•</span> Lun – Sáb ·
                        8:00 – 18:00
                    </div>
                </div>
            </div>

            <header>
                <div className="wrap head">
                    <a href="#inicio" className="logo">
                        <span className="mark">
                            <ImagenRecurso
                                imagenes={[
                                    img("logo ingedata.jpeg"),
                                    img("logo ingedata.jpg"),
                                    img("logo ingedata.png"),
                                ]}
                                alt="Logo INGEDATA"
                            />
                        </span>

                        <span className="txt">
                            <span className="name">
                                INGE<b>DATA</b>
                            </span>
                            <span className="sub">S . A . C .</span>
                        </span>
                    </a>

                    <nav className="mainnav">
                        <a href="#inicio">Inicio</a>
                        <a href="#nosotros">Nosotros</a>
                        <a href="#servicios">Servicios</a>
                        <a href="#tienda">Tienda</a>
                        <a href="#pagos">Pagos</a>
                        <a href="#contacto">Contacto</a>
                    </nav>

                    <div className="actions">
                        <button className="cart-btn" onClick={() => setCarritoAbierto(true)}>
                            🛒 Carrito <span className="badge">{cantidadTotal}</span>
                        </button>

                        <a
                            href={whatsappCotizacion}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-quote"
                        >
                            Cotizar ahora →
                        </a>
                    </div>
                </div>
            </header>

            <section className="hero" id="inicio">
                <div className="bgimg">
                    <ImagenRecurso
                        imagenes={[
                            img("catalogo empresarial.png"),
                            img("servicios.png"),
                            img("servicios2.png"),
                        ]}
                        alt="INGEDATA infraestructura tecnológica"
                    />
                </div>

                <div className="wrap">
                    <div>
                        <span className="eyebrow">Soluciones Integrales</span>

                        <h1>
                            Soluciones integrales en <em>telecomunicaciones, energía</em> e
                            infraestructura tecnológica
                        </h1>

                        <p>
                            Brindamos servicios de alta calidad en redes de datos, fibra óptica,
                            sistemas eléctricos, seguridad electrónica, climatización y más.
                            Soluciones confiables para impulsar tu negocio.
                        </p>

                        <div className="btns">
                            <a
                                href={whatsappCotizacion}
                                target="_blank"
                                rel="noreferrer"
                                className="btn-primary"
                            >
                                Solicitar cotización ✈
                            </a>

                            <a href="#servicios" className="btn-ghost">
                                Ver servicios ▸
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <div className="statstrip">
                <div className="wrap">
                    <div className="bar">
                        <div className="s">
                            <div className="ic">📈</div>
                            <div>
                                <div className="num">+50</div>
                                <small>Proyectos ejecutados</small>
                            </div>
                        </div>

                        <div className="s">
                            <div className="ic">🌎</div>
                            <div>
                                <div className="num">Cobertura</div>
                                <small>Nacional · todo el Perú</small>
                            </div>
                        </div>

                        <div className="s">
                            <div className="ic">🏅</div>
                            <div>
                                <div className="num">Equipos</div>
                                <small>Certificados FLUKE</small>
                            </div>
                        </div>

                        <div className="s">
                            <div className="ic">🏢</div>
                            <div>
                                <div className="num">Atención</div>
                                <small>Corporativa e industrial</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="about section" id="nosotros">
                <div className="wrap">
                    <div className="grid2">
                        <div className="photo">
                            <ImagenRecurso
                                imagenes={[
                                    img("servicios.png"),
                                    img("servicios2.png"),
                                    img("catalogo empresarial.png"),
                                ]}
                                alt="Equipo técnico INGEDATA"
                            />
                        </div>

                        <div>
                            <div className="ey">¿Quiénes somos?</div>
                            <h3>INGEDATA S.A.C.</h3>

                            <p>
                                Empresa peruana especializada en soluciones integrales de
                                infraestructura tecnológica, telecomunicaciones y sistemas
                                eléctricos.
                            </p>

                            <p>
                                Atendemos a empresas corporativas, campamentos mineros, plantas
                                industriales, instituciones y organizaciones de diversos sectores,
                                brindando soluciones confiables, seguras y eficientes.
                            </p>

                            <div className="pills">
                                <div className="pill">
                                    <span className="pic">🎓</span>
                                    <div>
                                        <b>Experiencia</b>
                                        <small>Profesionales capacitados</small>
                                    </div>
                                </div>

                                <div className="pill">
                                    <span className="pic">✅</span>
                                    <div>
                                        <b>Calidad</b>
                                        <small>Cumplimiento de estándares</small>
                                    </div>
                                </div>

                                <div className="pill">
                                    <span className="pic">🛡️</span>
                                    <div>
                                        <b>Seguridad</b>
                                        <small>Trabajos con altos estándares</small>
                                    </div>
                                </div>

                                <div className="pill">
                                    <span className="pic">🤝</span>
                                    <div>
                                        <b>Compromiso</b>
                                        <small>Con nuestros clientes</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="services section" id="servicios">
                <div className="wrap">
                    <div className="section-head">
                        <div className="ey">Servicios técnicos</div>
                        <h2>
                            Principales <b>servicios</b>
                        </h2>
                        <div className="uline"></div>
                        <p>
                            Ejecutamos proyectos de redes, electricidad, fibra óptica, energía,
                            CCTV y soporte técnico.
                        </p>
                    </div>

                    <div className="sv-grid">
                        <div className="sv-card">
                            <div className="ic">🌐</div>
                            <h4>Cableado estructurado</h4>
                            <p>
                                Instalación de puntos de red, patch panel, gabinete, face plate
                                y certificación.
                            </p>
                        </div>

                        <div className="sv-card">
                            <div className="ic">💡</div>
                            <h4>Fibra óptica</h4>
                            <p>
                                Instalación, empalme, medición y certificación de enlaces de
                                fibra óptica.
                            </p>
                        </div>

                        <div className="sv-card">
                            <div className="ic">⚡</div>
                            <h4>Sistemas eléctricos</h4>
                            <p>
                                Cableado eléctrico, tableros, tomacorrientes, tuberías EMT e
                                IMC.
                            </p>
                        </div>

                        <div className="sv-card">
                            <div className="ic">🔋</div>
                            <h4>UPS y energía</h4>
                            <p>
                                Instalación y mantenimiento de UPS, transformadores y grupos
                                electrógenos.
                            </p>
                        </div>

                        <div className="sv-card">
                            <div className="ic">🌍</div>
                            <h4>Pozo a tierra</h4>
                            <p>
                                Implementación, mantenimiento y medición de sistemas de puesta a
                                tierra.
                            </p>
                        </div>

                        <div className="sv-card">
                            <div className="ic">📹</div>
                            <h4>CCTV</h4>
                            <p>
                                Instalación y configuración de cámaras de vigilancia para
                                empresas.
                            </p>
                        </div>

                        <div className="sv-card">
                            <div className="ic">❄️</div>
                            <h4>Climatización</h4>
                            <p>
                                Instalación de equipos de aire acondicionado y soporte operativo.
                            </p>
                        </div>

                        <div className="sv-card">
                            <div className="ic">🪑</div>
                            <h4>Mobiliario</h4>
                            <p>
                                Fabricación e instalación de mobiliario en melamina para
                                oficinas.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="shop section" id="tienda">
                <div className="wrap">
                    <div className="section-head">
                        <div className="ey">Tienda en línea</div>
                        <h2>
                            Productos y <b>Servicios</b>
                        </h2>
                        <div className="uline"></div>
                        <p>
                            Catálogo de materiales, equipos y servicios técnicos de INGEDATA
                            S.A.C.
                        </p>
                    </div>

                    <div className="shop-top">
                        <div className="search">
                            <span className="mag">🔎</span>
                            <input
                                value={buscar}
                                onChange={(e) => setBuscar(e.target.value)}
                                placeholder="Buscar cable, UPS, jack, fibra, servicio..."
                            />
                        </div>

                        <select value={orden} onChange={(e) => setOrden(e.target.value)}>
                            <option value="default">Ordenar</option>
                            <option value="asc">Precio menor a mayor</option>
                            <option value="desc">Precio mayor a menor</option>
                            <option value="az">Nombre A-Z</option>
                        </select>
                    </div>

                    <div className="filters">
                        {categorias.map((cat) => (
                            <button
                                key={cat.value}
                                className={categoria === cat.value ? "active" : ""}
                                onClick={() => setCategoria(cat.value)}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    <div className="count">
                        {cargandoProductos
                            ? "Cargando productos..."
                            : `${lista.length} producto${lista.length !== 1 ? "s" : ""}`}
                    </div>

                    {cargandoProductos ? (
                        <div className="loading-products">
                            Cargando productos desde la base de datos...
                        </div>
                    ) : errorProductos ? (
                        <div className="loading-products error-products">
                            {errorProductos}
                            <br />
                            Verifica que el backend esté encendido en http://localhost:3000/productos
                        </div>
                    ) : (
                        <div className="grid">
                            {lista.map((p) => {
                                const requiereCotizacion = p.tag === "Cotizar";

                                return (
                                    <article className="card in" key={p.id}>
                                        <div className="media">
                                            <ImagenRecurso imagenes={obtenerImagenesProducto(p)} alt={p.nombre} />

                                            <div className="chips">
                                                {p.tag && (
                                                    <span
                                                        className={`chip ${p.tag === "Servicio" ||
                                                                p.tag === "Cotizar"
                                                                ? "svc"
                                                                : p.tag === "Kit"
                                                                    ? "green"
                                                                    : "gold"
                                                            }`}
                                                    >
                                                        {p.tag}
                                                    </span>
                                                )}
                                            </div>

                                            <button
                                                className={`fav ${favoritos[p.id] ? "on" : ""}`}
                                                onClick={() => toggleFavorito(p.id)}
                                            >
                                                {favoritos[p.id] ? "♥" : "♡"}
                                            </button>

                                            {requiereCotizacion ? (
                                                <button
                                                    className="quick quote-product"
                                                    onClick={() => cotizarProducto(p)}
                                                >
                                                    Solicitar cotización
                                                </button>
                                            ) : (
                                                <button
                                                    className="quick"
                                                    onClick={() => agregar(p.id)}
                                                >
                                                    Agregar al carrito
                                                </button>
                                            )}
                                        </div>

                                        <div className="body">
                                            <span className="brand">{p.brand}</span>
                                            <h3>{p.nombre}</h3>

                                            <div className="rate">
                                                <span className="stars">★★★★★</span>{" "}
                                                {Number(p.rate || 0).toFixed(1)}{" "}
                                                <span>({p.rev || 0})</span>
                                            </div>

                                            <div className="priceRow">
                                                {requiereCotizacion ? (
                                                    <>
                                                        <span className="price quote-price">
                                                            Precio a cotizar
                                                        </span>

                                                        <button
                                                            className="add quote-add"
                                                            onClick={() => cotizarProducto(p)}
                                                            title="Solicitar cotización por WhatsApp"
                                                        >
                                                            💬
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="price">
                                                            S/ {Number(p.precio || 0).toFixed(2)}{" "}
                                                            <small>+IGV</small>
                                                        </span>

                                                        <button
                                                            className="add"
                                                            onClick={() => agregar(p.id)}
                                                        >
                                                            +
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            <section className="why section">
                <div className="wrap">
                    <div className="section-head">
                        <div className="ey">Por qué elegirnos</div>
                        <h2>Calidad, seguridad y confianza</h2>
                        <div className="uline"></div>
                        <p>
                            Trabajamos con enfoque técnico, cumplimiento, orden y compromiso
                            con cada cliente.
                        </p>
                    </div>

                    <div className="why-grid">
                        <div className="why-card">
                            <div className="ic">🛡️</div>
                            <b>Seguridad</b>
                            <small>Procedimientos seguros y responsables.</small>
                        </div>

                        <div className="why-card">
                            <div className="ic">✅</div>
                            <b>Calidad</b>
                            <small>Soluciones alineadas a estándares técnicos.</small>
                        </div>

                        <div className="why-card">
                            <div className="ic">⚙️</div>
                            <b>Equipamiento</b>
                            <small>Herramientas para diagnóstico y certificación.</small>
                        </div>

                        <div className="why-card">
                            <div className="ic">🤝</div>
                            <b>Confianza</b>
                            <small>Atención cercana y profesional.</small>
                        </div>

                        <div className="why-card">
                            <div className="ic">🚀</div>
                            <b>Innovación</b>
                            <small>Soluciones tecnológicas eficientes.</small>
                        </div>
                    </div>
                </div>
            </section>

            <section className="payments section" id="pagos">
                <div className="wrap">
                    <div className="section-head payment-main-head">
                        <div className="ey">Método de pago</div>
                        <h2>
                            Transferencia <b>bancaria segura</b>
                        </h2>
                        <div className="uline"></div>
                        <p>
                            Realiza tu pago directamente a la cuenta empresarial de INGEDATA S.A.C.
                            Verifica los datos antes de transferir y conserva tu constancia de pago.
                        </p>
                    </div>

                    <div className="bank-payment-layout">
                        <div className="bank-card-interactive">
                            <div className="bank-card-top">
                                <div>
                                    <span className="bank-label">BANCO</span>
                                    <h3>{DATOS_BANCARIOS.banco}</h3>
                                </div>
                                <div className="bank-currency">
                                    <span>S/</span>
                                    <small>{DATOS_BANCARIOS.moneda}</small>
                                </div>
                            </div>

                            <div className="bank-owner">
                                <span>Titular</span>
                                <strong>{DATOS_BANCARIOS.titular}</strong>
                                <small>RUC {DATOS_EMPRESA.ruc}</small>
                            </div>

                            <div className="bank-number-block">
                                <div className="bank-number-heading">
                                    <span>Número de cuenta</span>
                                    <button
                                        type="button"
                                        className="copy-mini"
                                        onClick={() =>
                                            copiarTexto(
                                                DATOS_BANCARIOS.numeroCuenta,
                                                "Número de cuenta"
                                            )
                                        }
                                    >
                                        📋 Copiar
                                    </button>
                                </div>
                                <strong className="bank-number">
                                    {DATOS_BANCARIOS.numeroCuenta}
                                </strong>
                            </div>

                            <div className="bank-number-block cci-block">
                                <div className="bank-number-heading">
                                    <span>CCI</span>
                                    <button
                                        type="button"
                                        className="copy-mini"
                                        onClick={() =>
                                            copiarTexto(DATOS_BANCARIOS.cci, "CCI")
                                        }
                                    >
                                        📋 Copiar
                                    </button>
                                </div>
                                <strong className="bank-number bank-number-small">
                                    {DATOS_BANCARIOS.cci}
                                </strong>
                            </div>

                            <div className="bank-meta">
                                <div>
                                    <span>Tipo de cuenta</span>
                                    <b>{DATOS_BANCARIOS.tipoCuenta}</b>
                                </div>
                                <div>
                                    <span>Moneda</span>
                                    <b>{DATOS_BANCARIOS.moneda}</b>
                                </div>
                            </div>
                        </div>

                        <div className="payment-actions-panel">
                            <div className="payment-status">
                                <span className="status-dot"></span>
                                <div>
                                    <b>Cuenta empresarial habilitada</b>
                                    <small>Datos proporcionados por INGEDATA S.A.C.</small>
                                </div>
                            </div>

                            <div className="payment-action-card">
                                <span className="action-icon">🏦</span>
                                <div>
                                    <h4>Transferencia Interbank</h4>
                                    <p>
                                        Usa el número de cuenta o CCI según el banco desde el que
                                        realizarás la transferencia.
                                    </p>
                                </div>
                            </div>

                            <div className="payment-action-card detraction-card">
                                <span className="action-icon">🧾</span>
                                <div>
                                    <h4>Cuenta de detracción</h4>
                                    <p>
                                        Para operaciones sujetas a detracción utiliza únicamente esta
                                        cuenta cuando corresponda.
                                    </p>
                                    <div className="detraction-number-row">
                                        <strong>{DATOS_BANCARIOS.cuentaDetraccion}</strong>
                                        <button
                                            type="button"
                                            className="copy-mini copy-light"
                                            onClick={() =>
                                                copiarTexto(
                                                    DATOS_BANCARIOS.cuentaDetraccion,
                                                    "Cuenta de detracción"
                                                )
                                            }
                                        >
                                            📋 Copiar
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <a
                                className="payment-whatsapp-btn"
                                href={`https://wa.me/${WHATSAPP_1}?text=${encodeURIComponent(
                                    `Hola, ya realicé una transferencia a nombre de ${DATOS_BANCARIOS.titular} y deseo enviar mi constancia de pago.`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                💬 Enviar constancia por WhatsApp
                            </a>

                            <p className="payment-warning">
                                🔒 Antes de transferir, verifica que el titular mostrado por tu banco
                                corresponda a <b>{DATOS_BANCARIOS.titular}</b>.
                            </p>
                        </div>
                    </div>

                    <div className="comprobante-section">
                        <div className="section-head comprobante-head">
                            <div className="ey">Comprobante de pago</div>
                            <h2>
                                Tramita tu <b>boleta o factura</b>
                            </h2>
                            <div className="uline"></div>
                            <p>
                                Elige el comprobante, completa tus datos y envía la solicitud por
                                WhatsApp. Revisaremos la información antes de la emisión.
                            </p>
                        </div>

                        <div className="receipt-steps">
                            <div className="receipt-step active-step">
                                <span>1</span>
                                <div>
                                    <b>Elige</b>
                                    <small>Boleta o factura</small>
                                </div>
                            </div>
                            <div className="receipt-step">
                                <span>2</span>
                                <div>
                                    <b>Completa</b>
                                    <small>Tus datos fiscales</small>
                                </div>
                            </div>
                            <div className="receipt-step">
                                <span>3</span>
                                <div>
                                    <b>Solicita</b>
                                    <small>Envíalo por WhatsApp</small>
                                </div>
                            </div>
                        </div>

                        <div className="receipt-type-grid">
                            <button
                                type="button"
                                className={`receipt-type-card ${comprobante === "boleta" ? "active" : ""
                                    }`}
                                onClick={() => setComprobante("boleta")}
                            >
                                <span className="receipt-type-icon">🧾</span>
                                <span>
                                    <b>Boleta electrónica</b>
                                    <small>Para persona natural · requiere DNI</small>
                                </span>
                                <span className="receipt-check">
                                    {comprobante === "boleta" ? "✓" : "○"}
                                </span>
                            </button>

                            <button
                                type="button"
                                className={`receipt-type-card ${comprobante === "factura" ? "active" : ""
                                    }`}
                                onClick={() => setComprobante("factura")}
                            >
                                <span className="receipt-type-icon">📄</span>
                                <span>
                                    <b>Factura electrónica</b>
                                    <small>Para empresa o negocio · requiere RUC</small>
                                </span>
                                <span className="receipt-check">
                                    {comprobante === "factura" ? "✓" : "○"}
                                </span>
                            </button>
                        </div>

                        <div className="receipt-workspace">
                            <div className="comprobante-form interactive-form">
                                <div className="form-title-row">
                                    <div>
                                        <span className="form-kicker">
                                            {comprobante === "boleta"
                                                ? "DATOS PARA BOLETA"
                                                : "DATOS PARA FACTURA"}
                                        </span>
                                        <h3>
                                            {comprobante === "boleta"
                                                ? "Información del cliente"
                                                : "Información de la empresa"}
                                        </h3>
                                    </div>
                                    <span className="required-note">* Campos obligatorios</span>
                                </div>

                                {comprobante === "boleta" ? (
                                    <>
                                        <div className="form-group">
                                            <label htmlFor="comprobante-dni">
                                                DNI <span>*</span>
                                            </label>
                                            <div className="input-with-icon">
                                                <span>🪪</span>
                                                <input
                                                    id="comprobante-dni"
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={8}
                                                    placeholder="8 dígitos"
                                                    value={datosComprobante.dni}
                                                    onChange={(e) =>
                                                        actualizarDatoComprobante(
                                                            "dni",
                                                            e.target.value.replace(/\D/g, "")
                                                        )
                                                    }
                                                />
                                            </div>
                                            <small
                                                className={
                                                    datosComprobante.dni.length === 8
                                                        ? "field-ok"
                                                        : "field-hint"
                                                }
                                            >
                                                {datosComprobante.dni.length === 8
                                                    ? "✓ DNI con 8 dígitos"
                                                    : `${datosComprobante.dni.length}/8 dígitos`}
                                            </small>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="comprobante-nombres">
                                                Nombres y apellidos <span>*</span>
                                            </label>
                                            <div className="input-with-icon">
                                                <span>👤</span>
                                                <input
                                                    id="comprobante-nombres"
                                                    type="text"
                                                    placeholder="Nombre completo"
                                                    value={datosComprobante.nombres}
                                                    onChange={(e) =>
                                                        actualizarDatoComprobante(
                                                            "nombres",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="form-group">
                                            <label htmlFor="comprobante-ruc">
                                                RUC <span>*</span>
                                            </label>
                                            <div className="input-with-icon">
                                                <span>🏢</span>
                                                <input
                                                    id="comprobante-ruc"
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={11}
                                                    placeholder="11 dígitos"
                                                    value={datosComprobante.ruc}
                                                    onChange={(e) =>
                                                        actualizarDatoComprobante(
                                                            "ruc",
                                                            e.target.value.replace(/\D/g, "")
                                                        )
                                                    }
                                                />
                                            </div>
                                            <small
                                                className={
                                                    datosComprobante.ruc.length === 11
                                                        ? "field-ok"
                                                        : "field-hint"
                                                }
                                            >
                                                {datosComprobante.ruc.length === 11
                                                    ? "✓ RUC con 11 dígitos"
                                                    : `${datosComprobante.ruc.length}/11 dígitos`}
                                            </small>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="comprobante-razon">
                                                Razón social <span>*</span>
                                            </label>
                                            <div className="input-with-icon">
                                                <span>🏷️</span>
                                                <input
                                                    id="comprobante-razon"
                                                    type="text"
                                                    placeholder="Razón social de la empresa"
                                                    value={datosComprobante.razonSocial}
                                                    onChange={(e) =>
                                                        actualizarDatoComprobante(
                                                            "razonSocial",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group form-group-full">
                                            <label htmlFor="comprobante-direccion">
                                                Dirección fiscal <span>*</span>
                                            </label>
                                            <div className="input-with-icon">
                                                <span>📍</span>
                                                <input
                                                    id="comprobante-direccion"
                                                    type="text"
                                                    placeholder="Dirección fiscal registrada"
                                                    value={datosComprobante.direccionFiscal}
                                                    onChange={(e) =>
                                                        actualizarDatoComprobante(
                                                            "direccionFiscal",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="form-group form-group-full">
                                    <label htmlFor="comprobante-correo">
                                        Correo electrónico <span>*</span>
                                    </label>
                                    <div className="input-with-icon">
                                        <span>✉️</span>
                                        <input
                                            id="comprobante-correo"
                                            type="email"
                                            placeholder={
                                                comprobante === "boleta"
                                                    ? "correo@ejemplo.com"
                                                    : "facturacion@empresa.com"
                                            }
                                            value={datosComprobante.correo}
                                            onChange={(e) =>
                                                actualizarDatoComprobante(
                                                    "correo",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <small className="field-hint">
                                        El comprobante será enviado al correo indicado.
                                    </small>
                                </div>

                                <button
                                    type="button"
                                    className="btn-comprobante interactive-submit"
                                    onClick={solicitarComprobante}
                                >
                                    <span>💬</span>
                                    <span>
                                        Solicitar{" "}
                                        {comprobante === "boleta"
                                            ? "boleta electrónica"
                                            : "factura electrónica"}
                                    </span>
                                    <span>→</span>
                                </button>
                            </div>

                            <aside className="receipt-summary">
                                <div className="receipt-summary-icon">
                                    {comprobante === "boleta" ? "🧾" : "📄"}
                                </div>
                                <span className="summary-kicker">RESUMEN</span>
                                <h3>
                                    {comprobante === "boleta"
                                        ? "Boleta electrónica"
                                        : "Factura electrónica"}
                                </h3>

                                <div className="summary-list">
                                    {comprobante === "boleta" ? (
                                        <>
                                            <div>
                                                <span>DNI</span>
                                                <b>
                                                    {datosComprobante.dni || "Pendiente"}
                                                </b>
                                            </div>
                                            <div>
                                                <span>Cliente</span>
                                                <b>
                                                    {datosComprobante.nombres ||
                                                        "Pendiente"}
                                                </b>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                <span>RUC</span>
                                                <b>
                                                    {datosComprobante.ruc || "Pendiente"}
                                                </b>
                                            </div>
                                            <div>
                                                <span>Razón social</span>
                                                <b>
                                                    {datosComprobante.razonSocial ||
                                                        "Pendiente"}
                                                </b>
                                            </div>
                                        </>
                                    )}
                                    <div>
                                        <span>Correo</span>
                                        <b>{datosComprobante.correo || "Pendiente"}</b>
                                    </div>
                                </div>

                                <div className="summary-security">
                                    <span>✓</span>
                                    <p>
                                        Tus datos se enviarán directamente al WhatsApp de
                                        INGEDATA para su revisión.
                                    </p>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </section>

            <section className="contact section" id="contacto">
                <div className="wrap">
                    <div className="cta-band">
                        <div className="txt">
                            <h3>¿Necesitas una cotización?</h3>
                            <p>Comunícate con nosotros y recibe atención para tu proyecto.</p>
                            <p>
                                WhatsApp: {DATOS_EMPRESA.telefono1} /{" "}
                                {DATOS_EMPRESA.telefono2}
                            </p>
                        </div>

                        <a
                            className="btn-white"
                            href={whatsappCotizacion}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Escribir por WhatsApp →
                        </a>
                    </div>
                </div>
            </section>

            <footer>
                <div className="wrap fwrap">
                    <div>
                        <a href="#inicio" className="logo">
                            <span className="mark">
                                <ImagenRecurso
                                    imagenes={[
                                        img("logo ingedata.jpeg"),
                                        img("logo ingedata.jpg"),
                                        img("logo ingedata.png"),
                                    ]}
                                    alt="Logo INGEDATA"
                                />
                            </span>

                            <span className="txt">
                                <span className="name">
                                    INGE<b>DATA</b>
                                </span>
                                <span className="sub">S . A . C .</span>
                            </span>
                        </a>

                        <p>
                            Soluciones integrales en telecomunicaciones, energía, tecnología e
                            infraestructura.
                        </p>
                    </div>

                    <div>
                        <h4>Menú</h4>
                        <ul>
                            <li>
                                <a href="#nosotros">Nosotros</a>
                            </li>
                            <li>
                                <a href="#servicios">Servicios</a>
                            </li>
                            <li>
                                <a href="#tienda">Tienda</a>
                            </li>
                            <li>
                                <a href="#pagos">Pagos</a>
                            </li>
                        </ul>
                    </div>

                    <div className="fcontact">
                        <h4>Contacto</h4>
                        <p>
                            📞 {DATOS_EMPRESA.telefono1} / {DATOS_EMPRESA.telefono2}
                        </p>
                        <p>✉️ {DATOS_EMPRESA.correo}</p>
                        <p>🧾 RUC {DATOS_EMPRESA.ruc}</p>
                    </div>

                    <div>
                        <h4>Atención</h4>
                        <p>Lunes a sábado</p>
                        <p>8:00 a.m. - 6:00 p.m.</p>
                    </div>
                </div>

                <div className="wrap copyr">
                    <span>© 2026 INGEDATA S.A.C. Todos los derechos reservados.</span>
                    <span>Portal empresarial y e-commerce.</span>
                </div>
            </footer>

            <button
                className="fab"
                onClick={() => window.open(whatsappGeneral, "_blank")}
            >
                💬
            </button>

            <div
                className={`overlay ${carritoAbierto ? "show" : ""}`}
                onClick={() => setCarritoAbierto(false)}
            ></div>

            <aside className={`drawer ${carritoAbierto ? "show" : ""}`}>
                <div className="dh">
                    <h3>🛒 Carrito</h3>

                    <button className="close" onClick={() => setCarritoAbierto(false)}>
                        ×
                    </button>
                </div>

                <div className="items">
                    {itemsCarrito.length === 0 ? (
                        <div className="empty">
                            <span className="e">🛒</span>
                            <p>Tu carrito está vacío.</p>
                            <button onClick={() => setCarritoAbierto(false)}>
                                Seguir viendo
                            </button>
                        </div>
                    ) : (
                        itemsCarrito.map((item) => (
                            <div className="ci" key={item.id}>
                                <ImagenRecurso imagenes={obtenerImagenesProducto(item)} alt={item.nombre} />

                                <div className="info">
                                    <h4>{item.nombre}</h4>
                                    <div className="p">
                                        S/ {Number(item.precio || 0).toFixed(2)}
                                    </div>

                                    <div className="qty">
                                        <button onClick={() => cambiarCantidad(item.id, -1)}>
                                            -
                                        </button>

                                        <span>{item.cantidad}</span>

                                        <button onClick={() => cambiarCantidad(item.id, 1)}>
                                            +
                                        </button>
                                    </div>
                                </div>

                                <button className="rm" onClick={() => quitar(item.id)}>
                                    ✕
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="foot">
                    <div className="row">
                        <span>Subtotal</span>
                        <b>S/ {subtotal.toFixed(2)}</b>
                    </div>

                    <div className="row">
                        <span>IGV 18%</span>
                        <b>S/ {igv.toFixed(2)}</b>
                    </div>

                    <div className="row total">
                        <span>Total</span>
                        <b>S/ {total.toFixed(2)}</b>
                    </div>

                    <a
                        className="checkout"
                        href={whatsappCotizacion}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Solicitar cotización
                    </a>
                </div>
            </aside>

            <div className={`toast ${toast ? "show" : ""}`}>
                <span className="tic">✓</span> {toast}
            </div>
        </>
    );
}

export default App;