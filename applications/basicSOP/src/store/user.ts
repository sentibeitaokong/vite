import {defineStore} from "pinia";
import {ref} from "vue"

//负责存储 Token、调用获取用户信息的 API。
export const  useUserStore=defineStore('user',()=>{
    const token=ref(localStorage.getItem('ACCESS_TOKEN')||'')
    const roles=ref<string[]>([])
    //设置token
    const setToken = (newToken: string) => {
        token.value = newToken
        localStorage.setItem('ACCESS_TOKEN', newToken)
    }
    //获取用户信息
    const getInfo=async ()=>{
        //模拟接口请求
        const  mockRoles=['person']
        if (!mockRoles || mockRoles.length === 0) {
            throw new Error('获取用户信息失败，角色列表不能为空！')
        }

        roles.value = mockRoles
        return mockRoles
    }
    const  logout=()=>{
        token.value=''
        roles.value=[]
        localStorage.removeItem('ACCESS_TOKEN')
    }
    return {token,roles,getInfo,logout,setToken}
})