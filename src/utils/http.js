import axios from "axios";

// axios 配置
axios.defaults.timeout = 5000;
// axios.defaults.baseURL = "/weixin/";

// http request 拦截器
axios.interceptors.request.use(
    config => {
        // if (store.state.user.token) {
        //     // 任何请求，都带有"accessToken"值
        //     config.headers.accessToken = `${store.state.user.token}`;
        // }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

// http response 拦截器
axios.interceptors.response.use(
    response => {
        return response.data||{};
    },
    err => {
        
        return Promise.reject(err);
    }
);

export default axios;
