<template>
    <div>
        <v-data-table :headers="headers" :items="vehicles" item-key="matricula" class="elevation-2" :search="search"
            :custom-filter="filterOnlyCapsText">
            <template v-slot:top>
                <v-text-field v-model="search" label="Buscar (MAYÚSCULAS)" class="mx-4"></v-text-field>
            </template>

            <!-- Slot para los botones por fila -->
            <template v-slot:[`item.acciones`]="{ item }">
                <v-btn icon color="primary" @click="editVehicles(item)">
                    <v-icon>edit</v-icon>
                </v-btn>

                <v-btn icon color="red" @click="deleteVehicles(item)">
                    <v-icon>delete</v-icon>
                </v-btn>

                <vehicle-form :show="showForm" :vehicle="selectedVehicle" :editMode="isEditMode"
                    @close="showForm = false" @saved="fetchVehicles" />

            </template>
        </v-data-table>

        <v-btn depressed color="green" class="mt-4 white--text" @click="createVehicles">
            Añadir
            <v-icon>add</v-icon>
        </v-btn>

    </div>
</template>

<script>
//import axios from 'axios'
import axios from '@/utils/axios'
import VehicleForm from '../forms/VehicleForm.vue'

export default {
    components: {
        VehicleForm
    },
    data() {
        return {
            search: '',
            vehicles: [],
            showForm: false,
            selectedVehicle: null,
            isEditMode: false
        }
    },
    computed: {
        headers() {
            return [
                { text: 'Matrícula', value: 'matricula' },
                { text: 'Marca', value: 'marca' },
                { text: 'Modelo', value: 'modelo' },
                { text: 'Combustible', value: 'tipoCombustible' },
                { text: '', value: 'acciones', sortable: false },
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

                const response = await axios.get('/vehicle/page', {
                    params: {
                        pageNumber: 1,
                        pageSize: 10
                    }
                })
                this.vehicles = response.data.items
                console.log('Respuesta del servidor:', response) // Verifica que la respuesta del servidor sea correcta;
                this.vehicles = response.data.items
                console.log('Vehículos obtenidos:', this.vehicles) // Verifica que los vehículos se estén obteniendo correctamente;

            } catch (error) {
                console.error('Error al obtener los vehículos:', error)
                this.$emit('error', 'No se pudieron cargar los vehículos. Inténtalo de nuevo más tarde.')
            }
        },
        // esto deberia ser una llamada al endpoint de la API
        filterOnlyCapsText(value, search, item) {
            return (
                value != null &&
                search != null &&
                typeof value === 'string' &&
                value.toString().toLocaleUpperCase().includes(search)
            )
        },
        deleteVehicles(vehiculo) {
            console.log('Borrar vehículo:', vehiculo)
            // Aquí puedes hacer el borrado lógico (por ejemplo, usando axios para llamar a tu API)
        },

        editVehicles(vehicle) {
            this.selectedVehicle = vehicle
            this.isEditMode = true
            this.showForm = true
        },
        createVehicles() {
            this.selectedVehicle = null
            this.isEditMode = false
            this.showForm = true
        }
    },
    mounted() {
        this.fetchVehicles()
    },
}
</script>
