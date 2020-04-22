import request from '@/router/axios';

// 电表密钥管理分页
export const queryMeterKey = (data) => {
  return request({
    url: '/api/ami-system/rmetersecretkey/page',
    method: 'get',
    params: data
  })
}

// 集中器密钥管理分页
export const queryTerminalKey = (data) => {
  return request({
    url: '/api/ami-system/tmnlcipherpara/page',
    method: 'get',
    params: data
  })
}

// 同步电表导入数据到集中器
export const updateTmnlParaFromMeter = (data) => {
  return request({
    url: '/api/ami-system/tmnlcipherpara/updateTmnlParaFromMeter',
    method: 'get',
    params: data
  })
}

// 删除集中器密钥
export const delTmnlKey = (data) => {
  return request({
    url: '/api/ami-system/tmnlcipherpara/delete?' + data,
    method: 'get',
  })
}

// 删除电表密钥
export const delMeterKey = (data) => {
  return request({
    url: '/api/ami-system/rmetersecretkey/delete?' + data,
    method: 'get',
  })
}