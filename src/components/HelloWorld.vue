<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Esto es el Home</h1>
        <p>Este es un componente simple de Vue.</p>
        <router-link to="/login">Ir a Login</router-link>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
  name: 'HelloWorld',
  components: {
    axios
  },

  // Una vez iniciada la sesion, esta me devolvera un objeto donde tendre el token de acceso
  // y el token de refresco, que se guardaran en el localStorage
  // y se usaran para autenticar las peticiones a la API, mandando el token de acceso en el header Authorization
})
</script>
