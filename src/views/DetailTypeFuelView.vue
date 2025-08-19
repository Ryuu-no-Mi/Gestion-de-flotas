<template>
    <div>
        <app-drawer v-model="drawer" />
        <app-bar @toggle-drawer="drawer = !drawer" @goToSettings="goTo('config')" @changeCompany="goTo('changeCompany')"
            @logout="logout" />

        <v-container>
            <v-data-table :headers="headers" :items="typefuels" item-key="id" class="mt-16 elevation-2 text-center"
                :search="search" :custom-filter="filterIgnoreAccents">
                <template v-slot:top>
                    <v-row class="px-4 pb-4" dense>
                        <v-col cols="12" sm="9">
                            <v-text-field v-model="search" label="Buscar por tipo de combustible" hide-details
                                clearable />
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

                <template v-slot:[`item.acciones`]="{ item }">
                    <div class="text-center">
                        <v-btn icon color="primary" @click="editTypeFuel(item)">
                            <v-icon>edit</v-icon>
                        </v-btn>
                        <v-btn icon color="red" @click="deleteTypeFuel(item)">
                            <v-icon>delete</v-icon>
                        </v-btn>
                    </div>
                </template>
            </v-data-table>

            <v-btn depressed color="green" class="mt-4 white--text" @click="createTypeFuel">
                Añadir tipo de combustible
                <v-icon>add</v-icon>
            </v-btn>
        </v-container>

        <BtnGoToHome />

        <confirm-dialog :value="confirmDeleteDialog"
            :message="`¿Deseas eliminar el tipo de combustible ${typefuelToDelete?.nombre}?`"
            title="Confirmar Eliminación" @confirm="confirmDelete" @cancel="cancelDelete" />

        <type-fuel-form :show="showForm" :editMode="isEditMode" :typeFuelProp="typefuelSelected"
            @close="showForm = false" @saved="fetchAll" />
    </div>
</template>


<script>
import axios from '@/utils/axios'
import ConfirmDialog from '@/components/dialog/ConfirmDialog.vue'
import AppDrawer from '@/components/layout/AppDrawer.vue'
import AppBar from '@/components/layout/AppBar.vue'
import BtnGoToHome from '@/components/BtnGoToHome.vue'
import TypeFuelForm from '@/components/forms/TypeFuelForm.vue'

export default {
    name: 'TypeFuelView',
    components: {
        ConfirmDialog,
        AppDrawer,
        AppBar,
        BtnGoToHome,
        TypeFuelForm,
    },
    data() {
        return {
            search: '',
            typefuels: [],
            showForm: false,
            typefuelSelected: null,
            isEditMode: false,
            confirmDeleteDialog: false,
            typefuelToDelete: null,
            drawer: false,
        }
    },
    computed: {
        headers() {
            return [
                { text: 'ID', value: 'id', align: 'center', sortable: false },
                { text: 'Nombre', value: 'nombre', align: 'center', sortable: false },
                { text: 'Acciones', value: 'acciones', align: 'center', sortable: false },
            ]
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
        },
        goTo(routeName) {
            if (this.$route.name !== routeName) {
                this.$router.push({ name: routeName }).catch(() => { })
            }
        },
        logout() {
            localStorage.removeItem('token')
            this.$router.replace({ name: 'login' })
        },
        async fetchAll() {
            try {
                const res = await axios.get('/typefuel')
                this.typefuels = (Array.isArray(res.data) ? res.data : [])
                console.log(this.typefuels);

            } catch (e) {
                console.error('Error al cargar tipos de combustible:', e)
                this.$emit('error', 'No se pudieron cargar tipos de combustible.')
            }
        },
        createTypeFuel() {
            this.typefuelSelected = null
            this.isEditMode = false
            this.showForm = true
        },
        editTypeFuel(typefuel) {
            this.typefuelSelected = typefuel
            this.isEditMode = true
            this.showForm = true
        },
        deleteTypeFuel(typefuel) {
            this.typefuelToDelete = typefuel
            this.confirmDeleteDialog = true
        },
        async confirmDelete() {
            try {
                await axios.delete(`/typefuel/${this.typefuelToDelete.id}`)
                await this.fetchAll()
            } catch (e) {
                console.error('Error al eliminar tipo de combustible:', e)
                this.$emit('error', 'Error al eliminar el tipo de combustible.')
            } finally {
                this.typefuelToDelete = null
                this.confirmDeleteDialog = false
            }
        },
        cancelDelete() {
            this.typefuelToDelete = null
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
