<template>
    <v-container class="w-100  h-100 gray" fluid>
        <app-drawer v-model="drawer" />
        <app-bar @toggle-drawer="drawer = !drawer" @goToSettings="goTo('config')" @changeCompany="goTo('changeCompany')"
            @logout="logout" />
        <v-row class="w-100 mt-16" justify="center">
            <!-- 100% en móvil, ~80% md, ~66% lg, ~50% xl -->
            <v-col cols="12" sm="12" md="12" lg="10" xl="10 ">
                <v-card class="elevation-3">

                    <!-- Título bonito -->
                    <v-sheet class="title-hero d-flex align-center px-6 py-5">
                        <v-icon large class="mr-3">mdi-domain</v-icon>
                        <div>
                            <h1 class="text-h5 text-md-h4 font-weight-bold mb-1">Empresas disponibles</h1>
                            <div class="subtitle-2 grey--text text--darken-1">
                                Cambia tu empresa activa
                            </div>
                        </div>
                    </v-sheet>

                    <v-divider />

                    <!-- Tabla -->
                    <div class="table-wrapper ">
                        <v-simple-table class="company-table">
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                        <th class="text-center">ID</th>
                                        <th class="text-center">Nombre</th>
                                        <th class="text-center">NIF</th>
                                        <th class="text-center">Razón social</th>
                                        <th class="text-center">Activa</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr v-for="c in filtered" :key="c.id" class="company-row">
                                        <td class="text-center font-mono pa-1 blue">{{ c.id }}</td>
                                        <td class="text-center font-weight-medium text-truncate">{{ c.nombre || '—' }}
                                        </td>
                                        <td class="text-center text-truncate">{{ c.nif || '—' }}</td>
                                        <td class="text-center text-truncate">{{ c.razonSocial || '—' }}</td>
                                        <td class="text-center">
                                            <template v-if="c.id === activeCompanyId">
                                                <v-chip small color="green lighten-4" text-color="green darken-2"
                                                    class="px-3">
                                                    <v-avatar left size="10" class="mr-2" color="green"></v-avatar>
                                                    Activa
                                                </v-chip>
                                            </template>
                                            <template v-else>
                                                <v-btn small outlined color="primary" @click="cambiarEmpresa(c)">
                                                    Usar esta empresa
                                                </v-btn>
                                            </template>
                                        </td>
                                    </tr>

                                    <tr v-if="!loading && filtered.length === 0">
                                        <td colspan="5" class="text-center grey--text py-6">
                                            No hay empresas para mostrar.
                                        </td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </div>
                </v-card>
            </v-col>
        </v-row>
        <v-card-actions class="d-flex justify-center mt-4">
            <v-btn color="white" class="background-color: red" text @click="$router.push({ name: 'home' })">
                Volver a inicio
            </v-btn>
        </v-card-actions>
    </v-container>
</template>

<style scoped>
/* Encabezado con leve degradado */
.title-hero {
    background: linear-gradient(180deg, rgba(98, 0, 238, 0.08), rgba(98, 0, 238, 0));
}

/* Contenedor para evitar overflow horizontal en móviles */
.table-wrapper {
    width: 100%;
}

/* Tabla limpia + hover */
.company-table thead th {
    font-weight: 800;
    white-space: nowrap;
}

.company-row {
    transition: background-color 0.15s ease, transform 0.06s ease;
}

.company-row:hover {
    background-color: rgba(0, 0, 0, 0.025);
}

