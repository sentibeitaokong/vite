import {http} from "@/utils/request";
// import type {BaseResponse} from "@/api/types";

export interface UserInfo{
    id: number;
    username:string;
    avatar:string;
    role:string[],
}

export interface LoginParams{
    username:string;
    password:string;
}

//Api
export const getUserProfile=()=>{
    return http.get<UserInfo>('/user/profile')
}

export const login=(data:LoginParams)=>{
    return http.post<string>('/auth/login',data)
}