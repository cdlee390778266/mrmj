import Vue from 'vue';
import Router from 'vue-router';
import MENU from '../js/menu'

Vue.use(Router);
0
let routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '',
    component: resolve => require(['../components/common/Home.vue'], resolve),
    meta: { title: '' },
    children:[
      {
        path: '/icon',
        component: resolve => require(['../components/page/Icon.vue'], resolve),
        meta: { title: '自定义图标' }
      },
      {
        path: '/table',
        component: resolve => require(['../components/page/BaseTable.vue'], resolve),
        meta: { title: '基础表格' }
      },
      {
        path: '/tabs',
        component: resolve => require(['../components/page/Tabs.vue'], resolve),
        meta: { title: 'tab选项卡' }
      },
      {
        path: '/form',
        component: resolve => require(['../components/page/BaseForm.vue'], resolve),
        meta: { title: '基本表单' }
      },
      {
        // 图片上传组件
        path: '/upload',
        component: resolve => require(['../components/page/Upload.vue'], resolve),
        meta: { title: '文件上传' }   
      },
      {
        // vue-schart组件
        path: '/charts',
        component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
        meta: { title: 'schart图表' }
      },
      {
        // 拖拽Dialog组件
        path: '/dialog',
        component: resolve => require(['../components/page/DragDialog.vue'], resolve),
        meta: { title: '拖拽弹框' }
      },
      {
        // 权限页面
        path: '/permission',
        component: resolve => require(['../components/page/Permission.vue'], resolve),
        meta: { title: '权限测试', permission: true }
      }
    ]
  },
  {
    path: '/login',
    component: resolve => require(['../components/page/Login.vue'], resolve)
  },
  {
    path: '/error/404',
    component: resolve => require(['../components/page/error/404.vue'], resolve),
    meta: { title: '404' }
  },
  {
    path: '/error/403',
    component: resolve => require(['../components/page/error/403.vue'], resolve),
    meta: { title: '403' }
  },
  {
    path: '**',
    redirect: '/error/404'
  }
]

function createRoutes() {
  for(let key in MENU) {
    for(let value of MENU[key]) {
      routes[1].children.push({
        name: value.name,
        path: value.paramsPath ? `/${key}${value.paramsPath}` : `/${key}${value.path}`,
        component: resolve => require([`../components/page/${key}${value.path}.vue`], resolve)
      })
    }
  }
}

createRoutes();


export default new Router({
  routes
})
