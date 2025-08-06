<template>
  <v-app id="inspire">
    <!-- Drawer -->
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list>
        <!-- User Menu -->
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">Menú</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Home -->
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Inicio</v-list-item-title>
        </v-list-item>

        <!-- Vehicles -->
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-car</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Vehículos</v-list-item-title>
        </v-list-item>

        <v-list-item link>
          <v-list-item-icon>
            <v-icon color="darken-2">
              mdi-domain
            </v-icon>
          </v-list-item-icon>
          <v-list-item-title>Marcas</v-list-item-title>
        </v-list-item>

        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-car-multiple</v-icon>

          </v-list-item-icon>
          <v-list-item-title>Modelos</v-list-item-title>
        </v-list-item>


        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-fuel</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Tipos de Combustible</v-list-item-title>
        </v-list-item>

      </v-list>
    </v-navigation-drawer>

    <!-- User Settings Bar -->
    <v-app-bar app shrink-on-scroll height="64">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>Gestión de Flotas</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- User settings menu -->
      <v-menu offset-y bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="goToSettings">
            <v-list-item-icon><v-icon>mdi-cog</v-icon></v-list-item-icon>
            <v-list-item-title>Configuración</v-list-item-title>
          </v-list-item>

          <v-list-item @click="changeCompany">
            <v-list-item-icon><v-icon>mdi-domain-switch</v-icon></v-list-item-icon>
            <v-list-item-title>Cambiar Empresa</v-list-item-title>
          </v-list-item>

          <v-list-item @click="logout">
            <v-list-item-icon><v-icon>mdi-logout</v-icon></v-list-item-icon>
            <v-list-item-title>Cerrar sesión</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-container>
        <v-row>
          <!-- Vehículos -->
          <v-col cols="12" sm="6" md="6">
            <v-card class="pa-3" color="#f5f5f5" hover @click="goTo('vehicles')">
              <v-img src="../assets/img_cards/vehicles.jpg" height="200" cover></v-img>
              <v-card-title>
                <v-icon class="mr-2">mdi-car</v-icon>
                Vehículos
              </v-card-title>
              <v-card-subtitle>Gestión de vehículos registrados</v-card-subtitle>
            </v-card>
          </v-col>

          <!-- Modelos -->
          <v-col cols="12" sm="6" md="6">
            <v-card class="pa-3" color="#f5f5f5" hover @click="goTo('models')">
              <v-img src="../assets/img_cards/models.avif" height="200" cover></v-img>

              <v-card-title>
                <v-icon class="mr-2">mdi-car-multiple</v-icon>
                Modelos
              </v-card-title>
              <v-card-subtitle>Listado y control de modelos</v-card-subtitle>
            </v-card>
          </v-col>

          <!-- Marcas -->
          <v-col cols="12" sm="6" md="6">
            <v-card class="pa-3" color="#f5f5f5" hover @click="goTo('brands')">
              <v-img src="../assets/img_cards/brands-1200x675.png" height="200" cover></v-img>

              <v-card-title>
                <v-icon class="mr-2">mdi-domain</v-icon>
                Marcas
              </v-card-title>

              <v-card-subtitle>Catálogo de marcas de vehículos</v-card-subtitle>

            </v-card>
          </v-col>

          <!-- Combustibles -->
          <v-col cols="12" sm="6" md="6">
            <v-card class="pa-3" color="#f5f5f5" hover @click="goTo('fuels')">
              <v-img src="../assets/img_cards/typefuels.webp" height="200" cover></v-img>
              <v-card-title>
                <v-icon class="mr-2">mdi-fuel</v-icon>
                Tipos de Combustible
              </v-card-title>
              <v-card-subtitle>Gasolina, diésel, eléctrico, etc.</v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

  </v-app>
</template>



<script lang="ts">
import AppBar from './layout/AppBar.vue'
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
  name: 'HelloWorld',
  components: {
    axios
  },

  data() {
    return {
      drawer: false
    }
  },

  methods: {
    goTo(routeName: string) {
      this.$router.push({ name: routeName })
    },
    goToSettings() {
      this.$router.push({ name: 'settings' }); // Asegúrate de tener esa ruta
    },
    changeCompany() {
      this.$router.push({ name: 'switch-company' }); // Ruta a vista de empresa
    },
    logout() {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      this.$router.push({ name: 'login' });
    }
  }

  // Una vez iniciada la sesion, esta me devolvera un objeto donde tendre el token de acceso
  // y el token de refresco, que se guardaran en el localStorage
  // y se usaran para autenticar las peticiones a la API, mandando el token de acceso en el header Authorization
})
</script>
