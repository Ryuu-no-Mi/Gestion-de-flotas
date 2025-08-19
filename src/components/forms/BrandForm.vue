<template>
    <v-dialog :value="show" @input="$emit('close')" max-width="500px" persistent>
        <v-card>
            <v-card-title>
                <span class="headline">{{ editMode ? 'Editar marca' : 'Crear marca' }}</span>
            </v-card-title>

            <v-card-text>
                <v-form ref="form" v-model="valid">
                    <v-text-field v-model="form.nombre" label="Nombre de la marca" :rules="[rules.required, rules.min2]"
                        autofocus />
                    <!-- opcional, si tu tabla tiene campo activa -->
                    <!-- <v-switch v-model="form.activa" label="Activa" /> -->
                </v-form>
            </v-card-text>

            <v-card-actions>
                <v-spacer />
                <v-btn text color="red" @click="$emit('close')">Cancelar</v-btn>
                <v-btn text color="green" @click="save">Guardar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import axios from '@/utils/axios'

export default {
    name: 'BrandForm',
    props: {
        show: Boolean,
        brand: { type: Object, default: null },
        editMode: Boolean,
    },
    data() {
        return {
            valid: false,
            form: { nombre: '', activa: true },
            rules: {
                required: v => !!v || 'Requerido',
                min2: v => (v && v.trim().length >= 2) || 'Mín. 2 caracteres',
            },
        }
    },
    watch: {
        show(val) { if (val) this.init() },
    },
    methods: {
        init() {
            if (this.editMode && this.brand) {
                this.form = {
                    nombre: this.brand.nombre || '',
                    activa: this.brand.activa !== 0 && this.brand.activa !== false,
                }
            } else {
                this.form = { nombre: '', activa: true }
            }
        },
        async save() {
            if (!this.$refs.form.validate()) return
            try {
                const payload = { nombre: this.form.nombre, activo: this.form.activa }
                if (this.editMode) {
                    await axios.put(`/brand/${this.brand.id}`, payload)
                } else {
                    let response = await axios.post('/brand', payload)
                    console.log(response);

                }

                this.$emit('saved')
                this.$emit('close')
            } catch (e) {
                console.error('Error guardando marca:', e)
                this.$emit('error', 'No se pudo guardar la marca')
            }
        },
    },
}
</script>
