import axios from 'axios';
// 登录完成后的所有请求必须在请求的headers中添加token
// Add a request interceptor
let axiosIns = axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    let loginToken = sessionStorage.getItem('LoginToken');
    if (loginToken) {
      config.headers.Authorization = `Bearer ${loginToken}`;
    }
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default {
  login(data) {
    return axios.post('/api/login', data);
  },
  // 当我退出登录，取消全局注册的钩子
  logout() {
    axios.interceptors.request.eject(axiosIns);
  },
  getUserProgress() {
    return axios.get('/api/auth/shopSales/30001');
  },
  getNotices(date, limit, isloadelater) {
    if (date) {
      date = date.getTime();
    }
    return axios.get('/api/message', {
      params: {
        date,
        limit,
        isloadelater
      }
    });
  },
  setNoticereaded(id) {
    return axios.post(`/api/auth/notice/${id}`);
  },
  getShops(data) {
    return axios('/api/auth/shop?_limit=10&_order=asc&_sort=distance', {
      params: data
    });
  },
  getShopInfo(id) {
    return axios.get('/api/auth/shopSales/' + id);
  },
  uploadImg(formdata) {
    return axios({
      url: '/api/upload',
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: formdata
    });
  },
  submitSigin(data) {
    return axios.post('/api/auth/SignIn', data);
  },
  loadGoods(data) {
    return axios.get('/api/auth/goods', { params: data });
  },
  loadWarehouse() {
    return axios.get('/api/auth/warehouse');
  },
  subOrder(data) {
    return axios.post('/api/auth/order', data);
  },
  updateUserInfo(data) {
    return axios.put(`/api/auth/user/${data.id}`, data);
  }
};
