<template>
  <v-app>
    <app-drawer v-model="drawer" />
    <app-bar @toggle-drawer="drawer = !drawer" @goToSettings="goTo('config')" @changeCompany="goTo('changeCompany')"
      @logout="logout" />

    <v-main>
      <v-container>
        <v-row>
          <!-- usar require() directamente en el template -->
          <dashboard-card title="Vehículos" subtitle="Gestión de vehículos registrados" icon="mdi-car"
            :image="require('@/assets/img_cards/vehicles.jpg')" @click="goTo('vehicles')" />
          <!-- usar computed para exponer las imágenes, declarar shims-images.d.ts -->
          <dashboard-card title="Modelos" subtitle="Listado y control de modelos" icon="mdi-car-multiple"
            :image="ModelsImg" @click="goTo('models')" />
          <dashboard-card title="Marcas" subtitle="Catálogo de marcas de vehículos" icon="mdi-domain" :image="BrandsImg"
            @click="goTo('brands')" />
          <dashboard-card title="Tipos de Combustible" subtitle="Gasolina, diésel, eléctrico, etc." icon="mdi-fuel"
            :image="FuelsImg" @click="goTo('fuels')" />
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import AppBar from '@/components/layout/AppBar.vue'
import AppDrawer from '@/components/layout/AppDrawer.vue'
import DashboardCard from '@/components/dashboard/DashboardCard.vue'
import VehiclesImg from '@/assets/img_cards/vehicles.jpg'
import ModelsImg from '@/assets/img_cards/models.avif'
import BrandsImg from '@/assets/img_cards/brands-1200x675.png'
import FuelsImg from '@/assets/img_cards/typefuels.webp'



export default Vue.extend({
  name: 'HomeView',
  components: {
    AppBar,
    AppDrawer,
    DashboardCard
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
  }, computed: {
    VehiclesImg(): string {
      return VehiclesImg;
    },
    ModelsImg(): string {
      return ModelsImg;
    },
    BrandsImg(): string {
      return BrandsImg;
    },
    FuelsImg(): string {
      return FuelsImg;
    }
  }

})
</script>
