<template>
    <div class="main" @click="editingIndex = null; editingAutoIndex = null">
        <div class="title">导入</div>
        <div class="box">
            <v-text-field label="Base64 或明文输入" variant="outlined" v-model="input" prepend-inner-icon="mdi-content-paste"
                clearable />
            <div style="display: flex; gap: 20px; margin-bottom: -22px">
                <v-file-input label="存档合并上传（非必填）" variant="outlined" v-model="inputFile" accept="application/JSON"
                    prepend-inner-icon="mdi-content-save-move-outline" :prepend-icon="null" />
                <v-btn prepend-icon="mdi-login-variant" class="boxItem" @click="transform()" size="x-large"
                    :disabled="!input"><span
                        style="margin-top: -2px; margin-right: -4px; margin-left: -4px; letter-spacing: normal">导入</span>
                </v-btn>
            </div>
            <div style="margin-bottom: -44px">
                <v-checkbox v-model="ignoreRarityCyan" label="需手动修复项忽略稀有度为 新生 的记录" />
            </div>
            <v-expand-transition>
                <div style="overflow: hidden; "
                    v-if="output && (output.filter(item => item.error.length > 0).length > 0 || output.filter(item => item.autoFixed.length > 0).length > 0)">
                    <v-tabs v-model="tab" grow
                        style="background: #ffffff05; margin-top: 22px; border-radius: 4px 4px 0 0"
                        slider-color="#fff4">
                        <v-tab value="manual" :active="tab == 'manual'" prepend-icon="mdi-pencil"
                            v-if="output.filter(item => item.error.length > 0).length > 0">
                            <span style="letter-spacing: normal">需手动修复 ×
                                {{ output.filter(item => item.error.length > 0).length }}</span>
                        </v-tab>
                        <v-tab value="auto" :active="tab == 'auto'" prepend-icon="mdi-creation">
                            <span style="letter-spacing: normal">已自动修复 ×
                                {{ output.filter(item => item.autoFixed.length > 0).length }}</span>
                            <v-btn icon="mdi-chevron-up" variant="plain" style="position: absolute; right: 0"
                                v-ripple="null" @click="showAutoFixed = !showAutoFixed"
                                :style="{ transform: 'rotate(' + (showAutoFixed ? '0' : '180') + 'deg)' }" />
                        </v-tab>
                    </v-tabs>
                    <div class="boxTab">
                        <v-tabs-window v-model="tab">
                            <v-tabs-window-item value="manual">
                                <v-table class="boxTabTable" fixed-header>
                                    <thead>
                                        <tr>
                                            <th>稀有度</th>
                                            <th>器者</th>
                                            <th>位置</th>
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
                                                    @update:modelValue="item.item = ''" style="min-width: 95px" />
                                                <span v-else> {{ (item.rarity !== item.backup.rarity ?
                                                    item.backup.rarity + ' → ' : '') + item.rarity }}</span>
                                            </td>
                                            <td :class="{ highlightError: item.error.includes('item'), highlightSuccess: item.item !== item.backup.item && item.item !== '' }"
                                                style="overflow: hidden">
                                                <v-autocomplete class="tableSelect" density="compact"
                                                    v-if="item.error.includes('item') && editingIndex === index"
                                                    v-model="item.item"
                                                    :items="!item.rarity || item.rarity === '' ?
                                                        configStore.itemDict : configStore.itemDict.filter(dictItem => dictItem.rarity === item.rarity)"
                                                    item-title="item" item-value="item"
                                                    @update:modelValue="item.item = (item.item ? item.item : '')"
                                                    style="min-width: 147px" />
                                                <span v-else> {{ (item.item !== item.backup.item ?
                                                    item.backup.item + ' → ' : '') + item.item }}</span>
                                            </td>
                                            <td>{{ item.page }} 页 {{ item.row }} 行</td>
                                            <td>{{ item.banner }}</td>
                                            <td>{{ item.time }}</td>
                                        </tr>
                                    </tbody>
                                </v-table>
                                <v-btn v-if="output && output.filter(item => item.error.length > 0).length > 0"
                                    :disabled="!output.filter(item => item.error.length > 0).every(item => {
                                        return item.error.every(errorParam =>
                                            item[errorParam] !== item.backup[errorParam]) && item.item !== '' && item.rarity !== '';
                                    })" style="margin-top: 10px; width: 100%" prepend-icon="mdi-check"
                                    @click="output = clearArray(output); checkAndRepair(); tab = 'manual'"
                                    size="x-large">
                                    <span
                                        style="margin-top: -2px; margin-right: -4px; margin-left: -4px; letter-spacing: normal">提交修复</span>
                                </v-btn>
                            </v-tabs-window-item>
                            <v-tabs-window-item value="auto">
                                <v-expand-transition>
                                    <v-table class="boxTabTable" fixed-header v-if="showAutoFixed">
                                        <thead>
                                            <tr>
                                                <th>稀有度</th>
                                                <th>器者</th>
                                                <th>位置</th>
                                                <th>招集</th>
                                                <th>时间</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item, index) in output.filter(item => item.autoFixed.length > 0)"
                                                @click.stop="editingAutoIndex = index">
                                                <td
                                                    :class="{ highlightSuccess: item.rarity !== item.backup.rarity && item.rarity !== '' }">
                                                    {{ (item.rarity !== item.backup.rarity ?
                                                        item.backup.rarity + ' → ' : '') + item.rarity }}
                                                </td>
                                                <td
                                                    :class="{ highlightSuccess: item.item !== item.backup.item && item.item !== '' }">
                                                    {{ (item.item !== item.backup.item ?
                                                        item.backup.item + ' → ' : '') + item.item }}
                                                </td>
                                                <td>{{ item.page }} 页 {{ item.row }} 行</td>
                                                <td>{{ item.banner }}</td>
                                                <td>{{ item.time }}</td>
                                            </tr>
                                        </tbody>
                                    </v-table>
                                </v-expand-transition>
                            </v-tabs-window-item>
                        </v-tabs-window>
                    </div>
                </div>
            </v-expand-transition>
            <div class="result" style="padding-top: 22px"
                v-if="output && output.filter(item => item.error.length > 0).length === 0">
                <v-text-field :dirty="true" label="明文输出" variant="outlined"
                    :value="JSON.stringify(clearArray(mergeData || output), null, 4)" prepend-inner-icon="mdi-text-long"
                    readonly />
                <div style="display: flex; gap: 20px; margin-bottom: -22px">
                    <v-btn prepend-icon="mdi-content-save-check-outline" size="x-large" @click="saveDownload()">
                        <span style="margin-top: -2px; margin-left: -4px; letter-spacing: normal">
                            存档下载
                        </span>
                    </v-btn>
                    <v-btn style="flex: 1" prepend-icon="mdi-script-text" size="x-large">
                        <span style="margin-top: -2px; margin-left: -4px; letter-spacing: normal">
                            查看报告
                        </span>
                    </v-btn>
                </div>
            </div>
        </div>
        <br />
    </div>
