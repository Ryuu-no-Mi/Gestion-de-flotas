<template>
  <hello-world />
</template>

<script lang="ts">
import Vue from 'vue'
import HelloWorld from '../components/HelloWorld.vue'

export default Vue.extend({
  name: 'Home',

  components: {
    HelloWorld,
  },


  /*
  ✅ Opción 1: Usar función normal (recomendado para claridad)
  data() {
    return {
      message: "Welcome to the Home View!"
    }
  },

  ✅ Opción 2: Usar arrow function sin return explícito y sin llaves
  data: () => ({
    message: "Welcome to the Home View!"
  }),

  */
  // Expresion lambda para definir los datos del componente
  data() {


    // Propiedades reactivas del componente
    return {
      message: "Welcome to the Home View!"
    }
  }
})
</script>
