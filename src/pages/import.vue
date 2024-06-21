<template>
    <div class="main" @click="editingIndex = null; editingAutoIndex = null">
        <div class="title">导入</div>
        <div class="box">
            <div style="display: flex; gap: 20px; margin-bottom: -22px">
                <v-text-field label="Base64 或明文输入" variant="outlined" v-model="input"
                    prepend-inner-icon="mdi-content-paste" />
                <v-btn prepend-icon="mdi-content-paste" class="boxItem" @click="transform()" size="x-large"><span
                        style="margin-top: -1px; margin-right: -4px; letter-spacing: normal">导入</span>
                </v-btn>
            </div>
            <div style="border-radius: 4px; overflow: hidden"
                v-if="output && (output.filter(item => item.error.length > 0).length > 0 || output.filter(item => item.autoEdit.length > 0).length > 0)">
                <v-tabs v-model="tab" grow style="background: #ffffff05" slider-color="#fff4">
                    <v-tab value="manual" :active="tab == 'manual'" prepend-icon="mdi-pencil"
                        v-if="output.filter(item => item.error.length > 0).length > 0">
                        <span style="letter-spacing: normal">待手动修复项 ×
                            {{ output.filter(item => item.error.length > 0).length }}</span>
                    </v-tab>
                    <v-tab value="auto" :active="tab == 'auto'" prepend-icon="mdi-creation">
                        <span style="letter-spacing: normal">已自动修复项 ×
                            {{ output.filter(item => item.autoEdit.length > 0).length }}</span>
                    </v-tab>
                </v-tabs>
                <div class="boxTab" style="overflow-x: auto;">
                    <v-tabs-window v-model="tab">
                        <v-tabs-window-item value="manual">
                            <v-table style="white-space: nowrap;" fixed-header>
                                <thead>
                                    <tr>
                                        <th>稀有度</th>
                                        <th>器者</th>
                                        <th>招集</th>
                                        <th>时间</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in output.filter(item => item.error.length > 0)"
                                        @click.stop="editingIndex = index">
                                        <td :class="{ highlightError: item.error.includes('rarity'), highlightSuccess: item.rarity !== item.backup.rarity }"
                                            style="overflow: hidden">
                                            <v-select class="tableSelect" density="compact"
                                                v-if="(item.error.includes('rarity') || item.error.includes('item')) && editingIndex === index"
                                                v-model="item.rarity" :items="rarityDict"
                                                @update:modelValue="item.item = ''" />
                                            <span v-else> {{ (item.rarity !== item.backup.rarity ?
                                                item.backup.rarity + ' → ' : '') + item.rarity }}</span>
                                        </td>
                                        <td :class="{ highlightError: item.error.includes('item'), highlightSuccess: item.item !== item.backup.item }"
                                            style="overflow: hidden">
                                            <v-autocomplete class="tableSelect" density="compact"
                                                v-if="item.error.includes('item') && editingIndex === index"
                                                v-model="item.item"
                                                :items="!item.rarity || item.rarity === '' ?
                                                    configStore.itemDict : configStore.itemDict.filter(dictItem => dictItem.rarity === item.rarity)"
                                                item-title="item" item-value="item"
                                                @update:modelValue="item.item = (item.item ? item.item : '')" />
                                            <span v-else> {{ (item.item !== item.backup.item ?
                                                item.backup.item + ' → ' : '') + item.item }}</span>
                                        </td>
                                        <td>{{ item.banner }}</td>
                                        <td>{{ item.time }}</td>
                                    </tr>
                                </tbody>
                            </v-table>
                            <v-btn v-if="output && output.filter(item => item.error.length > 0).length > 0" :disabled="output.filter(item => item.error.length > 0).every(item => {
                                return item.error.every(errorParam => item.backup[errorParam] === item[errorParam]);
                            })" style="margin-top:10px; width: 100%" prepend-icon="mdi-check"
                                @click="output = output.map(obj => ({ rarity: obj.rarity, item: obj.item, banner: obj.banner, time: obj.time })); checkAndRepair(); tab = 'manual'"
                                size="x-large">
                                <span style="margin-top: -1px; margin-right: -4px; letter-spacing: normal">提交修复</span>
                            </v-btn>
                        </v-tabs-window-item>
                        <v-tabs-window-item value="auto">
                            <v-table style="white-space: nowrap" fixed-header>
                                <thead>
                                    <tr>
                                        <th>稀有度</th>
                                        <th>器者</th>
                                        <th>招集</th>
                                        <th>时间</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in output.filter(item => item.autoEdit.length > 0)"
                                        @click.stop="editingAutoIndex = index">
                                        <td :class="{ highlightSuccess: item.rarity !== item.backup.rarity }">
                                            {{ (item.rarity !== item.backup.rarity ?
                                                item.backup.rarity + ' → ' : '') + item.rarity }}
                                        </td>
                                        <td :class="{ highlightSuccess: item.item !== item.backup.item }">
                                            {{ (item.item !== item.backup.item ?
                                                item.backup.item + ' → ' : '') + item.item }}
                                        </td>
                                        <td>{{ item.banner }}</td>
                                        <td>{{ item.time }}</td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-tabs-window-item>
                    </v-tabs-window>
                </div>
            </div>
            <div class="result" v-if="output && output.filter(item => item.error.length > 0).length === 0">
                <v-text-field :dirty="true" label="明文输出" variant="outlined" :value="JSON.stringify(output)"
                    prepend-inner-icon="mdi-text-long" readonly />
            </div>
        </div>
        <br />
    </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { toast } from 'vue3-toastify';
