/**
 * 全站http配置
 *
 * axios参数说明
 * isSerialize是否开启form表单提交
 * isToken是否需要token
 */
import axios from 'axios'
import store from '@/store/';
import router from '@/router/router'
import {serialize} from '@/util/util'
import {getToken} from '@/util/auth'
import {Message} from 'element-ui'
import website from '@/config/website';
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {Base64} from 'js-base64';

axios.defaults.timeout = 30000;
//返回其他状态吗
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500; // 默认的
};
//跨域请求，允许保存cookie
axios.defaults.withCredentials = true;
// NProgress Configuration
NProgress.configure({
  showSpinner: false
});
//HTTPrequest拦截
axios.interceptors.request.use(config => {
  NProgress.start() // start progress bar
  const meta = (config.meta || {});
  const isToken = meta.isToken === false;
  config.headers['Authorization'] = `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`;
  // config.headers['blade-auth'] = `bearer eyJ0eXAiOiJKc29uV2ViVG9rZW4iLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJpc3N1c2VyIiwiYXVkIjoiYXVkaWVuY2UiLCJ0ZW5hbnRfaWQiOiIwMDAwMDAiLCJyb2xlX25hbWUiOiJhZG1pbmlzdHJhdG9yIiwidXNlcl9pZCI6IjEiLCJyb2xlX2lkIjoiMSIsInVzZXJfbmFtZSI6ImFkbWluIiwidG9rZW5fdHlwZSI6ImFjY2Vzc190b2tlbiIsImFjY291bnQiOiJhZG1pbiIsImNsaWVudF9pZCI6InNhYmVyIiwiZXhwIjoxNTgyMzc1MzY2LCJuYmYiOjE1ODIzNzE3NjZ9.slZY4cln_vhnXAFfQ_N5NKi6c57ZFU9P0UH2L0oKExc`;
  if (getToken() && !isToken) {
    config.headers['Blade-Auth'] = 'bearer ' + getToken() // 让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
    // todo
    // config.headers['Blade-Auth'] = 'bearer ' + getToken() // 让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
  }
  //headers中配置serialize为true开启序列化
  if (config.method === 'post' && meta.isSerialize === true) {
    config.data = serialize(config.data);
  }
  return config
}, error => {
  return Promise.reject(error)
});

const toLogin = () => {
  /*Message({
    message: 'refresh token is invalid, please reLogin',
    type: 'error'
  })*/
  store.dispatch('FedLogOut').then(() => router.push({path: '/login'}));
  // location.reload()
}
let httpCount=0;
//HTTPresponse拦截
axios.interceptors.response.use(res => {
  NProgress.done();
  const status = res.data.code || 200
  const statusWhiteList = website.statusWhiteList || [];
  /*const message = res.data.msg || '未知错误';
  const code=res.data.code;*/
  //如果在白名单里则自行catch逻辑处理
  if (statusWhiteList.includes(status)) return Promise.reject(res);
  //如果是401则跳转到登录页面
  if (status === 401) {
    httpCount+=1;
    store.dispatch("RefeshToken").then((refreshRes) => {
      if (refreshRes.data.code !== 200&&httpCount==1) {
        toLogin()
      }
    }).catch(() => {
      toLogin()
    });
  }
  // 如果请求为非200否者默认统一处理
  if (status !== 200) {
    // Message({
    //   message: message,
    //   type: 'error'
    // })
    return Promise.reject(res.data)
  }
  // blob类型为文件下载对象，不论是什么请求方式，直接返回文件流数据
  if (res.config.responseType === 'blob') {
    const fileName = decodeURI(res.headers['content-disposition'].split('filename=')[1])
    // 返回文件流内容，以及获取文件名, response.headers['content-disposition']的获取, 默认是获取不到的,需要对服务端webapi进行配置
    return Promise.resolve({ data: res.data, fileName: fileName })
  }
  return res;
}, error => {
  NProgress.done();
  return Promise.reject(new Error(error));
})

export default axios;
