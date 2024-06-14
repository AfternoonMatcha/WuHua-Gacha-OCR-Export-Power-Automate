<template>
    <div style="display: flex; gap: 20px; flex-wrap: wrap; margin: 20px 0;">
        <v-btn prepend-icon="mdi-palette-swatch" @click="changeTheme">切换主题</v-btn>
        <v-btn prepend-icon="mdi-logout-variant" @click="apiTest">接口请求</v-btn>
    </div>
</template>

<script setup>
import t from "@/utils/MatceTools.js";
import { useTheme } from "vuetify";

const theme = useTheme();

const changeTheme = () => {
    theme.global.name.value = theme.global.current.value.dark
        ? // ? "customLight"
        // : "customDark";
        "light"
        : "dark";
}

import { getSample, getURLSample, postSample } from "@/api/main";

const apiTest = () => {
    postSample({ param: "test" }).then((res) => {
        const logName = "POST 请求示例"
        t.log(t.GET, logName, res.data);
    });

    getSample({ data: "test" }).then((res) => {
        const logName = "GET 请求示例"
        t.log(t.GET, logName, res.data);
    });

    getURLSample("test").then((res) => {
        const logName = "GET 页面参数请求示例"
        t.log(t.GET, logName, res.data);
    });
}
</script>