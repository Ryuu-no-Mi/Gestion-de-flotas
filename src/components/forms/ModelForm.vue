<template>
    <v-dialog :value="show" @input="$emit('close')" max-width="560px" persistent>
        <v-card>
            <v-card-title class="headline">
                {{ editMode ? 'Editar modelo' : 'Crear modelo' }}
            </v-card-title>

            <v-card-text>
                <v-form ref="form" v-model="valid">
                    <v-text-field v-model="form.nombre" label="Nombre del modelo" :rules="[v => !!v || 'Requerido']"
                        clearable />
                    <v-select v-model="form.idMarca" :items="brandItems" item-text="label" item-value="value"
                        label="Marca" :rules="[v => !!v || 'Selecciona una marca']" clearable />
                </v-form>
            </v-card-text>

            <v-card-actions class="justify-end">
                <v-btn text @click="$emit('close')">Cancelar</v-btn>
                <v-btn color="green" dark @click="save">Guardar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import axios from '@/utils/axios'
export default {
    name: 'ModelForm',
    props: {
        show: Boolean,
        editMode: Boolean,
        modelProp: { type: Object, default: null },
        brands: { type: Array, default: () => [] },
    },
    data() {
        return {
            valid: false,
            form: { id: null, nombre: '', idMarca: null },
        }
    },
    computed: {
        brandItems() {
            return this.brands.map(b => ({ label: b.nombre, value: b.id }))
        },
    },
    watch: {
        modelProp: {
            immediate: true,
            handler(m) {
                this.form = m
                    ? { id: m.id, nombre: m.nombre || '', idMarca: m.idMarca || null }
                    : { id: null, nombre: '', idMarca: null }
            },
        },
    },
    methods: {
        async save() {
            let ok = this.$refs.form.validate()
            if (!ok) return

            console.log('Datos del formulario:', this.form)
            if (this.editMode) {
                await axios.put(`/model/${this.form.id}`, {
                    nombre: this.form.nombre,
                    idMarca: this.form.idMarca,
                })
            } else {
                await axios.post('/model', {
                    nombre: this.form.nombre,
                    idMarca: this.form.idMarca,
                })
            }
            this.$emit('saved')   // recarga en la vista
            this.$emit('close')
        },
    },
}
</script>
