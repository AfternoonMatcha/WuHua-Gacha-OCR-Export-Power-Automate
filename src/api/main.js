import request from "../utils/request";

// POST 请求示例
export const postSample = (query) => {
    return request({
        url: '/main/postSample',
        data: query,
        method: 'post'
    })
}

// GET 请求示例
export const getSample = (query) => {
    return request({
        url: '/main/getSample',
        params: query,
        method: 'get'
    })
}

// GET 页面参数请求示例
export const getURLSample = (data) => {
    return request({
        url: '/main/getURLSample/' + data,
        method: 'get'
    })
}