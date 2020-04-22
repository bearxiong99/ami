import request from '@/router/axios';

// 终端列表查询
export const getEtmnl = (data) => {
  return request({
    url: '/api/ami-devices/etmnlregister/getPageByCondition',
    method: 'post',
    data
  })
}
// 终端自动注册
export const etmnlRegister = (data) => {
  return request({
    url: '/api/ami-devices/etmnlregister/eTmnlAutomaticregister',
    method: 'post',
    data
  })
}
// 电表列表查询
export const getMeter = (data) => {
  return request({
    url: '/api/ami-devices/emetregister/getPageByCondition',
    method: 'post',
    data
  })
}
// 电表转移
export const meterRegister = (data) => {
  return request({
    url: '/api/ami-devices/emetregister/eMetAutomaticregister',
    method: 'post',
    data
  })
}
// 下发白名单
export const addWhitelist = (data) => {
  return request({
    url: '/api/ami-devices/emetregister/issueWhitelist',
    method: 'post',
    data
  })
}
export const getDevice = (data) => {
  return request({
    url: '/api/ami-dataquery/getDeviceList',
    method: 'post',
    data
  })
}
export const getViewList = (data) => {
  return request({
    url: '/api/ami-dataquery/getViewList',
    method: 'post',
    data
  })
}
// 查找电表更换记录
export const meterChangeHistory = (data) => {
  return request({
    url: '/api/ami-dataquery/meterChangeHistory',
    method: 'post',
    data
  })
}
// 查找电表更换详细
export const meterChangeDetail = (data) => {
  return request({
    url: '/api/ami-dataquery/meterChangeHistoryDetail',
    method: 'post',
    data
  })
}
// 报名单集中器查找
export const getWhiteDCU = (data) => {
  return request({
    url: '/api/ami-devices/etmnlregister/getByCondition',
    method: 'post',
    data
  })
}
// 根据集中器查找电表
export const getDCUtoMeter = (data) => {
  return request({
    url: '/api/ami-devices/emetregister/getByCondition',
    method: 'post',
    data
  })
}


