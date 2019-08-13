import Vue from 'vue';
import Router from 'vue-router';
import MENU from '../js/menu';
import Utils from '../js/utils';

Vue.use(Router);

let routes = [
  {
    path: '',
    beforeEnter: (to, from, next) => {

      let token = Utils.getStorage(Utils.CONFIG.storageNames.tokenName);

      if(token) {
        
        let orgCode = Utils.getStorage(Utils.CONFIG.storageNames.orgcodeName);
        let orgObj = Utils.checkModuleExistence(orgCode);
        if(orgObj.existence) {	//如果部门存在
          
          (to.fullPath == '/' || !to.fullPath.split('/').includes(orgObj.webOrgKey)) ? next(`/${orgObj.webOrgKey}/home`) : next();
        }else {
          
          Utils.removeUserStorage();
          next('/login');
        }
      }else {

        next('/login');
      }
    },
    component: resolve => require(['../components/common/Home.vue'], resolve),
    children:[
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
    ]
  },
  {
    path: '/login',
    beforeEnter: (to, from, next) => {

      let token = Utils.getStorage(Utils.CONFIG.storageNames.tokenName);
      if (token) {
        
        let orgCode = Utils.getStorage(Utils.CONFIG.storageNames.orgcodeName);
        let orgObj = Utils.checkModuleExistence(orgCode);
        if(orgObj.existence) {	//如果部门存在

          Utils.CONFIG.activeMenuType = orgObj.webOrgKey;
          next(`/${Utils.CONFIG.activeMenuType}/home`);
        }else {

          next();
        }
      } else {

        next();
      }
    },
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

    for(let item of MENU[key].list) {
      
      routes[0].children.push({
        name: item.name,
        path: item.paramsPath ? `/${key}${item.paramsPath}` : `/${key}${item.path}`,
        component: resolve => require([`../components/page/${key}${item.path}.vue`], resolve)
      })
    }
  }
}

createRoutes();

export default new Router({
  routes
})
