//定义后端通用的返回结构
export interface BaseResponse<T =any>{
    code:number;  // 业务状态码 (如 200 代表成功)
    message:string; // 提示信息
    data:T;  // 实际的泛型数据 payload
}

//分页数据结构
export interface PageData<T>{
    total:number;
    pageNum:number;
    pageSize:number;
    list:T[];
}