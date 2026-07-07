import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_PRODUCTOS = "https://ingedata-backend.onrender.com/productos";

const WHATSAPP_1 = "51986916557";
const WHATSAPP_2 = "51986913711";

const DATOS_EMPRESA = {
    telefono1: "986 916 557",
    telefono2: "986 913 711",
    correo: "jdiego@ingedataa.com",
    correo2: "lpanduro@ingedataa.com",
    ruc: "20613136054",
    titular: "INGEDATA S.A.C.",
    yape: "986 916 557",
    plin: "986 913 711",
};

const FALLBACK_LOGO = "/imagenes/logo ingedata.jpeg";

function img(nombre) {
    return `/imagenes/${nombre}`;
}

function ImagenRecurso({ imagenes, alt, className }) {
    const lista =
        Array.isArray(imagenes) && imagenes.length > 0
            ? imagenes
            : imagenes
                ? [imagenes]
                : [FALLBACK_LOGO];

    const rutas = [...lista, FALLBACK_LOGO];
    const [index, setIndex] = useState(0);

    return (
        <img
            src={rutas[index]}
            alt={alt}
            className={className}
            onError={() => {
                if (index < rutas.length - 1) {
                    setIndex(index + 1);
                }
            }}
        />
    );
}

const categorias = [
    "Todos",
    "Red y datos",
    "Fibra óptica",
    "Eléctricos",
    "Energía",
    "Servicios",
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
    const [pagoActivo, setPagoActivo] = useState("tarjeta");

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
                                key={cat}
                                className={categoria === cat ? "active" : ""}
                                onClick={() => setCategoria(cat)}
                            >
                                {cat}
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
                            {lista.map((p) => (
                                <article className="card in" key={p.id}>
                                    <div className="media">
                                        <ImagenRecurso imagenes={p.imagenes} alt={p.nombre} />

                                        <div className="chips">
                                            {p.tag && (
                                                <span
                                                    className={`chip ${p.tag === "Servicio"
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

                                        <button className="quick" onClick={() => agregar(p.id)}>
                                            Agregar al carrito
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
                                            <span className="price">
                                                S/ {Number(p.precio || 0).toFixed(2)}{" "}
                                                <small>+IGV</small>
                                            </span>

                                            <button className="add" onClick={() => agregar(p.id)}>
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
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
                    <div className="section-head">
                        <div className="ey">Métodos de pago</div>
                        <h2>
                            Pagos <b>rápidos y seguros</b>
                        </h2>
                        <div className="uline"></div>
                        <p>
                            Selecciona el método de pago que prefieras para cancelar tus
                            servicios o productos.
                        </p>
                    </div>

                    <div className="pay-tabs">
                        <button
                            className={pagoActivo === "tarjeta" ? "active" : ""}
                            onClick={() => setPagoActivo("tarjeta")}
                        >
                            💳 Tarjeta
                        </button>

                        <button
                            className={pagoActivo === "yape" ? "active" : ""}
                            onClick={() => setPagoActivo("yape")}
                        >
                            📱 Yape
                        </button>

                        <button
                            className={pagoActivo === "plin" ? "active" : ""}
                            onClick={() => setPagoActivo("plin")}
                        >
                            📲 Plin
                        </button>

                        <button
                            className={pagoActivo === "transferencia" ? "active" : ""}
                            onClick={() => setPagoActivo("transferencia")}
                        >
                            🏦 Transferencia
                        </button>
                    </div>

                    <div className="pay-panel">
                        {pagoActivo === "tarjeta" && (
                            <div className="pay-content">
                                <div>
                                    <h3>Pago con tarjeta</h3>

                                    <p>
                                        Solicita el link de pago seguro por WhatsApp. Te enviaremos
                                        el enlace según el monto de tu compra o servicio.
                                    </p>

                                    <div className="cards-list">
                                        <span>VISA</span>
                                        <span>Mastercard</span>
                                        <span>AMEX</span>
                                        <span>Diners</span>
                                    </div>

                                    <a
                                        className="btn-primary"
                                        href={whatsappCotizacion}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Solicitar link de pago
                                    </a>

                                    <small>
                                        Atención por WhatsApp: {DATOS_EMPRESA.telefono1} /{" "}
                                        {DATOS_EMPRESA.telefono2}
                                    </small>
                                </div>

                                <div className="pay-resume-card">
                                    <h4>Pago seguro</h4>
                                    <p>Validación previa por WhatsApp</p>
                                    <strong>{DATOS_EMPRESA.titular}</strong>
                                </div>
                            </div>
                        )}

                        {pagoActivo === "yape" && (
                            <div className="pay-content">
                                <div>
                                    <h3>Pago con Yape</h3>

                                    <p>
                                        Escanea el código QR o realiza el pago al número autorizado
                                        de INGEDATA.
                                    </p>

                                    <div className="datos-pago">
                                        <p>
                                            <b>Número Yape:</b> {DATOS_EMPRESA.yape}
                                        </p>
                                        <p>
                                            <b>Titular:</b> {DATOS_EMPRESA.titular}
                                        </p>
                                        <p>
                                            <b>Enviar constancia a:</b> {DATOS_EMPRESA.correo}
                                        </p>
                                    </div>

                                    <a
                                        className="btn-primary"
                                        href={whatsappCotizacion}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Enviar constancia por WhatsApp
                                    </a>
                                </div>

                                <div className="qr-box">
                                    <ImagenRecurso
                                        imagenes={[
                                            img("yape.jpg"),
                                            "/yape.jpg",
                                            img("yape-qr.jpg"),
                                            "/yape-qr.jpg",
                                        ]}
                                        alt="QR Yape INGEDATA"
                                    />
                                </div>
                            </div>
                        )}

                        {pagoActivo === "plin" && (
                            <div className="pay-content">
                                <div>
                                    <h3>Pago con Plin</h3>

                                    <p>
                                        Realiza tu pago mediante Plin usando el número autorizado de
                                        la empresa.
                                    </p>

                                    <div className="datos-pago">
                                        <p>
                                            <b>Número Plin:</b> {DATOS_EMPRESA.plin}
                                        </p>
                                        <p>
                                            <b>Titular:</b> {DATOS_EMPRESA.titular}
                                        </p>
                                        <p>
                                            <b>Enviar constancia a:</b> {DATOS_EMPRESA.correo}
                                        </p>
                                    </div>

                                    <a
                                        className="btn-primary"
                                        href={whatsappCotizacion}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Enviar constancia por WhatsApp
                                    </a>
                                </div>

                                <div className="pay-resume-card">
                                    <h4>PLIN</h4>
                                    <p>{DATOS_EMPRESA.plin}</p>
                                    <strong>{DATOS_EMPRESA.titular}</strong>
                                </div>
                            </div>
                        )}

                        {pagoActivo === "transferencia" && (
                            <div className="pay-content">
                                <div>
                                    <h3>Transferencia bancaria</h3>

                                    <p>
                                        Solicita los datos bancarios oficiales por WhatsApp para
                                        confirmar la cuenta vigente antes de pagar.
                                    </p>

                                    <div className="datos-pago">
                                        <p>
                                            <b>Titular:</b> {DATOS_EMPRESA.titular}
                                        </p>
                                        <p>
                                            <b>RUC:</b> {DATOS_EMPRESA.ruc}
                                        </p>
                                        <p>
                                            <b>WhatsApp:</b> {DATOS_EMPRESA.telefono1} /{" "}
                                            {DATOS_EMPRESA.telefono2}
                                        </p>
                                        <p>
                                            <b>Correo:</b> {DATOS_EMPRESA.correo}
                                        </p>
                                    </div>

                                    <a
                                        className="btn-primary"
                                        href={whatsappCotizacion}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Solicitar datos bancarios
                                    </a>
                                </div>

                                <div className="pay-resume-card">
                                    <h4>Transferencia</h4>
                                    <p>Cuenta oficial previa confirmación</p>
                                    <strong>{DATOS_EMPRESA.titular}</strong>
                                </div>
                            </div>
                        )}
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
                                <ImagenRecurso imagenes={item.imagenes} alt={item.nombre} />

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