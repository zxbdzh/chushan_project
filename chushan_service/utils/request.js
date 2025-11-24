// 定义全局 baseURL
const baseURL = 'https://api.zxbdwy.online/chushan';
// const baseURL = 'http://localhost:8080';

// 请求拦截器
function requestInterceptor(options) {
	// 将 baseURL 和请求的 url 拼接
	options.url = baseURL + options.url;

	options.timeout = 15000;

	return options;
}

// 响应拦截器
function responseInterceptor(response) {
	const {
		statusCode
	} = response;
	return response;
}

// 封装 uni.request 函数并添加拦截器
function request(options) {
	// 应用请求拦截器
	const newOptions = requestInterceptor(options);
	// 调用 uni.request 发起请求
	return uni.request(newOptions)
		.then((response) => {
			// 应用响应拦截器
			return responseInterceptor(response);
		})
		.catch((error) => {
			console.error('请求出错:', error);
			throw error;
		});
}

// 封装上传文件方法
function uploadFile(url) {
	const options = {
		url: '/common/upload',
		filePath: url,
		name: 'file'
	};

	// 复用请求拦截器处理基础配置
	const newOptions = requestInterceptor(options);

	return new Promise((resolve, reject) => {
		uni.uploadFile({
			...newOptions,
			success: (res) => {
				// 复用响应拦截器处理401等状态
				const processed = responseInterceptor(res);
				if (processed.statusCode === 200) {
					try {
						const data = JSON.parse(processed.data);
						resolve(data);
					} catch (error) {
						reject(new Error('文件上传响应解析失败'));
					}
				} else {
					reject(processed);
				}
			},
			fail: reject
		});
	});
}


export {
	request as
	default, uploadFile
};