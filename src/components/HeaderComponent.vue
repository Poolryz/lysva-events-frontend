<template>
    <header class="bg-gray-800">
        <nav>
            <router-link class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" to="/">Все мероприятия</router-link> |
            <router-link to="/create">Создать мероприятие</router-link>
        </nav>
        
    </header>
</template>
<script>
export default {
    name: HeaderComponent,
    

}
</script>