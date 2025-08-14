<template>
    <div>
        <app-drawer v-model="drawer" />
        <app-bar @toggle-drawer="drawer = !drawer" @goToSettings="goTo('config')" @changeCompany="goTo('changeCompany')"
            @logout="logout" />

        <v-container>
            <v-data-table :headers="headers" :items="displayedModels" item-key="id"
                class="mt-16 elevation-2 text-center" :search="search" :custom-filter="filterIgnoreAccents">
                <template v-slot:top>
                    <v-row class="px-4 pb-4" dense>
                        <v-col cols="12" sm="5">
                            <v-text-field v-model="search" label="Buscar por modelo" hide-details clearable />
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-select v-model="filters.brandId" :items="brandItems" item-text="label" item-value="value"
                                label="Filtrar por marca" clearable />
                        </v-col>
                        <v-col cols="12" sm="3" class="d-flex align-center justify-end">
                            <v-btn color="grey" class="mt-2" @click="clearFilters">
                                Limpiar
                                <v-icon right>mdi-filter-remove</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </template>

                <!-- celdas -->
                <template v-slot:[`item.id`]="{ item }">
                    <div class="text-center font-mono">{{ item.id }}</div>
                </template>

                <template v-slot:[`item.nombre`]="{ item }">
                    <div class="text-center font-weight-medium">{{ item.nombre || '—' }}</div>
                </template>

                <template v-slot:[`item.marcaNombre`]="{ item }">
                    <v-chip small class="ma-1" color="blue lighten-5" text-color="blue darken-2">
                        {{ item.marcaNombre || '—' }}
                    </v-chip>
                </template>

                <!-- acciones -->
                <template v-slot:[`item.acciones`]="{ item }">
                    <div class="text-center">
                        <v-btn icon color="primary" @click="editModel(item)">
                            <v-icon>edit</v-icon>
                        </v-btn>
                        <v-btn icon color="red" @click="deleteModel(item)">
                            <v-icon>delete</v-icon>
                        </v-btn>
                    </div>
                </template>
            </v-data-table>

            <v-btn depressed color="green" class="mt-4 white--text" @click="createModel">
                Añadir modelo
                <v-icon>add</v-icon>
            </v-btn>
        </v-container>

        <BtnGoToHome />

        <confirm-dialog :value="confirmDeleteDialog" :message="`¿Deseas eliminar el modelo ${modelToDelete?.nombre}?`"
            title="Confirmar Eliminación" @confirm="confirmDelete" @cancel="cancelDelete" />

        <!-- Formulario de modelo -->
        <model-form :show="showForm" :editMode="isEditMode" :modelProp="selectedModel" :brands="brands"
            @close="showForm = false" @saved="fetchAll" />
    </div>
</template>

<script>
import axios from '@/utils/axios'
import ConfirmDialog from '@/components/dialog/ConfirmDialog.vue'
import AppDrawer from '@/components/layout/AppDrawer.vue'
import AppBar from '@/components/layout/AppBar.vue'
import BtnGoToHome from '@/components/BtnGoToHome.vue'
import ModelForm from '@/components/forms/ModelForm.vue' // 👈 crea el archivo de abajo

export default {
    name: 'ModelsView',
    components: {
        ConfirmDialog,
        AppDrawer,
        AppBar,
        BtnGoToHome,
        ModelForm,
    },
    data() {
        return {
            search: '',
            filters: { brandId: null },
            brands: [],
            models: [],
            showForm: false,
            selectedModel: null,
            isEditMode: false,
            confirmDeleteDialog: false,
            modelToDelete: null,
            drawer: false,
        }
    },
    computed: {
        headers() {
            return [
                { text: 'ID', value: 'id', align: 'center', sortable: false },
                { text: 'Modelo', value: 'nombre', align: 'center', sortable: false },
                { text: 'Marca', value: 'marcaNombre', align: 'center', sortable: false },
                { text: 'Acciones', value: 'acciones', align: 'center', sortable: false },
            ]
        },
        brandMap() {
            const map = {}
            this.brands.forEach(b => { map[b.id] = b.nombre })
            return map
        },
        brandItems() {
            return this.brands.map(b => ({ label: b.nombre, value: b.id }))
        },
        modelsWithBrand() {
            return this.models.map(m => ({
                ...m,
                marcaNombre: this.brandMap[m.idMarca] || '',
            }))
        },
        displayedModels() {
            let arr = this.modelsWithBrand
            if (this.filters.brandId) {
                arr = arr.filter(m => Number(m.idMarca) === Number(this.filters.brandId))
            }
            if (this.search) {
                const s = this.normalize(this.search)
                arr = arr.filter(m =>
                    this.normalize(m.nombre).includes(s)
                )
            }
            return arr
        },
    },
    methods: {
        normalize(s) {
            return (s || '')
                .toString()
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
        },
        filterIgnoreAccents(value, search) {
            if (!search) return true
            return this.normalize(value).includes(this.normalize(search))
        },
        clearFilters() {
            this.search = ''
            this.filters.brandId = null
        },
        goTo(routeName) {
            if (this.$route.name !== routeName) {
                this.$router.push({ name: routeName }).catch(() => { })
            }
        },
        logout() {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('token')
            this.$router.replace({ name: 'login' }).catch(() => { })
        },
        async fetchBrands() {
            const res = await axios.get('/brand')
            this.brands = Array.isArray(res.data) ? res.data : []
        },
        async fetchModels() {
            const res = await axios.get('/model')
            this.models = Array.isArray(res.data) ? res.data : []
        },
        async fetchAll() {
            try {
                await Promise.all([this.fetchBrands(), this.fetchModels()])
            } catch (e) {
                console.error('Error al cargar marcas/modelos:', e)
                this.$emit('error', 'No se pudieron cargar modelos o marcas.')
            }
        },
        createModel() {
            this.selectedModel = null
            this.isEditMode = false
            this.showForm = true
        },
        editModel(model) {
            this.selectedModel = model
            this.isEditMode = true
            this.showForm = true
        },
        deleteModel(model) {
            this.modelToDelete = model
            this.confirmDeleteDialog = true
        },
        async confirmDelete() {
            try {
                await axios.delete(`/model/${this.modelToDelete.id}`)
                await this.fetchAll()
            } catch (e) {
                console.error('Error al eliminar modelo:', e)
                this.$emit('error', 'Error al eliminar el modelo.')
            } finally {
                this.modelToDelete = null
                this.confirmDeleteDialog = false
            }
        },
        cancelDelete() {
            this.modelToDelete = null
            this.confirmDeleteDialog = false
        },
    },
    async mounted() {
        await this.fetchAll()
    },
}
</script>

<style scoped>
.v-data-table {
    border-radius: 12px;
}
</style>
