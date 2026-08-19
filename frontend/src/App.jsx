import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_BASE_URL = "http://localhost:3000";

const API_PRODUCTOS = `${API_BASE_URL}/productos`;
const API_SOLICITUDES_PROFORMA = `${API_BASE_URL}/solicitudes-proforma`;
const API_ADMIN_LOGIN = `${API_BASE_URL}/admin/login`;
const API_ADMIN_COTIZACIONES = `${API_BASE_URL}/admin/cotizaciones`;
const API_ADMIN_PEDIDOS = `${API_BASE_URL}/admin/pedidos`;

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

const FALLBACK_LOGO = "/imagenes/logo-ingedata-nuevo.jpeg";

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
    const brand = normalizarTexto(producto?.brand || producto?.marca || "");

    const archivo = (...nombres) => nombres.map((nombreArchivo) => img(nombreArchivo));

    // =========================================================
    // CABLEADO ESTRUCTURADO
    // =========================================================

    if (nombre.includes("cable utp") && nombre.includes("cat 6a") && nombre.includes("panduit")) {
        return archivo("cable utp 6a panduit.jpg");
    }

    if (nombre.includes("cable utp") && nombre.includes("cat 6a") && nombre.includes("commscope")) {
        return archivo("cable utp 6a commscope.jpg");
    }

    if (nombre.includes("cable utp") && nombre.includes("cat 6") && nombre.includes("panduit")) {
        return archivo("cable utp 6 panduit.jpg");
    }

    if (nombre.includes("cable utp") && nombre.includes("cat 6") && nombre.includes("commscope")) {
        return archivo("cable utp 6 commscope.jpg");
    }

    // Respaldo por marca por si el nombre del producto cambia ligeramente.
    if (nombre.includes("cable utp") && nombre.includes("6a") && brand.includes("panduit")) {
        return archivo("cable utp 6a panduit.jpg");
    }

    if (nombre.includes("cable utp") && nombre.includes("6a") && brand.includes("commscope")) {
        return archivo("cable utp 6a commscope.jpg");
    }

    if (nombre.includes("cable utp") && brand.includes("panduit")) {
        return archivo("cable utp 6 panduit.jpg");
    }

    if (nombre.includes("cable utp") && brand.includes("commscope")) {
        return archivo("cable utp 6 commscope.jpg");
    }

    if (nombre.includes("jack") && nombre.includes("cat 6a")) {
        return archivo("jack 6a.jpg");
    }

    if (nombre.includes("jack") && nombre.includes("cat 6")) {
        return archivo("jack 6.jpg");
    }

    if (nombre.includes("face plate") || nombre.includes("faceplate")) {
        return archivo("face plate.jpg");
    }

    if (nombre.includes("tapa ciega")) {
        return archivo("tapa ciega data.jpg");
    }

    if (nombre.includes("patch panel") || nombre.includes("patch-panel")) {
        return archivo("Patch-Panel 24 partes.jpg");
    }

    if (
        (nombre.includes("patch cord") || nombre.includes("patchcord")) &&
        !nombre.includes("fibra")
    ) {
        return archivo("pashcord.jpg");
    }

    if (nombre.includes("gabinete rack") && nombre.includes("12u")) {
        return archivo("Gabinete rack 19 pulgadas 12U de pared.jpg");
    }

    // =========================================================
    // FIBRA ÓPTICA
    // =========================================================

    if (nombre.includes("fibra optica monomodo")) {
        return archivo("Fibra óptica monomodo 12 hilos por metro.png");
    }

    if (nombre.includes("fibra optica multimodo")) {
        // Imagen referencial mientras no exista una imagen exclusiva de multimodo.
        return archivo("Fibra óptica monomodo 12 hilos por metro.png");
    }

    if (nombre.includes("bandeja") && nombre.includes("empalme")) {
        return archivo("bandeja de empalme 24 puertos.jpg");
    }

    if (
        nombre.includes("patch cord") &&
        nombre.includes("fibra") &&
        nombre.includes("lc")
    ) {
        return archivo("Patch cord fibra LC-LC dúplex 3 m.jpg");
    }

    if (nombre.includes("pigtail") && nombre.includes("om3")) {
        return archivo("Pigtail LC OM3 pack x12.jpg");
    }

    if (nombre.includes("certificacion") && nombre.includes("fluke")) {
        return archivo("Certificación de cableado con FLUKE DSX-5000 por punto.jpg");
    }

    // =========================================================
    // CABLES ELÉCTRICOS NH-90
    // =========================================================

    if (nombre.includes("nh-90")) {
        const matchCalibre = nombre.match(/(\d+(?:\.\d+)?)\s*mm/);
        const calibre = matchCalibre?.[1] || "";

        if (calibre === "35") {
            return archivo("35mm nh-90 indeco.jpg");
        }

        if (calibre === "25") {
            return archivo("25mm nh-90 indeco.jpg");
        }

        if (calibre === "16") {
            return archivo("16 NH-90mm indeco.jpg");
        }

        if (calibre === "10") {
            return archivo("cable electrico 10mm.jpg");
        }

        if (calibre === "6") {
            return archivo("cable electrico indeco.jpg");
        }

        if (calibre === "4") {
            return archivo("cable electrico blanco indeco.jpg");
        }

        if (calibre === "2.5") {
            return archivo("cable electrico amarillo indeco.jpg");
        }
    }

    // =========================================================
    // CABLES ELÉCTRICOS N2XOH
    // =========================================================

    if (nombre.includes("n2xoh")) {
        const matchCalibre = nombre.match(/(\d+(?:\.\d+)?)\s*mm/);
        const calibre = matchCalibre?.[1] || "";

        if (calibre === "35") {
            return archivo(
                "35 N2XOHmm indeco.jpg",
                "16mm N2XOH indeco.jpg"
            );
        }

        if (calibre === "25") {
            return archivo(
                "25 N2XOH mm indeco.jpg",
                "16mm N2XOH indeco.jpg"
            );
        }

        // Para 4, 6, 10 y 16 se usa una foto referencial N2XOH
        // que existe físicamente en public/imagenes.
        return archivo("16mm N2XOH indeco.jpg");
    }

    // =========================================================
    // OTROS CABLES / PRODUCTOS ELÉCTRICOS
    // =========================================================

    if (nombre.includes("cable electrico amarillo")) {
        return archivo("cable electrico amarillo indeco.jpg");
    }

    if (nombre.includes("cable electrico blanco")) {
        return archivo("cable electrico blanco indeco.jpg");
    }

    if (nombre.includes("cable electrico indeco")) {
        return archivo("cable electrico indeco.jpg");
    }

    if (nombre.includes("schuko")) {
        return archivo("toma schuko.jpg");
    }

    if (nombre.includes("industrial") && nombre.includes("32a")) {
        return archivo("Tomacorriente industrial 32A.jpg");
    }

    if (nombre.includes("tomas comerciales")) {
        return archivo("tomas comerciales.jpg");
    }

    if (nombre.includes("tomas estabilizadas")) {
        return archivo("tomas estabilizadas.jpg");
    }

    if (nombre.includes("interruptor termomagnetico")) {
        return archivo("Interruptor termomagnético 2x32A.jpg");
    }

    if (nombre.includes("tablero de distribucion")) {
        return archivo("Tablero de distribución 12 polos.png");
    }

    if (nombre.includes("tuberia emt")) {
        return archivo("Tubería EMT.jpg");
    }

    if (nombre.includes("pozo a tierra") && nombre.includes("kit")) {
        return archivo("Kit pozo a tierra varilla + dosis química.png");
    }

    if (nombre.includes("instalacion") && nombre.includes("pozo a tierra")) {
        return archivo("Instalación de pozo a tierra incluye medición.jpg");
    }

    // =========================================================
    // ENERGÍA
    // =========================================================

    if (nombre.includes("ups apc") && nombre.includes("1500va")) {
        return archivo("UPS APC 1500VA línea interactiva.jpg");
    }

    if (
        (nombre.includes("ups on-line") || nombre.includes("ups online")) &&
        nombre.includes("3000va")
    ) {
        return archivo("UPS On-line 3000VA rack.jpg");
    }

    if (nombre.includes("banco de baterias")) {
        return archivo("Banco de baterías externo para UPS.jpg");
    }

    if (nombre.includes("grupo electrogeno")) {
        return archivo("Grupo electrógeno 6.5 kW a gasolina.jpg");
    }

    if (nombre.includes("transformador de aislamiento")) {
        return archivo("Transformador de aislamiento 5 kVA.jpg");
    }

    if (nombre.includes("mantenimiento") && nombre.includes("ups")) {
        return archivo("Mantenimiento preventivo de UPS.png");
    }

    // =========================================================
    // MELAMINA
    // =========================================================

    if (
        nombre.includes("escritorio") ||
        (nombre.includes("estacion") && nombre.includes("trabajo"))
    ) {
        return archivo("escritorio melamina.webp");
    }

    if (
        nombre.includes("muebles de oficina") ||
        nombre.includes("fabricacion de mobiliario")
    ) {
        return archivo("Fabricación de mobiliario en melamina por m².png");
    }

    if (nombre.includes("gabinete") && nombre.includes("almacenamiento")) {
        return archivo("gabinetes de almacenamiento melamine.png");
    }

    if (nombre.includes("recepcion")) {
        return archivo("muebles de recepcion melamine.jpg");
    }

    if (nombre.includes("kitchenette") || nombre.includes("mueble de cocina")) {
        return archivo("mueble de cocina melamine.jpg");
    }

    if (nombre.includes("mobiliario personalizado")) {
        return archivo("mobiliario personalizado melamine.jpg");
    }

    // =========================================================
    // ESTRUCTURAS METÁLICAS
    // =========================================================

    if (nombre.includes("cobertura") && nombre.includes("metalica")) {
        return archivo("coberturas metalicas.jpg");
    }

    if (nombre.includes("escalera") && nombre.includes("metalica")) {
        return archivo("escaleras metalicas.jpg");
    }

    if (nombre.includes("baranda") && nombre.includes("metalica")) {
        return archivo("barandas metalicas.jpg");
    }

    if (nombre.includes("mesa") && nombre.includes("metalica")) {
        return archivo("mesas metalicas.jpg");
    }

    if (nombre.includes("estructura") && nombre.includes("metalica")) {
        return archivo("estructuras metalicas personalizadas.jpg");
    }

    // =========================================================
    // SERVICIOS
    // =========================================================

    if (nombre.includes("fibra optica") && nombre.includes("planta interna")) {
        return archivo("cableado fibra optica parte interna.png");
    }

    if (nombre.includes("fibra optica") && nombre.includes("planta externa")) {
        // En tu carpeta existe una versión con espacio antes de ".png".
        // Dejamos también una segunda ruta por compatibilidad.
        return archivo(
            "cableado fibra optica parte externa .png",
            "cableado fibra optica parte externa.png"
        );
    }

    if (nombre.includes("cctv")) {
        return archivo("Instalación y configuración de CCTV por cámara.jpg");
    }

    // =========================================================
    // RESPALDO DEL BACKEND
    // =========================================================

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

