<template>
    <v-app-bar app shrink-on-scroll height="64">
        <v-app-bar-nav-icon @click="$emit('toggle-drawer')" />
        <v-toolbar-title>Gestión de Flotas</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-menu offset-y bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-account</v-icon>
                </v-btn>
            </template>

            <v-list>
                <v-list-item @click="$emit('goToSettings')">
                    <v-list-item-icon><v-icon>mdi-cog</v-icon></v-list-item-icon>
                    <v-list-item-title>Configuración</v-list-item-title>
                </v-list-item>

                <v-list-item @click="$emit('changeCompany')">
                    <v-list-item-icon><v-icon>mdi-domain-switch</v-icon></v-list-item-icon>
                    <v-list-item-title>Cambiar Empresa</v-list-item-title>
                </v-list-item>

                <v-list-item @click="$emit('logout')">
                    <v-list-item-icon><v-icon>mdi-logout</v-icon></v-list-item-icon>
                    <v-list-item-title>Cerrar sesión</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    name: 'AppBar'
})
</script>
