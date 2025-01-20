<template>
    <div class="mostrar-leyendas-wrapper">
        <button ref="filterButton" class="btn btn-secondary toggle-filter-button" @click="toggleFiltro">Filtrar</button>
        <div v-if="mostrarFiltro" class="filtro-lateral" ref="filterMenu">
            <div class="card shadow h-100">
                <div class="card-header bg-primary text-white">
                    <h5 class="card-title">Filtros</h5>
                    <button class="btn btn-light btn-sm float-end" @click="limpiarFiltros">Limpiar Filtros</button>
                </div>
                <div class="card-body overflow-auto">
                    <label class="form-label">Provincias</label>
                    <div v-for="provincia in provincias" :key="provincia.id" class="form-check">
                        <input type="checkbox" :id="'provincia-' + provincia.id" :value="provincia.id"
                            :checked="filtros.provincias.includes(provincia.id)"
                            @change="actualizarFiltro('provincias', provincia.id, $event)" class="form-check-input" />
                        <label :for="'provincia-' + provincia.id" class="form-check-label">{{ provincia.nombre
                            }}</label>
                    </div>

                    <label class="form-label mt-3">Cantones</label>
                    <div v-for="canton in cantones" :key="canton.id" class="form-check">
                        <input type="checkbox" :id="'canton-' + canton.id" :value="canton.id"
                            :checked="filtros.cantones.includes(canton.id)"
                            @change="actualizarFiltro('cantones', canton.id, $event)" class="form-check-input" />
                        <label :for="'canton-' + canton.id" class="form-check-label">{{ canton.nombre }}</label>
                    </div>

                    <label class="form-label mt-3">Distritos</label>
                    <div v-for="distrito in distritos" :key="distrito.id" class="form-check">
                        <input type="checkbox" :id="'distrito-' + distrito.id" :value="distrito.id"
                            :checked="filtros.distritos.includes(distrito.id)"
                            @change="actualizarFiltro('distritos', distrito.id, $event)" class="form-check-input" />
                        <label :for="'distrito-' + distrito.id" class="form-check-label">{{ distrito.nombre }}</label>
                    </div>

                    <label class="form-label mt-3">Categorías</label>
                    <div v-for="categoria in categorias" :key="categoria.id" class="form-check">
                        <input type="checkbox" :id="'categoria-' + categoria.id" :value="categoria.id"
                            :checked="filtros.categorias.includes(categoria.id)"
                            @change="actualizarFiltro('categorias', categoria.id, $event)" class="form-check-input" />
                        <label :for="'categoria-' + categoria.id" class="form-check-label">{{ categoria.nombre
                            }}</label>
                    </div>

                    <button class="btn btn-primary w-100 mt-3" @click="filtrarLeyendas">Aplicar Filtros</button>
                </div>
            </div>
        </div>

        <div class="container-fluid">
            <div class="row mt-4 justify-content-center">
                <div class="col-md-8">
                    <div class="book-container">
                        <div class="book-page">
                            <div v-if="paginaActual === 0" class="cover-page">
                                <h2>Bienvenido al Épico Mundo de Leyendas Ticas</h2>
                                <p>Aprendamos un poco de nuestro folklore</p>
                            </div>
                            <div v-else class="legend-page">
                                <h4>{{ leyendas[paginaActual - 1].nombre }}</h4>
                                <p>{{ leyendas[paginaActual - 1].descripcion }}</p>
                                <img :src="'http://127.0.0.1:8080' + leyendas[paginaActual - 1].imagen" alt="Leyenda"
                                    class="img-fluid my-3" />
                                <small class="text-muted">{{ leyendas[paginaActual - 1].fecha_de_leyenda }}</small>
                                <div class="d-flex justify-content-end mt-3">
                                    <button class="btn btn-warning me-2"
                                        @click="editarLeyenda(leyendas[paginaActual - 1].id)">
                                        Editar
                                    </button>
                                    <button class="btn btn-danger"
                                        @click="confirmarEliminar(leyendas[paginaActual - 1].id)">
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="navigation mt-3 d-flex justify-content-between">
                        <button class="btn btn-secondary" :disabled="paginaActual === 0" @click="paginaAnterior">
                            Anterior
                        </button>
                        <button class="btn btn-secondary" :disabled="paginaActual === leyendas.length"
                            @click="paginaSiguiente">
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="mostrarModalEliminar" class="modal d-block" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title">Confirmación de Eliminación</h5>
                        <button type="button" class="btn-close" @click="cancelarEliminar"></button>
                    </div>
                    <div class="modal-body">
                        <p>¿Estás seguro de que deseas eliminar esta leyenda?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="cancelarEliminar">Cancelar</button>
                        <button type="button" class="btn btn-danger"
                            @click="eliminarLeyendaConfirmada">Eliminar</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="mostrarModalExito" class="modal d-block" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title">¡Éxito!</h5>
                        <button type="button" class="btn-close" @click="cerrarModalExito"></button>
                    </div>
                    <div class="modal-body">
                        <p>La leyenda se ha eliminado exitosamente.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="cerrarModalExito">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="mostrarModalError" class="modal d-block" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title">Error</h5>
                        <button type="button" class="btn-close" @click="cerrarModalError"></button>
                    </div>
                    <div class="modal-body">
                        <p>No se encontraron leyendas que coincidan con los parámetros de búsqueda.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="cerrarModalError">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            leyendas: [],
            paginaActual: 0,
            mostrarFiltro: false,
            filtros: {
                nombre: "",
                cantones: [],
                distritos: [],
                provincias: [],
                categorias: [],
            },
            provincias: [],
            cantones: [],
            distritos: [],
            categorias: [],
            mostrarModalEliminar: false,
            leyendaAEliminar: null,
            mostrarModalExito: false,
            mostrarModalError: false,
        };
    },
    methods: {

        async obtenerLeyendas() {
            try {
                const response = await fetch("http://127.0.0.1:8080/leyendas");
                if (!response.ok) throw new Error("Error al obtener las leyendas");
                this.leyendas = await response.json();
            } catch (error) {
                console.error("Error al consumir el API:", error);
            }
        },

        irAAgregar() {
            this.$router.push("/crear");
        },
        toggleFiltro() {
            this.mostrarFiltro = !this.mostrarFiltro;
        },
        filtrarLeyendas() {
            console.log("Aplicando filtros:", this.filtros);
        },
        async obtenerOpcionesFiltros() {
            try {
                const [provinciasRes, cantonesRes, distritosRes, categoriasRes] = await Promise.all([
                    fetch("http://127.0.0.1:8080/provincias"),
                    fetch("http://127.0.0.1:8080/cantones"),
                    fetch("http://127.0.0.1:8080/distritos"),
                    fetch("http://127.0.0.1:8080/categorias"),
                ]);

                this.provincias = await provinciasRes.json();
                this.cantones = await cantonesRes.json();
                this.distritos = await distritosRes.json();
                this.categorias = await categoriasRes.json();
            } catch (error) {
                console.error("Error al cargar las opciones de filtros:", error);
            }
        },
        async filtrarLeyendas() {
            try {
                const params = new URLSearchParams();
                if (this.filtros.provincias.length > 0) {
                    this.filtros.provincias.forEach((id) => params.append("provincias", id));
                }
                if (this.filtros.cantones.length > 0) {
                    this.filtros.cantones.forEach((id) => params.append("cantones", id));
                }
                if (this.filtros.distritos.length > 0) {
                    this.filtros.distritos.forEach((id) => params.append("distritos", id));
                }
                if (this.filtros.categorias.length > 0) {
                    this.filtros.categorias.forEach((id) => params.append("categorias", id));
                }
                const response = await fetch(`http://127.0.0.1:8080/leyendas/filtrar?${params.toString()}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        this.mostrarModalError = true;
                        return;
                    } else {
                        throw new Error("Error al filtrar las leyendas");
                    }
                }
                const leyendasFiltradas = await response.json();
                if (leyendasFiltradas.length === 0) {
                    this.mostrarModalError = true;
                } else {
                    this.leyendas = leyendasFiltradas;
                    this.paginaActual = 0;
                }
            } catch (error) {
                console.error("Error al filtrar leyendas:", error);
                this.mostrarModalError = true;
            }
        },
        actualizarFiltro(filtro, valor, event) {
            if (event.target.checked) {
                this.filtros[filtro].push(valor);
            } else {
                this.filtros[filtro] = this.filtros[filtro].filter((item) => item !== valor);
            }
        },
        limpiarFiltros() {
            this.filtros = {
                nombre: "",
                cantones: [],
                distritos: [],
                provincias: [],
                categorias: [],
            };
            this.obtenerLeyendas();
        },
        paginaAnterior() {
            if (this.paginaActual > 0) {
                this.paginaActual--;
            }
        },
        paginaSiguiente() {
            if (this.paginaActual < this.leyendas.length) {
                this.paginaActual++;
            }
        },
        editarLeyenda(id) {
            this.$router.push(`/editar/${id}`);
        },
        confirmarEliminar(id) {
            this.leyendaAEliminar = id;
            this.mostrarModalEliminar = true;
        },

        cancelarEliminar() {
            this.mostrarModalEliminar = false;
            this.leyendaAEliminar = null;
        },

        async eliminarLeyendaConfirmada() {
            try {
                const response = await fetch(`http://127.0.0.1:8080/leyendas/${this.leyendaAEliminar}`, {
                    method: "DELETE",
                });

                if (!response.ok) throw new Error("Error al eliminar la leyenda");
                this.leyendas = this.leyendas.filter((leyenda) => leyenda.id !== this.leyendaAEliminar);
                if (this.paginaActual > this.leyendas.length) {
                    this.paginaActual = this.leyendas.length;
                }

                if (this.leyendas.length === 0) {
                    this.paginaActual = 0;
                }
                this.mostrarModalEliminar = false;
                this.mostrarModalExito = true;
                this.leyendaAEliminar = null;
            } catch (error) {
                console.error("Error al eliminar la leyenda:", error);
                this.mensajeError = "No se pudo eliminar la leyenda.";
                this.mostrarModalEliminar = false;
                this.mostrarModalError = true;
            }
        },
        irALeyenda(leyendaId) {
            const index = this.leyendas.findIndex((leyenda) => leyenda.id === Number(leyendaId));
            if (index !== -1) {
                this.paginaActual = index + 1;
            }
        },
        cerrarModalExito() {
            this.mostrarModalExito = false;
        },
        cerrarModalError() {
            this.mostrarModalError = false;
        },
        cerrarFiltroSiEsExterno(event) {
            const menu = this.$refs.filterMenu;
            const button = this.$refs.filterButton;
            if (menu && !menu.contains(event.target) && button && !button.contains(event.target)) {
                this.mostrarFiltro = false;
            }
        },
    },
    mounted() {
        this.obtenerLeyendas();
        this.obtenerOpcionesFiltros();
        document.addEventListener("click", this.cerrarFiltroSiEsExterno);
        this.obtenerLeyendas().then(() => {
            const leyendaId = this.$route.query.leyenda;
            if (leyendaId) {
                this.irALeyenda(leyendaId);
            }
        });
    },
    beforeUnmount() {
        document.removeEventListener("click", this.cerrarFiltroSiEsExterno);
    },
};
</script>


