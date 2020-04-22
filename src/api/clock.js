import request from '@/router/axios';

// 读时钟
export const readTask = (data) => {
  return request({
    url: '/api/ami-communicate/taskCore/createMutilOptParamTask',
    method: 'post',
    data
  })
}
// 读时钟
export const setTask = (data) => {
  return request({
    url: '/api/ami-communicate/taskCore/createSetParamTask',
    method: 'get',
    params: data
  })
}

// 时钟设置对时
export const createClockSyn = (data) => {
  return request({
    url: '/api/ami-communicate/saveTaskCore/createClockSyn',
    method: 'post',
    data
  })
}

// 查看结果
export const checkResult = (data) => {
  return request({
    url: '/api/ami-communicate/taskCore/checkTaskResultList',
    method: 'post',
    data
  })
}
// 读瞬时曲线
export const readRealTask = (data) => {
  return request({
    url: '/api/ami-communicate/taskCore/createMutilReadRealTask',
    method: 'post',
    data
  })
}
// 读瞬时量
export const readRealCallTask = (data) => {
  return request({
    url: '/api/ami-communicate/taskCore/createMutilReadTransCallTask',
    method: 'post',
    data
  })
}

// 读曲线
export const readHisTask = (data) => {
  return request({
    url: '/api/ami-communicate/taskCore/createMutilReadHisTask',
    method: 'post',
    data
  })
}
// 查询拉合闸事件记录
export const getDeviceAlarm = (data) => {
  return request({
    url: '/api/ami-dataquery/getDeviceAlarm',
    method: 'post',
    data
  })
}
// 查询拉合闸操作记录
export const getOperationInfo = (data) => {
  return request({
    url: '/api/ami-dataquery/getDeviceOperationInfo',
    method: 'post',
    data
  })
}
// 集中器参数设置
export const setParam = (data) => {
  return request({
    url: '/api/ami-communicate/taskCore/createSetParamComPlx',
    method: 'post',
    data
  })
}
// 集中器删除白名单
export const createDelDevParamMeter = (data) => {
  return request({
    url: '/api/ami-communicate/diffTaskCore/createDelDevParamMeter',
    method: 'post',
    data
  })
}
// 集中器抄读方案配置
export const setDCUConfig = (data) => {
  return request({
    url: '/api/ami-communicate/diffTaskCore/createSetDevProfileConf',
    method: 'post',
    data
  })
}
// 获取当前数据模板
export const getList = (data) => {
  return request({
    url: '/api/ami-communicate/obisMod/list',
    method: 'post',
    data
  })
}

// 获取当前数据模板
export const readMeterFailList = (data) => {
  return request({
    url: 'api/ami-dataquery/readMeterFailList',
    method: 'post',
    data
  })
}

// 自动对时方案配置-----------------
// 列表查询
export const getTem = (data) => {
  return request({
    url: '/api/ami-devices/tClocksynTemplate/getByPage',
    method: 'post',
    data
  })
}
// 添加
export const save = (data) => {
  return request({
    url: '/api/ami-devices/tClocksynTemplate/save',
    method: 'post',
    data
  })
}
// 删除
export const del = (params) => {
  return request({
    url: '/api/ami-devices/tClocksynTemplate/delete',
    method: 'get',
    params
  })
}
// 修改
export const update = (data) => {
  return request({
    url: '/api/ami-devices/tClocksynTemplate/update',
    method: 'post',
    data
  })
}


// 偏差分析-----------------
// 电表
export const getMeter = (data) => {
  return request({
    url: '/api/ami-devices/recMetClockSyn/list',
    method: 'post',
    data
  })
}
// 电表
export const getTmnl = (data) => {
  return request({
    url: '/api/ami-devices/recTmnlClockSyn/list',
    method: 'post',
    data
  })
}

// 集中器重载档案
export const reloadArchives = (data) => {
  return request({
    url: '/api/ami-communicate/optArchives/reloadArchives',
    method: 'post',
    data
  })
}