</template>

<script setup>
// console.clear()
import { ref } from "vue";
import { toast } from 'vue3-toastify';
import { useConfigStore } from "@/stores/config";
const configStore = useConfigStore();
import t from "@/utils/MatceTools.js";

const input = ref(null)
const output = ref(null)
const isBase64 = ref(false)
const base64output = ref(null)
const tab = ref(null)
const editingIndex = ref(null)
const editingAutoIndex = ref(null)
const rarityDict = ref(["特出", "优异", "新生"])
const bannerDict = ref(["招集", "征集", "限时"])

// 转换
const transform = async () => {
    output.value = null
    base64output.value = null
    const base64Pattern = /^(?:[A-Za-z0-9+\/]{4})*?(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
    isBase64.value = base64Pattern.test(input.value)
    let parseData = null
    if (input.value) {
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
            parseData = JSON.parse(base64output.value.replace(/^\uFEFF/, ""));
            if (!(Array.isArray(parseData) && parseData.every(item => {
                return (
                    typeof item.rarity === 'string' &&
                    typeof item.item === 'string' &&
                    typeof item.banner === 'string' &&
                    typeof item.time === 'string'
                );
            }))) {
                throw new Error("请检查您的输入数据是否正确")
            }
            t.logs("JSON", parseData);
            output.value = parseData
        } catch (err) {
            const logName = "JSON 解析出现错误！";
            toast.error(logName + "\n" + err.message);
            t.log(t.ERROR, logName, err.message);
            return
        }
    }

    if (output.value) {
        checkAndRepair()
    } else {
        toast.error("请检查您的输入数据是否正确");
    }
}

