import request from '@/router/axios';


export const queryKpiToInstallSucessRate = () => {
  return request({
    url: '/api/ami-dataquery/kpiIndex/queryKpiToInstallSucessRate',
    method: 'post',

  })
};

export const queryKpiToReadSuccRate = () => {
  return request({
    url: '/api/ami-dataquery/kpiIndex/queryKpiToReadSuccRate',
    method: 'post',
  })
};

export const queryKpiToReadSuccRateList = () => {
  return request({
    url: '/api/ami-dataquery/kpiIndex/queryKpiToReadSuccRateList',
    method: 'post',
  })
};

export const queryKpiToSystemUserRate = () => {
  return request({
    url: '/api/ami-dataquery/kpiIndex/queryKpiToSystemUserRate',
    method: 'post',
  })
};


