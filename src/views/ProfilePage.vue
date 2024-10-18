<template>
    <div class="container mx-20">


        <h3 class="text-center font-bold text-gray-800 text-lg my-8">Профиль редактора</h3>

        <div class="wrap flex justify-between my-20">
            <div class="wrap__item">
                <img  src="/src/assets/svg icon/avatar.png" alt="" class="avatar w-1/4">
            </div>
            <div class="wrap__item">
                <p class="text-nowrap font-semibold text-base">Ваш логин: </p>
                <ul>
                    <li v-for="event in myEvents" :key="event">
                        {{ event }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {

    data() {
        return {
            myEvents: [1, 2, 3],
        }
    },
    computed: {
    }
}
</script>