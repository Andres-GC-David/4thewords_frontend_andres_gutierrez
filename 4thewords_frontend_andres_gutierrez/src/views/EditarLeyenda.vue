<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow-lg">
          <div class="card-header bg-dark text-white text-center">
            <h3>Editar Leyenda</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="validarFormulario">
              <div class="mb-3">
                <label for="nombre" class="form-label">Nombre</label>
                <input type="text" id="nombre" v-model="form.nombre" class="form-control" maxlength="100"
                  placeholder="Escribe el nombre de la leyenda" />
                <small v-if="errores.nombre" class="text-danger">{{ errores.nombre }}</small>
              </div>
              <div class="mb-3">
                <label for="descripcion" class="form-label">Descripción</label>
                <textarea id="descripcion" v-model="form.descripcion" class="form-control" rows="3"
                  placeholder="Escribe una descripción breve"></textarea>
                <small v-if="errores.descripcion" class="text-danger">{{ errores.descripcion }}</small>
              </div>
              <div class="mb-3">
                <label for="fecha_de_leyenda" class="form-label">Fecha de Leyenda</label>
                <input type="date" id="fecha_de_leyenda" v-model="form.fecha_de_leyenda" class="form-control"
                  :max="maxFecha" />
                <small v-if="errores.fecha_de_leyenda" class="text-danger">{{ errores.fecha_de_leyenda }}</small>
              </div>
              <div class="mb-3">
                <label for="categoria" class="form-label">Categoría</label>
                <select id="categoria" v-model="form.categoria" class="form-select">
                  <option value="" disabled>Selecciona una categoría</option>
                  <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
                    {{ categoria.nombre }}
                  </option>
                </select>
                <small v-if="errores.categoria" class="text-danger">{{ errores.categoria }}</small>
              </div>
              <div class="mb-3">
                <label for="provincia" class="form-label">Provincia</label>
                <select id="provincia" v-model="form.provincia" class="form-select" @change="cargarCantones">
                  <option value="" disabled>Selecciona una provincia</option>
                  <option v-for="provincia in provincias" :key="provincia.id" :value="provincia.id">
                    {{ provincia.nombre }}
                  </option>
                </select>
                <small v-if="errores.provincia" class="text-danger">{{ errores.provincia }}</small>
              </div>
              <div class="mb-3">
                <label for="canton" class="form-label">Cantón</label>
                <select id="canton" v-model="form.canton" class="form-select" @change="cargarDistritos">
                  <option value="" disabled>Selecciona un cantón</option>
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
              <div class="mb-3 text-center">
                <label class="form-label">Imagen (No editable)</label>
                <img :src="imagenActual" alt="Vista previa" class="img-thumbnail mb-2"
                  style="max-width: 100%; height: auto;" @click="mostrarModalImagenNoEditable" />
                <p class="text-muted">La imagen no puede ser editada.</p>
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-primary">Actualizar Leyenda</button>
              </div>
              <div class="d-grid bg-yellow mt-3">
                <button type="button" class="btn btn-warning" @click="volverALeyenda">
                  Volver a la Leyenda
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div v-if="mostrarModalImagen" class="modal d-block" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-warning">
            <h5 class="modal-title">Información</h5>
            <button type="button" class="btn-close" @click="cerrarModalImagen"></button>
          </div>
          <div class="modal-body">
            <p>La imagen no puede ser editada. Si deseas cambiar la imagen, elimina la leyenda y crea una nueva.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cerrarModalImagen">Cerrar</button>
          </div>
        </div>
      </div>
    </div>


    <div v-if="mostrarModalExito" class="modal d-block" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">¡Actualización Exitosa!</h5>
            <button type="button" class="btn-close" @click="cerrarModalExito"></button>
          </div>
          <div class="modal-body">
            La leyenda se ha actualizado correctamente.
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="cerrarModalExito">
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    </div>


    <div v-if="mostrarModalError" class="modal d-block" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">¡Error!</h5>
            <button type="button" class="btn-close" @click="cerrarModalError"></button>
          </div>
          <div class="modal-body">
            {{ mensajeError }}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cerrarModalError">
              Cerrar
            </button>
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
      datosOriginales: null,
      categorias: [],
      provincias: [],
      cantones: [],
      distritos: [],
      imagenActual: "",
      errores: {},
      maxFecha: new Date().toISOString().split("T")[0],
      mostrarModalImagen: false,
      mostrarModalExito: false,
      mostrarModalError: false,
      mensajeError: "",
    };
  },
  methods: {
    async cargarDatosIniciales() {
      try {
        const responseLeyenda = await fetch(`http://127.0.0.1:8080/leyendasEdicion/${this.$route.params.id}`);
        const leyenda = await responseLeyenda.json();

        this.form = {
          nombre: leyenda.nombre,
          descripcion: leyenda.descripcion,
          fecha_de_leyenda: leyenda.fecha_de_leyenda,
          categoria: leyenda.categoria,
          provincia: leyenda.provincia,
          canton: leyenda.canton,
          distrito: leyenda.distrito,
        };

        this.datosOriginales = { ...this.form };
        this.imagenActual = `http://127.0.0.1:8080${leyenda.imagen}`;


        await this.cargarCategorias();
        await this.cargarProvincias();
        await this.cargarCantones();
        await this.cargarDistritos();
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      }
    },

    async actualizarLeyenda() {
      try {
        const response = await fetch(`http://127.0.0.1:8080/leyendas/${this.$route.params.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.form),
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.detail || "Error al actualizar la leyenda");
        }

        this.mostrarModalExito = true;
      } catch (error) {
        this.mensajeError = error.message;
        this.mostrarModalError = true;
        console.error("Error al actualizar la leyenda:", error);
      }
    },

    validarFormulario() {
      this.errores = {};
      if (!this.form.nombre) this.errores.nombre = "El nombre es obligatorio.";
      if (!this.form.descripcion) this.errores.descripcion = "La descripción es obligatoria.";
      if (!this.form.fecha_de_leyenda) this.errores.fecha_de_leyenda = "La fecha es obligatoria.";
      if (!this.form.categoria) this.errores.categoria = "La categoría es obligatoria.";
      if (!this.form.provincia) this.errores.provincia = "La provincia es obligatoria.";
      if (!this.form.canton) this.errores.canton = "El cantón es obligatorio.";
      if (!this.form.distrito) this.errores.distrito = "El distrito es obligatorio.";

      if (JSON.stringify(this.form) === JSON.stringify(this.datosOriginales)) {
        this.mensajeError = "No se realizó ningún cambio en los datos.";
        this.mostrarModalError = true;
        return;
      }

      if (Object.keys(this.errores).length === 0) {
        this.actualizarLeyenda();
      }
    },
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
    },
    async cargarDistritos() {
      const response = await fetch(`http://127.0.0.1:8080/cantones/${this.form.canton}/distritos`);
      this.distritos = await response.json();
    },
    mostrarModalImagenNoEditable() {
      this.mostrarModalImagen = true;
    },
    cerrarModalImagen() {
      this.mostrarModalImagen = false;
    },
    cerrarModalExito() {
      this.mostrarModalExito = false;
      this.$router.push({ path: "/", query: { leyenda: this.$route.params.id } });
    },
    cerrarModalError() {
      this.mostrarModalError = false;
    },
    volverALeyenda() {
      this.$router.push({ path: "/", query: { leyenda: this.$route.params.id } });
    },
  },
  mounted() {
    this.cargarDatosIniciales();
  },
};
</script>
  
