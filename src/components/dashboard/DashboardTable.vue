<template>
    <div>
        <v-data-table :headers="headers" :items="vehicles" item-key="matricula" class="elevation-1" :search="search"
            :custom-filter="filterOnlyCapsText">
            <template v-slot:top>
                <v-text-field v-model="search" label="Buscar (MAYÚSCULAS)" class="mx-4"></v-text-field>
            </template>
        </v-data-table>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            search: '',
            vehicles: [],
        }
    },
    computed: {
        headers() {
            return [
                { text: 'Matrícula', value: 'matricula' },
                { text: 'Marca', value: 'marca' },
                { text: 'Modelo', value: 'modelo' },
                { text: 'Combustible', value: 'combustible' },
                { text: 'Año', value: 'anio' },
                { text: 'Estado', value: 'estado' },
            ]
        },
    },
    methods: {
        async fetchVehicles() {
            try {

                const token = localStorage.getItem('token')
                if (!token) {
                    throw new Error('Token no encontrado')
                }
                console.log('Token:', token) // Verifica que el token se esté obteniendo correctamente;

                // llamda al enpoint GetAllVehicles sin paginar
                // const response = await axios.get('https://localhost:7077/api/vehicle', {
                //     headers: { Authorization: `Bearer ${token}` },
                // })

                const response = await axios.get('https://localhost:7077/api/vehicle/paged', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        pageNumber: 1,
                        pageSize: 10
                    }
                })
                this.vehicles = response.data
                console.log('Vehículos obtenidos:', this.vehicles) // Verifica que los vehículos se estén obteniendo correctamente;

            } catch (error) {
                console.error('Error al obtener los vehículos:', error)
                this.$emit('error', 'No se pudieron cargar los vehículos. Inténtalo de nuevo más tarde.')
            }
        },
        filterOnlyCapsText(value, search, item) {
            return (
                value != null &&
                search != null &&
                typeof value === 'string' &&
                value.toString().toLocaleUpperCase().includes(search)
            )
        },
    },
    mounted() {
        this.fetchVehicles()
    },
}
</script>
