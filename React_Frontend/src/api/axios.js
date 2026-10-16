import axios from 'axios';

const api = axios.create({
    baseURL: 'https://sales-management-system-backend-xpr8.onrender.com/api',
    // baseURL: 'http://localhost:8000/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: ផ្ញើ Bearer Token ទៅគ្រប់ Request
// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('auth_token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// 💡 Attach Bearer token ដោយស្វ័យប្រវត្តិមុនពេលផ្ញើ Request ទៅ Backend
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        config.headers.Accept = 'application/json';
        return config;
    },
    (error) => Promise.reject(error)
);

//សំរាប់ Test ទេ 
// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response ? error.response.status : null;
        const requestUrl = error.config ? error.config.url : '';

        // Logout តែពេលណា 401 Unauthorized កកើតឡើងលើ Authenticated Routes ពិតប្រាកដ
        if (status === 401 && !requestUrl.includes('/login') && !requestUrl.includes('/register')) {
            // ឆែកមើលថាតើមាន Token ក្នុង LocalStorage ដែរឬទេ មុននឹង Clear
            if (localStorage.getItem('auth_token')) {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');

                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;