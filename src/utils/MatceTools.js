// MatceTools.js
// Matce. 240315
/* //////////// 工具方法集 //////////// */

/*
引入例
import t from '@/utils/MatceTools.js' //JS 方法工具箱

使用例
mounted() {
    t.promiseLoadJS('/maptalk/maptalks.min.js').then(() => {
        this.loadBaseMap(this.mapServerURLArray[0])
    })
},
*/

import { toRaw } from "vue";

export default {
    // 校验只要是数字（包含正负整数，0 以及正负浮点数）就返回 true
    isNumber(num) {
        return typeof num === 'number' && isFinite(num);
    },

    // 引入外部 JS（promise保证引入后再执行代码段）
    promiseLoadJS(src) {
        return new Promise((resolve, reject) => {
            let loadJSArray = document.getElementsByClassName('promiseLoadJS');
            for (let i = 0; i < loadJSArray.length; i++) {
                if (src === loadJSArray[i].getAttribute('src')) {
                    loadJSArray[i].remove();
                }
            }
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = src;
            script.className = 'promiseLoadJS';
            document.body.appendChild(script);

            script.onload = () => {
                resolve();
            };
            script.onerror = () => {
                reject();
            };
        });
    },

    // 空数据判断
    isEmpty(data) {
        if (data === undefined || data === null || data === '' || data === NaN) {
            return true;
        }
        return false;
    },

    // 引入外部 JS
    loadJS() {
        let loadJSArray = document.getElementsByClassName('loadJS');
        for (let i = 0; i < loadJSArray.length; i++) {
            if (src === loadJSArray[i].getAttribute('src')) {
                loadJSArray[i].remove();
            }
        }
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        script.className = 'loadJS';
        document.body.appendChild(script);
    },

    // 控制台内输出自定义样式的站点信息【此处设定为传入三段信息的数组】
    logTitle(strArray) {
        if (strArray != undefined && strArray != '' && strArray.length == 3) {
            console.log(
                '%c ' + strArray[0] + ' %c ' + strArray[1] + ' %c ' + strArray[2] + ' %c ',
                'font-family: "Bahnschrift", "黑体"; background:#0d47a1 ; padding: 4px; border-radius: 3px 0 0 3px;  color: white',
                'font-family: "Bahnschrift", "黑体"; background:#1565c0 ; padding: 4px; color: white',
                'font-family: "Bahnschrift", "黑体"; background:#2196f3 ; padding: 4px; border-radius: 0 3px 3px 0;  color: white',
                'background:transparent'
            );
        }
    },

    // 常量（控制台输出自定义样式的日志用到）
    GET: 'GET',
    POST: 'POST',
    WS: 'WS',
    ERROR: 'ERROR',
    WARN: 'WARN',
    INFO: 'INFO',
    NOTICE: 'NOTICE',
    OBJ: 'OBJ',

    // 控制台输出自定义样式的日志【type: 类型 desc: 描述 content: 内容】
    /* 使用例：
            t.log(t.INFO, '在线状态检查完成！')
            t.log(t.GET, '在线状态 | ' + device.location + '', result.result + ' ' + (result.result ? '在线 √' : '离线 ×')
        */
    log(type, desc, ...content) {
        if (content === undefined || content.length === 0) {
            content = '';
        }

        let color = {
            red: ['#b71c1c', '#d32f2f'],
            orange: ['#e65100', '#f57c00'],
            teal: ['#004d40', '#00796b'],
            blue: ['#0d47a1', '#1976d2'],
            purple: ['#4a148c', '#7b1fa2'],
            brown: ['#3e2723', '#5d4037']
        };

        let colorUse = color.brown;

        if (type != undefined && type != '' && desc != undefined && desc != '') {
            if (type == 'GET' || type == 'POST' || type == 'WS') {
                colorUse = color.teal;
                this.consoleLOG(colorUse, type, desc, ...content);
            } else if (type == 'WARN') {
                colorUse = color.orange;
                this.consoleWARN(colorUse, type, desc, ...content);
            } else if (type == 'ERROR') {
                colorUse = color.red;
                this.consoleERROR(colorUse, type, desc, ...content);
            } else if (type == 'NOTICE') {
                colorUse = color.blue;
                this.consoleLOG(colorUse, type, desc, ...content);
            } else if (type == 'OBJ') {
                colorUse = color.purple;
                this.consoleLOG(colorUse, type, desc, ...content);
            } else if (type == 'INFO') {
                colorUse = color.brown;
                this.consoleLOG(colorUse, type, desc, ...content);
            }
            if (content == undefined) {
                content = '';
            }
        }
    },

    consoleLOG(colorUse, type, desc, ...content) {
        console.log(
            '%c ' + type + ' %c ' + desc + ' %c ',
            'font-family: "Bahnschrift", "黑体"; background:' + colorUse[0] + ' ; padding: 4px; border-radius: 3px 0 0 3px;  color: white',
            'font-family: "Bahnschrift", "黑体"; background:' + colorUse[1] + ' ; padding: 4px; border-radius: 0 3px 3px 0;  color: white',
            'background:transparent',
            ...content.map(item => toRaw(item))
        );
    },

    consoleWARN(colorUse, type, desc, ...content) {
        console.warn(
            '%c ' + type + ' %c ' + desc + ' %c ',
            'font-family: "Bahnschrift", "黑体"; background:' + colorUse[0] + ' ; padding: 4px; border-radius: 3px 0 0 3px;  color: white',
            'font-family: "Bahnschrift", "黑体"; background:' + colorUse[1] + ' ; padding: 4px; border-radius: 0 3px 3px 0;  color: white',
            'background:transparent',
            ...content.map(item => toRaw(item))
        );
    },

    consoleERROR(colorUse, type, desc, ...content) {
        console.error(
            '%c ' + type + ' %c ' + desc + ' %c ',
            'font-family: "Bahnschrift", "黑体"; background:' + colorUse[0] + ' ; padding: 4px; border-radius: 3px 0 0 3px;  color: white',
            'font-family: "Bahnschrift", "黑体"; background:' + colorUse[1] + ' ; padding: 4px; border-radius: 0 3px 3px 0;  color: white',
            'background:transparent',
            ...content.map(item => toRaw(item))
        );
    },

    // 控制台快速输出自定义样式的日志【str: 描述 content: 内容】
    logs(desc, ...content) {
        if (content === undefined || content.length === 0) {
            content = '';
        }
        this.log(this.INFO, desc, ...content);
    },

    rgbToHex(r, g, b) {
        let hex = ((r << 16) | (g << 8) | b).toString(16);
        return '#' + new Array(Math.abs(hex.length - 7)).join('0') + hex;
    },

    hexToRgb(hex) {
        let rgb = [];
        for (let i = 1; i < 7; i += 2) {
            rgb.push(parseInt('0x' + hex.slice(i, i + 2)));
        }
        return rgb;
    },

    gradientColor(startColor, endColor, step) {
        step = step - 1;
        // 将hex转换为rgb
        let sColor = this.hexToRgb(startColor),
            eColor = this.hexToRgb(endColor);

        // 计算R\G\B每一步的差值
        let rStep = (eColor[0] - sColor[0]) / step,
            gStep = (eColor[1] - sColor[1]) / step,
            bStep = (eColor[2] - sColor[2]) / step;

        let gradientColorArr = [];
        for (let i = 0; i < step; i++) {
            // 计算每一步的hex值
            gradientColorArr.push(this.rgbToHex(parseInt(rStep * i + sColor[0]), parseInt(gStep * i + sColor[1]), parseInt(bStep * i + sColor[2])));
        }
        gradientColorArr.push(endColor);
        return gradientColorArr;
    }
};
