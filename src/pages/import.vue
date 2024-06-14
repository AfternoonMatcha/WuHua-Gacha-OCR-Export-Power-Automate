<template>
    <div class="main">
        <div class="title">导入</div>
        <div class="box">
            <div style="display: flex; gap: 20px">
                <v-text-field label="Base64 或明文输入" variant="outlined" v-model="input"
                    prepend-inner-icon="mdi-content-paste" />
                <v-btn prepend-icon="mdi-content-paste" class="boxItem" @click="transform()" size="x-large"><span
                        style="margin-top: -1px; margin-right: -4px; letter-spacing: 1px">导入</span>
                </v-btn>
            </div>
            <v-text-field v-if="isBase64" label="明文输出" variant="outlined" v-model="base64output"
                prepend-inner-icon="mdi-text-long" readonly />
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import t from "@/utils/MatceTools.js";

const input = ref("77u/Wwp7InJhcml0eSI6IueJueWHuiIsImJhbm5lciI6IumZkOaXti/kuIDop4HnpZ7mgJ0iLCJpdGVtIjoi5rSb56We6LWL5Zu+IiwidGltZSI6IjIwMjTlubQ15pyIMTjml6Ux5pe2MjPliIYifSwKeyJyYXJpdHkiOiLkvJjlvIIiLCJiYW5uZXIiOiLpmZDml7Yv5LiA6KeB56We5oCdIiwiaXRlbSI6IuWkp+ebgum8jiIsInRpbWUiOiIyMDI05bm0NeaciDE45pelMeaXtjIy5YiGIn0sCnsicmFyaXR5Ijoi5paw55SfIiwiYmFubmVyIjoi6ZmQ5pe2L+S4gOingeelnuaAnSIsIml0ZW0iOiLnjpvpm4XpmbbnopciLCJ0aW1lIjoiMjAyNOW5tDXmnIgxOOaXpTHml7YxNuWIhiJ9LAp7InJhcml0eSI6IuaWsOeUnyIsImJhbm5lciI6IumZkOaXti/kuIDop4HnpZ7mgJ0iLCJpdGVtIjoi5Y+v54ix6Iqx5p2fIiwidGltZSI6IjIwMjTlubQ15pyIMTjml6Ux5pe2MTbliIYifSwKeyJyYXJpdHkiOiLmlrDnlJ8iLCJiYW5uZXIiOiLpmZDml7Yv5LiA6KeB56We5oCdIiwiaXRlbSI6IuWuneefs+WGoCIsInRpbWUiOiIyMDI05bm0NeaciDE45pelMeaXtjE25YiGIn0sCnsicmFyaXR5Ijoi5paw55SfIiwiYmFubmVyIjoi6ZmQ5pe2L+S4gOingeelnuaAnSIsIml0ZW0iOiLokpnljLvoja/ooosiLCJ0aW1lIjoiMjAyNOW5tDXmnIgxOOaXpTDml7Y1NOWIhiJ9LAp7InJhcml0eSI6IuaWsOeUnyIsImJhbm5lciI6IumZkOaXti/kuIDop4HnpZ7mgJ0iLCJpdGVtIjoi5b+D5b2i5p6qIiwidGltZSI6IjIwMjTlubQ15pyIMTjml6Uw5pe2NTTliIYifSwKeyJyYXJpdHkiOiLmlrDnlJ8iLCJiYW5uZXIiOiIiLCJpdGVtIjoi55m96YeJ57u/5b2p55O2IiwidGltZSI6IjIwMjTlubQ15pyIMTjml6Uw5pe2NTTliIYifSwKeyJyYXJpdHkiOiLmlrDnlJ8iLCJiYW5uZXIiOiLpmZDml7Yv5LiA6KeB56We5oCdIiwiaXRlbSI6IiIsInRpbWUiOiIyMDI05bm0NeaciDE45pelMOaXtjMy5YiGIn0sCnsicmFyaXR5Ijoi5paw55SfIiwiYmFubmVyIjoi6ZmQ5pe2L+S4gOingeelnuaAnSIsIml0ZW0iOiLkupTmn7HlmagiLCJ0aW1lIjoiIn0sCnsicmFyaXR5Ijoi54m55Ye6IiwiYmFubmVyIjoi6ZmQ5pe2L+S4gOingeelnuaAnSIsIml0ZW0iOiLllYbpnoUiLCJ0aW1lIjoiMjAyNOW5tDXmnIgxOOaXpTDml7YzMeWIhiJ9LAp7InJhcml0eSI6IiIsImJhbm5lciI6IumZkOaXti/kuIDop4HnpZ7mgJ0iLCJpdGVtIjoi5b+D5b2i5p6qIiwidGltZSI6IjIwMjTlubQ15pyIMTjml6Uw5pe2MzHliIYifSwKeyJyYXJpdHkiOiLmlrDnlJ8iLCJiYW5uZXIiOiLpmZDml7Yv5LiA6KeB56We5oCdIiwiaXRlbSI6IuWPr+eIseiKseadnyIsInRpbWUiOiIyMDI05bm0NeaciDE45pelMOaXtjI45YiGIn0sCnsicmFyaXR5Ijoi5paw55SfIiwiYmFubmVyIjoi6ZmQ5pe2L+S4gOingeelnuaAnSIsIml0ZW0iOiLlpKnmsJTljZzpqqgiLCJ0aW1lIjoiMjAyNOW5tDXmnIgxOOaXpTDml7YyOOWIhiJ9LAp7InJhcml0eSI6IuS8mOW8giIsImJhbm5lciI6IumZkOaXti/kuIDop4HnpZ7mgJ0iLCJpdGVtIjoi5aSp5Lqh57CLIiwidGltZSI6IjIwMjTlubQ15pyIMTjml6Uw5pe2MjjliIYifSwKeyJyYXJpdHkiOiLmlrDnlJ8iLCJiYW5uZXIiOiLpmZDml7Yv5LiA6KeB56We5oCdIiwiaXRlbSI6IuS6uuWktOeTtiIsInRpbWUiOiIyMDI05bm0NeaciDE35pelMjPml7Y1N+WIhiJ9LAp7InJhcml0eSI6IuaWsOeUnyIsImJhbm5lciI6IumZkOaXti/kuIDop4HnpZ7mgJ0iLCJpdGVtIjoi55+z5YagIiwidGltZSI6IjIwMjTlubQ15pyIMTfml6UyM+aXtjUw5YiGIn0sCnsicmFyaXR5Ijoi5paw55SfIiwiYmFubmVyIjoi6ZmQ5pe2L+S4gOingeelnuaAnSIsIml0ZW0iOiLnjpvpm4XpmbbnopciLCJ0aW1lIjoiMjAyNOW5tDXmnIgxN+aXpTIz5pe2MzjliIYifSwKeyJyYXJpdHkiOiIiLCJiYW5uZXIiOiIiLCJpdGVtIjoiIiwidGltZSI6IiJ9LAp7InJhcml0eSI6IiIsImJhbm5lciI6IiIsIml0ZW0iOiIiLCJ0aW1lIjoiIn0KXQ==")
const output = ref(null)
const isBase64 = ref(false)
const base64output = ref(null)