import { useConfigStore } from "@/stores/config";
const configStore = useConfigStore()
import t from "@/utils/MatceTools.js";

const input = ref("77u/Wwp7InJhcml0eSI6IueJueWHuiIsImJhbm5lciI6IumZkOaXti/kuIDop4HnpZ7mgJ0iLCJpdGVtIjoi5rSb56We6LWL5Zu+IiwidGltZSI6IjIwMjTlubQ15pyIMTjml6Ux5pe2MjPliIYifSwKeyJyYXJpdHkiOiLkvJjlvIIiLCJiYW5uZXIiOiLpmZDml7Yv5LiA6KeB56We5oCdIiwiaXRlbSI6IuWkp+ebgum8jiIsInRpbWUiOiIyMDI05bm0NeaciDE45pelMeaXtjIy5YiGIn0sCnsicmFyaXR5Ijoi5paw55SfIiwiYmFubmVyIjoi6ZmQ5pe2L+S4gOingeelnuaAnSIsIml0ZW0iOiLnjpvpm4XpmbbnopciLCJ0aW1lIjoiMjAyNOW5tDXmnIgxOOaXpTHml7YxNuWIhiJ9LAp7InJhcml0eSI6IuaWsOeUnyIsImJhbm5lciI6IumZkOaXti/kuIDop4HnpZ7mgJ0iLCJpdGVtIjoi5Y+v54ix6Iqx5p2fIiwidGltZSI6IjIwMjTlubQ15pyIMTjml6Ux5pe2MTbliIYifSwKeyJyYXJpdHkiOiLmlrDnlJ8iLCJiYW5uZXIiOiLpmZDml7Yv5LiA6KeB56We5oCdIiwiaXRlbSI6IuWuneefs+WGoCIsInRpbWUiOiIyMDI05bm0NeaciDE45pelMeaXtjE25YiGIn0sCnsicmFyaXR5Ijoi5paw55SfIiwiYmFubmVyIjoi6ZmQ5pe2L+S4gOingeelnuaAnSIsIml0ZW0iOiLokpnljLvoja/ooosiLCJ0aW1lIjoiMjAyNOW5tDXmnIgxOOaXpTDml7Y1NOWIhiJ9LAp7InJhcml0eSI6IuaWsOeUnyIsImJhbm5lciI6IumZkOaXti/kuIDop4HnpZ7mgJ0iLCJpdGVtIjoi5b+D5b2i5p6qIiwidGltZSI6IjIwMjTlubQ15pyIMTjml6Uw5pe2NTTliIYifSwKeyJyYXJpdHkiOiLmlrDnlJ8iLCJiYW5uZXIiOiIiLCJpdGVtIjoi55m96YeJ57u/5b2p55O2IiwidGltZSI6IjIwMjTlubQ15pyIMTjml6Uw5pe2NTTliIYifSwKeyJyYXJpdHkiOiLmlrDnlJ8iLCJiYW5uZXIiOiLpmZDml7Yv5LiA6KeB56We5oCdIiwiaXRlbSI6IiIsInRpbWUiOiIyMDI05bm0NeaciDE45pelMOaXtjMy5YiGIn0sCnsicmFyaXR5Ijoi5paw55SfIiwiYmFubmVyIjoi6ZmQ5pe2L+S4gOingeelnuaAnSIsIml0ZW0iOiLkupTmn7HlmagiLCJ0aW1lIjoiIn0sCnsicmFyaXR5Ijoi54m55Ye6IiwiYmFubmVyIjoi6ZmQ5pe2L+S4gOingeelnuaAnSIsIml0ZW0iOiLllYbpnoUiLCJ0aW1lIjoiMjAyNOW5tDXmnIgxOOaXpTDml7YzMeWIhiJ9LAp7InJhcml0eSI6IiIsImJhbm5lciI6IumZkOaXti/kuIDop4HnpZ7mgJ0iLCJpdGVtIjoi5b+D5b2i5p6qIiwidGltZSI6IjIwMjTlubQ15pyIMTjml6Uw5pe2MzHliIYifSwKeyJyYXJpdHkiOiLmlrDnlJ8iLCJiYW5uZXIiOiLpmZDml7Yv5LiA6KeB56We5oCdIiwiaXRlbSI6IuWPr+eIseiKseadnyIsInRpbWUiOiIyMDI05bm0NeaciDE45pelMOaXtjI45YiGIn0sCnsicmFyaXR5Ijoi5paw55SfIiwiYmFubmVyIjoi6ZmQ5pe2L+S4gOingeelnuaAnSIsIml0ZW0iOiLlpKnmsJTljZzpqqgiLCJ0aW1lIjoiMjAyNOW5tDXmnIgxOOaXpTDml7YyOOWIhiJ9LAp7InJhcml0eSI6IuS8mOW8giIsImJhbm5lciI6IumZkOaXti/kuIDop4HnpZ7mgJ0iLCJpdGVtIjoi5aSp5Lqh57CLIiwidGltZSI6IjIwMjTlubQ15pyIMTjml6Uw5pe2MjjliIYifSwKeyJyYXJpdHkiOiLmlrDnlJ8iLCJiYW5uZXIiOiLpmZDml7Yv5LiA6KeB56We5oCdIiwiaXRlbSI6IuS6uuWktOeTtiIsInRpbWUiOiIyMDI05bm0NeaciDE35pelMjPml7Y1N+WIhiJ9LAp7InJhcml0eSI6IuaWsOeUnyIsImJhbm5lciI6IumZkOaXti/kuIDop4HnpZ7mgJ0iLCJpdGVtIjoi55+z5YagIiwidGltZSI6IjIwMjTlubQ15pyIMTfml6UyM+aXtjUw5YiGIn0sCnsicmFyaXR5Ijoi5paw55SfIiwiYmFubmVyIjoi6ZmQ5pe2L+S4gOingeelnuaAnSIsIml0ZW0iOiLnjpvpm4XpmbbnopciLCJ0aW1lIjoiMjAyNOW5tDXmnIgxN+aXpTIz5pe2MzjliIYifSwKeyJyYXJpdHkiOiIiLCJiYW5uZXIiOiIiLCJpdGVtIjoiIiwidGltZSI6IiJ9LAp7InJhcml0eSI6IiIsImJhbm5lciI6IiIsIml0ZW0iOiIiLCJ0aW1lIjoiIn0KXQ==")
const output = ref(null)
const isBase64 = ref(false)
const base64output = ref(null)
const tab = ref(null)
const editingIndex = ref(null)
const editingAutoIndex = ref(null)
const rarityDict = ref(["特出", "优异", "新生"])
// 转换
const transform = () => {
    output.value = null
    base64output.value = null
    const base64Pattern = /^(?:[A-Za-z0-9+\/]{4})*?(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
    isBase64.value = base64Pattern.test(input.value)
    // Base64 解析
    if (isBase64.value) {
        try {
            base64output.value = decodeURIComponent(atob(input.value).split('').map((c) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join('')).replace(/\r/g, '');
        } catch (err) {
            const logName = "Base64 解析出现错误！";
            toast.error(logName + "\n" + JSON.stringify(err));
            t.log(t.ERROR, logName, err);
        }
    } else {
        base64output.value = input.value;
    }
    // JSON 解析
    try {
        output.value = JSON.parse(base64output.value.replace(/^\uFEFF/, ""));
        t.logs("JSON", output.value);

    } catch (err) {
        const logName = "JSON 解析出现错误！";
        toast.error(logName + "\n" + err.message);
        t.log(t.ERROR, logName, err.message);
        return
    }
    checkAndRepair()
}

// 找到最相近的字符串
function findMostSimilar(str, arr) {
    let maxMatch = 0;
    let mostSimilar = '';

    arr.forEach(item => {
        let matchCount = 0;
        str.split('').forEach(char => {
            if (item.includes(char)) {
                matchCount++;
            }
        });
        if (matchCount > maxMatch) {
            maxMatch = matchCount;
            mostSimilar = item;
        }
    });
    return { mostSimilar, maxMatch };
}

const checkAndRepair = () => {
    const logName = "";
    const itemDict = configStore.itemDict
    if (itemDict.length < 1) {
        logName = "器者数据库为空！无法修复数据"
        toast.error(logName);
        t.log(t.ERROR, logName);
        return
    }
    output.value = output.value.filter(item =>
        Object.values(item).some(value => value !== "")
    ); // 移除完全空项
    const itemNameArray = itemDict.map((itemObject) => {
        return itemObject.item;
    });
    output.value.forEach(item => {
        item.backup = JSON.parse(JSON.stringify(item))
        item.error = []
        item.autoEdit = []
        // 器者判断
        if (item.item === "") {
            item.error.push("item")
        } else {
            if (!itemNameArray.includes(item.item)) {
                const mostSimilarItem = findMostSimilar(item.item, itemNameArray)
                if (mostSimilarItem.maxMatch >= 2) {
                    t.logs("器者修改", JSON.stringify(item.item), "=>", mostSimilarItem)
                    item.autoEdit.push("item")
                    item.item = mostSimilarItem.mostSimilar
                } else {
                    item.error.push("item")
                }
            }
        }
        // 稀有度判断
        const itemFind = itemDict.find(dictItem => dictItem.item === item.item)
        const itemFindRarity = itemFind ? itemFind.rarity : null
        if (!rarityDict.value.includes(item.rarity) || (itemFind && itemFindRarity !== item.rarity)) {
            if (itemFind) {
                t.logs("稀有度修改", item.item + "：" + JSON.stringify(item.rarity) + "=>" + itemFindRarity)
                item.autoEdit.push("rarity")
                item.rarity = itemFindRarity
            } else {
                item.error.push("rarity")
            }
        }
    });
    t.logs("修复后的 JSON", JSON.parse(JSON.stringify(output.value)))
    if (output.value.filter(item => item.error.length > 0).length > 0) {
        tab.value = 'manual'
    } else {
        toast.success("数据修复完成！\n可从输出框获取修复后的数据")
        tab.value = 'auto'
    }
}
// transform()
</script>

<style lang="scss" scoped>
.highlightError {
    background: rgba(map-get($red, "base"), .3);
    cursor: pointer;
}

.highlightSuccess {
    background: rgba(map-get($light-green, "base"), .3);
}

.tableSelect {
    min-width: 147px;
    margin-bottom: -22px;
}

.main {
    min-height: calc(100vh - 104px);

    .title {
        margin: 40px 0;
        font-size: 30px;
        font-weight: bold;
        overflow: hidden;
    }

    .box {
        display: flex;
        flex-direction: column;
        gap: 20px;
        max-width: calc(100vw - 40px);

        &Item {
            margin-bottom: 22px;
            height: 56px
        }
    }

    .result {}
}
</style>