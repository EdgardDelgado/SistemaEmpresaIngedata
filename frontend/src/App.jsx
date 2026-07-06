import { useMemo, useState } from "react";
import "./App.css";

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
    const lista = Array.isArray(imagenes) ? imagenes : [imagenes];
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

const productos = [
    {
        id: 1,
        cat: "Red y datos",
        brand: "Panduit",
        nombre: "Cable UTP Cat 6 Panduit",
        precio: 389.0,
        rate: 4.9,
        rev: 124,
        tag: "Más vendido",
        imagenes: [img("cable utp 6 panduit.jpg")],
    },
    {
        id: 2,
        cat: "Red y datos",
        brand: "CommScope",
        nombre: "Cable UTP Cat 6 CommScope",
        precio: 389.0,
        rate: 4.8,
        rev: 80,
        imagenes: [img("cable utp 6 commscope.jpg")],
    },
    {
        id: 3,
        cat: "Red y datos",
        brand: "Panduit",
        nombre: "Cable UTP Cat 6A Panduit",
        precio: 520.0,
        rate: 4.9,
        rev: 62,
        tag: "Nuevo",
        imagenes: [img("cable utp 6a panduit.jpg")],
    },
    {
        id: 4,
        cat: "Red y datos",
        brand: "CommScope",
        nombre: "Cable UTP Cat 6A CommScope",
        precio: 540.0,
        rate: 4.8,
        rev: 41,
        imagenes: [img("cable utp 6a commscope.jpg")],
    },
    {
        id: 5,
        cat: "Red y datos",
        brand: "Panduit",
        nombre: "Jack RJ45 Cat 6",
        precio: 168.0,
        rate: 4.6,
        rev: 33,
        imagenes: [img("jack 6.jpg")],
    },
    {
        id: 6,
        cat: "Red y datos",
        brand: "Panduit",
        nombre: "Jack RJ45 Cat 6A",
        precio: 198.0,
        rate: 4.8,
        rev: 35,
        imagenes: [img("jack 6a.jpg")],
    },
    {
        id: 7,
        cat: "Red y datos",
        brand: "Genérico",
        nombre: "Face Plate",
        precio: 12.0,
        rate: 4.5,
        rev: 23,
        imagenes: [img("face plate.jpg")],
    },
    {
        id: 8,
        cat: "Red y datos",
        brand: "Genérico",
        nombre: "Tapa ciega data",
        precio: 8.0,
        rate: 4.5,
        rev: 20,
        imagenes: [img("tapa ciega data.jpg")],
    },
    {
        id: 9,
        cat: "Red y datos",
        brand: "Genérico",
        nombre: "Patch Cord RJ45",
        precio: 25.0,
        rate: 4.7,
        rev: 58,
        imagenes: [
            img("pascord.jpg"),
            img("pashcord.jpg"),
            img("patchcord.jpg"),
            img("Patch Cord RJ45.jpg"),
        ],
    },
    {
        id: 10,
        cat: "Red y datos",
        brand: "Siemon",
        nombre: "Patch Panel 24 puertos",
        precio: 245.0,
        rate: 4.8,
        rev: 41,
        imagenes: [
            img("Patch-Panel 24 partes.webp"),
            img("Patch-Panel 24 puertos.webp"),
            img("Patch Panel 24 puertos.webp"),
        ],
    },
    {
        id: 11,
        cat: "Red y datos",
        brand: "Genérico",
        nombre: 'Gabinete rack 19" 12U de pared',
        precio: 720.0,
        rate: 4.8,
        rev: 21,
        tag: "Nuevo",
        imagenes: [
            img("Gabinete rack 19 pulgada 12U de pared.webp"),
            img("Gabinete rack 19 pulgadas 12U de pared.webp"),
            img("Gabinete rack 19 pulgadas 12U de pared.jpg"),
        ],
    },
    {
        id: 12,
        cat: "Fibra óptica",
        brand: "CommScope",
        nombre: "Fibra óptica monomodo 12 hilos por metro",
        precio: 6.5,
        rate: 4.8,
        rev: 72,
        imagenes: [img("Fibra óptica monomodo 12 hilos por metro.png")],
    },
    {
        id: 13,
        cat: "Fibra óptica",
        brand: "Siemon",
        nombre: "Bandeja de empalme 24 puertos",
        precio: 430.0,
        rate: 4.7,
        rev: 26,
        imagenes: [img("bandeja de empalme 24 puertos.jpg")],
    },
    {
        id: 14,
        cat: "Fibra óptica",
        brand: "Panduit",
        nombre: "Patch Cord fibra LC-LC dúplex 3 m",
        precio: 48.0,
        rate: 4.9,
        rev: 64,
        imagenes: [
            img("Patch Cord fibra LC-LC dúplex 3 m.jpg"),
            img("Patch Cord fibra LC-LC duplex 3 m.jpg"),
            img("Patch Cord fibra LC-LC dúplex 3m.jpg"),
        ],
    },
    {
        id: 15,
        cat: "Fibra óptica",
        brand: "Genérico",
        nombre: "Pigtail LC OM3 pack x12",
        precio: 96.0,
        rate: 4.5,
        rev: 18,
        imagenes: [img("Pigtail LC OM3 pack x12.jpg")],
    },
    {
        id: 16,
        cat: "Eléctricos",
        brand: "Indeco",
        nombre: "Cable eléctrico Indeco",
        precio: 185.0,
        rate: 4.8,
        rev: 97,
        tag: "Oferta",
        imagenes: [img("cable electrico indeco.jpg")],
    },
    {
        id: 17,
        cat: "Eléctricos",
        brand: "Indeco",
        nombre: "Cable eléctrico amarillo Indeco",
        precio: 185.0,
        rate: 4.7,
        rev: 44,
        imagenes: [img("cable electrico amarillo indeco.jpg")],
    },
    {
        id: 18,
        cat: "Eléctricos",
        brand: "Indeco",
        nombre: "Cable eléctrico blanco Indeco",
        precio: 185.0,
        rate: 4.7,
        rev: 44,
        imagenes: [img("cable electrico blanco indeco.jpg")],
    },
    {
        id: 19,
        cat: "Eléctricos",
        brand: "Schneider",
        nombre: "Interruptor termomagnético 2x32A",
        precio: 78.5,
        rate: 4.9,
        rev: 53,
        imagenes: [
            img("Interruptor termomagnético 2x32A.webp"),
            img("Interruptor termomagnetico 2x32A.webp"),
            img("Interruptor termomagnético 2x32A.jpg"),
        ],
    },
    {
        id: 20,
        cat: "Eléctricos",
        brand: "Bticino",
        nombre: "Tablero de distribución 12 polos",
        precio: 142.0,
        rate: 4.7,
        rev: 38,
        imagenes: [img("Tablero de distribución 12 polos.png")],
    },
    {
        id: 21,
        cat: "Eléctricos",
        brand: "Steck",
        nombre: "Tomacorriente industrial 32A",
        precio: 39.9,
        rate: 4.6,
        rev: 22,
        imagenes: [img("Tomacorriente industrial 32A.jpg")],
    },
    {
        id: 22,
        cat: "Eléctricos",
        brand: "Bticino",
        nombre: "Tomas comerciales",
        precio: 18.0,
        rate: 4.7,
        rev: 31,
        imagenes: [img("tomas comerciales.jpg")],
    },
    {
        id: 23,
        cat: "Eléctricos",
        brand: "Bticino",
        nombre: "Tomas estabilizadas",
        precio: 22.0,
        rate: 4.8,
        rev: 34,
        imagenes: [img("tomas estabilizadas.jpg")],
    },
    {
        id: 24,
        cat: "Eléctricos",
        brand: "Genérico",
        nombre: "Tubería EMT",
        precio: 210.0,
        rate: 4.5,
        rev: 15,
        imagenes: [img("Tubería EMT.jpg")],
    },
    {
        id: 25,
        cat: "Eléctricos",
        brand: "Genérico",
        nombre: "Kit pozo a tierra varilla + dosis química",
        precio: 560.0,
        rate: 4.9,
        rev: 44,
        tag: "Kit",
        imagenes: [img("Kit pozo a tierra varilla + dosis química.png")],
    },
    {
        id: 26,
        cat: "Energía",
        brand: "APC",
        nombre: "UPS APC 1500VA línea interactiva",
        precio: 1290.0,
        rate: 4.9,
        rev: 156,
        tag: "Más vendido",
        imagenes: [img("UPS APC 1500VA línea interactiva.jpg")],
    },
    {
        id: 27,
        cat: "Energía",
        brand: "APC",
        nombre: "UPS On-line 3000VA rack",
        precio: 4350.0,
        rate: 4.8,
        rev: 31,
        imagenes: [img("UPS On-line 3000VA rack.jpg")],
    },
    {
        id: 28,
        cat: "Energía",
        brand: "Schneider",
        nombre: "Transformador de aislamiento 5 kVA",
        precio: 2980.0,
        rate: 4.7,
        rev: 12,
        imagenes: [img("Transformador de aislamiento 5 kVA.jpg")],
    },
    {
        id: 29,
        cat: "Energía",
        brand: "Genérico",
        nombre: "Grupo electrógeno 6.5 kW a gasolina",
        precio: 3890.0,
        rate: 4.6,
        rev: 21,
        tag: "Nuevo",
        imagenes: [img("Grupo electrógeno 6.5 kW a gasolina.jpg")],
    },
    {
        id: 30,
        cat: "Energía",
        brand: "APC",
        nombre: "Banco de baterías externo para UPS",
        precio: 1150.0,
        rate: 4.8,
        rev: 27,
        imagenes: [img("Banco de baterías externo para UPS.jpg")],
    },
    {
        id: 31,
        cat: "Servicios",
        brand: "INGEDATA",
        nombre: "Certificación de cableado con FLUKE DSX-5000 por punto",
        precio: 35.0,
        rate: 5.0,
        rev: 88,
        tag: "Servicio",
        imagenes: [
            img("Certificación de cableado con FLUKE DSX-5000 por punto.jpg"),
            img("Certificación de cableado con FLUKE DSX-500 por punto.jpg"),
        ],
    },
    {
        id: 32,
        cat: "Servicios",
        brand: "INGEDATA",
        nombre: "Instalación de pozo a tierra incluye medición",
        precio: 1450.0,
        rate: 4.9,
        rev: 46,
        tag: "Servicio",
        imagenes: [img("Instalación de pozo a tierra incluye medición.jpg")],
    },
    {
        id: 33,
        cat: "Servicios",
        brand: "INGEDATA",
        nombre: "Instalación y configuración de CCTV por cámara",
        precio: 180.0,
        rate: 4.8,
        rev: 52,
        tag: "Servicio",
        imagenes: [img("Instalación y configuración de CCTV por cámara.jpg")],
    },
    {
        id: 34,
        cat: "Servicios",
        brand: "INGEDATA",
        nombre: "Mantenimiento preventivo de UPS",
        precio: 320.0,
        rate: 4.9,
        rev: 34,
        tag: "Servicio",
        imagenes: [img("Mantenimiento preventivo de UPS.png")],
    },
    {
        id: 35,
        cat: "Servicios",
        brand: "INGEDATA",
        nombre: "Fabricación de mobiliario en melamina por m²",
        precio: 260.0,
        rate: 4.8,
        rev: 29,
        tag: "Servicio",
        imagenes: [img("Fabricación de mobiliario en melamina por m².png")],
    },
];