// 转换
const transform = () => {
    // 检查是否为 Base64
    isBase64.value = true
    const keywords = ["特出", "优异", "新生"];
    for (let keyword of keywords) {
        if (input.value.includes(keyword)) {
            isBase64.value = false
            break
        }
    }

    // 对 Base64 进行转码
    if (isBase64.value) {
        try {
            base64output.value = decodeURIComponent(atob(input.value).split('').map((c) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join('')).replace(/\r/g, '')
        } catch (err) {
            const logName = "Base64 解码出现错误！"
            base64output.value = logName + err.message
            t.log(t.ERROR, logName, err.message)
            return
        }
    } else {
        base64output.value = input.value
    }

    let jsonString = base64output.value.replace(/^\uFEFF/, "");

    // 转换为 JSON 对象进行处理
    let jsonObject = null
    try {
        jsonObject = JSON.parse(jsonString)
    } catch (err) {
        const logName = "JSON 解析出现错误！"
        output.value = logName + err.message
        t.log(t.ERROR, logName, err.message)
        return
    }
    output.value = jsonObject
    t.logs("JSON", output.value)
}
</script>

<style lang="scss" scoped>
.main {
    .title {
        margin: 40px 0;
        font-size: 30px;
        font-weight: bold;
        overflow: hidden;
    }

    .box {
        display: flex;
        flex-direction: column;
        gap: 10px;

        &Item {
            margin-bottom: 22px;
            height: 56px
        }
    }
}
</style>