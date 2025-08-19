<template>
    <div>
        <app-drawer v-model="drawer" />
        <app-bar @toggle-drawer="drawer = !drawer" @goToSettings="goTo('config')" @changeCompany="goTo('changeCompany')"
            @logout="logout" />
        <!-- <v-data-table :headers="headers" :items="brands" item-key="id" class="elevation-2 text-center" :search="search"
            show-expand :expanded.sync="expanded"> -->
        <v-container>
            <v-data-table :headers="headers" :items="brands" item-key="id" class="mt-16 elevation-2 text-center"
                :search="search" :custom-filter="filterIgnoreAccents">
                <template v-slot:top>
                    <v-row class="px-4 pb-4" dense>
                        <v-col cols="12" sm="9">
                            <v-text-field v-model="search" label="Buscar por nombre" hide-details clearable />
                        </v-col>
                        <v-col cols="12" sm="3" class="d-flex align-center justify-end">
                            <v-btn color="grey" class="mt-2" @click="clearFilters">
                                Limpiar
                                <v-icon right>mdi-filter-remove</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </template>

                <!-- Campos -->
                <template v-slot:[`item.id`]="{ item }">
                    <div class="text-center font-mono">{{ item.id }}</div>
                </template>

                <template v-slot:[`item.nombre`]="{ item }">
                    <div class="text-center font-weight-medium">{{ item.nombre || '-' }}</div>
                </template>

                <template v-slot:[`item.totalModelos`]="{ item }">
                    <!-- <v-chip small color="grey lighten-4" class="px-3">
                    <v-avatar left size="12" class="mr-2" color="grey"></v-avatar>
                    {{ countModels(item.id) }} modelos
                </v-chip> -->
                    <div class=" w-80 text-center">
                        <div class="d-flex flex-wrap justify-center">
                            <v-chip v-for="m in modelsByBrand(item.id)" :key="m.id" class="ma-1 text-center" small
                                color="blue lighten-5" text-color="blue darken-2">
                                {{ m.nombre }}
                            </v-chip>
                            <div v-if="modelsByBrand(item.id).length === 0" class="grey--text text--darken-1">
                                (Sin modelos)
                            </div>
                        </div>
                    </div>
                </template>

                <!-- Acciones -->
                <template v-slot:[`item.acciones`]="{ item }">
                    <div class="text-center">
                        <v-btn icon color="primary" @click="editBrand(item)">
                            <v-icon>edit</v-icon>
                        </v-btn>
                        <v-btn icon color="red" @click="deleteBrand(item)">
                            <v-icon>delete</v-icon>
                        </v-btn>
                    </div>
                </template>

                <!-- Fila expandida: chips de modelos de la marca -->
                <!-- <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length" class="text-left px-6 py-4">
                    <div class="mb-2 grey--text text--darken-1 text-caption">
                        Modelos de <strong>{{ item.nombre }}</strong>
                    </div>
                    <div class="d-flex flex-wrap gap-2">
                        <v-chip v-for="m in modelsByBrand(item.id)" :key="m.id" class="ma-1" small
                            color="blue lighten-5" text-color="blue darken-2">
                            {{ m.nombre }}
                        </v-chip>
                        <div v-if="modelsByBrand(item.id).length === 0" class="grey--text text--darken-1">
                            (Sin modelos)
                        </div>
                    </div>
                </td>
            </template> -->
            </v-data-table>

            <v-btn depressed color="green" class="mt-4 white--text" @click="createBrand">
                Añadir marca
                <v-icon>add</v-icon>
            </v-btn>
        </v-container>

        <!-- <v-card-actions class="d-flex justify-center">
            <v-btn color="white darken-1" class="background-color: red" text @click="$router.push({ name: 'home' })">
                Volver a inicio
            </v-btn>
        </v-card-actions> -->

        <BtnGoToHome />

        <!-- Si ya tienes un formulario de marca, úsalo aquí -->
        <!-- <brand-form :show="showForm" :brand="selectedBrand" :editMode="isEditMode"
         @close="showForm = false" @saved="fetchAll" /> -->

        <confirm-dialog :value="confirmDeleteDialog" :message="`¿Deseas eliminar la marca ${brandToDelete?.nombre}?`"
            title="Confirmar Eliminación" @confirm="confirmDelete" @cancel="cancelDelete" />

        <brand-form :show="showForm" :brand="selectedBrand" :editMode="isEditMode" @close="showForm = false"
            @saved="fetchBrands" />

    </div>
