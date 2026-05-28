import axios from 'axios'
import type {AxiosInstance,AxiosError,InternalAxiosRequestConfig,AxiosResponse} from "axios";
import type {BaseResponse} from "@/api/types";

//创建Axios实例
const  service:AxiosInstance = axios.create({
    baseURL:import.meta.env.VITE_BASE_API || '/api',
    timeout:15000,  //超时时间：15s
    headers:{
        "Content-Type":'application/json;charset=utf-8'
    }
})

//请求拦截器
service.interceptors.request.use(
    (config:InternalAxiosRequestConfig)=>{
        //中间处理
        return config
    },
    (error:AxiosError)=>{
        //拦截发送请求前的致命错误
        return Promise.reject(error)
    }
)

//响应拦截器
service.interceptors.response.use(
    (reponse:AxiosResponse<BaseResponse>)=>{
        const res=reponse.data
        // 假设后端约定 code === 200 为操作成功
        if(res.code==200){
            // 成功时，直接返回剥离了 Axios 包装的真实数据 (res)
            // 注意：这里返回 res，那么调用方拿到的是 BaseResponse 结构
            return res as any
        }
        // 处理自定义业务错误 (如 4001 密码错误, 4002 余额不足等)
        const errorMsg=res.message||'系统内部错误'
        // 抛出错误，中断后续的 Promise 链
        return Promise.reject(new Error(errorMsg))
    },
    (error:AxiosError)=>{
        //Http状态码拦截
        let message = '网络异常，请稍后再试'
        if(error.response){
            switch (error.response.status){
                case 401:
                    message='登录已过期，请重新登录'
                    break
                case 403:
                    message = '您没有权限访问该资源'
                    break
                case 404:
                    message = '请求的资源不存在'
                    break
                case 500:
                    message = '服务器内部错误'
                    break
                default:
                    message = `网络错误: ${error.response.status}`
            }
        }else if(error.message.includes('timeout')){
            message='请求超时，请检查网络连接'
        }else if(error.message.includes('Network Error')){
            message='网络连接中断'
        }
        return Promise.reject(message)
    }
)

// 导出基于泛型的通用请求方法
export const http = {
    get<T = any>(url: string, config?: any): Promise<BaseResponse<T>> {
        return service.get(url, config)
    },
    post<T = any>(url: string, data?: any, config?: any): Promise<BaseResponse<T>> {
        return service.post(url, data, config)
    },
    put<T = any>(url: string, data?: any, config?: any): Promise<BaseResponse<T>> {
        return service.put(url, data, config)
    },
    delete<T = any>(url: string, config?: any): Promise<BaseResponse<T>> {
        return service.delete(url, config)
    }
}

export default service