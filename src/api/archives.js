import request from '@/router/axios';
import {baseUrl} from '@/config/env';

// 组织单位新增
export const addInsrt = (data) => {
  return request({
    url: '/api/ami-devices/oorg/insert',
    method: 'post',
    data
  })
}

// 组织单位修改
export const updateById = (data) => {
  return request({
    url: '/api/ami-devices/oorg/updateById',
    method: 'post',
    data
  })
}

// 组织单位删除
export const deleteById = (data) => {
  return request({
    url: '/api/ami-devices/oorg/deleteById',
    method: 'get',
    params: data
  })
}

// 分页查询
export const getByCondition = (data) => {
  return request({
    url: '/api/ami-devices/oorg/getByCondition',
    method: 'post',
    data
  })
}
// 集中器增删改
export const dcuOpt = (data) => {
  return request({
    url: '/api/ami-dataquery/optArcherService',
    method: 'post',
    data
  })
}

// 档案批量导入---------------------------------

// sap档案分页
export const sapPage = (data) => {
  return request({
    url: '/api/ami-devices/sapmeter/page',
    method: 'get',
    params: data
  })
}
// wfms 电表档案分页
export const wfmsMeterPage = (data) => {
  return request({
    url: '/api/ami-devices/wfmsmeter/list',
    method: 'get',
    params: data
  })
}
// wfms DCU档案分页
export const wfmsDCUPage = (data) => {
  return request({
    url: '/api/ami-devices/wfmsdcu/list',
    method: 'get',
    params: data
  })
}

// 查询升级文件---------------------------------

export const getFileList = (data) => {
  return request({
    url: '/api/ami-devices/fileimportrecord/page',
    method: 'get',
    params: data
  })
}