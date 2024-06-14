import axios from "axios";
import { useUserStore } from "@/stores/user";
import t from "@/utils/MatceTools.js";
import { toast } from 'vue3-toastify';

const request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    withCredentials: false,
    timeout: 60000
})

request.interceptors.request.use((config) => {
    const store = useUserStore()
    config.headers.Authorization = 'Bearer ' + store.token
    return config
})

// 添加响应拦截器
request.interceptors.response.use(
    response => {
        // 对响应数据做点什么
        if (response.data.code && response.data.code !== 200) {
            const errorTitle = response.data.code + "/ 向服务器发送的请求有误"
            const errorMessage = response.data.msg + "\n";
            toast.error(errorTitle + "\n" +
                // new URL(response.request.responseURL).pathname + "\n" + 
                errorMessage, {
            });
            t.log(t.ERROR, errorTitle, errorMessage, new URL(response.request.responseURL).pathname, response)
        }
        return response.data;
    },
    error => {
        // 对响应错误做点什么
        const errorTitle = "在与服务器的通信中发生问题"
        toast.error(errorTitle + "\n" +
            // new URL(response.request.responseURL).pathname + "\n" + 
            error.message, {
        });
        t.log(t.ERROR, errorTitle, error)
    }
);

export default request