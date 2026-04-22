import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import "./housesView.css"
import { UseTheme } from "../contexts/ThemeContext"
import axios from "axios"
/* import foto1 from "../assets/foto-boggero-1.jpg" */

interface House {
    _id: string
    title: string
    direction: string
    operation: string
    ubication: string
    price: string
    typeOfHouse: string
    description: string
    condition: string
    ambients: string
    bathrooms: string
    years: string
    taxes: string
    covered: string
    uncovered: string
    area: string
    imageUrl: string[]
    maps: string
    createdAt: string
}

const operationColor: Record<string, string> = {
    "Venta":    "hv-tag--venta",
    "Alquiler": "hv-tag--alquiler",
    "Temporal": "hv-tag--temporal",
}

const ITEMS_PER_PAGE = 6

const HousesView = () => {
    const { theme } = UseTheme()
    const [houses, setHouses]     = useState<House[]>([])
    const [loading, setLoading]   = useState(false)
    const [error, setError]       = useState(false)
    const [filter, setFilter]     = useState<string>("Todos")
    const [imgIndex, setImgIndex] = useState<Record<string, number>>({})
    const [page, setPage]         = useState<number>(1)

    const getHouses = async () => {
        try {
            setError(false)
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/houses`)
            setHouses(response.data)
        } catch (error: any) {
            setError(true)
            console.log("Error al traer casas", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { getHouses() }, [])

    // Resetear página al cambiar filtro
    useEffect(() => { setPage(1) }, [filter])

    const operations = ["Todos", ...Array.from(new Set(houses.map(h => h.operation)))]

    const filtered = filter === "Todos"
        ? houses
        : houses.filter(h => h.operation === filter)

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)

    const paginated = filtered.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    )

    const nextImg = (id: string, total: number) => {
        setImgIndex(prev => ({ ...prev, [id]: ((prev[id] ?? 0) + 1) % total }))
    }

    const prevImg = (id: string, total: number) => {
        setImgIndex(prev => ({ ...prev, [id]: ((prev[id] ?? 0) - 1 + total) % total }))
    }

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

    const handlePage = (n: number) => {
        setPage(n)
        scrollToTop()
    }

    /* ── ESTADOS ── */
    if (loading) return (
        <div className={`hv-root ${theme}`}>
            <div className="hv-state-wrap">
                <div className="hv-spinner" />
                <p className="hv-state-text">Cargando propiedades...</p>
            </div>
        </div>
    )

    if (error) return (
        <div className={`hv-root ${theme}`}>
            <div className="hv-state-wrap">
                <p className="hv-state-text hv-state-error">Error al cargar las propiedades. Intentá nuevamente.</p>
                <button className="hv-retry-btn" onClick={getHouses}>Reintentar</button>
            </div>
        </div>
    )

    if (!loading && houses.length === 0) return (
        <div className={`hv-root ${theme}`}>
            <div className="hv-state-wrap">
                <p className="hv-state-text">No hay propiedades disponibles por el momento.</p>
            </div>
        </div>
    )

    return (
        <div className={`hv-root ${theme}`}>

            {/* ── HEADER ── */}
            <header className="hv-header">
                <div className="hv-header-inner">
                    <span className="hv-eyebrow">BOGGERO PROPIEDADES</span>
                    <h1 className="hv-title">
                        Propiedades<br />
                        <span className="hv-title-outline">disponibles.</span>
                    </h1>
                    <p className="hv-subtitle">
                        {filtered.length} propiedad{filtered.length !== 1 ? "es" : ""} en cartera · Actualizadas al día
                    </p>
                </div>

                {/* Filtros */}
                <div className="hv-filters">
                    {operations.map(op => (
                        <button
                            key={op}
                            className={`hv-filter-btn ${filter === op ? "is-active" : ""}`}
                            onClick={() => setFilter(op)}
                        >
                            {op}
                        </button>
                    ))}
                </div>
            </header>

            {/* ── GRID ── */}
            <section className="hv-grid">
                {paginated.map((house, i) => {
                    const currentImg  = imgIndex[house._id] ?? 0
                    const hasMultiple = house.imageUrl.length > 1

                    return (
                        <motion.article
                            key={house._id}
                            className="hv-card"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.15 }}
                            transition={{ duration: 0.6, delay: (i % 2) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {/* ── IMAGEN ── */}
                            <div className="hv-card-img-wrap">
                                <img
                                    src={house.imageUrl[currentImg]}
                                    alt={house.title}
                                    className="hv-card-img"
                                />

                                <div className="hv-card-img-overlay" />

                                <span className={`hv-tag ${operationColor[house.operation] ?? "hv-tag--venta"}`}>
                                    {house.operation}
                                </span>

                                <span className="hv-tag-type">{house.typeOfHouse}</span>

                                {hasMultiple && (
                                    <>
                                        <button
                                            className="hv-img-nav hv-img-nav--prev"
                                            onClick={() => prevImg(house._id, house.imageUrl.length)}
                                        >
                                            ‹
                                        </button>
                                        <button
                                            className="hv-img-nav hv-img-nav--next"
                                            onClick={() => nextImg(house._id, house.imageUrl.length)}
                                        >
                                            ›
                                        </button>
                                        <div className="hv-img-dots">
                                            {house.imageUrl.map((_, di) => (
                                                <span
                                                    key={di}
                                                    className={`hv-img-dot ${di === currentImg ? "is-active" : ""}`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* ── BODY ── */}
                            <div className="hv-card-body">

                                <div className="hv-card-price-row">
                                    <span className="hv-card-price">{house.price}</span>
                                    <span className="hv-card-condition">{house.condition}</span>
                                </div>

                                <h2 className="hv-card-title">{house.title}</h2>

                                <p className="hv-card-direction">
                                    <span className="hv-card-direction-icon">📍</span>
                                    {house.direction}
                                </p>

                                <div className="hv-card-divider" />

                                <div className="hv-card-stats">
                                    <div className="hv-stat">
                                        <span className="hv-stat-val">{house.ambients}</span>
                                        <span className="hv-stat-lbl">Amb.</span>
                                    </div>
                                    <div className="hv-stat">
                                        <span className="hv-stat-val">{house.bathrooms}</span>
                                        <span className="hv-stat-lbl">Baños</span>
                                    </div>
                                    <div className="hv-stat">
                                        <span className="hv-stat-val">{house.covered}m²</span>
                                        <span className="hv-stat-lbl">Cubiertos</span>
                                    </div>
                                    <div className="hv-stat">
                                        <span className="hv-stat-val">{house.area}m²</span>
                                        <span className="hv-stat-lbl">Total</span>
                                    </div>
                                </div>

                                <p className="hv-card-desc">{house.description}</p>

                                <div className="hv-card-footer">
                                    <span className="hv-card-taxes">Expensas: {house.taxes}</span>
                                    <a href={`/propiedades/${house._id}`} className="hv-card-cta">
                                        Ver detalle →
                                    </a>
                                </div>
                            </div>
                        </motion.article>
                    )
                })}
            </section>

            {/* ── PAGINACIÓN ── */}
            {totalPages > 1 && (
                <div className="hv-pagination">
                    <button
                        className="hv-page-btn hv-page-btn--arrow"
                        onClick={() => handlePage(page - 1)}
                        disabled={page === 1}
                    >
                        ←
                    </button>

                    <div className="hv-page-numbers">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => {
                            const show       = n === 1 || n === totalPages || Math.abs(n - page) <= 1
                            const isEllipsis = !show && (n === 2 || n === totalPages - 1)

                            if (isEllipsis) return <span key={n} className="hv-page-ellipsis">···</span>
                            if (!show) return null

                            return (
                                <button
                                    key={n}
                                    className={`hv-page-btn ${page === n ? "is-active" : ""}`}
                                    onClick={() => handlePage(n)}
                                >
                                    {n}
                                </button>
                            )
                        })}
                    </div>

                    <button
                        className="hv-page-btn hv-page-btn--arrow"
                        onClick={() => handlePage(page + 1)}
                        disabled={page === totalPages}
                    >
                        →
                    </button>

                    <span className="hv-page-info">
                        {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} de {filtered.length}
                    </span>
                </div>
            )}

        </div>
    )
}

export default HousesView