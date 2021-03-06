import Vue from 'vue'
import axios from 'axios'
import {Message} from 'iview'
import {appRouter} from '../main'
import { getToken } from '../common/utils'

Vue.prototype.$axios = axios

const server = axios.create({
    baseURL: '/',
    timeout: 60000,
    headers: {
        'Cache-Control': 'no-cache',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json;charset=utf-8'
    }
})

const originMap = {
    api: ''
}

const getURL = (url, origin = 'api', mock = false) => {
    if (mock) {
        return '/mock' + url
    }
    return originMap[origin] + url
}

function replaceRequestURL (config) {
    config.url = getURL(config.url, config.origin, config.mock)
}

// 公共拦截器
server.interceptors.request.use(config => {
    if (getToken()) {
        config.headers['X-TOKEN'] = getToken()
        // config.headers['X-TOKEN'] = 'DEV_TOKEN'
    }
    replaceRequestURL(config)
    return config
}, error => {
    return Promise.reject(error)
})

function clientErrorProcess (response) {
    console.log(response)
    if (!response.config.alert) {
        if (response.data && response.data.message) {
            Message.error(`${response.data.message}`)
        } else {
            Message.error('请求错误，错误码未知！')
        }
    }
}

server.interceptors.response.use(response => {
    const {config, data} = response
    if (data && data.resultCode &&
        (data.resultCode.startsWith('4') || data.resultCode.startsWith('5'))) {
        clientErrorProcess(response)
    } else if (config.alertSuccess) {
        Message.success(data.msg || '操作成功')
    }
    return response
}, error => {
    if (!error.response && error.message.indexOf('timeout') !== -1) {
        Message.error('请求超时')
    } else if (error.response && error.response.status >= 500) {
        if (error.response.data && error.response.data.resultCode) {
            Message.error(`服务器错误，错误码：${error.response.data.resultCode}，消息：${error.response.data.msg}`)
        } else {
            Message.error('服务器错误，错误码未知')
        }
    } else if (error.response && error.response.status === 401) {
        Message.error('用户登录信息已过期，请重新登录')
        window.localStorage.clear()
        setTimeout(() => {
            appRouter.replace('/login')
        })
    } else if (error.response && error.response.status >= 400 && error.response.status < 500) {
        clientErrorProcess(error.response)
    } else {
        Message.error('服务器访问异常')
    }
    return Promise.reject(error)
})

export default server