// 找到最相近的字符串
function findMostSimilar(str, arr) {
    let maxMatch = 0;
    let mostSimilar = '';
    let arrCheck = JSON.parse(JSON.stringify(arr)).map(item => {
        return { value: item, matchCount: 0 }
    })
    arrCheck.forEach(item => {
        let matchCount = 0;
        str.split('').forEach(char => {
            if (item.value.includes(char)) {
                matchCount++;
            }
        });
        item.matchCount = matchCount
        if (matchCount > maxMatch) {
            maxMatch = matchCount;
        }
    });
    const mostSimilarArray = arrCheck.filter(item => item.matchCount === maxMatch)
    if (mostSimilarArray.length > 1) {
        maxMatch = 0 // 出现多个最相近项时返回未找到
    } else if (mostSimilarArray.length === 1) {
        mostSimilar = mostSimilarArray[0].value; // 仅当有一个最相近项时返回找到的最相近项
    }
    return { mostSimilar, maxMatch };
}

const showAutoFixed = ref(false)
const ignoreRarityCyan = ref(true)
const checkAndRepair = () => {
    showAutoFixed.value = false
    let logName = "";
    const itemDict = configStore.itemDict
    if (itemDict.length < 1) {
        logName = "器者数据库为空！无法修复数据"
        toast.error(logName);
        t.log(t.ERROR, logName);
        output.value = null
        return
    }

    // 检查卡池类型是否一致
    const checkTypeList = checkBannerType(output.value)
    if (Object.values(checkTypeList).filter(type => type).length > 1) {
        logName = "卡池类型不一致！当前包含的类型有：" + Object.keys(checkTypeList).filter((key) => checkTypeList[key] === true).join("、")
        toast.error(logName);
        t.log(t.ERROR, logName);
        output.value = null
        return
    }

    output.value.forEach((item, index) => {
        item.backup = JSON.parse(JSON.stringify(item)) // 添加比对副本
        item.page = Math.floor(index / 10) + 1 // 添加所在页数
        item.row = index % 10 + 1 // 添加所在行数
    })

    output.value = output.value.filter(item =>
        !Object.keys(item).filter(key => !["backup", "page", "row"].includes(key))
            .every(checkKey => item[checkKey] === "") // 移除完全空项
    );

    const itemNameArray = itemDict.map((itemObject) => {
        return itemObject.item;
    });
    output.value.forEach((item) => {
        item.banner = item.banner.replace("／", "/") // 招集修复
        item.error = []
        item.autoFixed = []
        // 器者判断
        if (item.item === "") {
            if (!ignoreRarityCyan.value || item.rarity !== "新生") {
                item.error.push("item")
            }
        } else {
            if (!itemNameArray.includes(item.item)) {
                const mostSimilarItem = findMostSimilar(item.item, itemNameArray)
                if (mostSimilarItem.maxMatch >= 2) {
                    t.logs("器者修改", JSON.stringify(item.item), "→", mostSimilarItem)
                    item.autoFixed.push("item")
                    item.item = mostSimilarItem.mostSimilar
                } else {
                    if (!ignoreRarityCyan.value || item.rarity !== "新生") {
                        item.error.push("item")
                    }
                }
            }
        }
        // 稀有度判断
        const itemFind = itemDict.find(dictItem => dictItem.item === item.item)
        const itemFindRarity = itemFind ? itemFind.rarity : null
        if (!rarityDict.value.includes(item.rarity) || (itemFind && itemFindRarity !== item.rarity)) {
            if (itemFind) {
                t.logs("稀有度修改", item.item + "：" + JSON.stringify(item.rarity) + " → " + itemFindRarity)
                item.autoFixed.push("rarity")
                item.rarity = itemFindRarity
            } else {
                item.error.push("item")
            }
        }
        // 时间判断
        try {
            if (!item.time.match(/(\d{4})-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01]) (0?[0-9]|1[0-9]|2[0-3]):([0-5][0-9])/)) {
                const dateParts = item.time.match(/(\d{4})年(\d{1,2})月(\d{1,2})日(\d{1,2})时(\d{1,2})分/)
                if (dateParts) {
                    const [, year, month, day, hour, minute] = dateParts;
                    item.time = year + '-' + month.padStart(2, '0') + '-' + day.padStart(2, '0') + ' '
                        + hour.padStart(2, '0') + ':' + minute.padStart(2, '0');
                } else { throw new Error() }
            }
        } catch (error) {
            t.log(t.NOTICE, "时间错误", item, error.message)
            // item.error.push("time")
        }
    });
    t.logs("修复后的 JSON", clearArray(output.value))
    if (output.value.filter(item => item.error.length > 0).length > 0) {
        tab.value = 'manual'
    } else {
        toast.success("输入数据修复完成！\n总记录合计 " + output.value.length + " 项")
        tab.value = 'auto'
    }

    checkFileAndMerge()
}

