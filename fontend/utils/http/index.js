
import { useUserStore } from '@/store'

let isRefreshing = false; // 是否正在刷新 token
let requestQueue = []; // 请求队列

export const http = (options) => {

  // 1. 返回 Promise 对象
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      dataType: 'json',
      // #ifndef MP-WEIXIN
      responseType: 'json',
      // #endif
      // 响应成功
      success(res) {

        if ((res.data.code >= 200 && res.data.code < 300) || (res.data.refreshToken && res.data.token)) {
          resolve(res.data, options)
        } else if (res.data.code === 401) {
          addToQueue(options, resolve, reject);
        } else if (res.data.code === 403) {
          const store = useUserStore()
          store.clearUserInfo();
          reject(res)
        } else {
          uni.showToast({
            icon: 'none',
            title: res.data.msg || '网络错误，换个网络试试',
          })
          reject(res)
        }
      },
      // 响应失败
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        reject(err)
      },
    })
  })
}



// 将请求加入队列
function addToQueue(options, resolve, reject) {
  requestQueue.push({ options, resolve, reject });

  if (!isRefreshing) {
    // 如果没有正在刷新 token，则开始刷新
    refreshToken();
  }
}

// 刷新 token
function refreshToken() {
  isRefreshing = true; // 加锁
  const refreshToken = uni.getStorageSync('refreshToken');
  if (!refreshToken) {
    uni.showToast({
      icon: 'none',
      title: '请前往登录'
    })
    const store = useUserStore()
    store.clearUserInfo();
  }
  uni.request({
    url: "/refreshToken", // 刷新 token 的接口
    method: 'POST',
    data: { refreshToken },
    success: (res) => {
      if (res.data.code === 200 && res.data.data) {
        // 更新短 token
        uni.setStorageSync('token', res.data.data);

        // 释放锁
        isRefreshing = false;

        // 重试队列中的请求
        retryQueue();
      } else {
        const store = useUserStore()
        store.clearUserInfo();
        // 刷新失败，清空队列并报错
        clearQueue(new Error('Failed to refresh token'));
      }
    },
    fail: (err) => {
      // 刷新失败，清空队列并报错
      clearQueue(err);
    }
  });
}

// 重试队列中的请求
function retryQueue() {
  while (requestQueue.length > 0) {
    const { options, resolve, reject } = requestQueue.shift();
    http(options).then(resolve).catch(reject);
  }
}

// 清空队列并报错
function clearQueue(error) {
  isRefreshing = false; // 释放锁
  while (requestQueue.length > 0) {
    const { reject } = requestQueue.shift();
    reject(error);
  }
}


/**
 * GET 请求
 * @param url 后台地址
 * @param query 请求query参数
 * @returns
 */
export const httpGet = (url, query) => {
  return http({
    url,
    query,
    method: 'GET',
  })
}

/**
 * POST 请求
 * @param url 后台地址
 * @param data 请求body参数
 * @param query 请求query参数，post请求也支持query，很多微信接口都需要
 * @returns
 */
export const httpPost = (
  url,
  data,
  query,
) => {
  return http({
    url,
    query,
    data,
    method: 'POST',
  })
}
export const httpDelete = (url, query) => {
  return http({
    url,
    query,
    method: 'DELETE',
  })
}

http.get = httpGet
http.post = httpPost
http.delete = httpDelete
