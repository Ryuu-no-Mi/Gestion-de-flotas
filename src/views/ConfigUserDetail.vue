<template>
    <v-container fluid class="d-flex flex-column align-center justify-center" style="height: 100vh">
        <v-card elevation="2" class="pa-8" max-width="800">
            <v-card-title class="text-h6">
                Configuración de Usuario
            </v-card-title>
            <v-row>
                <v-icon large color="primary" class="mx-auto">mdi-account-circle</v-icon>
            </v-row>
            <v-divider class="my-5" />

            <v-list class="d-flex flex-column align-center justify-center" dense>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="font-weight-bold text-center">Nombre</v-list-item-title>
                        <v-list-item-subtitle class="text-center">{{ form.nombre }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="font-weight-bold text-center">Apellidos</v-list-item-title>
                        <v-list-item-subtitle class="text-center">{{ form.apellidos || "Apellidos no disponibles"
                            }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="font-weight-bold text-center">Correo Electrónico</v-list-item-title>
                        <v-list-item-subtitle class="text-center">{{ form.email }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="font-weight-bold text-center">Teléfono</v-list-item-title>
                        <v-list-item-subtitle class="text-center">{{ form.telefono || "Teléfono no disponible"
                        }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="font-weight-bold text-center">Móvil</v-list-item-title>
                        <v-list-item-subtitle class="text-center">{{ form.movil || "Móvil no disponible"
                        }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="font-weight-bold text-center">Código Postal</v-list-item-title>
                        <v-list-item-subtitle class="text-center">{{ form.cp || "Código Postal no disponible"
                        }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="font-weight-bold text-center">Provincia</v-list-item-title>
                        <v-list-item-subtitle class="text-center">{{ form.provincia || "Provincia no disponible"
                        }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="font-weight-bold text-center">Población</v-list-item-title>
                        <v-list-item-subtitle class="text-center">{{ form.poblacion || "Población no disponible"
                        }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>

            <v-card-actions class="d-flex justify-center">
                <v-btn color="red darken-1" text @click="$router.push({ name: 'home' })">
                    Volver a inicio
                </v-btn>
            </v-card-actions>

        </v-card>
    </v-container>
</template>


<script>
import axios from '@/utils/axios'
import { jwtDecode } from 'jwt-decode'

export default {
    name: 'ConfigUserDetail',
    data() {
        return {
            formValid: false,
            form: {
                userId: null,
                id: null,
                nombre: '',
                apellidos: '',
                email: '',
                telefono: '',
                movil: '',
                cp: '',
                provincia: '',
                poblacion: ''
            },
            snackbar: false,
            rules: {
                required: v => !!v || 'Este campo es obligatorio',
                email: v => /.+@.+\..+/.test(v) || 'Email inválido'
            }
        }
    },
    methods: {
        async fetchUserData() {
            try {
                const response = await axios.get('/user') // Ajusta si el endpoint es diferente
                console.log('Datos del usuario:', response.data);

                Object.assign(this.form, response.data)
            } catch (err) {
                console.error('Error al cargar datos del usuario:', err)
            }
        },
        async guardarCambios() {
            if (!this.$refs.form.validate()) return

            try {
                await axios.put('/user/config', this.form)
                this.snackbar = true
            } catch (err) {
                console.error('Error al guardar datos:', err)
                this.$emit('error', 'No se pudo actualizar la configuración del usuario')
            }
        },
        getUserIdFromToken() {
            const token = localStorage.getItem('token')
            if (!token) return null

            console.log('Token:', token);

            try {
                const decoded = jwtDecode(token)
                console.log('Decoded token:', decoded);

                return decoded.DATA1 // ajusta según cómo venga en tu token
            } catch (error) {
                console.error('Token inválido:', error)
                return null
            }
        }
    },
    async mounted() {

        const userId = this.getUserIdFromToken()
        console.log('User ID from token:', userId);

        if (!userId) {
            console.error('No se pudo obtener el ID del usuario desde el token')
            return
        }

        try {
            const response = await axios.get(`/user/${userId}`)
            console.log('Datos del usuario obtenidos:', response.data);

            this.form = { ...response.data } // Asumiendo que el DTO viene completo
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error)
        }
    }
}
</script>

<style scoped>
.max-width-lg {
    max-width: 700px;
}
</style>