const inputFile = ref(null)
const saveDownload = () => {
    const blob = new Blob([JSON.stringify(clearArray(mergeData.value || output.value), null, 4)],
        { type: 'application/json' }); // 创建 Blob 对象
    const link = document.createElement('a'); // 创建下载链接
    link.href = URL.createObjectURL(blob);
    const checkTypeList = checkBannerType(mergeData.value || output.value)
    link.download = '物华抽卡导出记录 '
        + (Object.keys(checkTypeList).filter((key) => checkTypeList[key] === true)[0] || "未知")
        + '渠道 ' + new Date(new Date().getTime() + 3600000 * 8).toISOString().replace(/-|:|\.\d{3}/g, '').replace('T', '-').replace('Z', '') + new Date().getMilliseconds();
    link.click(); // 触发下载
    URL.revokeObjectURL(link.href); // 释放 URL 对象
}

// 对象数组最简化
const clearArray = (array, ...require) => {
    let result = array.map(({ rarity, item, banner, time }) => ({ rarity, item, banner, time }))
    if (require.includes("addTimestamp")) {
        result.forEach(item => { item.timestamp = new Date(item.time).getTime() })
    }
    return result
}

const findOverlapIndex = (array1, array2) => {
    for (let i = 0; i < array1.length; i++) {
        for (let j = 0; j < array2.length; j++) {
            if (array1[i].timestamp === array2[j].timestamp) {
                // 如果重合项位于数组的开头或末尾，比较 name 属性
                if (i === 0 || i === array1.length - 1 || j === 0 || j === array2.length - 1) {
                    if (array1[i].name === array2[j].name) {
                        return { index1: i, index2: j };
                    }
                } else {
                    return { index1: i, index2: j };
                }
            }
        }
    }
    return { index1: -1, index2: -1 };  // 如果没有找到重合项，返回 -1
}

const checkBannerType = (array1, array2) => {
    let typeList = bannerDict.value.reduce((obj, key) => {
        obj[key] = false;
        return obj;
    }, {});
    if (!array2) {
        array2 = []
    }
    [array1, array2].forEach(array => {
        array.forEach(obj => {
            const type = obj.banner.split('/')[0];
            Object.keys(typeList).forEach(checkType => {
                if (type === checkType) {
                    typeList[checkType] = true;
                }
            })
        });
    });
    return typeList;
}

// 合并两个对象数组
const mergeArrays = (array1, array2) => {
    array1 = clearArray(array1, "addTimestamp")
    array2 = clearArray(array2, "addTimestamp")
    // 检查卡池类型是否一致
    const checkTypeList = checkBannerType(array1, array2)
    if (Object.values(checkTypeList).filter(type => type).length > 1) {
        throw new Error("卡池类型不一致！当前包含的类型有：" + Object.keys(checkTypeList).filter((key) => checkTypeList[key] === true).join("、"))
    }
    const indexInArray = findOverlapIndex(array1, array2);
    t.logs("合并重合位置", indexInArray)
    // 如果没有找到重合项，则根据时间戳大小决定拼接顺序
    if (indexInArray.index1 === -1 && indexInArray.index2 === -1) {
        if (array1.length === 0) {
            return array2;
        } else if (array2.length === 0) {
            return array1;
        } else if (array1[0].timestamp > array2[0].timestamp) {
            return array1.concat(array2);
        } else {
            return array2.concat(array1);
        }
    } else {
        // 找到重合项，根据重合位置拼接数组
        let partOverNext = [];
        if (indexInArray.index1 - indexInArray.index2 > 0) {
            partOverNext = array1.slice(0, indexInArray.index1 - indexInArray.index2)
        }
        const partNext = array2.slice(0, indexInArray.index2);
        const partPast = array1.slice(indexInArray.index1, array1.length);
        let partOverPast = []
        if ((array2.length - indexInArray.index2 - partPast.length) > 0) {
            partOverPast = array2.slice(indexInArray.index2 + partPast.length, array2.length)
        }
        t.logs("合并部分拆分", [partOverNext, partNext, partPast, partOverPast])
        return clearArray([...partOverNext, ...partNext, ...partPast, ...partOverPast]);
    }
}

