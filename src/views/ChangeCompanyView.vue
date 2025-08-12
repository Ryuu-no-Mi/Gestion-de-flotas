<template>
    <section class="p-4">
        <header class="mb-4 flex items-center justify-between gap-3">
            <h2 class="text-xl font-semibold">Cambiar de empresa</h2>
            <div class="flex items-center gap-2">
                <input v-model.trim="search" type="search" placeholder="Buscar empresa..."
                    class="border rounded px-3 py-2 text-sm w-64" />
                <button class="border px-3 py-2 rounded text-sm" :disabled="loading" @click="fetchCompanies"
                    title="Recargar">
                    {{ loading ? 'Cargando...' : 'Recargar' }}
                </button>
            </div>
        </header>

        <div v-if="error" class="mb-3 rounded bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
            {{ error }}
        </div>

        <div class="overflow-x-auto border rounded">
            <table class="min-w-full text-sm">
                <thead class="bg-gray-50 text-center">
                    <tr>
                        <th class="text-center p-6 font-medium text-gray-600">ID</th>
                        <th class="text-center p-6 font-medium text-gray-600">NOMBRE</th>
                        <th class="text-center p-6 font-medium text-gray-600">NIF</th>
                        <th class="text-center p-6 font-medium text-gray-600">RAZÓN SOCIAL</th>
                        <th class="text-center p-6 font-medium text-gray-600">ACTIVA</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="c in filtered" :key="c.id" class="border-t text-center">
                        <td class="p-3">
                            <div class="font-medium">{{ c.id }}</div>
                        </td>
                        <td class="p-3 text-gray-700">{{ c.nombre || '—' }}</td>
                        <td class="p-3 text-gray-700">{{ c.nif || '—' }}</td>
                        <td class="p-3 text-gray-700">{{ c.razonSocial || '—' }}</td>
                        <td class="p-3">
                            <span class="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs"
                                :class="c.activa ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'">
                                <span
                                    :class="['h-2 w-2 rounded-full', c.activa ? 'bg-emerald-500' : 'bg-gray-400']"></span>
                                {{ c.activa ? 'Activa' : 'Inactiva' }}
                            </span>
                        </td>
                    </tr>

                    <tr v-if="!loading && filtered.length === 0">
                        <td colspan="3" class="p-6 text-center text-gray-500">No hay empresas para mostrar.</td>
                    </tr>
                </tbody>
            </table>

            <div v-if="loading" class="p-6 text-center text-gray-500">Cargando empresas…</div>
        </div>
    </section>
</template>

<script>
import axios from '@/utils/axios'
import { jwtDecode } from 'jwt-decode'

export default {
    name: 'CambioEmpresa',
    data() {
        return {
            loading: false,
            error: '',
            companies: [],
            search: ''
        }
    },

    computed: {
        filtered() {
            const q = this.search.toLowerCase().trim()
            if (!q) return this.companies
            return this.companies.filter(c =>
                [c.nombre, c.codigo, c.referenciaExterna]
                    .filter(Boolean)
                    .some(v => String(v).toLowerCase().includes(q))
            )
        }
    },

    methods: {
        getUserIdFromToken() {
            try {
                const raw = localStorage.getItem('token')
                if (!raw) return null
                const t = jwtDecode(raw)
                return t?.DATA1 || t?.sub || t?.nameid || t?.nameId || t?.unique_name || null
            } catch {
                return null
            }
        },

        async fetchCompanies() {
            this.loading = true
            this.error = ''
            this.companies = []

            const idUser = this.getUserIdFromToken()
            if (!idUser) {
                this.loading = false
                this.error = 'No se pudo obtener el usuario desde el token.'
                return
            }

            try {
                // 1) Pido la relación usuario–empresa
                const relRes = await axios.get(`/companyuser/user/${idUser}`)
                console.log('Relación usuario–empresa:', relRes.data)

                // si viene un solo objeto, lo meto en un array para procesar igual que varios
                const relaciones = Array.isArray(relRes.data) ? relRes.data : [relRes.data]

                // 2) Pido los datos de cada empresa
                const detailPromises = relaciones.map(rel =>
                    axios.get(`/company/${rel.idEmpresa}`).then(r => r.data)
                )


                const empresas = await Promise.all(detailPromises)

                console.log(empresas);


                // 3) Si tu backend marca la activa dentro de este DTO, la usamos; si no, aquí va lógica de activo
                this.companies = empresas
            } catch (e) {
                this.error = e?.response?.data?.message || 'No se pudieron cargar las empresas.'
                console.error(e)
            } finally {
                this.loading = false
            }
        }
    },
    mounted() {
        this.fetchCompanies()
    }
}
</script>

<style scoped>
dialog::backdrop {
    background: rgba(0, 0, 0, .25);
}
</style>
