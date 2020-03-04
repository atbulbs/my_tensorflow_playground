import Vue from 'vue'
import Router from 'vue-router'
import { PAGES } from '../shared/consts'

Vue.use(Router)

export default new Router({
  routes: PAGES.map(item => ({
    name: item[0],
    path: item[1],
    component: () => import(`./pages/${ item[0] }.vue`)
  }))
})