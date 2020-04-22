import request from '@/router/axios';

// 查询模板
export const getTem = (data) => {
  return request({
    url: '/api/ami-devices/ttasktemplate/page',
    method: 'post',
    data
  })
}

// 新增
export const save = (data) => {
  return request({
    url: '/api/ami-devices/ttasktemplate/save',
    method: 'post',
    data
  })
}

// 修改
export const update = (data) => {
  return request({
    url: '/api/ami-devices/ttasktemplate/update',
    method: 'post',
    data
  })
}

// 删除
export const del = (data) => {
  return request({
    url: '/api/ami-devices/ttasktemplate/remove',
    method: 'post',
    data
  })
}

// 采集任务查询
export const getTask = (data) => {
  return request({
    url: '/api/ami-devices/tTmnlTask/getPageByCondition',
    method: 'post',
    data
  })
}

// 更新
export const upgrade = (data) => {
  return request({
    url: '/api/ami-devices/tTmnlTask/update',
    method: 'post',
    data
  })
}
