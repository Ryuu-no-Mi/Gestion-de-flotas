<template>
    <div class="my-6 d-flex justify-center">
        <v-btn :to="{ name: 'home' }" text>
            Volver a inicio
        </v-btn>
    </div>
</template>


<script>
export default {
    name: 'BtnGoToHome',
}
</script>