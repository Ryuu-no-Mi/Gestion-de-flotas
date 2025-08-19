<template>
    <v-dialog :value="show" @input="$emit('close')" max-width="520px" persistent>
        <v-card>
            <v-card-title class="headline">
                {{ editMode ? 'Editar tipo de combustible' : 'Crear tipo de combustible' }}
            </v-card-title>

            <v-card-text>
                <v-form ref="form" v-model="valid">
                    <v-text-field v-model="form.nombre" label="Nombre" :rules="[v => !!v || 'Requerido']" clearable />
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
    name: 'TypeFuelForm',
    props: {
        show: Boolean,
        editMode: Boolean,
        typeFuelProp: { type: Object, default: null },
    },
    data() {
        return {
            valid: false,
            form: { id: null, nombre: '' },
        }
    },
    watch: {
        typeFuelProp: {
            immediate: true,
            handler(tf) {
                this.form = tf ? { id: tf.id, nombre: tf.nombre || '' } : { id: null, nombre: '' }
            },
        },
    },
    methods: {
        async save() {
            const ok = this.$refs.form.validate()
            if (!ok) return

            if (this.editMode && this.form.id) {
                await axios.put(`/typefuel/${this.form.id}`, { nombre: this.form.nombre })
            } else {
                await axios.post('/typefuel', { nombre: this.form.nombre })
            }
            this.$emit('saved')
            this.$emit('close')
        },
    },
}
</script>
