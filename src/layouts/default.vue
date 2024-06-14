<template>
    <v-layout>
        <v-navigation-drawer v-model="drawer" temporary density="comfortable">
            <v-list-item lines="two" title="WuHua-Gacha-OCR-Export" subtitle="物华弥新抽卡记录导出项目"
                @click="router.push({ path: '/' })" />
            <v-divider />
            <v-list density="comfortable" nav>
                <v-list-item v-for="navItem in configStore.nav" :prepend-icon="'mdi-' + navItem.icon"
                    :title="navItem.title" :active="urlNow === navItem.url"
                    @click="router.push({ path: navItem.url })" />
            </v-list>
            <v-divider />
            <v-list lines="three">
                <v-list-subheader>Ver. {{ version }} /
                    <a href="https://Matce.cn" style="color: inherit; text-decoration: none" target="_blank">By:
                        Matce</a></v-list-subheader>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar subtitle="test">
            <template v-slot:prepend>
                <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            </template>

            <v-app-bar-title @click="router.push({ path: '/' })"
                style="cursor: pointer">WuHua-Gacha-OCR-Export</v-app-bar-title>
        </v-app-bar>

        <v-main>
            <div class="layerMain">
                <div class="layerContainer">
                    <router-view />
                </div>
            </div>
        </v-main>
    </v-layout>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import t from "@/utils/MatceTools.js"; //JS 方法工具箱\
import { useConfigStore } from "@/stores/config";
const configStore = useConfigStore()

const router = useRouter();
const route = useRoute();

import config from "/package.json";
let version = config.version;

let drawer = ref(null);

let urlNow = ref(route.path);
watch(() => route.path, (newPath) => {
    urlNow.value = newPath;
});
</script>

<style lang="scss" scoped>
.layerMain {
    height: 100%;
    display: flex;
    justify-content: center;

    .layerContainer {
        height: 100%;
        flex: 1;
        max-width: 70%;
        transition: .2s ease;
        padding: 0 19px;

        @media (max-width: 1300px) {
            & {
                max-width: 90%;
            }
        }

        @media (max-width: 700px) {
            & {
                max-width: 1000px;
            }
        }
    }
}
</style>