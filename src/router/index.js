import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'
Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'/login',
    component:Login

  },
  {
    path:'/home',
    component:Home,
    redirect:'/welcome',
    children:[
      {path:'/welcome',component:Welcome},
      {path:'/users',component:Users}
    ]
  },
  // {path:'/welcome',component:Welcome}
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})
//挂载路由导航守卫

router.beforeEach((to,from,next)=>{
  //to 将要访问的路径 from 代表从哪个路径跳转过来 next 是一个函数,表示放行
  if(to.path==='/login'){
    return next()
  }
  const tokenStr=window.sessionStorage.getItem("token")
  if(!tokenStr){
      return next("/login")
  }
  next() //放行
})
export default router
