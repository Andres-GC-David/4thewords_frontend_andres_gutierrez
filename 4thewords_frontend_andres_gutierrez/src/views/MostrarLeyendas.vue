<template>
    <div class="container-fluid">
        <div class="row mt-3">
            <div class="col-12 d-flex justify-content-between align-items-center">
                <button class="btn btn-dark" @click="irAAgregar">Agregar Leyenda</button>
                <button class="btn btn-secondary" @click="toggleFiltro">Filtrar</button>
            </div>
        </div>

        <div v-if="mostrarFiltro" class="row mt-3">
            <div class="col-md-4 offset-md-4">
                <div class="card shadow">
                    <div class="card-header bg-primary text-white">
                        <h5 class="card-title">Filtrar Leyendas</h5>
                    </div>
                    <div class="card-body">
                        <input type="text" v-model="filtros.nombre" placeholder="Nombre" class="form-control my-2" />
                        <input type="text" v-model="filtros.provincia" placeholder="Provincia"
                            class="form-control my-2" />
                        <input type="text" v-model="filtros.canton" placeholder="Cantón" class="form-control my-2" />
                        <input type="text" v-model="filtros.distrito" placeholder="Distrito"
                            class="form-control my-2" />
                        <input type="text" v-model="filtros.categoria" placeholder="Categoría"
                            class="form-control my-2" />
                        <button class="btn btn-primary w-100" @click="filtrarLeyendas">Filtrar</button>
                    </div>
                </div>
            </div>
        </div>

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
                                <button class="btn btn-danger" @click="eliminarLeyenda(leyendas[paginaActual - 1].id)">
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
                canton: "",
                distrito: "",
                provincia: "",
                categoria: "",
            },
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
        eliminarLeyenda(id) {
            if (confirm("¿Seguro que deseas eliminar esta leyenda?")) {
                console.log("Eliminando leyenda con ID:", id);
            }
        },
    },
    mounted() {
        this.obtenerLeyendas();
    },
};
</script>


<style scoped>
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
    overflow: hidden;
    padding: 20px;
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


@media (max-width: 768px) {
    .book-container {
        height: 400px;
        width: 100%;
    }

    .navigation button {
        font-size: 14px;
    }
}

@media (max-width: 576px) {
    .book-container {
        height: 350px;
    }

    .navigation button {
        font-size: 12px;
        padding: 8px;
    }
}
</style>
