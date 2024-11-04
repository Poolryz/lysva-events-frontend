<template>
    <div class="container mx-20 flex justify-between my-32">
        <div class="left-panel">
            <ul>
                <li class="link link_active">
                    My profile
                </li>
                <li class="link">
                    Events
                </li>
                <li class="link">
                    Security
                </li>
            </ul>
        </div>
        <div class="right-panel">
            <div class="right-panel__section section">
                <div class="info">
                    <img src="/src/assets/svg icon/avatar.png" alt="" class="avatar">
                    <div class="info__text">
                        <div class="name">{{loginInfo.name}}</div>
                        <div class="organization">{{loginInfo.organization}}</div>
                    </div>
                </div>
                <button class="btm" type="button">Edit</button>
            </div>
        </div>


    </div>
</template>

<script>
import axios from 'axios';
import urlChanger from '../services/constElement';

export default {

    data() {
        return {
            loginInfo: ''
        }
    },
    computed: {

    },
    methods: {
        async getLoginInfo() {
            try {
                const response = await axios.get(`${urlChanger()}login`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Отправляем токен для авторизации
                    },
                });
                this.loginInfo = response.data
            } catch (error) {
                console.log("Ошибка при получении информации пользователя", error)
            }
        },
    },
    created() {
        this.getLoginInfo()
    }
}
</script>
<style lang="scss">
.left-panel {
    @apply min-w-64
}

.link {
    @apply text-gray-400 font-semibold text-nowrap text-2xl hover:text-blue-500 cursor-pointer transition-all p-4 my-1 rounded-2xl;

    &_active {
        @apply bg-blue-100 text-blue-400
    }
}

.right-panel {
    @apply ml-7 w-full;

    &__section {
        @apply flex justify-between items-center;

        .btm {
            @apply border-solid border-2 p-2;
        }
    }
}

.avatar {
    @apply max-w-52 rounded-full
}

.info {
    @apply flex items-center;

    &__text {
        @apply ml-4;

        .name {
            @apply text-xl font-bold
        }

        .organization {
            @apply text-lg
        }
    }

}
</style>