</template>

<script>
import axios from '@/utils/axios'
import ConfirmDialog from '@/components/dialog/ConfirmDialog.vue'
import AppDrawer from '@/components/layout/AppDrawer.vue'
import AppBar from '@/components/layout/AppBar.vue'
import BtnGoToHome from '@/components/BtnGoToHome.vue'
import BrandForm from '@/components/forms/BrandForm.vue'

export default {
    name: 'BrandsView',
    components: {
        ConfirmDialog,
        AppDrawer,
        AppBar,
        BtnGoToHome,
        BrandForm
    },
    data() {
        return {
            search: '',
            brands: [],
            models: [],
            expanded: [],
            vehicle: [],
            showForm: false,
            selectedBrand: null,
            isEditMode: false,
            confirmDeleteDialog: false,
            showForm: false,
            brandToDelete: null,
            drawer: false
        }
    },
    computed: {
        headers() {
            return [
                { text: 'ID', value: 'id', align: 'center', sortable: false },
                { text: 'Marca', value: 'nombre', align: 'center', sortable: false },
                { text: 'Modelos', value: 'totalModelos', align: 'center', sortable: false },
                { text: 'Acciones', value: 'acciones', align: 'center', sortable: false }
            ]
        }
    },
    methods: {
        clearFilters() {
            this.search = ''
        },
        goTo(routeName) {
            if (this.$route.name !== routeName) {
                this.$router.push({ name: routeName })
            }
        },
        logout() {
            localStorage.removeItem('token')
            this.$router.replace({ name: 'login' });
        },
        async fetchBrands() {
            const res = await axios.get('/brand')
            // DTO: { id, nombre, ... }
            this.brands = Array.isArray(res.data) ? res.data : []
        },
        async fetchModels() {
            const res = await axios.get('/model')
            // DTO: { id, nombre, idMarca, ... }
            this.models = Array.isArray(res.data) ? res.data : []
        },
        async fetchAll() {
            try {
                await Promise.all([this.fetchBrands(), this.fetchModels()])
            } catch (e) {
                console.error('Error al cargar marcas/modelos:', e)
                this.$emit('error', 'No se pudieron cargar marcas y modelos.')
            }
        },
        modelsByBrand(brandId) {
            return this.models.filter(m => Number(m.idMarca) === Number(brandId))
        },
        // Acciones (placeholders mínimos)
        createBrand() {
            this.selectedBrand = null
            this.isEditMode = false
            this.showForm = true
        },
        editBrand(brand) {
            this.selectedBrand = brand
            this.isEditMode = true
            this.showForm = true
        },
        deleteBrand(brand) {
            this.brandToDelete = brand
            this.confirmDeleteDialog = true
        },
        async confirmDelete() {
            try {
                await axios.delete(`/brand/${this.brandToDelete.id}`)
                await this.fetchAll()
            } catch (e) {
                console.error('Error al eliminar marca:', e)
                this.$emit('error', 'Error al eliminar la marca.')
            } finally {
                this.brandToDelete = null
                this.confirmDeleteDialog = false
            }
        },
        cancelDelete() {
            this.brandToDelete = null
            this.confirmDeleteDialog = false
        }, filterIgnoreAccents(value, search) {
            if (!search) return true
            const norm = s => (s || '')
                .toString()
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
            return norm(value).includes(norm(search))
        },
    },
    async mounted() {
        await this.fetchAll()
    }
}
</script>

<style scoped>
/* ajustar separación visual como en tu otra tabla */
.v-data-table {
    border-radius: 12px;
}
</style>
