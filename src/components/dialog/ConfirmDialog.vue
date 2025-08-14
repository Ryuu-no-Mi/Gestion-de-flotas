<template>
    <v-dialog v-model="internalValue" max-width="400" persistent>
        <v-card>
            <v-card-title class="headline">{{ title }}</v-card-title>
            <v-card-text>{{ message }}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="black darken-1" hover text @click="cancel">Cancelar</v-btn>
                <v-btn color="red darken-1" text @click="confirm">Eliminar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'ConfirmDialog',
    props: {
        value: Boolean,
        title: {
            type: String,
            default: '¿Estás seguro de eliminar este elemento?'
        },
        message: {
            type: String,
            default: '¿Deseas continuar con esta acción?'
        }
    },
    computed: {
        internalValue: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
    methods: {
        confirm() {
            this.$emit('confirm')
            this.internalValue = false
        },
        cancel() {
            this.$emit('cancel')
            this.internalValue = false
        }
    }
}
</script>
