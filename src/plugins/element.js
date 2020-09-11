import Vue from 'vue'
import { Button } from 'element-ui'
import {Form,FormItem,Input} from 'element-ui'
import {Message} from 'element-ui'
import {Container,Header,
  Aside,Main,Menu,
  Submenu,MenuItemGroup,
  MenuItem,Breadcrumb,BreadcrumbItem,
  Card,Row,Col,Table,TableColumn,
  Switch,Tooltip,Pagination,Dialog,MessageBox} from 'element-ui'
Vue.prototype.$message=Message
//挂载MessageBox
Vue.prototype.$confirm=MessageBox.confirm
//注册为全局组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
// Vue.use(MessageBox)
// Vue.use()
//跟上面的方式不一样
