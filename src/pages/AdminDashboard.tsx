import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import "./adminDashboard.css"
import { UseTheme } from "../contexts/ThemeContext"
 
/* ══════════════════════════════════════════════════════════
   TIPOS
══════════════════════════════════════════════════════════ */
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
 
type FormData = Omit<House, "_id" | "createdAt"> & {
    imageUrl: (File | string)[]
}
 
const EMPTY_FORM: FormData = {
    title: "Cada Adosada", direction: "Alsina 419", operation: "Venta", ubication: "Ramos Mejía",
    price: "495000", typeOfHouse: "Casa", description: "Hermoso Caseron Antiguo", condition: "Excelente",
    ambients: "7", bathrooms: "5", years: "80", taxes: "No tiene",
    covered: "400", uncovered: "65", area: "465", maps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.4836978348512!2d-58.59427952346842!3d-34.642485459548155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcc78680e101bf%3A0x22f9e48dbcffb16f!2sAm%C3%A9rica%20191%2C%20B1706%20Haedo%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1776883363521!5m2!1ses-419!2sar", imageUrl: []
}
 
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`
 
/* ══════════════════════════════════════════════════════════
   COMPONENTE
══════════════════════════════════════════════════════════ */
const AdminDashboard = () => {
    const { theme } = UseTheme()
 
    const [houses, setHouses]           = useState<House[]>([])
    const [loadingList, setLoadingList] = useState(false)
 
    const [showCreate, setShowCreate]       = useState(false)
    const [formData, setFormData]           = useState<FormData | any>(EMPTY_FORM)
    const [coverIndex, setCoverIndex]       = useState(0)
    const [loadingCreate, setLoadingCreate] = useState(false)
    const [errorCreate, setErrorCreate]     = useState<string | null>(null)
    const [dragOver, setDragOver]           = useState(false)
 
    const [editHouse, setEditHouse]           = useState<House | null>(null)
    const [editForm, setEditForm]             = useState<FormData>(EMPTY_FORM)
    const [editCover, setEditCover]           = useState(0)
    const [newEditImages, setNewEditImages]   = useState<File[]>([])
    const [loadingEdit, setLoadingEdit]       = useState(false)
    const [errorEdit, setErrorEdit]           = useState<string | null>(null)
    const [dragOverEdit, setDragOverEdit]     = useState(false)
 
    const [deleteId, setDeleteId]     = useState<string | null>(null)
    const [loadingDel, setLoadingDel] = useState(false)
 
    /* ── GET ──────────────────────────────────────────────── */
    const getHouses = async () => {
        try {
            setLoadingList(true)
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/houses`,
                { withCredentials: true }
            )
            setHouses(res.data)
        } catch (e) {
            console.error("Error cargando propiedades", e)
        } finally {
            setLoadingList(false)
        }
    }
 
    useEffect(() => { getHouses() }, [])
 
    /* ── CLOUDINARY ───────────────────────────────────────── */
    const uploadToCloudinary = async (files: File[]): Promise<string[]> => {
        const urls: string[] = []
        for (const file of files) {
            const fd = new FormData()
            fd.append("file", file)
            fd.append("upload_preset", "Boggero")
            const res = await axios.post(CLOUDINARY_URL, fd)
            if (!res?.data?.secure_url) throw new Error("CLOUDINARY_ERROR")
            urls.push(res.data.secure_url)
        }
        return urls
    }
 
    /* ══════════════════════════════════════════════════════
       CREAR
    ══════════════════════════════════════════════════════ */
    const handleSetCreate = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev : any) => ({ ...prev, [name]: value }))
    }
 
    const addImages = (files: FileList | File[]) => {
        const arr = Array.from(files)
        if (formData.imageUrl.length + arr.length > 25) { alert("Máximo 25 imágenes"); return }
        setFormData((prev : any) => ({ ...prev, imageUrl: [...prev.imageUrl, ...arr] }))
    }
 
    const removeCreateImage = (index: number) => {
        setFormData((prev : any) => ({ ...prev, imageUrl: prev.imageUrl.filter((_: any, i: any) => i !== index) }))
        if (coverIndex >= index && coverIndex > 0) setCoverIndex(c => c - 1)
    }
 
    const moveCreateImage = (from: number, to: number) => {
        const imgs = [...formData.imageUrl]
        const [moved] = imgs.splice(from, 1)
        imgs.splice(to, 0, moved)
        setFormData((prev : any) => ({ ...prev, imageUrl: imgs }))
        if (coverIndex === from) setCoverIndex(to)
    }
 
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoadingCreate(true)
        setErrorCreate(null)
        try {
            const files = formData.imageUrl.filter((f: any) => f instanceof File) as File[]
            const ordered = [...files]
            if (coverIndex !== 0 && coverIndex < ordered.length) {
                const [cover] = ordered.splice(coverIndex, 1)
                ordered.unshift(cover)
            }
            const urls = await uploadToCloudinary(ordered)
            const finalData = { ...formData, imageUrl: urls }
 
            await axios.post(
                `${import.meta.env.VITE_API_URL}/createhouse`,
                finalData,
                { withCredentials: true }
            )
            setShowCreate(false)
            setFormData(EMPTY_FORM)
            setCoverIndex(0)
            await getHouses()
        } catch (err: any) {
            setErrorCreate(err.message === "CLOUDINARY_ERROR" ? "cloudinary" : "general")
        } finally {
            setLoadingCreate(false)
        }
    }
 
    /* ══════════════════════════════════════════════════════
       EDITAR
    ══════════════════════════════════════════════════════ */
    const openEdit = (house: House) => {
        setEditHouse(house)
        setEditForm({ ...house })
        setEditCover(0)
        setNewEditImages([])
        setErrorEdit(null)
    }
 
    const handleSetEdit = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setEditForm(prev => ({ ...prev, [name]: value }))
    }
 
    const addEditImages = (files: FileList | File[]) => {
        const arr = Array.from(files)
        const total = (editForm.imageUrl?.length ?? 0) + newEditImages.length + arr.length
        if (total > 25) { alert("Máximo 25 imágenes"); return }
        setNewEditImages(prev => [...prev, ...arr])
    }
 
    const removeEditExistingImage = (index: number) => {
        setEditForm(prev => ({
            ...prev,
            imageUrl: (prev.imageUrl as string[]).filter((_, i) => i !== index)
        }))
        if (editCover >= index && editCover > 0) setEditCover(c => c - 1)
    }
 
    const removeEditNewImage = (index: number) => {
        setNewEditImages(prev => prev.filter((_, i) => i !== index))
    }
 
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editHouse) return
        setLoadingEdit(true)
        setErrorEdit(null)
        try {
            let newUrls: string[] = []
            if (newEditImages.length > 0) newUrls = await uploadToCloudinary(newEditImages)
 
            const allUrls = [...(editForm.imageUrl as string[]), ...newUrls]
            if (editCover !== 0 && editCover < allUrls.length) {
                const [cover] = allUrls.splice(editCover, 1)
                allUrls.unshift(cover)
            }
 
            const { imageUrl: _, ...rest } = editForm
            const finalData = { ...rest, imageUrl: allUrls }
 
            await axios.put(
                `${import.meta.env.VITE_API_URL}/update/${editHouse._id}`,
                finalData,
                { withCredentials: true }
            )
            setEditHouse(null)
            await getHouses()
        } catch (err: any) {
            setErrorEdit(err.message === "CLOUDINARY_ERROR" ? "cloudinary" : "general")
        } finally {
            setLoadingEdit(false)
        }
    }
 
    /* ══════════════════════════════════════════════════════
       ELIMINAR
    ══════════════════════════════════════════════════════ */
    const handleDelete = async () => {
        if (!deleteId) return
        setLoadingDel(true)
        try {
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/delete/${deleteId}`,
                { withCredentials: true }
            )
            setDeleteId(null)
            await getHouses()
        } catch (err) {
            console.error("Error eliminando", err)
        } finally {
            setLoadingDel(false)
        }
    }
 
    const previewUrl = (img: File | string) =>
        img instanceof File ? URL.createObjectURL(img) : img
 
    /* ══════════════════════════════════════════════════════
       RENDER
    ══════════════════════════════════════════════════════ */
    return (
        <div className={`adm-root ${theme}`}>
 
            {/* ── HEADER ── */}
            <header className="adm-header">
                <div>
                    <span className="adm-eyebrow">PANEL ADMINISTRATIVO</span>
                    <h1 className="adm-title">
                        Gestión de<br />
                        <span className="adm-title-rose">Propiedades</span>
                    </h1>
                </div>
                <button
                    className="adm-create-btn"
                    onClick={() => { setShowCreate(true); setFormData(EMPTY_FORM); setCoverIndex(0) }}
                >
                    + NUEVA PROPIEDAD
                </button>
            </header>
 
            {/* ── LISTA ── */}
            <section className="adm-list">
                {loadingList ? (
                    <div className="adm-state">
                        <div className="adm-spinner" />
                        <p>Cargando propiedades...</p>
                    </div>
                ) : houses.length === 0 ? (
                    <div className="adm-state">
                        <p className="adm-state-empty">No hay propiedades cargadas.</p>
                    </div>
                ) : houses.map((house, i) => (
                    <motion.div
                        key={house._id}
                        className="adm-row"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                    >
                        <div className="adm-row-img">
                            <img src={house.imageUrl[0]} alt={house.title} />
                        </div>
                        <div className="adm-row-info">
                            <span className={`adm-op-tag adm-op-${house.operation.toLowerCase()}`}>
                                {house.operation}
                            </span>
                            <p className="adm-row-title">{house.title}</p>
                            <p className="adm-row-dir">{house.direction}</p>
                        </div>
                        <div className="adm-row-meta">
                            <span className="adm-row-price">{house.price}</span>
                            <span className="adm-row-type">{house.typeOfHouse}</span>
                        </div>
                        <div className="adm-row-actions">
                            <button className="adm-edit-btn" onClick={() => openEdit(house)}>EDITAR</button>
                            <button className="adm-del-btn" onClick={() => setDeleteId(house._id)}>ELIMINAR</button>
                        </div>
                    </motion.div>
                ))}
            </section>
 
            {/* ══════════════════════════════════════════════
                MODAL CREAR
            ══════════════════════════════════════════════ */}
            <AnimatePresence>
                {showCreate && (
                    <motion.div className="adm-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div
                            className={`adm-modal ${theme}`}
                            initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="adm-modal-header">
                                <span className="adm-modal-title">NUEVA PROPIEDAD</span>
                                <button className="adm-modal-close" onClick={() => setShowCreate(false)}>✕</button>
                            </div>
 
                            <form className="adm-form" onSubmit={handleCreate}>
                                <HouseFormFields data={formData} onChange={handleSetCreate} />
 
                                <div className="adm-form-section-label">
                                    IMÁGENES ({formData.imageUrl.length}/25) — ★ para marcar portada
                                </div>
 
                                <div
                                    className={`adm-dropzone ${dragOver ? "is-over" : ""}`}
                                    onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={e => { e.preventDefault(); setDragOver(false); addImages(e.dataTransfer.files) }}
                                    onClick={() => document.getElementById("create-file-input")?.click()}
                                >
                                    <span>📁 Arrastrá imágenes o hacé click para seleccionar</span>
                                    <small>Máximo 25 · JPG, PNG, WEBP</small>
                                    <input id="create-file-input" type="file" multiple accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={e => e.target.files && addImages(e.target.files)}
                                    />
                                </div>
 
                                {formData.imageUrl.length > 0 && (
                                    <div className="adm-img-preview-grid">
                                        {formData.imageUrl.map((img: any, i: any) => (
                                            <div key={i} className={`adm-img-thumb ${coverIndex === i ? "is-cover" : ""}`}>
                                                <img src={previewUrl(img)} alt={`img-${i}`} />
                                                <div className="adm-img-thumb-actions">
                                                    <button type="button" className="adm-thumb-cover" title="Portada" onClick={() => setCoverIndex(i)}>
                                                        {coverIndex === i ? "★" : "☆"}
                                                    </button>
                                                    {i > 0 && (
                                                        <button type="button" className="adm-thumb-move" onClick={() => moveCreateImage(i, i - 1)}>←</button>
                                                    )}
                                                    {i < formData.imageUrl.length - 1 && (
                                                        <button type="button" className="adm-thumb-move" onClick={() => moveCreateImage(i, i + 1)}>→</button>
                                                    )}
                                                    <button type="button" className="adm-thumb-del" onClick={() => removeCreateImage(i)}>✕</button>
                                                </div>
                                                {coverIndex === i && <span className="adm-cover-label">PORTADA</span>}
                                            </div>
                                        ))}
                                    </div>
                                )}
 
                                {errorCreate === "cloudinary" && <p className="adm-error">Error al subir imágenes. Verificá tu conexión.</p>}
                                {errorCreate === "general"   && <p className="adm-error">Error al crear la propiedad. Intentá nuevamente.</p>}
 
                                <div className="adm-form-footer">
                                    <button type="button" className="adm-cancel-btn" onClick={() => setShowCreate(false)}>CANCELAR</button>
                                    <button type="submit" className="adm-submit-btn" disabled={loadingCreate}>
                                        {loadingCreate ? "CREANDO..." : "CREAR PROPIEDAD"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
 
            {/* ══════════════════════════════════════════════
                MODAL EDITAR
            ══════════════════════════════════════════════ */}
            <AnimatePresence>
                {editHouse && (
                    <motion.div className="adm-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div
                            className={`adm-modal ${theme}`}
                            initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="adm-modal-header">
                                <span className="adm-modal-title">EDITAR PROPIEDAD</span>
                                <button className="adm-modal-close" onClick={() => setEditHouse(null)}>✕</button>
                            </div>
 
                            <form className="adm-form" onSubmit={handleUpdate}>
                                <HouseFormFields data={editForm} onChange={handleSetEdit} />
 
                                <div className="adm-form-section-label">
                                    IMÁGENES ACTUALES ({(editForm.imageUrl as string[]).length}) — ★ portada · ✕ eliminar
                                </div>
 
                                <div className="adm-img-preview-grid">
                                    {(editForm.imageUrl as string[]).map((url, i) => (
                                        <div key={i} className={`adm-img-thumb ${editCover === i ? "is-cover" : ""}`}>
                                            <img src={url} alt={`img-${i}`} />
                                            <div className="adm-img-thumb-actions">
                                                <button type="button" className="adm-thumb-cover" onClick={() => setEditCover(i)}>
                                                    {editCover === i ? "★" : "☆"}
                                                </button>
                                                <button type="button" className="adm-thumb-del" onClick={() => removeEditExistingImage(i)}>✕</button>
                                            </div>
                                            {editCover === i && <span className="adm-cover-label">PORTADA</span>}
                                        </div>
                                    ))}
                                </div>
 
                                <div className="adm-form-section-label" style={{ marginTop: "1.5rem" }}>
                                    AGREGAR IMÁGENES NUEVAS ({newEditImages.length})
                                </div>
 
                                <div
                                    className={`adm-dropzone ${dragOverEdit ? "is-over" : ""}`}
                                    onDragOver={e => { e.preventDefault(); setDragOverEdit(true) }}
                                    onDragLeave={() => setDragOverEdit(false)}
                                    onDrop={e => { e.preventDefault(); setDragOverEdit(false); addEditImages(e.dataTransfer.files) }}
                                    onClick={() => document.getElementById("edit-file-input")?.click()}
                                >
                                    <span>📁 Arrastrá imágenes o hacé click</span>
                                    <input id="edit-file-input" type="file" multiple accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={e => e.target.files && addEditImages(e.target.files)}
                                    />
                                </div>
 
                                {newEditImages.length > 0 && (
                                    <div className="adm-img-preview-grid">
                                        {newEditImages.map((file, i) => (
                                            <div key={i} className="adm-img-thumb">
                                                <img src={previewUrl(file)} alt={`new-${i}`} />
                                                <div className="adm-img-thumb-actions">
                                                    <button type="button" className="adm-thumb-del" onClick={() => removeEditNewImage(i)}>✕</button>
                                                </div>
                                                <span className="adm-new-label">NUEVA</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
 
                                {errorEdit === "cloudinary" && <p className="adm-error">Error al subir imágenes.</p>}
                                {errorEdit === "general"   && <p className="adm-error">Error al guardar cambios.</p>}
 
                                <div className="adm-form-footer">
                                    <button type="button" className="adm-cancel-btn" onClick={() => setEditHouse(null)}>CANCELAR</button>
                                    <button type="submit" className="adm-submit-btn" disabled={loadingEdit}>
                                        {loadingEdit ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
 
            {/* ══════════════════════════════════════════════
                MODAL CONFIRMAR ELIMINAR
            ══════════════════════════════════════════════ */}
            <AnimatePresence>
                {deleteId && (
                    <motion.div className="adm-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div
                            className={`adm-confirm ${theme}`}
                            initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
                        >
                            <p className="adm-confirm-title">¿Eliminar esta propiedad?</p>
                            <p className="adm-confirm-sub">Esta acción no se puede deshacer.</p>
                            <div className="adm-confirm-actions">
                                <button className="adm-cancel-btn" onClick={() => setDeleteId(null)}>CANCELAR</button>
                                <button className="adm-del-confirm-btn" onClick={handleDelete} disabled={loadingDel}>
                                    {loadingDel ? "ELIMINANDO..." : "SÍ, ELIMINAR"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
 
        </div>
    )
}
 
/* ══════════════════════════════════════════════════════════
   SUBCOMPONENTES
══════════════════════════════════════════════════════════ */
const HouseFormFields = ({
    data, onChange
}: {
    data: FormData
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
}) => (
    <div className="adm-fields">
        <div className="adm-form-section-label">INFORMACIÓN PRINCIPAL</div>
        <div className="adm-fields-grid">
            <Field label="Título"            name="title"       value={data.title}       onChange={onChange} required />
            <Field label="Dirección"         name="direction"   value={data.direction}   onChange={onChange} required />
            <Field label="Ubicación"         name="ubication"   value={data.ubication}   onChange={onChange} required />
            <Field label="Precio"            name="price"       value={data.price}       onChange={onChange} required />
            <SelectField label="Operación"   name="operation"   value={data.operation}   onChange={onChange} required
                options={["Venta", "Alquiler", "Temporal"]} />
            <SelectField label="Tipo"        name="typeOfHouse" value={data.typeOfHouse} onChange={onChange} required
                options={["Casa", "Departamento", "PH", "Local Comercial", "Oficina", "Terreno", "Quinta"]} />
        </div>
 
        <div className="adm-form-section-label" style={{ marginTop: "1.5rem" }}>CARACTERÍSTICAS</div>
        <div className="adm-fields-grid">
            <SelectField label="Condición"       name="condition"  value={data.condition}  onChange={onChange} required
                options={["Excelente", "Muy bueno", "Bueno", "Regular", "A reciclar"]} />
            <Field label="Ambientes"             name="ambients"   value={data.ambients}   onChange={onChange} required />
            <Field label="Baños"                 name="bathrooms"  value={data.bathrooms}  onChange={onChange} required />
            <Field label="Antigüedad (años)"     name="years"      value={data.years}      onChange={onChange} required />
            <Field label="Expensas"              name="taxes"      value={data.taxes}      onChange={onChange} required />
            <Field label="M² cubiertos"          name="covered"    value={data.covered}    onChange={onChange} required />
            <Field label="M² descubiertos"       name="uncovered"  value={data.uncovered}  onChange={onChange} required />
            <Field label="M² totales"            name="area"       value={data.area}       onChange={onChange} required />
        </div>
 
        <div className="adm-form-section-label" style={{ marginTop: "1.5rem" }}>DESCRIPCIÓN Y MAPA</div>
        <div className="adm-fields-grid">
            <div className="adm-form-group adm-span-2">
                <label className="adm-label">Descripción</label>
                <textarea className="adm-textarea" name="description" value={data.description} onChange={onChange} required rows={4} />
            </div>
            <div className="adm-form-group adm-span-2">
                <label className="adm-label">URL Embed Google Maps</label>
                <input className="adm-input" type="text" name="maps" value={data.maps} onChange={onChange} required
                    placeholder="https://www.google.com/maps/embed?..." />
            </div>
        </div>
    </div>
)
 
const Field = ({ label, name, value, onChange, required }: {
    label: string; name: string; value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean
}) => (
    <div className="adm-form-group">
        <label className="adm-label">{label}</label>
        <input className="adm-input" type="text" name={name} value={value} onChange={onChange} required={required} />
    </div>
)
 
const SelectField = ({ label, name, value, onChange, options, required }: {
    label: string; name: string; value: string
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    options: string[]; required?: boolean
}) => (
    <div className="adm-form-group">
        <label className="adm-label">{label}</label>
        <select className="adm-select" name={name} value={value} onChange={onChange} required={required}>
            <option value="">Seleccioná</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    </div>
)
 
export default AdminDashboard