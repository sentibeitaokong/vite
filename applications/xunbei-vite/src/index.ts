import './index.css'
import {add} from "./add.ts";

type User={
    name:string;
    age:number
}

const user:User={
    name:'vite',
    age:1
}

console.log(user)
console.log(add(1,2))