const categorias = [
    "Todos",
    "Red y datos",
    "Fibra óptica",
    "Eléctricos",
    "Energía",
    "Servicios",
];

function App() {
    const [categoria, setCategoria] = useState("Todos");
    const [buscar, setBuscar] = useState("");
    const [orden, setOrden] = useState("default");
    const [carrito, setCarrito] = useState({});
    const [carritoAbierto, setCarritoAbierto] = useState(false);
    const [favoritos, setFavoritos] = useState({});
    const [toast, setToast] = useState("");
    const [pagoActivo, setPagoActivo] = useState("tarjeta");

    const lista = useMemo(() => {
        let data = productos.filter((p) => {
            const okCategoria = categoria === "Todos" || p.cat === categoria;
            const texto = `${p.nombre} ${p.brand} ${p.cat}`.toLowerCase();
            const okBuscar = texto.includes(buscar.toLowerCase().trim());
            return okCategoria && okBuscar;
        });

        if (orden === "asc") data = [...data].sort((a, b) => a.precio - b.precio);
        if (orden === "desc") data = [...data].sort((a, b) => b.precio - a.precio);
        if (orden === "az")
            data = [...data].sort((a, b) => a.nombre.localeCompare(b.nombre));

        return data;
    }, [categoria, buscar, orden]);

    const itemsCarrito = Object.entries(carrito)
        .map(([id, cantidad]) => {
            const producto = productos.find((p) => p.id === Number(id));
            return { ...producto, cantidad };
        })
        .filter((item) => item.id);

    const subtotal = itemsCarrito.reduce(
        (acc, item) => acc + item.precio * item.cantidad,
        0
    );
    const igv = subtotal * 0.18;
    const total = subtotal + igv;
    const cantidadTotal = itemsCarrito.reduce((acc, item) => acc + item.cantidad, 0);

    const textoCotizacion =
        itemsCarrito.length === 0
            ? "Hola, deseo solicitar una cotización con INGEDATA."
            : `Hola, deseo cotizar lo siguiente:\n\n${itemsCarrito
                .map(
                    (item) =>
                        `- ${item.nombre} x${item.cantidad} | S/ ${(
                            item.precio * item.cantidad
                        ).toFixed(2)}`
                )
                .join("\n")}\n\nSubtotal: S/ ${subtotal.toFixed(2)}\nIGV: S/ ${igv.toFixed(
                    2
                )}\nTotal referencial: S/ ${total.toFixed(2)}`;

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
                                Empresa peruana especializada en soluciones integrales de infraestructura
                                tecnológica, telecomunicaciones y sistemas eléctricos.
                            </p>
                            <p>
                                Atendemos a empresas corporativas, campamentos mineros, plantas
                                industriales, instituciones y organizaciones de diversos sectores, brindando
                                soluciones confiables, seguras y eficientes.
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
                        {lista.length} producto{lista.length !== 1 ? "s" : ""}
                    </div>

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
                                        <span className="stars">★★★★★</span> {p.rate.toFixed(1)}{" "}
                                        <span>({p.rev})</span>
                                    </div>

                                    <div className="priceRow">
                                        <span className="price">
                                            S/ {p.precio.toFixed(2)} <small>+IGV</small>
                                        </span>

                                        <button className="add" onClick={() => agregar(p.id)}>
                                            +
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
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
                                    <div className="p">S/ {item.precio.toFixed(2)}</div>

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