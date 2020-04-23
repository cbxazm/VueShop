import Vue from 'vue'
import { Button } from 'element-ui'
import {Form,FormItem,Input} from 'element-ui'
import {Message} from 'element-ui'
Vue.prototype.$message=Message
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// Vue.use()
//跟上面的方式不一样

