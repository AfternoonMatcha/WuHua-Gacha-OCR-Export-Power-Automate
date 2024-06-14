<template>
    <div class="main">
        <div class="title">Welcome 欢迎</div>
        <div class="navBox">
            <v-card height="100" v-ripple="{ class: 'text-white' }" v-for="navItem in [...configStore.nav.filter(nav => nav.url !== '/'),
            { title: '敬请期待', url: null, icon: 'chevron-right' }]" cols="auto" class="nav d-flex elevation-0"
                :prepend-icon="'mdi-' + navItem.icon" @click="router.push({ path: navItem.url })">
                <div class="navTitle">{{ navItem.title }}</div>
            </v-card>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import t from "@/utils/MatceTools.js";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

import { useConfigStore } from "@/stores/config";
const configStore = useConfigStore()
</script>

<style lang="scss" scoped>
.main {
    .title {
        margin-top: 80px;
        margin-bottom: 40px;
        font-size: 30px;
        font-weight: bold;
        overflow: hidden;
    }

    .navBox {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        overflow: hidden;

        .nav {
            width: 100%;
            max-width: 100%;
            cursor: pointer;
            padding: 14px;
            display: flex;
            align-items: center;
            transition: 0.2s ease;

            &Title {
                flex: 1;
                margin-top: 1px;
                font-size: 16px;
                overflow: hidden;
                white-space: pre-wrap;
                display: -webkit-box;
                overflow: hidden;
                text-overflow: ellipsis; //省略号
                -webkit-line-clamp: 3; //指定保留行数
                -webkit-box-orient: vertical;
            }
        }

        .nav:hover {
            padding-left: 20px;
        }

        @media (min-width: 700px) {
            .nav {
                width: calc(calc(100% - 10px) / 2);
                padding-right: 0px;
            }
        }

        @media (min-width: 900px) {
            .nav {
                width: calc(calc(100% - 20px) / 3);
            }
        }
    }
}
</style>