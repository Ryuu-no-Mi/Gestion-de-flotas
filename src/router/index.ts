import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DetailVehiclesView from '@/views/DetailVehiclesView.vue'

Vue.use(VueRouter)

//  2. Usa un Navigation Guard Global en tu router

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/LoginView.vue')
  },
  {
    path: '/vehicles',
    name: 'vehicles',
    component: DetailVehiclesView
  }, {
    path: '/brands',
    name: 'brands',
    component: () => import(/* webpackChunkName: "brands" */ '../views/DetailBrandsView.vue')
  }, {
    path: '/models',
    name: 'models',
    component: () => import(/* webpackChunkName: "models" */ '../views/DetailModelsView.vue')
  },
  {
    path: '/config',
    name: 'config',
    component: () => import(/* webpackChunkName: "config" */ '../views/ConfigUserDetail.vue')
  },
  {
    path: '/changeCompany',
    name: 'changeCompany',
    component: () => import(/* webpackChunkName: "changeCompany" */ '../views/ChangeCompanyView.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// ✅ Navigation Guard: proteger rutas privadas
router.beforeEach((to, from, next) => {
  const publicPages = ['login'] // rutas públicas
  const authRequired = !publicPages.includes(to.name as string)
  const token = localStorage.getItem('token')

  if (authRequired && !token) {
    return next({ name: 'login' })
  }

  next()
})

export default router
