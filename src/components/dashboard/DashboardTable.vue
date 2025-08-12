<template>
    <div>

        <v-data-table :headers="headers" :items="vehicles" item-key="matricula" class="elevation-2 text-center"
            :custom-filter="filterOnlyCapsText">

            <template v-slot:top>
                <v-row class="px-4 pb-4" dense>
                    <v-col cols="12" sm="4">
                        <v-select v-model="filters.brandId" :items="brands" item-text="label" item-value="value"
                            label="Filtrar por Marca" clearable />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-select v-model="filters.modelId" :items="filteredModels" item-text="label" item-value="value"
                            label="Filtrar por Modelo" :disabled="!filters.brandId"
                            no-data-text="Selecciona una marca primero" clearable />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-select v-model="filters.fuelId" :items="typesFuel" item-text="label" item-value="value"
                            label="Filtrar por Combustible" clearable />
                    </v-col>
                </v-row>
                <v-row class="px-4 pb-4" dense>
                    <v-col cols="10">
                        <v-text-field v-model="search" label="Buscar por texto" hide-details clearable />
                    </v-col>
                    <v-col cols="2">
                        <v-btn color="primary" class="mt-2 w-100" @click="fetchVehicles">
                            Buscar
                            <v-icon right>mdi-magnify</v-icon>
                        </v-btn>
                        <v-btn color="grey" class="mt-2 w-100" @click="clearFilters">
                            Limpiar
                            <v-icon right>mdi-filter-remove</v-icon>
                        </v-btn>
                    </v-col>

                </v-row>
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

        <confirm-dialog :value="confirmDeleteDialog"
            :message="`¿Deseas eliminar el vehículo con matrícula ${vehicleToDelete?.matricula}?`"
            title="Confirmar Eliminación" @confirm="confirmDelete" @cancel="cancelDelete" />


    </div>
</template>

<script>
//import axios from 'axios'
import axios from '@/utils/axios'
import VehicleForm from '../forms/VehicleForm.vue'
import ConfirmDialog from '@/components/dialog/ConfirmDialog.vue'

export default {
    components: {
        VehicleForm,
        ConfirmDialog
    },
    data() {
        return {
            search: '',
            vehicles: [],
            showForm: false,
            selectedVehicle: null,
            isEditMode: false,
            confirmDeleteDialog: false,
            vehicleToDelete: null,

            // Faltaban estas:
            filters: {
                brandId: null,
                modelId: null,
                fuelId: null
            },
            brands: [],
            models: [],
            typesFuel: []

        }
    },
    computed: {
        filteredModels() {
            if (!this.filters.brandId) return []
            // modelos ya traen idBrand => filtramos directo
            const list = this.models.filter(m => m.idBrand === this.filters.brandId)
            // por si el backend trae duplicados
            const uniq = new Map(list.map(m => [m.value, m]))
            return Array.from(uniq.values())
        },
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
    watch: {
        'filters.brandId'(newBrandId) {
            // al cambiar marca, limpiamos el modelo seleccionado
            this.filters.modelId = null
            // no hace falta tocar this.models; ya lo filtra computed
        }
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
                        pageSize: 10,
                        idMarca: this.filters.brandId,
                        idModelo: this.filters.modelId,
                        idTipoCombustible: this.filters.fuelId,
                        matricula: this.search
                    }
                })
                this.vehicles = response.data.items
                //console.log('Respuesta del servidor:', response) // Verifica que la respuesta del servidor sea correcta;
                //this.vehicles = response.data.items
                //console.log('Vehículos obtenidos:', this.vehicles) // Verifica que los vehículos se estén obteniendo correctamente;

            } catch (error) {
                console.error('Error al obtener los vehículos:', error)
                this.$emit('error', 'No se pudieron cargar los vehículos. Inténtalo de nuevo más tarde.')
            }
        },
        async getBrands() {
            const response = await axios.get('/brand')
            this.brands = response.data.map(b => ({ label: b.nombre, value: b.id }))
        },
        async getModels() {
            const response = await axios.get('/model')
            this.models = response.data.map(m => ({ label: m.nombre, value: m.id, idBrand: m.idMarca }))
        },
        async getTypesFuel() {
            const response = await axios.get('/typefuel')
            this.typesFuel = response.data.map(t => ({ label: t.nombre, value: t.id }))
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
        deleteVehicles(vehicle) {
            console.log('Borrar vehículo:', vehicle.marca, vehicle.modelo, vehicle.matricula)
            // Aquí puedes hacer el borrado lógico (por ejemplo, usando axios para llamar a tu API)
            this.vehicleToDelete = vehicle
            this.confirmDeleteDialog = true
        },
        async confirmDelete() {
            try {
                await axios.delete(`/vehicle/${this.vehicleToDelete.id}`)
                this.fetchVehicles()
                this.vehicleToDelete = null
            } catch (error) {
                console.error('Error al eliminar vehículo:', error)
                this.$emit('error', 'Error al eliminar el vehículo.')
            }
            this.vehicleToDelete = null
            this.confirmDeleteDialog = false
        },
        cancelDelete() {
            this.vehicleToDelete = null
            this.confirmDeleteDialog = false
        }
        ,

        editVehicles(vehicle) {
            this.selectedVehicle = vehicle
            this.isEditMode = true
            this.showForm = true
        },
        createVehicles() {
            this.selectedVehicle = null
            this.isEditMode = false
            this.showForm = true
        },
        clearFilters() {
            this.search = ''
            this.filters = {
                brandId: null,
                modelId: null,
                fuelId: null
            }
            this.fetchVehicles()
        }

    },
    async mounted() {
        await Promise.all([
            this.getBrands(),
            this.getModels(),
            this.getTypesFuel()
        ])
        this.fetchVehicles()
    },
}
</script>

<style scoped>
th.text-center {
    text-align: center !important;
}

.search-bar {
    width: 70%;
    max-width: 75rem;
}
</style>
