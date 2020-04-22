import request from '@/router/axios';


export const queryDetail = (params) => {
  return request({
    url: '/api/ami-dataquery/dailyFreeCurve/queryDetail',
    method: 'post',
    data: params
  })
};

export const filterData = (params) => {
  return request({
    url: '/api/ami-dataquery/dailyFreeCurve/filterData',
    method: 'post',
    data: params
  })
};