const mergeData = ref(null)
const checkFileAndMerge = async () => {
    mergeData.value = null
    // 存档文件解析
    let parseFileData = null
    if (inputFile.value) {
        try {
            const readFile = (file) => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(JSON.parse(e.target.result));
                reader.onerror = reject;
                reader.readAsText(file);
            });
            parseFileData = await readFile(inputFile.value);
            if (!(Array.isArray(parseFileData) && parseFileData.length >= 10 && parseFileData.every(item => {
                return (
                    typeof item.rarity === 'string' &&
                    typeof item.item === 'string' &&
                    typeof item.banner === 'string' &&
                    typeof item.time === 'string'
                );
            }))) {
                throw new Error("请检查您的输入数据是否正确")
            }
            t.logs("存档 JSON", parseFileData);
        } catch (err) {
            const logName = "存档解析出现错误！";
            toast.error(logName + "\n" + err.message);
            t.log(t.ERROR, logName, err.message);
            return
        }
        try {
            mergeData.value = clearArray(mergeArrays(parseFileData, output.value));
            t.logs("合并存档", mergeData.value)
            toast.success("输入数据与上传的存档合并完成！\n总记录合计 " + mergeData.value.length + " 项")
        } catch (err) {
            const logName = "存档合并出现错误！";
            toast.error(logName + "\n" + err.message);
            t.log(t.ERROR, logName, err.message);
            return
        }
    }
}

