import request from '@/router/axios';


export const queryDetail = (params) => {
  return request({
    url: '/api/ami-dataquery/messageQuery/queryDetail',
    method: 'post',
    data: params
  })
};