<style scoped>
.mostrar-leyendas-container {
    display: flex;
    flex-direction: row;
}

.filtro-lateral {
    width: 300px;
    background-color: #f8f9fa;
    border-right: 1px solid #ddd;
    padding: 20px;
    overflow-y: auto;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
}

.contenido-libro {
    flex-grow: 1;
    padding: 20px;
    margin-left: 300px;
    transition: margin-left 0.3s ease-in-out;
}

.book-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    height: 500px;
    margin: 0 auto;
    border: 3px solid #333;
    border-radius: 10px;
    background: #fdf7e3;
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.3);
    padding: 20px;
    overflow: hidden;
}

.book-page {
    width: 100%;
    height: 100%;
    text-align: center;
}

.cover-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #333;
    height: 100%;
}

.legend-page {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}

.navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.legend-page img {
    max-width: 100%;
    max-height: 50%;
    object-fit: contain;
    margin: 0 auto;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.toggle-filter-button {
    top: 20px;
    left: 20px;
    z-index: 1200;
}

@media (max-width: 1350px) {
    .filtro-lateral {
        width: 80%;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        border: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        height: auto;
        margin-bottom: 20px;
    }

    .contenido-libro {
        margin-left: 0;
    }

}

.contenido-libro {
    flex-grow: 1;
    padding: 20px;
    transition: margin-left 0.3s ease-in-out;
}

.book-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    height: 500px;
    margin: 0 auto;
    border: 3px solid #333;
    border-radius: 10px;
    background: #fdf7e3;
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.3);
    padding: 20px;
    overflow: hidden;
}

@media (max-width: 1024px) {
    .book-container {
        height: 500px;
    }

    .navigation button {
        font-size: 14px;
    }
}

@media (max-width: 768px) {
    .book-container {
        height: 500px;
    }
}

@media (max-width: 576px) {
    .book-container {
        height: 500px;
    }

    .navigation button {
        font-size: 12px;
        padding: 8px;
    }
}

.navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.legend-page img {
    max-width: 100%;
    max-height: 50%;
    object-fit: contain;
    margin: 0 auto;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>

