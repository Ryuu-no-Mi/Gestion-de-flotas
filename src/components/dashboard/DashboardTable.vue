<template>
    <div>
        <v-data-table :headers="headers" :items="vehicles" item-key="matricula" class="elevation-2 text-center"
            :search="search" :custom-filter="filterOnlyCapsText">
            <template v-slot:top>
                <div class="d-flex justify-center">
                    <v-text-field v-model="search" label="Buscar (MAYÚSCULAS)" class="search-bar" hide-details />
                </div>
            </template>


            <!-- Mostrar "-" si falta la matrícula -->
            <template v-slot:[`item.matricula`]="{ item }">
                <div class="text-center">{{ item.matricula || '-' }}</div>
            </template>

            <template v-slot:[`item.marca`]="{ item }">
                <div class="text-center">{{ item.marca || '-' }}</div>
            </template>

            <template v-slot:[`item.modelo`]="{ item }">
                <div class="text-center">{{ item.modelo || '-' }}</div>
            </template>

            <template v-slot:[`item.tipoCombustible`]="{ item }">
                <div class="text-center">{{ item.tipoCombustible || '-' }}</div>
            </template>

            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:header.matricula>
                <div class="text-center">Matrícula</div>
            </template>

            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:header.marca>
                <div class="text-center">Marca</div>
            </template>

            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:header.modelo>
                <div class="text-center">Modelo</div>
            </template>

            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:header.tipoCombustible>
                <div class="text-center">Combustible</div>
            </template>

            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:header.acciones>
                <div class="text-center">Acciones</div>
            </template>




            <!-- Slot para los botones por fila -->
            <template v-slot:[`item.acciones`]="{ item }">
                <div class="text-center">
                    <v-btn icon color="primary" @click="editVehicles(item)">
                        <v-icon>edit</v-icon>
                    </v-btn>
                    <v-btn icon color="red" @click="deleteVehicles(item)">
                        <v-icon>delete</v-icon>
                    </v-btn>
                </div>

            </template>
        </v-data-table>

        <v-btn depressed color="green" class="mt-4 white--text" @click="createVehicles">
            Añadir
            <v-icon>add</v-icon>
        </v-btn>

        <vehicle-form :show="showForm" :vehicle="selectedVehicle" :editMode="isEditMode" @close="showForm = false"
            @saved="fetchVehicles" />

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
                { text: 'Matrícula', value: 'matricula', sortable: false },
                { text: 'Marca', value: 'marca', sortable: false },
                { text: 'Modelo', value: 'modelo', sortable: false },
                { text: 'Combustible', value: 'tipoCombustible', sortable: false },
                { text: 'Acciones', value: 'acciones', sortable: false }
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

<style scoped>
th.text-center {
    text-align: center !important;
}

.search-bar {
    width: 80%;
    max-width: 70rem;
}
</style>
