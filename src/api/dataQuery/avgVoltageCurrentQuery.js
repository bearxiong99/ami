import request from '@/router/axios';


export const queryDetail = (params) => {
  return request({
    url: '/api/ami-dataquery/avgVolCurve/queryDetail',
    method: 'post',
    data: params
  })
};

export const orgType = (params) => {
  return request({
    url: '/api/ami-dataquery/avgVolCurve/orgType',
    method: 'post',
    params: params
  })
};

export const filterData = (params) => {
  return request({
    url: '/api/ami-dataquery/avgVolCurve/filterData',
    method: 'post',
    data: params
  })
};

