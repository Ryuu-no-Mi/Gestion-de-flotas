<template>
    <v-dialog v-model="dialog" max-width="600px" persistent>
        <v-card>
            <v-card-title>
                <span class="headline">{{ editMode ? 'Editar Vehículo' : 'Crear Vehículo' }}</span>
            </v-card-title>

            <v-card-text>
                <v-form ref="form" v-model="formValid">
                    <v-text-field v-model="formData.matricula" label="Matrícula" :rules="[rules.required]" />
                    <v-text-field v-model="formData.marca" label="Marca" :rules="[rules.required]" />
                    <v-text-field v-model="formData.modelo" label="Modelo" :rules="[rules.required]" />
                    <v-select v-model="formData.tipoCombustible" :items="combustibles" label="Combustible"
                        :rules="[rules.required]" item-text="label" item-value="value" />
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
        vehicle: {
            type: Object,
            default: () => null
        },
        editMode: {
            type: Boolean,
            default: false
        },
        show: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            dialog: this.show,
            formData: {
                matricula: '',
                marca: '',
                modelo: '',
                tipoCombustible: ''
            },
            formValid: false,
            rules: {
                required: v => !!v || 'Este campo es obligatorio'
            },
            combustibles: [
                { label: 'Gasolina sin plomo', value: 'Gasolina sin plomo' },
                { label: 'Gasoil', value: 'Gasoil' },
            ]
        }
    },
    watch: {
        show(val) {
            this.dialog = val
            if (val) this.initializeForm()
        },
        // dialog(val) {
        //     if (!val) this.$emit('close')
        // }
    },
    methods: {
        initializeForm() {
            if (this.editMode && this.vehicle) {
                // Protección contra datos faltantes
                this.formData = {
                    matricula: this.vehicle.matricula || '',
                    marca: this.vehicle.marca || '',
                    modelo: this.vehicle.modelo || '',
                    tipoCombustible: this.validateCombustible(this.vehicle.tipoCombustible) || ''
                }
            } else {
                this.formData = {
                    matricula: '',
                    marca: '',
                    modelo: '',
                    tipoCombustible: ''
                }
            }
        },
        async submitForm() {
            try {
                let valid = this.$refs.form.validate()
                if (!valid) return

                const token = localStorage.getItem('token')
                const config = { headers: { Authorization: `Bearer ${token}` } }

                if (this.editMode) {
                    await axios.put(`/vehicle`, this.formData, config)
                } else {
                    await axios.post(`/vehicle`, this.formData, config)
                }

                this.$emit('saved')
                this.close()
            } catch (error) {
                console.error('Error al guardar vehículo:', error)
                this.$emit('error', 'Error al guardar el vehículo')
            }
        },
        validateCombustible(tipo) {
            const valid = this.combustibles.map(c => c.value)
            return valid.includes(tipo) ? tipo : ''
        },
        close() {
            this.formData = {
                matricula: '',
                marca: '',
                modelo: '',
                tipoCombustible: ''
            }
            this.dialog = false
            this.$emit('close');
        }
    }
}
</script>