/* Truncar texto largo sin romper la tabla */
.text-truncate {
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* Ajustes responsive para columnas estrechas */
@media (max-width: 800px) {
    .text-truncate {
        max-width: 160px;
    }
}
</style>


<script>
import axios from '@/utils/axios'
import { jwtDecode } from 'jwt-decode'
import AppBar from '@/components/layout/AppBar.vue'
import AppDrawer from '@/components/layout/AppDrawer.vue'

export default {
    components: {
        AppBar,
        AppDrawer,
    },
    name: 'CambioEmpresa',
    data() {
        return {
            loading: false,
            error: '',
            companies: [],
            search: '',
            activeCompanyId: null,
            activeRecord: null,
            //
            drawer: false
        }
    },

    computed: {
        filtered() {
            const query = this.search.toLowerCase().trim()
            if (!query) return this.companies
            return this.companies.filter(c =>
                [c.nombre, c.nif, c.razonSocial]
                    .filter(Boolean)
                    .some(v => String(v).toLowerCase().includes(query))
            )
        }
    },

    methods: {
        getUserIdFromToken() {
            try {
                const raw = localStorage.getItem('token')
                if (!raw) return null
                const t = jwtDecode(raw)
                return t?.DATA1
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
                // 1) relaciones usuario–empresa (puede venir 1 o N)
                const relRes = await axios.get(`/companyuser/user/${idUser}`)
                const relaciones = Array.isArray(relRes.data) ? relRes.data : [relRes.data]
                console.log('Relación usuario–empresa:', relaciones)

                // 2) pide detalles de cada empresa y conserva la relación (para usar su idEmpresa)
                const pairs = await Promise.all(
                    relaciones.map(async rel => {
                        const dto = await axios.get(`/company/${rel.idEmpresa}`).then(r => r.data)
                        return { rel, dto }
                    })
                )
                const empresasDTO = pairs.map(p => p.dto)
                console.log('Detalles de empresas:', empresasDTO)

                // 3) activas GLOBAL (array). Filtra por TU usuario
                const activeRes = await axios.get('/companyactive')
                const raw = activeRes?.data?.data ?? activeRes?.data
                console.log("RAW:", raw);

                const list = Array.isArray(raw) ? raw : []
                console.log("LIST:", list);

                const activeForUser = list.find(x => String(x.idUsuario) === String(idUser))

                console.log('Empresa activa para usuario:', activeForUser)
                const activeCompanyId = activeForUser ? Number(activeForUser.idEmpresa) : null

                console.log('Company id (activa):', activeCompanyId, typeof activeCompanyId)
                //console.log('RAW /companyactive:', JSON.stringify(activeRes.data))

                this.activeCompanyId = activeCompanyId
                this.activeRecord = activeForUser || null

                // 4) marca activa comparando contra rel.idEmpresa (no contra dto.id)
                this.companies = pairs
                    .map(({ rel, dto }) => ({
                        ...dto,
                        activa: activeCompanyId != null && Number(rel.idEmpresa) === activeCompanyId
                    }))
                    .sort((a, b) => Number(b.activa) - Number(a.activa))

                console.log('Companies con activa:', this.companies.map(x => ({ id: x.id, activa: x.activa })))
                console.log('IDs empresas:', empresasDTO.map(e => ({ id: e.id, typeof: typeof e.id })))
            } catch (e) {
                this.error = e?.response?.data?.message || 'No se pudieron cargar las empresas.'
                console.error(e)
            } finally {
                this.loading = false
            }
        },
        async cambiarEmpresa(empresa) {
            try {
                console.log('Cambiando empresa a:', empresa);
                console.log(empresa);

                const idUsuario = Number(this.getUserIdFromToken())
                const idEmpresaDestino = Number(empresa.id) // el id de la empresa seleccionada en la tabla
                const idAplicacion = this.activeRecord?.idAplicacion ?? 0
                const idRegistro = this.activeRecord?.id ?? 0 // no es imprescindible si el servicio busca por IdUsuario

                // CompanyActiveDTO completo
                const dto = {
                    id: idRegistro,
                    idEmpresa: idEmpresaDestino,
                    idUsuario: idUsuario,
                    idAplicacion: idAplicacion
                }

                await axios.put('/companyactive/set-active', dto)


                this.fetchCompanies() // recarga lista para reflejar cambio
                alert(`Empresa cambiada a: ${empresa.nombre || '—'}`)
            } catch (err) {
                console.error('Error al cambiar empresa:', err)
            }
        }

    },
    mounted() {
        this.fetchCompanies()
    }
}
</script>

<style scoped>
.company-table {
    /* filas separadas como “cards” */
    border-collapse: separate;
    border-spacing: 0 10px;
    /* separación vertical entre filas */
    margin: -10px 0;
    /* compensa el spacing para que no sume altura extra */
}

.company-table thead th {
    padding: 16px;
    background: #f6f7fb;
    /* gris suave de cabecera */
    color: #546e7a;
    /* slate */
    font-weight: 600;
    letter-spacing: .02em;
}

.company-table tbody td {
    padding: 14px 16px;
}

.company-row {
    /* sombra y redondeado por fila */
    box-shadow: 0 2px 6px rgba(0, 0, 0, .06);
    border-radius: 12px;
    transition: box-shadow .18s ease, transform .06s ease;
}

.company-row:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, .10);
    transform: translateY(-2px);
}

/* separadores verticales sutiles entre celdas */
.company-row>td+td {
    border-left: 2px solid #eef2f7;
}
</style>
