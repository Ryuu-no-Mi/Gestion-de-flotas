<template>
    <v-col cols="12" sm="6" md="6">
        <v-card class="pa-3" color="#f5f5f5" hover @click="$emit('click')">
            <v-img :src="image" height="200" cover></v-img>
            <v-card-title>
                <v-icon class="mr-2">{{ icon }}</v-icon>
                {{ title }}
            </v-card-title>
            <v-card-subtitle>{{ subtitle }}</v-card-subtitle>
        </v-card>
    </v-col>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: 'DashboardCard',
    props: {
        title: String,
        subtitle: String,
        icon: String,
        image: String
    }

})
</script>