function ImagenRecurso({ imagenes, alt, className, style }) {
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
            style={style}
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
    const esRutaAdmin = window.location.pathname.startsWith("/admin");

    // Navegación interna robusta para la web pública.
    // Evita recargas/pantallas en blanco al navegar a #inicio, #tienda, etc.
    useEffect(() => {
        if (esRutaAdmin) return;

        const navegarASeccion = (id, actualizarUrl = true) => {
            const destino = document.getElementById(id);
            if (!destino) return;

            if (actualizarUrl) {
                window.history.replaceState(null, "", `#${id}`);
            }

            requestAnimationFrame(() => {
                destino.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        };

        const manejarClick = (event) => {
            const enlace = event.target.closest('a[href^="#"]');
            if (!enlace) return;

            const href = enlace.getAttribute("href");
            if (!href || href === "#") return;

            const id = decodeURIComponent(href.slice(1));
            if (!document.getElementById(id)) return;

            event.preventDefault();
            navegarASeccion(id);
        };

        document.addEventListener("click", manejarClick);

        const hashInicial = window.location.hash.replace(/^#/, "");
        if (hashInicial) {
            setTimeout(() => navegarASeccion(decodeURIComponent(hashInicial), false), 100);
        }

        return () => document.removeEventListener("click", manejarClick);
    }, [esRutaAdmin]);

    const [adminCorreo, setAdminCorreo] = useState("");
    const [adminPassword, setAdminPassword] = useState("");

    const [adminToken, setAdminToken] = useState(
        localStorage.getItem("ingedata_admin_token") || ""
    );

    const [adminUsuario, setAdminUsuario] = useState(null);
    const [adminError, setAdminError] = useState("");
    const [adminCargando, setAdminCargando] = useState(false);
    const [adminCotizaciones, setAdminCotizaciones] = useState([]);
    const [adminCotizacionesCargando, setAdminCotizacionesCargando] = useState(false);
    const [adminCotizacionesError, setAdminCotizacionesError] = useState("");
    const [adminCotizacionSeleccionada, setAdminCotizacionSeleccionada] = useState(null);
    const [adminSeccion, setAdminSeccion] = useState("dashboard");

    const [adminPedidos, setAdminPedidos] = useState([]);
    const [adminPedidosCargando, setAdminPedidosCargando] = useState(false);
    const [adminPedidosError, setAdminPedidosError] = useState("");
    const [adminPedidoSeleccionado, setAdminPedidoSeleccionado] = useState(null);
    const [adminPedidoDetalleCargando, setAdminPedidoDetalleCargando] = useState(false);
    const [adminPedidoMensaje, setAdminPedidoMensaje] = useState("");
    const [adminDetalleCargando, setAdminDetalleCargando] = useState(false);
    const [adminPrecios, setAdminPrecios] = useState({});
    const [adminGuardandoCotizacion, setAdminGuardandoCotizacion] = useState(false);
    const [adminCotizacionMensaje, setAdminCotizacionMensaje] = useState("");
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
        if (esRutaAdmin) {
            setCargandoProductos(false);
            return;
        }

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
    }, [esRutaAdmin]);

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

    const cantidadTotal = itemsCarrito.reduce(
        (acc, item) => acc + item.cantidad,
        0
    );

    const textoCotizacion =
        itemsCarrito.length === 0
            ? `Hola, deseo solicitar una proforma con INGEDATA.

Aún no he seleccionado productos. Por favor, deseo recibir información comercial.`
            : `Hola, deseo solicitar una PROFORMA con INGEDATA.

Productos / servicios seleccionados:

${itemsCarrito
                .map((item) => `- ${item.nombre} x ${item.cantidad}`)
                .join("\n")}

Por favor, indíqueme precios, disponibilidad, plazo de entrega y condiciones comerciales.`;

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
        mostrarToast("Producto agregado a la solicitud");
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
    const cargarCotizacionesAdmin = async (tokenActual = adminToken) => {
        if (!tokenActual) return;

        try {
            setAdminCotizacionesCargando(true);
            setAdminCotizacionesError("");

            const respuesta = await fetch(API_ADMIN_COTIZACIONES, {
                headers: {
                    Authorization: `Bearer ${tokenActual}`,
                },
            });

            const data = await respuesta.json();

            if (respuesta.status === 401 || respuesta.status === 403) {
                localStorage.removeItem("ingedata_admin_token");
                setAdminToken("");
                setAdminUsuario(null);
                setAdminCotizaciones([]);
                throw new Error(data.error || "Tu sesión expiró. Inicia sesión nuevamente.");
            }

            if (!respuesta.ok) {
                throw new Error(data.error || "No se pudieron cargar las cotizaciones");
            }

            setAdminCotizaciones(Array.isArray(data) ? data : []);
        } catch (error) {
            setAdminCotizacionesError(error.message);
        } finally {
            setAdminCotizacionesCargando(false);
        }
    };
    const cargarPedidosAdmin = async (tokenActual = adminToken) => {
        if (!tokenActual) return;

        try {
            setAdminPedidosCargando(true);
            setAdminPedidosError("");

            const respuesta = await fetch(
                API_ADMIN_PEDIDOS,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${tokenActual}`,
                    },
                }
            );

            const data = await respuesta.json();

            if (respuesta.status === 401 || respuesta.status === 403) {
                localStorage.removeItem("ingedata_admin_token");

                setAdminToken("");
                setAdminUsuario(null);
                setAdminPedidos([]);

                throw new Error(
                    data.error ||
                    "Tu sesión expiró. Inicia sesión nuevamente."
                );
            }

            if (!respuesta.ok) {
                throw new Error(
                    data.error ||
                    "No se pudieron cargar los pedidos."
                );
            }

            setAdminPedidos(
                Array.isArray(data) ? data : []
            );

        } catch (error) {
            console.error(
                "Error al cargar pedidos:",
                error
            );

            setAdminPedidosError(
                error.message ||
                "Error al cargar los pedidos."
            );

        } finally {
            setAdminPedidosCargando(false);
        }
    };

    const abrirDetallePedidoAdmin = async (id) => {
        if (!adminToken) return;
        try {
            setAdminDetalleCargando(true);
            setAdminPedidosError("");
            setAdminPedidoMensaje("");
            const respuesta = await fetch(`${API_ADMIN_PEDIDOS}/${id}`, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            const data = await respuesta.json();
            if (respuesta.status === 401 || respuesta.status === 403) {
                localStorage.removeItem("ingedata_admin_token");
                setAdminToken("");
                setAdminUsuario(null);
                throw new Error(data.error || "Tu sesión expiró. Inicia sesión nuevamente.");
            }
            if (!respuesta.ok) throw new Error(data.error || "No se pudo cargar el pedido.");
            setAdminPedidoSeleccionado(data);
        } catch (error) {
            setAdminPedidosError(error.message || "Error al cargar el pedido.");
        } finally {
            setAdminDetalleCargando(false);
        }
    };

    const cambiarEstadoPedidoAdmin = async (estado) => {
        if (!adminToken || !adminPedidoSeleccionado?.id) return;
        try {
            setAdminGuardandoPedido(true);
            setAdminPedidoMensaje("");
            const respuesta = await fetch(`${API_ADMIN_PEDIDOS}/${adminPedidoSeleccionado.id}/estado`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminToken}`,
                },
                body: JSON.stringify({ estado }),
            });
            const data = await respuesta.json();
            if (respuesta.status === 401 || respuesta.status === 403) {
                localStorage.removeItem("ingedata_admin_token");
                setAdminToken("");
                setAdminUsuario(null);
                throw new Error(data.error || "Tu sesión expiró. Inicia sesión nuevamente.");
            }
            if (!respuesta.ok) throw new Error(data.error || "No se pudo actualizar el estado.");
            const pedidoActualizado = data.pedido || { ...adminPedidoSeleccionado, estado };
            setAdminPedidoSeleccionado((actual) => ({ ...actual, ...pedidoActualizado, estado: pedidoActualizado.estado || estado }));
            setAdminPedidoMensaje(data.mensaje || "Estado del pedido actualizado correctamente.");
            await cargarPedidosAdmin(adminToken);
        } catch (error) {
            setAdminPedidoMensaje(error.message || "Error al actualizar el pedido.");
        } finally {
            setAdminGuardandoPedido(false);
        }
    };

    const abrirDetalleCotizacionAdmin = async (id) => {
        if (!adminToken) return;

        try {
            setAdminDetalleCargando(true);
            setAdminError("");
            setAdminCotizacionMensaje("");

            const respuesta = await fetch(`${API_ADMIN_COTIZACIONES}/${id}`, {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            });

            const data = await respuesta.json();

            if (respuesta.status === 401 || respuesta.status === 403) {
                localStorage.removeItem("ingedata_admin_token");
                setAdminToken("");
                setAdminUsuario(null);
                setAdminCotizacionSeleccionada(null);
                throw new Error(data.error || "Tu sesión expiró. Inicia sesión nuevamente.");
            }

            if (!respuesta.ok) {
                throw new Error(data.error || "No se pudo cargar el detalle");
            }

            const preciosIniciales = {};

            (data.productos || []).forEach((producto) => {
                preciosIniciales[producto.id] =
                    producto.precio_unitario === null ||
                        producto.precio_unitario === undefined
                        ? ""
                        : String(producto.precio_unitario);
            });

            setAdminPrecios(preciosIniciales);
            setAdminCotizacionSeleccionada(data);
        } catch (error) {
            setAdminError(error.message);
        } finally {
            setAdminDetalleCargando(false);
        }
    };

    const cambiarPrecioAdmin = (detalleId, valor) => {
        const valorLimpio = String(valor)
            .replace(",", ".")
            .replace(/[^0-9.]/g, "");

        const partes = valorLimpio.split(".");
        const normalizado =
            partes.length > 2
                ? `${partes.shift()}.${partes.join("")}`
                : valorLimpio;

        setAdminPrecios((prev) => ({
            ...prev,
            [detalleId]: normalizado,
        }));

        setAdminCotizacionMensaje("");
    };

    const totalesAdmin = useMemo(() => {
        const productosCotizacion = adminCotizacionSeleccionada?.productos || [];

        if (productosCotizacion.length === 0) {
            return {
                subtotal: 0,
                igv: 0,
                total: 0,
                completo: false,
            };
        }

        let subtotal = 0;
        let completo = true;

        for (const producto of productosCotizacion) {
            const valorPrecio = adminPrecios[producto.id];
            const precio = Number(String(valorPrecio ?? "").replace(",", "."));
            const cantidad = Number(producto.cantidad || 0);

            if (
                valorPrecio === "" ||
                valorPrecio === null ||
                valorPrecio === undefined ||
                !Number.isFinite(precio) ||
                precio <= 0 ||
                !Number.isFinite(cantidad) ||
                cantidad <= 0
            ) {
                completo = false;
                continue;
            }

            subtotal += precio * cantidad;
        }

        subtotal = Number(subtotal.toFixed(2));
        const igv = Number((subtotal * 0.18).toFixed(2));
        const total = Number((subtotal + igv).toFixed(2));

        return {
            subtotal,
            igv,
            total,
            completo,
        };
    }, [adminCotizacionSeleccionada, adminPrecios]);

    const guardarCotizacionAdmin = async () => {
        if (!adminToken || !adminCotizacionSeleccionada) return;

        const productosCotizacion = adminCotizacionSeleccionada.productos || [];

        if (productosCotizacion.length === 0) {
            setAdminCotizacionMensaje("La cotización no contiene productos.");
            return;
        }

        const productosPayload = [];

        for (const producto of productosCotizacion) {
            const precio = Number(adminPrecios[producto.id]);

            if (!Number.isFinite(precio) || precio <= 0) {
                setAdminCotizacionMensaje(
                    `Ingresa un precio válido mayor a 0 para: ${producto.nombre}`
                );
                return;
            }

            productosPayload.push({
                detalle_id: producto.id,
                precio_unitario: Number(precio.toFixed(2)),
            });
        }

        try {
            setAdminGuardandoCotizacion(true);
            setAdminCotizacionMensaje("");

            const respuesta = await fetch(
                `${API_ADMIN_COTIZACIONES}/${adminCotizacionSeleccionada.id}/cotizar`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${adminToken}`,
                    },
                    body: JSON.stringify({
                        productos: productosPayload,
                    }),
                }
            );

            const data = await respuesta.json();

            if (respuesta.status === 401 || respuesta.status === 403) {
                localStorage.removeItem("ingedata_admin_token");
                setAdminToken("");
                setAdminUsuario(null);
                setAdminCotizacionSeleccionada(null);
                throw new Error(data.error || "Tu sesión expiró. Inicia sesión nuevamente.");
            }

            if (!respuesta.ok) {
                throw new Error(data.error || "No se pudo guardar la cotización");
            }

            await cargarCotizacionesAdmin(adminToken);
            await abrirDetalleCotizacionAdmin(adminCotizacionSeleccionada.id);
            setAdminCotizacionMensaje("Cotización guardada correctamente.");
        } catch (error) {
            setAdminCotizacionMensaje(error.message);
        } finally {
            setAdminGuardandoCotizacion(false);
        }
    };
    const cambiarEstadoCotizacionAdmin = async (nuevoEstado) => {
        if (!adminToken || !adminCotizacionSeleccionada) return;

        try {
            setAdminGuardandoCotizacion(true);
            setAdminCotizacionMensaje("");

            const respuesta = await fetch(
                `${API_ADMIN_COTIZACIONES}/${adminCotizacionSeleccionada.id}/estado`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${adminToken}`,
                    },
                    body: JSON.stringify({
                        estado: nuevoEstado,
                    }),
                }
            );

            const data = await respuesta.json();

            if (respuesta.status === 401 || respuesta.status === 403) {
                localStorage.removeItem("ingedata_admin_token");
                setAdminToken("");
                setAdminUsuario(null);
                setAdminCotizacionSeleccionada(null);

                throw new Error(
                    data.error || "Tu sesión expiró. Inicia sesión nuevamente."
                );
            }

            if (!respuesta.ok) {
                throw new Error(
                    data.error || "No se pudo actualizar el estado de la cotización"
                );
            }

            await cargarCotizacionesAdmin(adminToken);
            await abrirDetalleCotizacionAdmin(adminCotizacionSeleccionada.id);

            setAdminCotizacionMensaje(
                nuevoEstado === "APROBADA"
                    ? "Cotización aprobada correctamente."
                    : "Cotización rechazada correctamente."
            );
        } catch (error) {
            setAdminCotizacionMensaje(error.message);
        } finally {
            setAdminGuardandoCotizacion(false);
        }
    };

    const iniciarSesionAdmin = async (e) => {
        e.preventDefault();

        try {
            setAdminCargando(true);
            setAdminError("");

            const respuesta = await fetch(API_ADMIN_LOGIN, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    correo: adminCorreo.trim(),
                    password: adminPassword,
                }),
            });

            const data = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(data.error || "No se pudo iniciar sesión");
            }

            localStorage.setItem("ingedata_admin_token", data.token);
            setAdminToken(data.token);
            setAdminUsuario(data.administrador);
            setAdminPassword("");
            await cargarCotizacionesAdmin(data.token);
        } catch (error) {
            setAdminError(error.message);
        } finally {
            setAdminCargando(false);
        }
    };

    const cerrarSesionAdmin = () => {
        localStorage.removeItem("ingedata_admin_token");
        setAdminToken("");
        setAdminUsuario(null);
        setAdminCotizaciones([]);
        setAdminCotizacionSeleccionada(null);
        setAdminPrecios({});
        setAdminCotizacionMensaje("");
        setAdminError("");
        setAdminCotizacionesError("");
    };

    useEffect(() => {
        if (esRutaAdmin && adminToken) {
            cargarCotizacionesAdmin(adminToken);
            cargarPedidosAdmin(adminToken);
        }
    }, [esRutaAdmin, adminToken]);
    if (esRutaAdmin) {
        const pendientes = adminCotizaciones.filter(
            (c) => String(c.estado || "").toUpperCase() === "PENDIENTE"
        ).length;

        const personas = adminCotizaciones.filter(
            (c) => c.cliente?.tipo_cliente === "PERSONA"
        ).length;

        const empresas = adminCotizaciones.filter(
            (c) => c.cliente?.tipo_cliente === "EMPRESA"
        ).length;

        const cotizadas = adminCotizaciones.filter(
            (c) => String(c.estado || "").toUpperCase() === "COTIZADA"
        ).length;

        const aprobadas = adminCotizaciones.filter((c) => String(c.estado || "").toUpperCase() === "APROBADA").length;
        const rechazadas = adminCotizaciones.filter((c) => String(c.estado || "").toUpperCase() === "RECHAZADA").length;
        const pedidosPendientes = adminPedidos.filter((p) => String(p.estado || "").toUpperCase() === "PENDIENTE").length;
        const pedidosProceso = adminPedidos.filter((p) => String(p.estado || "").toUpperCase() === "EN_PROCESO").length;
        const pedidosCompletados = adminPedidos.filter((p) => String(p.estado || "").toUpperCase() === "COMPLETADO").length;
        const pedidosCancelados = adminPedidos.filter((p) => String(p.estado || "").toUpperCase() === "CANCELADO").length;

        const estilos = {
            pagina: { minHeight: "100vh", background: "#f4f7fb", color: "#10233f", fontFamily: "Arial, sans-serif" },
            loginPagina: { minHeight: "100vh", display: "grid", placeItems: "center", padding: "28px", background: "linear-gradient(135deg,#071a34 0%,#0c2d57 55%,#0e4f9d 100%)" },
            loginCard: { width: "min(440px, 100%)", background: "#fff", borderRadius: "24px", padding: "34px", boxShadow: "0 28px 70px rgba(0,0,0,.28)" },
            logoLogin: { width: "230px", maxWidth: "100%", height: "72px", objectFit: "contain", display: "block", margin: "0 auto 22px" },
            etiqueta: { display: "block", fontSize: "13px", fontWeight: 800, marginBottom: "7px", color: "#334155" },
            input: { width: "100%", boxSizing: "border-box", border: "1px solid #cbd5e1", borderRadius: "12px", padding: "13px 14px", fontSize: "15px", outline: "none" },
            botonAzul: { border: 0, borderRadius: "10px", padding: "10px 14px", fontWeight: 800, cursor: "pointer", background: "#1473e6", color: "#fff" },
            sidebar: { width: "250px", background: "#081d38", color: "#fff", minHeight: "100vh", padding: "24px 18px", boxSizing: "border-box" },
            contenido: { flex: 1, padding: "30px", minWidth: 0 },
            tarjeta: { background: "#fff", borderRadius: "16px", boxShadow: "0 8px 24px rgba(15,23,42,.07)", border: "1px solid #e7edf5" },
            stat: { background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 8px 24px rgba(15,23,42,.06)", border: "1px solid #e7edf5" },
            navItem: { display: "flex", gap: "10px", alignItems: "center", width: "100%", padding: "12px 13px", border: 0, borderRadius: "10px", background: "rgba(255,255,255,.08)", color: "#fff", fontWeight: 700, textAlign: "left", marginBottom: "8px", cursor: "pointer" },
            badge: { display: "inline-flex", padding: "5px 10px", borderRadius: "999px", background: "#fff7d6", color: "#8a6500", fontSize: "12px", fontWeight: 800 },
            precioInput: { width: "120px", boxSizing: "border-box", border: "1px solid #cbd5e1", borderRadius: "9px", padding: "9px 10px", fontSize: "14px", outline: "none" },
            resumenTotal: { display: "grid", gridTemplateColumns: "1fr auto", gap: "8px 22px", marginLeft: "auto", width: "min(340px, 100%)", padding: "18px", background: "#f8fafc", border: "1px solid #e7edf5", borderRadius: "14px" },
        };

        if (!adminToken) {
            return (
                <div style={estilos.loginPagina}>
                    <div style={estilos.loginCard}>
                        <ImagenRecurso
                            imagenes={[img("logo-ingedata-nuevo.jpeg")]}
                            alt="INGEDATA"
                            style={estilos.logoLogin}
                        />

                        <div style={{ textAlign: "center", marginBottom: "26px" }}>
                            <div style={{ color: "#1473e6", fontWeight: 900, letterSpacing: "1.5px", fontSize: "12px", marginBottom: "8px" }}>
                                PANEL ADMINISTRATIVO
                            </div>
                            <h1 style={{ margin: "0 0 8px", fontSize: "28px" }}>Iniciar sesión</h1>
                            <p style={{ margin: 0, color: "#64748b", lineHeight: 1.55 }}>
                                Acceso exclusivo para la administración de INGEDATA.
                            </p>
                        </div>

                        <form onSubmit={iniciarSesionAdmin}>
                            <div style={{ marginBottom: "16px" }}>
                                <label style={estilos.etiqueta}>Correo electrónico</label>
                                <input
                                    style={estilos.input}
                                    type="email"
                                    placeholder="admin@ingedata.com"
                                    value={adminCorreo}
                                    onChange={(e) => setAdminCorreo(e.target.value)}
                                    autoComplete="username"
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: "18px" }}>
                                <label style={estilos.etiqueta}>Contraseña</label>
                                <input
                                    style={estilos.input}
                                    type="password"
                                    placeholder="Ingresa tu contraseña"
                                    value={adminPassword}
                                    onChange={(e) => setAdminPassword(e.target.value)}
                                    autoComplete="current-password"
                                    required
                                />
                            </div>

                            {adminError && (
                                <div style={{ padding: "11px 13px", marginBottom: "15px", borderRadius: "10px", background: "#fff1f2", color: "#be123c", fontSize: "13px", fontWeight: 700 }}>
                                    {adminError}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={adminCargando}
                                style={{ ...estilos.botonAzul, width: "100%", padding: "14px 16px", opacity: adminCargando ? 0.7 : 1 }}
                            >
                                {adminCargando ? "Ingresando..." : "Iniciar sesión"}
                            </button>
                        </form>
                    </div>
                </div>
            );
        }

        return (
            <div style={estilos.pagina}>
                <div style={{ display: "flex", minHeight: "100vh" }}>
                    <aside style={estilos.sidebar}>
                        <ImagenRecurso
                            imagenes={[img("logo-ingedata-nuevo.jpeg")]}
                            alt="INGEDATA"
                            style={{ width: "190px", height: "62px", objectFit: "contain", background: "#fff", borderRadius: "12px", padding: "6px", boxSizing: "border-box", marginBottom: "26px" }}
                        />

                        <div style={{ fontSize: "11px", letterSpacing: "1.5px", color: "#7fa7d3", margin: "0 8px 12px", fontWeight: 800 }}>ADMINISTRACIÓN</div>
                        <button
                            type="button"
                            style={estilos.navItem}
                            onClick={() => {
                                setAdminSeccion("dashboard");
                                cargarCotizacionesAdmin();
                                cargarPedidosAdmin();
                            }}
                        >
                            📊 Dashboard
                        </button>

                        <button
                            type="button"
                            style={estilos.navItem}
                            onClick={() => {
                                setAdminSeccion("cotizaciones");
                                setAdminPedidoSeleccionado(null);
                                cargarCotizacionesAdmin();
                            }}
                        >
                            📋 Cotizaciones
                        </button>

                        <button
                            type="button"
                            style={estilos.navItem}
                            onClick={() => {
                                setAdminSeccion("pedidos");
                                setAdminPedidoSeleccionado(null);
                                setAdminCotizacionSeleccionada(null);
                                setAdminPedidoMensaje("");
                                cargarPedidosAdmin();
                            }}
                        >
                            📦 Pedidos
                        </button>

                        <button
                            type="button"
                            style={{
                                ...estilos.navItem,
                                marginTop: "28px",
                                background: "rgba(255,255,255,.04)"
                            }}
                            onClick={cerrarSesionAdmin}
                        >
                            🚪 Cerrar sesión
                        </button>
                    </aside>

                    <main style={estilos.contenido}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", alignItems: "center", marginBottom: "26px", flexWrap: "wrap" }}>
                            <div>
                                <div style={{ color: "#1473e6", fontSize: "12px", letterSpacing: "1.4px", fontWeight: 900 }}>PANEL ADMINISTRATIVO</div>
                                <h1 style={{ margin: "6px 0 4px", fontSize: "30px" }}>
                                    {adminSeccion === "pedidos" ? "Gestión de pedidos" : adminSeccion === "dashboard" ? "Panel de control" : "Solicitudes de cotización"}
                                </h1>

                                <p style={{ margin: 0, color: "#64748b" }}>
                                    {adminSeccion === "pedidos" ? "Revisa y administra los pedidos generados desde cotizaciones aprobadas." : adminSeccion === "dashboard" ? "Resumen general de cotizaciones y pedidos de INGEDATA." : "Revisa las solicitudes registradas desde la web."}
                                </p>
                            </div>
                            <div style={{ ...estilos.tarjeta, padding: "12px 16px", fontSize: "13px" }}>
                                <div style={{ fontWeight: 800 }}>{adminUsuario?.nombre || "Administrador INGEDATA"}</div>
                                <div style={{ color: "#64748b" }}>{adminUsuario?.correo || "Sesión activa"}</div>
                            </div>
                        </div>

                        {adminSeccion === "dashboard" && (
                            <>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                                    {[
                                        ["Solicitudes", adminCotizaciones.length], ["Pendientes", pendientes], ["Cotizadas", cotizadas],
                                        ["Aprobadas", aprobadas], ["Rechazadas", rechazadas], ["Pedidos", adminPedidos.length],
                                        ["En proceso", pedidosProceso], ["Completados", pedidosCompletados]
                                    ].map(([titulo, valor]) => <div key={titulo} style={estilos.stat}><div style={{ color: "#64748b", fontSize: "13px", fontWeight: 700 }}>{titulo}</div><div style={{ fontSize: "30px", fontWeight: 900 }}>{valor}</div></div>)}
                                </div>
                                <section style={{ ...estilos.tarjeta, padding: "22px" }}>
                                    <h2 style={{ margin: "0 0 16px" }}>Resumen operativo</h2>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "14px" }}>
                                        <div style={{ padding: "18px", background: "#f8fafc", borderRadius: "14px" }}><b>Cotizaciones</b><p style={{ color: "#64748b", marginBottom: 0 }}>{personas} personas · {empresas} empresas</p></div>
                                        <div style={{ padding: "18px", background: "#f8fafc", borderRadius: "14px" }}><b>Pedidos activos</b><p style={{ color: "#64748b", marginBottom: 0 }}>{pedidosPendientes} pendientes · {pedidosProceso} en proceso</p></div>
                                        <div style={{ padding: "18px", background: "#f8fafc", borderRadius: "14px" }}><b>Pedidos cerrados</b><p style={{ color: "#64748b", marginBottom: 0 }}>{pedidosCompletados} completados · {pedidosCancelados} cancelados</p></div>
                                    </div>
                                </section>
                            </>
                        )}

                        {adminSeccion === "cotizaciones" && (
                            <>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                                    <div style={estilos.stat}><div style={{ color: "#64748b", fontSize: "13px", fontWeight: 700 }}>Total solicitudes</div><div style={{ fontSize: "30px", fontWeight: 900 }}>{adminCotizaciones.length}</div></div>
                                    <div style={estilos.stat}><div style={{ color: "#64748b", fontSize: "13px", fontWeight: 700 }}>Pendientes</div><div style={{ fontSize: "30px", fontWeight: 900 }}>{pendientes}</div></div>
                                    <div style={estilos.stat}><div style={{ color: "#64748b", fontSize: "13px", fontWeight: 700 }}>Personas</div><div style={{ fontSize: "30px", fontWeight: 900 }}>{personas}</div></div>
                                    <div style={estilos.stat}><div style={{ color: "#64748b", fontSize: "13px", fontWeight: 700 }}>Empresas</div><div style={{ fontSize: "30px", fontWeight: 900 }}>{empresas}</div></div>
                                    <div style={estilos.stat}><div style={{ color: "#64748b", fontSize: "13px", fontWeight: 700 }}>Cotizadas</div><div style={{ fontSize: "30px", fontWeight: 900 }}>{cotizadas}</div></div>
                                </div>
                                {adminCotizacionesError && <div style={{ padding: "13px 16px", borderRadius: "12px", background: "#fff1f2", color: "#be123c", marginBottom: "18px", fontWeight: 700 }}>{adminCotizacionesError}</div>}
                                <section style={{ ...estilos.tarjeta, overflow: "hidden" }}>
                                    <div style={{ padding: "18px 20px", borderBottom: "1px solid #e7edf5", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "15px", flexWrap: "wrap" }}>
                                        <div><h2 style={{ margin: 0, fontSize: "19px" }}>Cotizaciones</h2><small style={{ color: "#64748b" }}>Personas y empresas</small></div>
                                        <button type="button" style={estilos.botonAzul} onClick={() => cargarCotizacionesAdmin()} disabled={adminCotizacionesCargando}>{adminCotizacionesCargando ? "Actualizando..." : "↻ Actualizar"}</button>
                                    </div>
                                    {adminCotizacionesCargando && adminCotizaciones.length === 0 ? <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Cargando cotizaciones...</div> : adminCotizaciones.length === 0 ? <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>No hay solicitudes registradas.</div> : (
                                        <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
                                            <thead><tr style={{ background: "#f8fafc", textAlign: "left" }}>{["Código", "Cliente", "Tipo", "Documento", "Productos", "Estado", "Fecha", "Acción"].map((t) => <th key={t} style={{ padding: "13px 16px", fontSize: "12px", color: "#64748b", borderBottom: "1px solid #e7edf5" }}>{t}</th>)}</tr></thead>
                                            <tbody>{adminCotizaciones.map((c) => <tr key={c.id}>
                                                <td style={{ padding: "14px 16px", borderBottom: "1px solid #edf2f7", fontWeight: 800, whiteSpace: "nowrap" }}>{c.codigo}</td>
                                                <td style={{ padding: "14px 16px", borderBottom: "1px solid #edf2f7" }}><div style={{ fontWeight: 800 }}>{c.cliente?.nombre || "Sin nombre"}</div><small style={{ color: "#64748b" }}>{c.cliente?.correo || "Sin correo"}</small></td>
                                                <td style={{ padding: "14px 16px", borderBottom: "1px solid #edf2f7" }}>{c.cliente?.tipo_cliente || "-"}</td><td style={{ padding: "14px 16px", borderBottom: "1px solid #edf2f7" }}>{c.cliente?.documento || "-"}</td>
                                                <td style={{ padding: "14px 16px", borderBottom: "1px solid #edf2f7", textAlign: "center" }}>{c.cantidad_productos ?? 0}</td>
                                                <td style={{ padding: "14px 16px", borderBottom: "1px solid #edf2f7" }}><span style={estilos.badge}>{c.estado || "PENDIENTE"}</span></td>
                                                <td style={{ padding: "14px 16px", borderBottom: "1px solid #edf2f7", whiteSpace: "nowrap" }}>{c.fecha_solicitud ? new Date(c.fecha_solicitud).toLocaleString("es-PE") : "-"}</td>
                                                <td style={{ padding: "14px 16px", borderBottom: "1px solid #edf2f7" }}><button type="button" style={estilos.botonAzul} onClick={() => abrirDetalleCotizacionAdmin(c.id)}>Ver</button></td>
                                            </tr>)}</tbody>
                                        </table></div>
                                    )}
                                </section>
                            </>
                        )}

                        {adminSeccion === "pedidos" && (
                            <>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "16px", marginBottom: "24px" }}>
                                    <div style={estilos.stat}><div style={{ color: "#64748b", fontSize: "13px", fontWeight: 700 }}>Total pedidos</div><div style={{ fontSize: "30px", fontWeight: 900 }}>{adminPedidos.length}</div></div>
                                    <div style={estilos.stat}><div style={{ color: "#64748b", fontSize: "13px", fontWeight: 700 }}>Pendientes</div><div style={{ fontSize: "30px", fontWeight: 900 }}>{pedidosPendientes}</div></div>
                                    <div style={estilos.stat}><div style={{ color: "#64748b", fontSize: "13px", fontWeight: 700 }}>En proceso</div><div style={{ fontSize: "30px", fontWeight: 900 }}>{pedidosProceso}</div></div>
                                    <div style={estilos.stat}><div style={{ color: "#64748b", fontSize: "13px", fontWeight: 700 }}>Completados</div><div style={{ fontSize: "30px", fontWeight: 900 }}>{pedidosCompletados}</div></div>
                                    <div style={estilos.stat}><div style={{ color: "#64748b", fontSize: "13px", fontWeight: 700 }}>Cancelados</div><div style={{ fontSize: "30px", fontWeight: 900 }}>{pedidosCancelados}</div></div>
                                </div>
                                {adminPedidosError && <div style={{ padding: "13px 16px", borderRadius: "12px", background: "#fff1f2", color: "#be123c", marginBottom: "18px", fontWeight: 700 }}>{adminPedidosError}</div>}
                                <section style={{ ...estilos.tarjeta, overflow: "hidden" }}>
                                    <div style={{ padding: "18px 20px", borderBottom: "1px solid #e7edf5", display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><h2 style={{ margin: 0 }}>Pedidos</h2><small style={{ color: "#64748b" }}>Pedidos generados desde cotizaciones aprobadas</small></div><button type="button" style={estilos.botonAzul} onClick={() => cargarPedidosAdmin()}>{adminPedidosCargando ? "Actualizando..." : "↻ Actualizar"}</button></div>
                                    {adminPedidosCargando && adminPedidos.length === 0 ? <div style={{ padding: 40, textAlign: "center" }}>Cargando pedidos...</div> : adminPedidos.length === 0 ? <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>No hay pedidos registrados.</div> : <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
                                        <thead><tr style={{ background: "#f8fafc", textAlign: "left" }}>{["Código", "Cliente", "Documento", "Productos", "Total", "Estado", "Fecha", "Acción"].map(t => <th key={t} style={{ padding: "13px 16px", fontSize: 12, color: "#64748b" }}>{t}</th>)}</tr></thead>
                                        <tbody>{adminPedidos.map(p => <tr key={p.id}><td style={{ padding: "14px 16px", borderTop: "1px solid #edf2f7", fontWeight: 800 }}>{p.codigo}</td><td style={{ padding: "14px 16px", borderTop: "1px solid #edf2f7" }}>{p.cliente?.nombre || "-"}</td><td style={{ padding: "14px 16px", borderTop: "1px solid #edf2f7" }}>{p.cliente?.documento || "-"}</td><td style={{ padding: "14px 16px", borderTop: "1px solid #edf2f7" }}>{p.cantidad_productos ?? 0}</td><td style={{ padding: "14px 16px", borderTop: "1px solid #edf2f7", fontWeight: 800 }}>S/ {Number(p.total || 0).toFixed(2)}</td><td style={{ padding: "14px 16px", borderTop: "1px solid #edf2f7" }}><span style={estilos.badge}>{p.estado}</span></td><td style={{ padding: "14px 16px", borderTop: "1px solid #edf2f7", whiteSpace: "nowrap" }}>{p.fecha_pedido ? new Date(p.fecha_pedido).toLocaleString("es-PE") : "-"}</td><td style={{ padding: "14px 16px", borderTop: "1px solid #edf2f7" }}><button type="button" style={estilos.botonAzul} onClick={() => abrirDetallePedidoAdmin(p.id)}>Ver</button></td></tr>)}</tbody>
                                    </table></div>}
                                </section>
                            </>
                        )}
                    </main>
                </div>

                {adminPedidoSeleccionado && (
                    <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(4,16,34,.66)", display: "grid", placeItems: "center", padding: 20 }} onClick={() => setAdminPedidoSeleccionado(null)}>
                        <div style={{ width: "min(900px,100%)", maxHeight: "88vh", overflowY: "auto", background: "#fff", borderRadius: 20, boxShadow: "0 28px 80px rgba(0,0,0,.35)" }} onClick={e => e.stopPropagation()}>
                            <div style={{ padding: "20px 22px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e7edf5" }}><div><small style={{ color: "#64748b", fontWeight: 800 }}>DETALLE DEL PEDIDO</small><h2 style={{ margin: "4px 0 0" }}>{adminPedidoSeleccionado.codigo}</h2></div><button onClick={() => setAdminPedidoSeleccionado(null)} style={{ border: 0, background: "#eef2f7", width: 38, height: 38, borderRadius: "50%", fontSize: 20, cursor: "pointer" }}>×</button></div>
                            <div style={{ padding: 22 }}>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 12, marginBottom: 20 }}><div style={estilos.stat}><small>Cliente</small><div style={{ fontWeight: 900, marginTop: 5 }}>{adminPedidoSeleccionado.cliente?.nombre || "-"}</div></div><div style={estilos.stat}><small>Documento</small><div style={{ fontWeight: 900, marginTop: 5 }}>{adminPedidoSeleccionado.cliente?.documento || "-"}</div></div><div style={estilos.stat}><small>Estado</small><div style={{ marginTop: 5 }}><span style={estilos.badge}>{adminPedidoSeleccionado.estado}</span></div></div></div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 10, marginBottom: 20 }}><div><b>Teléfono:</b> {adminPedidoSeleccionado.cliente?.telefono || "-"}</div><div><b>Correo:</b> {adminPedidoSeleccionado.cliente?.correo || "-"}</div><div><b>Dirección:</b> {adminPedidoSeleccionado.cliente?.direccion || "-"}</div><div><b>Fecha:</b> {adminPedidoSeleccionado.fecha_pedido ? new Date(adminPedidoSeleccionado.fecha_pedido).toLocaleString("es-PE") : "-"}</div></div>
                                <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", minWidth: 650 }}><thead><tr style={{ background: "#f8fafc", textAlign: "left" }}>{["Producto", "Marca", "Cantidad", "P. unitario", "Subtotal"].map(t => <th key={t} style={{ padding: 11 }}>{t}</th>)}</tr></thead><tbody>{(adminPedidoSeleccionado.productos || []).map((p, i) => <tr key={p.id || i}><td style={{ padding: 11, borderTop: "1px solid #e7edf5", fontWeight: 700 }}>{p.nombre}</td><td style={{ padding: 11, borderTop: "1px solid #e7edf5" }}>{p.marca || "-"}</td><td style={{ padding: 11, borderTop: "1px solid #e7edf5" }}>{p.cantidad}</td><td style={{ padding: 11, borderTop: "1px solid #e7edf5" }}>S/ {Number(p.precio_unitario || 0).toFixed(2)}</td><td style={{ padding: 11, borderTop: "1px solid #e7edf5", fontWeight: 800 }}>S/ {Number(p.subtotal || 0).toFixed(2)}</td></tr>)}</tbody></table></div>
                                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}><div style={estilos.resumenTotal}><span>Subtotal</span><b>S/ {Number(adminPedidoSeleccionado.subtotal || 0).toFixed(2)}</b><span>IGV 18 %</span><b>S/ {Number(adminPedidoSeleccionado.igv || 0).toFixed(2)}</b><strong>TOTAL</strong><strong style={{ color: "#1473e6", fontSize: 20 }}>S/ {Number(adminPedidoSeleccionado.total || 0).toFixed(2)}</strong></div></div>
                                {adminPedidoMensaje && <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: 10, background: adminPedidoMensaje.toLowerCase().includes("correctamente") ? "#ecfdf5" : "#fff1f2", color: adminPedidoMensaje.toLowerCase().includes("correctamente") ? "#166534" : "#be123c", fontWeight: 800 }}>{adminPedidoMensaje}</div>}
                                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18, flexWrap: "wrap" }}><button type="button" onClick={() => setAdminPedidoSeleccionado(null)} style={{ border: "1px solid #cbd5e1", borderRadius: 10, padding: "12px 16px", background: "#fff", fontWeight: 800, cursor: "pointer" }}>Cerrar</button>{!["COMPLETADO", "CANCELADO"].includes(String(adminPedidoSeleccionado.estado || "").toUpperCase()) && <><button type="button" disabled={adminGuardandoPedido} onClick={() => cambiarEstadoPedidoAdmin("CANCELADO")} style={{ border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", background: "#fff1f2", color: "#be123c", fontWeight: 800, cursor: "pointer" }}>Cancelar</button>{String(adminPedidoSeleccionado.estado || "").toUpperCase() === "PENDIENTE" && <button type="button" disabled={adminGuardandoPedido} onClick={() => cambiarEstadoPedidoAdmin("EN_PROCESO")} style={estilos.botonAzul}>Pasar a EN PROCESO</button>}{String(adminPedidoSeleccionado.estado || "").toUpperCase() === "EN_PROCESO" && <button type="button" disabled={adminGuardandoPedido} onClick={() => cambiarEstadoPedidoAdmin("COMPLETADO")} style={estilos.botonAzul}>Marcar COMPLETADO</button>}</>}</div>
                            </div>
                        </div>
                    </div>
                )}

                {adminCotizacionSeleccionada && (
                    <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(4,16,34,.66)", display: "grid", placeItems: "center", padding: "20px" }} onClick={() => setAdminCotizacionSeleccionada(null)}>
                        <div style={{ width: "min(850px, 100%)", maxHeight: "88vh", overflowY: "auto", background: "#fff", borderRadius: "20px", boxShadow: "0 28px 80px rgba(0,0,0,.35)" }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ padding: "20px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e7edf5" }}>
                                <div><small style={{ color: "#64748b", fontWeight: 800 }}>DETALLE DE SOLICITUD</small><h2 style={{ margin: "4px 0 0" }}>{adminCotizacionSeleccionada.codigo}</h2></div>
                                <button type="button" onClick={() => setAdminCotizacionSeleccionada(null)} style={{ border: 0, background: "#eef2f7", width: "38px", height: "38px", borderRadius: "50%", cursor: "pointer", fontSize: "20px" }}>×</button>
                            </div>
                            <div style={{ padding: "22px" }}>
                                {adminDetalleCargando ? <p>Cargando detalle...</p> : (
                                    <>
                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "12px", marginBottom: "22px" }}>
                                            <div style={{ ...estilos.stat, boxShadow: "none" }}><small style={{ color: "#64748b" }}>Cliente</small><div style={{ fontWeight: 900, marginTop: "4px" }}>{adminCotizacionSeleccionada.cliente?.tipo_cliente === "EMPRESA" ? adminCotizacionSeleccionada.cliente?.razon_social : `${adminCotizacionSeleccionada.cliente?.nombres || ""} ${adminCotizacionSeleccionada.cliente?.apellidos || ""}`.trim()}</div></div>
                                            <div style={{ ...estilos.stat, boxShadow: "none" }}><small style={{ color: "#64748b" }}>Documento</small><div style={{ fontWeight: 900, marginTop: "4px" }}>{adminCotizacionSeleccionada.cliente?.tipo_cliente === "EMPRESA" ? adminCotizacionSeleccionada.cliente?.ruc : adminCotizacionSeleccionada.cliente?.dni}</div></div>
                                            <div style={{ ...estilos.stat, boxShadow: "none" }}><small style={{ color: "#64748b" }}>Estado</small><div style={{ marginTop: "5px" }}><span
                                                style={{
                                                    ...estilos.badge,
                                                    background:
                                                        String(adminCotizacionSeleccionada.estado || "").toUpperCase() === "APROBADA"
                                                            ? "#dcfce7"
                                                            : String(adminCotizacionSeleccionada.estado || "").toUpperCase() === "RECHAZADA"
                                                                ? "#ffe4e6"
                                                                : String(adminCotizacionSeleccionada.estado || "").toUpperCase() === "COTIZADA"
                                                                    ? "#dbeafe"
                                                                    : "#fff7d6",
                                                    color:
                                                        String(adminCotizacionSeleccionada.estado || "").toUpperCase() === "APROBADA"
                                                            ? "#166534"
                                                            : String(adminCotizacionSeleccionada.estado || "").toUpperCase() === "RECHAZADA"
                                                                ? "#be123c"
                                                                : String(adminCotizacionSeleccionada.estado || "").toUpperCase() === "COTIZADA"
                                                                    ? "#1d4ed8"
                                                                    : "#8a6500",
                                                }}
                                            >
                                                {adminCotizacionSeleccionada.estado}
                                            </span></div></div>
                                        </div>
                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "10px", marginBottom: "22px", fontSize: "14px" }}>
                                            <div><b>Teléfono:</b> {adminCotizacionSeleccionada.cliente?.telefono || "-"}</div>
                                            <div><b>Correo:</b> {adminCotizacionSeleccionada.cliente?.correo || "-"}</div>
                                            <div><b>Dirección:</b> {adminCotizacionSeleccionada.cliente?.direccion || "-"}</div>
                                            <div><b>Fecha:</b> {adminCotizacionSeleccionada.fecha_solicitud ? new Date(adminCotizacionSeleccionada.fecha_solicitud).toLocaleString("es-PE") : "-"}</div>
                                        </div>
                                        <div style={{ padding: "14px 16px", background: "#f8fafc", borderRadius: "12px", marginBottom: "20px" }}><b>Observaciones</b><p style={{ margin: "6px 0 0", color: "#475569" }}>{adminCotizacionSeleccionada.observaciones || "Sin observaciones."}</p></div>
                                        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", flexWrap: "wrap", marginBottom: "10px" }}>
                                            <h3 style={{ margin: 0 }}>Productos solicitados</h3>
                                            <small style={{ color: "#64748b" }}>
                                                {["APROBADA", "RECHAZADA"].includes(
                                                    String(adminCotizacionSeleccionada.estado || "").toUpperCase()
                                                )
                                                    ? "Cotización finalizada. Los precios ya no pueden modificarse."
                                                    : String(adminCotizacionSeleccionada.estado || "").toUpperCase() === "COTIZADA"
                                                        ? "Puedes modificar los precios y volver a guardar la cotización cuando sea necesario."
                                                        : "Ingresa el precio unitario sin IGV. El sistema calculará el IGV 18 %."}
                                            </small>
                                        </div>

                                        <div style={{ overflowX: "auto" }}>
                                            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
                                                <thead>
                                                    <tr style={{ background: "#f8fafc", textAlign: "left" }}>
                                                        <th style={{ padding: "11px" }}>Producto</th>
                                                        <th style={{ padding: "11px" }}>Marca</th>
                                                        <th style={{ padding: "11px" }}>Cantidad</th>
                                                        <th style={{ padding: "11px" }}>Precio unitario</th>
                                                        <th style={{ padding: "11px" }}>Subtotal</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {(adminCotizacionSeleccionada.productos || []).map((p) => {
                                                        const precio = Number(adminPrecios[p.id]);
                                                        const precioValido = Number.isFinite(precio) && precio > 0;
                                                        const subtotalVisual = precioValido
                                                            ? Number((precio * Number(p.cantidad || 0)).toFixed(2))
                                                            : 0;

                                                        return (
                                                            <tr key={p.id}>
                                                                <td style={{ padding: "11px", borderTop: "1px solid #e7edf5", fontWeight: 700 }}>
                                                                    {p.nombre}
                                                                </td>
                                                                <td style={{ padding: "11px", borderTop: "1px solid #e7edf5" }}>
                                                                    {p.marca || "-"}
                                                                </td>
                                                                <td style={{ padding: "11px", borderTop: "1px solid #e7edf5" }}>
                                                                    {p.cantidad}
                                                                </td>
                                                                <td style={{ padding: "11px", borderTop: "1px solid #e7edf5" }}>
                                                                    <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                                                                        <span style={{ fontWeight: 800 }}>S/</span>
                                                                        <input
                                                                            type="text"
                                                                            inputMode="decimal"
                                                                            style={{
                                                                                ...estilos.precioInput,
                                                                                background: ["APROBADA", "RECHAZADA"].includes(
                                                                                    String(adminCotizacionSeleccionada.estado || "").toUpperCase()
                                                                                )
                                                                                    ? "#f1f5f9"
                                                                                    : "#ffffff",
                                                                                cursor: ["APROBADA", "RECHAZADA"].includes(
                                                                                    String(adminCotizacionSeleccionada.estado || "").toUpperCase()
                                                                                )
                                                                                    ? "not-allowed"
                                                                                    : "text",
                                                                            }}
                                                                            placeholder="0.00"
                                                                            value={adminPrecios[p.id] ?? ""}
                                                                            onChange={(e) => cambiarPrecioAdmin(p.id, e.target.value)}
                                                                            disabled={["APROBADA", "RECHAZADA"].includes(
                                                                                String(adminCotizacionSeleccionada.estado || "").toUpperCase()
                                                                            )}
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td style={{ padding: "11px", borderTop: "1px solid #e7edf5", fontWeight: 800 }}>
                                                                    {precioValido ? `S/ ${subtotalVisual.toFixed(2)}` : "Pendiente"}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "22px" }}>
                                            <div style={estilos.resumenTotal}>
                                                <span style={{ color: "#64748b" }}>Subtotal</span>
                                                <b>S/ {totalesAdmin.subtotal.toFixed(2)}</b>
                                                <span style={{ color: "#64748b" }}>IGV 18 %</span>
                                                <b>S/ {totalesAdmin.igv.toFixed(2)}</b>
                                                <span style={{ color: "#0f172a", fontSize: "17px", fontWeight: 900 }}>TOTAL</span>
                                                <strong style={{ color: "#1473e6", fontSize: "20px" }}>
                                                    S/ {totalesAdmin.total.toFixed(2)}
                                                </strong>
                                            </div>
                                        </div>

                                        {adminCotizacionMensaje && (
                                            <div
                                                style={{
                                                    marginTop: "16px",
                                                    padding: "12px 14px",
                                                    borderRadius: "10px",
                                                    background: adminCotizacionMensaje.toLowerCase().includes("correctamente") ? "#ecfdf5" : "#fff1f2",
                                                    color: adminCotizacionMensaje.toLowerCase().includes("correctamente") ? "#166534" : "#be123c",
                                                    fontWeight: 800,
                                                    fontSize: "13px",
                                                }}
                                            >
                                                {adminCotizacionMensaje}
                                            </div>
                                        )}

                                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "18px", flexWrap: "wrap" }}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setAdminCotizacionSeleccionada(null);
                                                    setAdminCotizacionMensaje("");
                                                }}
                                                style={{
                                                    border: "1px solid #cbd5e1",
                                                    borderRadius: "10px",
                                                    padding: "12px 16px",
                                                    background: "#fff",
                                                    color: "#334155",
                                                    fontWeight: 800,
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Cerrar
                                            </button>
                                            {String(adminCotizacionSeleccionada.estado || "").toUpperCase() === "COTIZADA" && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => cambiarEstadoCotizacionAdmin("RECHAZADA")}
                                                        disabled={adminGuardandoCotizacion}
                                                        style={{
                                                            border: "1px solid #fecaca",
                                                            borderRadius: "10px",
                                                            padding: "12px 16px",
                                                            background: "#fff1f2",
                                                            color: "#be123c",
                                                            fontWeight: 800,
                                                            cursor: adminGuardandoCotizacion ? "not-allowed" : "pointer",
                                                            opacity: adminGuardandoCotizacion ? 0.6 : 1,
                                                        }}
                                                    >
                                                        Rechazar
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => cambiarEstadoCotizacionAdmin("APROBADA")}
                                                        disabled={adminGuardandoCotizacion}
                                                        style={{
                                                            border: "1px solid #bbf7d0",
                                                            borderRadius: "10px",
                                                            padding: "12px 16px",
                                                            background: "#dcfce7",
                                                            color: "#166534",
                                                            fontWeight: 800,
                                                            cursor: adminGuardandoCotizacion ? "not-allowed" : "pointer",
                                                            opacity: adminGuardandoCotizacion ? 0.6 : 1,
                                                        }}
                                                    >
                                                        Aprobar
                                                    </button>
                                                </>
                                            )}

                                            {["PENDIENTE", "COTIZADA"].includes(
                                                String(adminCotizacionSeleccionada.estado || "").toUpperCase()
                                            ) && (
                                                    <button
                                                        type="button"
                                                        onClick={guardarCotizacionAdmin}
                                                        disabled={adminGuardandoCotizacion || !totalesAdmin.completo}
                                                        style={{
                                                            ...estilos.botonAzul,
                                                            padding: "12px 18px",
                                                            opacity:
                                                                adminGuardandoCotizacion || !totalesAdmin.completo
                                                                    ? 0.55
                                                                    : 1,
                                                            cursor:
                                                                adminGuardandoCotizacion || !totalesAdmin.completo
                                                                    ? "not-allowed"
                                                                    : "pointer",
                                                        }}
                                                    >
                                                        {adminGuardandoCotizacion
                                                            ? "Guardando..."
                                                            : String(adminCotizacionSeleccionada.estado || "").toUpperCase() === "COTIZADA"
                                                                ? "Guardar cambios"
                                                                : "Guardar cotización"}
                                                    </button>
                                                )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

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
                    <a href="#inicio" className="logo logo-completo" aria-label="INGEDATA - Inicio">
                        <span className="mark mark-completo">
                            <ImagenRecurso
                                imagenes={[
                                    img("logo-ingedata-nuevo.jpeg"),
                                ]}
                                alt="INGEDATA - Tecnología, Infraestructura e Ingeniería"
                            />
                        </span>
                    </a>

                    <nav className="mainnav">
                        <a href="#inicio">Inicio</a>
                        <a href="#nosotros">Nosotros</a>
                        <a href="#servicios">Servicios</a>
                        <a href="#tienda">Catálogo</a>
                        <a href="#pagos">Pagos</a>
                        <a href="#contacto">Contacto</a>
                    </nav>

                    <div className="actions">
                        <button className="cart-btn" onClick={() => setCarritoAbierto(true)}>
                            📋 Solicitud <span className="badge">{cantidadTotal}</span>
                        </button>

                        <a href="#tienda" className="btn-quote">
                            Solicitar proforma →
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
                            <a href="#tienda" className="btn-primary">
                                Seleccionar productos →
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
                        <div className="ey">Catálogo empresarial</div>
                        <h2>
                            Productos y <b>Servicios</b>
                        </h2>
                        <div className="uline"></div>
                        <p>
                            Selecciona los productos o servicios que necesitas. Los precios se
                            cotizan mediante una proforma personalizada de INGEDATA S.A.C.
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
                            No se pudo conectar con el catálogo en línea. Intenta nuevamente en unos segundos.
                        </div>
                    ) : (
                        <div className="grid">
                            {lista.map((p) => {
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

                                            <button
                                                className="quick"
                                                onClick={() => agregar(p.id)}
                                            >
                                                Agregar a solicitud
                                            </button>
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
                                                <span className="price quote-price">
                                                    Precio a cotizar
                                                </span>

                                                <button
                                                    className="add"
                                                    onClick={() => agregar(p.id)}
                                                    title="Agregar a solicitud"
                                                >
                                                    +
                                                </button>
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

                        <a className="btn-white" href="#tienda">
                            Armar solicitud →
                        </a>
                    </div>
                </div>
            </section>

            <footer>
                <div className="wrap fwrap">
                    <div>
                        <a href="#inicio" className="logo logo-completo" aria-label="INGEDATA - Inicio">
                            <span className="mark mark-completo">
                                <ImagenRecurso
                                    imagenes={[
                                        img("logo-ingedata-nuevo.jpeg"),
                                    ]}
                                    alt="INGEDATA - Tecnología, Infraestructura e Ingeniería"
                                />
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
                                <a href="#tienda">Catálogo</a>
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
                    <span>Portal empresarial y catálogo de soluciones.</span>
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
                    <h3>📋 Solicitud de proforma</h3>

                    <button className="close" onClick={() => setCarritoAbierto(false)}>
                        ×
                    </button>
                </div>

                <div className="items">
                    {itemsCarrito.length === 0 ? (
                        <div className="empty">
                            <span className="e">📋</span>
                            <p>Aún no has seleccionado productos.</p>
                            <button onClick={() => setCarritoAbierto(false)}>
                                Ver catálogo
                            </button>
                        </div>
                    ) : (
                        itemsCarrito.map((item) => (
                            <div className="ci" key={item.id}>
                                <ImagenRecurso
                                    imagenes={obtenerImagenesProducto(item)}
                                    alt={item.nombre}
                                />

                                <div className="info">
                                    <h4>{item.nombre}</h4>
                                    <div className="p">Cantidad solicitada</div>

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

                                <button
                                    className="rm"
                                    onClick={() => quitar(item.id)}
                                    title="Quitar de la solicitud"
                                >
                                    ✕
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="foot">
                    <div className="row total">
                        <span>Productos seleccionados</span>
                        <b>{cantidadTotal}</b>
                    </div>

                    <p
                        style={{
                            margin: "12px 0",
                            fontSize: "0.85rem",
                            lineHeight: 1.5,
                            color: "#64748b",
                        }}
                    >
                        INGEDATA preparará una proforma personalizada con precios,
                        disponibilidad y condiciones comerciales.
                    </p>

                    {itemsCarrito.length > 0 ? (
                        <a
                            className="checkout"
                            href={whatsappCotizacion}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Solicitar proforma por WhatsApp
                        </a>
                    ) : (
                        <button
                            className="checkout"
                            type="button"
                            onClick={() => setCarritoAbierto(false)}
                        >
                            Seleccionar productos
                        </button>
                    )}
                </div>
            </aside>

            <div className={`toast ${toast ? "show" : ""}`}>
                <span className="tic">✓</span> {toast}
            </div>
        </>
    );

}

export default App;