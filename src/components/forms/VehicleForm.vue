<template>
    <v-dialog :value="show" @input="close" max-width="600px" persistent>
        <v-card>
            <v-card-title>
                <span class="headline">{{ editMode ? 'Editar Vehículo' : 'Crear Vehículo' }}</span>
            </v-card-title>

            <v-card-text>
                <v-form ref="form" v-model="formValid">
                    <v-text-field v-model="formData.matricula" label="Matrícula" :rules="[rules.required]" />
                    <v-select v-model.number="formData.brand" :items="brands" item-text="label" item-value="value"
                        label="Marca" :rules="[rules.required]" />

                    <v-select v-model.number="formData.model" :items="models" item-text="label" item-value="value"
                        label="Modelo" :rules="[rules.required]" />

                    <v-select v-model.number="formData.typeFuel" :items="typesFuel" item-text="label" item-value="value"
                        label="Combustible" :rules="[rules.required]" />

                </v-form>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="close">Cancelar</v-btn>
                <v-btn color="green darken-1" text @click="submitForm">Guardar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import axios from '@/utils/axios'

export default {
    name: 'VehicleForm',
    props: {
        vehicle: Object,
        editMode: Boolean,
        show: Boolean,
    },
    data() {
        return {
            formData: {
                matricula: '',
                brand: 0,
                model: 0,
                typeFuel: 0,
            },
            formValid: false,
            rules: {
                required: v => !!v || 'Este campo es obligatorio',
            },
            brands: [],
            models: [],
            filteredModels: [],     // Modelos según la marca seleccionada -- NO SE SI EN EL CREATE, EL MODELO TAMBIEN DEPENDE DE LA MARCA COMO EN EL EDIT
            typesFuel: [],


        }
    },
    watch: {
        show(val) {
            if (val) this.initializeForm()
            this.getKeyForm()
        },
    },

    methods: {
        initializeForm() {
            let veh = this.vehicle || {}
            console.log('Initializing form with vehicle:', veh);

            this.formData = {
                matricula: veh.matricula || '',
                brand: veh.marcaId || '',
                model: veh.modeloId || '',
                typeFuel: veh.tipoCombustibleId || '',
            }

            console.log('Asignando marca:', veh.marcaId, 'o', veh.marca)
            console.log('formData.brand:', this.formData.brand)
            console.log('brands:', this.brands)


        },

        async submitForm() {
            if (!this.$refs.form.validate()) return

            try {
                let payload = {
                    matricula: this.formData.matricula,
                    marcaId: this.formData.brand,
                    modeloId: this.formData.model,
                    tipoCombustibleId: this.formData.typeFuel,
                }

                if (this.editMode) {
                    payload.id = this.vehicle.id
                    console.log('Actualizando vehículo con payload:', payload);
                    await axios.put(`/vehicle/${this.vehicle.id}`, payload)
                } else {
                    console.log('Creando nuevo vehículo:', payload);
                    await axios.post('/vehicle', payload)

                }

                this.$emit('saved')
                this.close()
            } catch (err) {
                console.error('Error al guardar vehículo:', err)
                this.$emit('error', 'Error al guardar el vehículo')
            }
        },
        async getBrands() {
            //ya tiene el token  en axios.js
            try {
                const response = await axios.get("/brand")
                console.log("Respuesta de marcas:", response.data)
                this.brands = response.data.map(brand => ({
                    label: brand.nombre,
                    value: brand.id
                }))
                console.log("Marcas obtenidas:", this.brands)
            } catch (error) {
                console.error("Error al obtener marcas:", error)
            }


        },
        async getModels() {
            try {
                const response = await axios.get("/model")
                this.models = response.data.map(model => ({
                    label: model.nombre,
                    value: model.id
                }))
                console.log("Modelos obtenidos:", this.models)
            } catch (error) {
                console.error("Error al obtener modelos:", error)
            }
        },
        async getTypesFuel() {
            try {
                const response = await axios.get("/typefuel")
                this.typesFuel = response.data.map(type => ({
                    label: type.nombre,
                    value: type.id
                }))
                console.log("Tipos de combustible obtenidos:", this.typesFuel)
            } catch (error) {
                console.error("Error al obtener tipos de combustible:", error)
            }
        },
        getKeyForm() {
            const token = localStorage.getItem('token')
            if (!token) {
                console.warn("No hay token. Evitando llamadas innecesarias.")
                return
            }

            this.getBrands()
            this.getModels()
            this.getTypesFuel()
        },
        close() {
            this.$emit('close')
        },
    }
}
</script>
