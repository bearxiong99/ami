import request from '@/router/axios';

// 告警名称
export const getAlarmNames = (params) => {
  return request({
    url: '/api/ami-monitor/eventcodedef/all',
    method: 'get',
    params
  })
}

// 集中器告警
export const getDCU = (params) => {
  return request({
    url: '/api/ami-monitor/emptmnlalarm/page?' + params,
    method: 'get',
  })
}

// 电表告警
export const getMeter = (params) => {
  return request({
    url: '/api/ami-monitor/empmetalarm/page?' + params,
    method: 'get',
  })
}

// 类型
export const getType = (params) => {
  return request({
    url: '/api/ami-monitor/eventcodedef/list',
    method: 'get',
    params
  })
}

// 新增
export const add = (data) => {
  return request({
    url: '/api/ami-monitor/eventcodedef/save',
    method: 'post',
    data
  })
}

// 修改
export const update = (data) => {
  return request({
    url: '/api/ami-monitor/eventcodedef/update',
    method: 'post',
    data
  })
}

// 删除
export const del = (data) => {
  return request({
    url: '/api/ami-monitor/eventcodedef/del',
    method: 'post',
    data
  })
}

// 告警实时监视------------------------

// 告警实时监视数量
export const count = (data) => {
  return request({
    url: '/api/ami-monitor/alarmmonitor/count?' + data,
    method: 'get',
  })
}

// 确认集中器
export const updateTmnl = (data) => {
  return request({
    url: '/api/ami-monitor/emptmnlalarm/update',
    method: 'post',
    data
  })
}

// 批量确认集中器
export const updateTmnlList = (data) => {
  return request({
    url: '/api/ami-monitor/emptmnlalarm/updateStatus',
    method: 'post',
    data
  })
}

// 确认电表
export const updateMeter = (data) => {
  return request({
    url: '/api/ami-monitor/empmetalarm/update',
    method: 'post',
    data
  })
}

// 批量确认电表
export const updateMeterList = (data) => {
  return request({
    url: '/api/ami-monitor/empmetalarm/updateStatus',
    method: 'post',
    data
  })
}