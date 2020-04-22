import request from '@/router/axios';
import {baseUrl} from '@/config/env';

export const getCaptchaPath = (uuid) => {
  return `api/ami-auth/captcha.jpg?uuid=${uuid}`
}

export const loginByUsername = (tenantId, account, password, type, uuid, captcha) => request({
  url: '/api/ami-auth/token',
  method: 'post',
  params: {
    tenantId,
    account,
    password,
    type,
    uuid,
    captcha
  }
})

export const getButtons = () => request({
  url: '/api/ami-system/menu/buttons',
  method: 'get'
});

export const getUserInfo = () => request({
  url: baseUrl + '/user/getUserInfo',
  method: 'get'
});

export const refeshToken = (refreshToken) => request({
  url: '/api/ami-auth/token',
  method: 'post',
  params: {
    grantType: 'refresh_token',
    refreshToken: refreshToken
  }
})

export const getMenu = () => request({
  url: '/api/ami-system/menu/routes',
  method: 'get'
});

// TODO
export const getTopMenu = () => request({
  url: baseUrl + '/user/getTopMenu',
  method: 'get'
});

export const sendLogs = (list) => request({
  url: baseUrl + '/user/logout',
  method: 'post',
  data: list
})

export const logout = () => request({
  url: '/api/ami-auth/token/logout',
  method: 'post'
})

export const homePage = () => request({
  url: '/api/ami-dataquery/homePageStatistics',
  method: 'get'
})
