<template>
    <v-navigation-drawer app temporary v-model="drawer">
        <v-list>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="title">Menú</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-item link @click="$router.push({ name: 'home' })">
                <v-list-item-icon><v-icon>mdi-home</v-icon></v-list-item-icon>
                <v-list-item-title>Inicio</v-list-item-title>
            </v-list-item>

            <v-list-item link @click="$router.push({ name: 'vehicles' })">
                <v-list-item-icon><v-icon>mdi-car</v-icon></v-list-item-icon>
                <v-list-item-title>Vehículos</v-list-item-title>
            </v-list-item>

            <v-list-item link @click="$router.push({ name: 'brands' })">
                <v-list-item-icon><v-icon>mdi-domain</v-icon></v-list-item-icon>
                <v-list-item-title>Marcas</v-list-item-title>
            </v-list-item>

            <v-list-item link @click="$router.push({ name: 'models' })">
                <v-list-item-icon><v-icon>mdi-car-multiple</v-icon></v-list-item-icon>
                <v-list-item-title>Modelos</v-list-item-title>
            </v-list-item>

            <v-list-item link @click="$router.push({ name: 'typefuels' })">
                <v-list-item-icon><v-icon>mdi-fuel</v-icon></v-list-item-icon>
                <v-list-item-title>Combustibles</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
export default {
    name: 'AppDrawer',
    props: {
        value: Boolean,
    },
    computed: {
        drawer: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
            }
        }
    }
}
</script>
