<template>
    <v-app>
        <app-drawer v-model="drawer" />
        <app-bar @toggle-drawer="drawer = !drawer" @goToSettings="goTo('config')" @changeCompany="goTo('changeCompany')"
            @logout="logout" />
        <v-main>
            <v-container >
                <dashboard-table />
            </v-container>
        </v-main>
    </v-app>

</template>

<script lang="ts">
import Vue from 'vue'
import AppBar from '@/components/layout/AppBar.vue'
import AppDrawer from '@/components/layout/AppDrawer.vue'
import DashboardTable from '@/components/dashboard/DashboardTable.vue'


export default Vue.extend({
    name: 'DetailVehiclesView',
    components: {
        AppBar,
        AppDrawer,
        DashboardTable
    },
    data() {
        return {
            drawer: false
        }
    },
    methods: {
        goTo(route: string) {
            this.$router.push({ name: route });
        },
        logout() {
            localStorage.clear();
            this.$router.push({ name: 'login' });
        }
    }
})
</script>
