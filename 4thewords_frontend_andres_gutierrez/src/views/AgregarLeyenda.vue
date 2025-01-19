<template>
    <div class="container mt-4">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card shadow-lg">
                    <div class="card-header bg-dark text-white text-center">
                        <h3>Agregar Nueva Leyenda</h3>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="validarFormulario" enctype="multipart/form-data">
                            <div class="mb-3">
                                <label for="nombre" class="form-label">Nombre</label>
                                <input type="text" id="nombre" v-model="form.nombre" class="form-control"
                                    maxlength="100" placeholder="Escribe el nombre de la leyenda" />
                                <small v-if="errores.nombre" class="text-danger">{{ errores.nombre }}</small>
                            </div>
                            <div class="mb-3">
                                <label for="descripcion" class="form-label">Descripcion</label>
                                <textarea id="descripcion" v-model="form.descripcion" class="form-control" rows="3"
                                    placeholder="Escribe una descripción breve"></textarea>
                                <small v-if="errores.descripcion" class="text-danger">{{ errores.descripcion }}</small>
                            </div>
                            <div class="mb-3">
                                <label for="fecha_de_leyenda" class="form-label">Fecha de Leyenda</label>
                                <input type="date" id="fecha_de_leyenda" v-model="form.fecha_de_leyenda"
                                    class="form-control" :max="maxFecha" />
                                <small v-if="errores.fecha_de_leyenda" class="text-danger">{{ errores.fecha_de_leyenda
                                    }}</small>
                            </div>
                            <div class="mb-3">
                                <label for="categoria" class="form-label">Categoria</label>
                                <select id="categoria" v-model="form.categoria" class="form-select">
                                    <option value="" disabled>Selecciona una categoria</option>
                                    <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
                                        {{ categoria.nombre }}
                                    </option>
                                </select>
                                <small v-if="errores.categoria" class="text-danger">{{ errores.categoria }}</small>
                            </div>
                            <div class="mb-3">
                                <label for="provincia" class="form-label">Provincia</label>
                                <select id="provincia" v-model="form.provincia" class="form-select"
                                    @change="cargarCantones">
                                    <option value="" disabled>Selecciona una provincia</option>
                                    <option v-for="provincia in provincias" :key="provincia.id" :value="provincia.id">
                                        {{ provincia.nombre }}
                                    </option>
                                </select>
                                <small v-if="errores.provincia" class="text-danger">{{ errores.provincia }}</small>
                            </div>
                            <div class="mb-3">
                                <label for="canton" class="form-label">Canton</label>
                                <select id="canton" v-model="form.canton" class="form-select" @change="cargarDistritos">
                                    <option value="" disabled>Selecciona un canton</option>
                                    <option v-for="canton in cantones" :key="canton.id" :value="canton.id">
                                        {{ canton.nombre }}
                                    </option>
                                </select>
                                <small v-if="errores.canton" class="text-danger">{{ errores.canton }}</small>
                            </div>
                            <div class="mb-3">
                                <label for="distrito" class="form-label">Distrito</label>
                                <select id="distrito" v-model="form.distrito" class="form-select">
                                    <option value="" disabled>Selecciona un distrito</option>
                                    <option v-for="distrito in distritos" :key="distrito.id" :value="distrito.id">
                                        {{ distrito.nombre }}
                                    </option>
                                </select>
                                <small v-if="errores.distrito" class="text-danger">{{ errores.distrito }}</small>
                            </div>
                            <div class="mb-3">
                                <label for="imagen" class="form-label">Imagen</label>
                                <input type="file" id="imagen" ref="imagen" class="form-control" accept="image/*"
                                    @change="vistaPreviaImagen" />
                                <small v-if="errores.imagen" class="text-danger">{{ errores.imagen }}</small>
                            </div>
                            <div v-if="imagenPreview" class="text-center mb-3">
                                <img :src="imagenPreview" alt="Vista previa" class="img-thumbnail"
                                    style="max-width: 100%; height: auto;" />
                                <button type="button" class="btn btn-danger mt-2" @click="eliminarImagen">Eliminar
                                    Imagen</button>
                            </div>
                            <div class="d-grid">
                                <button type="submit" class="btn btn-primary">Agregar Leyenda</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="mostrarModal" class="modal d-block" tabindex="-1" aria-labelledby="successModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title" id="successModalLabel">Exito!!! :)</h5>
                        <button type="button" class="btn-close" aria-label="Cerrar" @click="cerrarModal"></button>
                    </div>
                    <div class="modal-body">
                        La leyenda se ha agregado exitosamente.
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="cerrarModal">
                            Volver al Inicio
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="mostrarModalError" class="modal d-block" tabindex="-1" aria-labelledby="errorModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title" id="errorModalLabel">Error!!! :(</h5>
                        <button type="button" class="btn-close" aria-label="Cerrar" @click="cerrarModalError"></button>
                    </div>
                    <div class="modal-body">
                        {{ mensajeError }}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="cerrarModalError">Cerrar</button>
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
            form: {
                nombre: "",
                descripcion: "",
                fecha_de_leyenda: "",
                categoria: "",
                provincia: "",
                canton: "",
                distrito: "",
            },
            categorias: [],
            provincias: [],
            cantones: [],
            distritos: [],
            imagenPreview: null,
            errores: {},
            maxFecha: new Date().toISOString().split("T")[0],
            mostrarModal: false,
            mostrarModalError: false,
            mensajeError: "",
        };
    },
    methods: {
        async cargarCategorias() {
            const response = await fetch("http://127.0.0.1:8080/categorias");
            this.categorias = await response.json();
        },
        async cargarProvincias() {
            const response = await fetch("http://127.0.0.1:8080/provincias");
            this.provincias = await response.json();
        },
        async cargarCantones() {
            const response = await fetch(`http://127.0.0.1:8080/provincias/${this.form.provincia}/cantones`);
            this.cantones = await response.json();
            this.distritos = [];
        },
        async cargarDistritos() {
            const response = await fetch(`http://127.0.0.1:8080/cantones/${this.form.canton}/distritos`);
            this.distritos = await response.json();
        },
        vistaPreviaImagen(event) {
            const file = event.target.files[0];
            if (file) {
                this.imagenPreview = URL.createObjectURL(file);
            }
        },
        eliminarImagen() {
            this.imagenPreview = null;
            this.$refs.imagen.value = "";
        },
        validarFormulario() {
            this.errores = {};
            if (!this.form.nombre) this.errores.nombre = "El nombre es obligatorio.";
            if (!this.form.descripcion) this.errores.descripcion = "La descripcion es obligatoria.";
            if (!this.form.fecha_de_leyenda) this.errores.fecha_de_leyenda = "La fecha es obligatoria.";
            if (!this.form.categoria) this.errores.categoria = "La categoria es obligatoria.";
            if (!this.form.provincia) this.errores.provincia = "La provincia es obligatoria.";
            if (!this.form.canton) this.errores.canton = "El canton es obligatorio.";
            if (!this.form.distrito) this.errores.distrito = "El distrito es obligatorio.";
            if (!this.$refs.imagen.files[0]) this.errores.imagen = "La imagen es obligatoria.";

            if (Object.keys(this.errores).length > 0) {
                this.mensajeError = "Por favor, completa todos los campos obligatorios.";
                this.mostrarModalError = true;
                return; 
            }

            this.enviarLeyenda();
        },
        async enviarLeyenda() {
            try {
                const formData = new FormData();
                for (const key in this.form) {
                    formData.append(key, this.form[key]);
                }
                formData.append("imagen", this.$refs.imagen.files[0]);

                const response = await fetch("http://127.0.0.1:8080/leyendas", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    const errorResponse = await response.json();
                    throw new Error(errorResponse.detail || "Error al agregar la leyenda");
                }

                this.mostrarModal = true;

                this.form = {
                    nombre: "",
                    descripcion: "",
                    fecha_de_leyenda: "",
                    categoria: "",
                    provincia: "",
                    canton: "",
                    distrito: "",
                };
                this.imagenPreview = null;
                this.$refs.imagen.value = "";
            } catch (error) {
                this.mensajeError = error.message;
                this.mostrarModalError = true; 
                console.error("Error al enviar leyenda:", error);
            }
        },

        cerrarModal() {
            this.mostrarModal = false;
            this.irAInicio();
        },

        irAInicio() {
            this.$router.push("/");
        },

        cerrarModalError() {
            this.mostrarModalError = false;
        },
    },
    mounted() {
        this.cargarCategorias();
        this.cargarProvincias();
    },
};
</script>
  
<style scoped>
.card {
    border-radius: 10px;
}

label {
    font-weight: bold;
}

button {
    font-size: 16px;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1050;
}

.modal-dialog {
    max-width: 500px;
    width: 90%;
}

.modal-header.bg-danger {
    background-color: #dc3545 !important;
}

@media (max-width: 768px) {
    h3 {
        font-size: 1.5rem;
    }

    button {
        font-size: 14px;
    }
}
</style>
