import request from '@/router/axios';


export const queryTypeData = (eventType) => {
  return request({
    url: '/api/ami-dataquery/meterEventQuery/queryTypeData',
    method: 'get',
    params: eventType
  })
};

export const queryLogData = (eventNo) => {
  return request({
    url: '/api/ami-dataquery/meterEventQuery/queryLogData',
    method: 'get',
    params: eventNo
  })
};

export const queryContentData = (params) => {
  return request({
    url: '/api/ami-dataquery/meterEventQuery/queryContentData',
    method: 'post',
    data: params
  })
};

export const filterData = (params) => {
  return request({
    url: '/api/ami-dataquery/meterEventQuery/filterData',
    method: 'post',
    data: params
  })
};