input.value = "77u/Wwp7InJhcml0eSI6IueJueWHuiIsImJhbm5lciI6IumZkOaXti/kuIDop4HnpZ7mgJ0iLCJpdGVtIjoi5rSb56We6LWL5Zu+IiwidGltZSI6IjIwMjTlubQ15pyIMTjml6Ux5pe2MjPliIYifSwKeyJyYXJpdHkiOiLkvJjlvIIiLCJiYW5uZXIiOiLpmZDml7Yv5LiA6KeB56We5oCdIiwiaXRlbSI6IuWkp+ebgum8jiIsInRpbWUiOiIyMDI05bm0NeaciDE45pelMeaXtjIy5YiGIn0sCnsicmFyaXR5Ijoi5paw55SfIiwiYmFubmVyIjoi6ZmQ5pe2L+S4gOingeelnuaAnSIsIml0ZW0iOiLnjpvpm4XpmbbnopciLCJ0aW1lIjoiMjAyNOW5tDXmnIgxOOaXpTHml7YxNuWIhiJ9LAp7InJhcml0eSI6IuaWsOeUnyIsImJhbm5lciI6IumZkOaXti/kuIDop4HnpZ7mgJ0iLCJpdGVtIjoi5Y+v54ix6Iqx5p2fIiwidGltZSI6IjIwMjTlubQ15pyIMTjml6Ux5pe2MTbliIYifSwKeyJyYXJpdHkiOiLmlrDnlJ8iLCJiYW5uZXIiOiLpmZDml7Yv5LiA6KeB56We5oCdIiwiaXRlbSI6IuWuneefs+WGoCIsInRpbWUiOiIyMDI05bm0NeaciDE45pelMeaXtjE25YiGIn0sCnsicmFyaXR5Ijoi5paw55SfIiwiYmFubmVyIjoi6ZmQ5pe2L+S4gOingeelnuaAnSIsIml0ZW0iOiLokpnljLvoja/ooosiLCJ0aW1lIjoiMjAyNOW5tDXmnIgxOOaXpTDml7Y1NOWIhiJ9LAp7InJhcml0eSI6IuaWsOeUnyIsImJhbm5lciI6IumZkOaXti/kuIDop4HnpZ7mgJ0iLCJpdGVtIjoi5b+D5b2i5p6qIiwidGltZSI6IjIwMjTlubQ15pyIMTjml6Uw5pe2NTTliIYifSwKeyJyYXJpdHkiOiLmlrDnlJ8iLCJiYW5uZXIiOiIiLCJpdGVtIjoi55m96YeJ57u/5b2p55O2IiwidGltZSI6IjIwMjTlubQ15pyIMTjml6Uw5pe2NTTliIYifSwKeyJyYXJpdHkiOiLmlrDnlJ8iLCJiYW5uZXIiOiLpmZDml7Yv5LiA6KeB56We5oCdIiwiaXRlbSI6IiIsInRpbWUiOiIyMDI05bm0NeaciDE45pelMOaXtjMy5YiGIn0sCnsicmFyaXR5Ijoi5paw55SfIiwiYmFubmVyIjoi6ZmQ5pe2L+S4gOingeelnuaAnSIsIml0ZW0iOiLkupTmn7HlmagiLCJ0aW1lIjoiIn0sCnsicmFyaXR5Ijoi54m55Ye6IiwiYmFubmVyIjoi6ZmQ5pe2L+S4gOingeelnuaAnSIsIml0ZW0iOiLllYbpnoUiLCJ0aW1lIjoiMjAyNOW5tDXmnIgxOOaXpTDml7YzMeWIhiJ9LAp7InJhcml0eSI6IiIsImJhbm5lciI6IumZkOaXti/kuIDop4HnpZ7mgJ0iLCJpdGVtIjoi5b+D5b2i5p6qIiwidGltZSI6IjIwMjTlubQ15pyIMTjml6Uw5pe2MzHliIYifSwKeyJyYXJpdHkiOiLmlrDnlJ8iLCJiYW5uZXIiOiLpmZDml7Yv5LiA6KeB56We5oCdIiwiaXRlbSI6IuWPr+eIseiKseadnyIsInRpbWUiOiIyMDI05bm0NeaciDE45pelMOaXtjI45YiGIn0sCnsicmFyaXR5Ijoi5paw55SfIiwiYmFubmVyIjoi6ZmQ5pe2L+S4gOingeelnuaAnSIsIml0ZW0iOiLlpKnmsJTljZzpqqgiLCJ0aW1lIjoiMjAyNOW5tDXmnIgxOOaXpTDml7YyOOWIhiJ9LAp7InJhcml0eSI6IuS8mOW8giIsImJhbm5lciI6IumZkOaXti/kuIDop4HnpZ7mgJ0iLCJpdGVtIjoi5aSp5Lqh57CLIiwidGltZSI6IjIwMjTlubQ15pyIMTjml6Uw5pe2MjjliIYifSwKeyJyYXJpdHkiOiLmlrDnlJ8iLCJiYW5uZXIiOiLpmZDml7Yv5LiA6KeB56We5oCdIiwiaXRlbSI6IuS6uuWktOeTtiIsInRpbWUiOiIyMDI05bm0NeaciDE35pelMjPml7Y1N+WIhiJ9LAp7InJhcml0eSI6IuaWsOeUnyIsImJhbm5lciI6IumZkOaXti/kuIDop4HnpZ7mgJ0iLCJpdGVtIjoi55+z5YagIiwidGltZSI6IjIwMjTlubQ15pyIMTfml6UyM+aXtjUw5YiGIn0sCnsicmFyaXR5Ijoi5paw55SfIiwiYmFubmVyIjoi6ZmQ5pe2L+S4gOingeelnuaAnSIsIml0ZW0iOiLnjpvpm4XpmbbnopciLCJ0aW1lIjoiMjAyNOW5tDXmnIgxN+aXpTIz5pe2MzjliIYifSwKeyJyYXJpdHkiOiIiLCJiYW5uZXIiOiIiLCJpdGVtIjoiIiwidGltZSI6IiJ9LAp7InJhcml0eSI6IiIsImJhbm5lciI6IiIsIml0ZW0iOiIiLCJ0aW1lIjoiIn0KXQ=="
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
    margin-bottom: -22px;
}

.main {
    min-height: calc(100vh - 104px);
    padding-bottom: 20px;

    .title {
        margin: 40px 0;
        font-size: 30px;
        font-weight: bold;
        overflow: hidden;
    }

    .box {
        display: flex;
        flex-direction: column;
        max-width: calc(100vw - 40px);

        &Item {
            margin-bottom: 22px;
            height: 56px
        }

        &Tab {
            overflow-x: auto;

            &Table {
                white-space: nowrap;
                border-radius: 0 0 4px 4px;
            }
        }
    }

    .result {}
}
</style>