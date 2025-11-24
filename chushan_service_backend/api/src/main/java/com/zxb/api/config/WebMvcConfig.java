package com.zxb.api.config;

import com.zxb.api.interceptor.LoginInterceptor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@Slf4j
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${server.baseUrl}")
    private String url;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(url) // 替换为你的前端地址
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        log.info("开启静态资源映射...");
        registry.addResourceHandler("doc.html").addResourceLocations("classpath:/META-INF/resources/");
        registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
    }

<<<<<<< HEAD
    @Override
=======
>>>>>>> d51e30be6a2be42b21fc0d359a8039bda9864aba
    public void addInterceptors(InterceptorRegistry registry) {
        // 配置第一个拦截器：排除所有不需要拦截的路径
        registry.addInterceptor(new LoginInterceptor())
                .excludePathPatterns(
                        "/user/login",
                        "/doc.html",
                        "/webjars/**",
                        "/v3/api-docs/**",
                        "/favicon.ico",
                        "/tourism/type",
                        "/guideItems",
                        "/appointments", // 先排除所有/appointments请求
                        // 房间相关 - 小程序需要的接口
                        "/api/rooms/list", "/api/rooms/*/", "/api/rooms/check-available/*",
                        // 房间预约相关 - 小程序需要的接口
                        "/api/room-reservations", "/api/room-reservations/by-phone", "/api/room-reservations/by-room-date", "/api/room-reservations/validate-id-card", "/api/room-reservations/*/cancel",
                        "/common/upload"
                )
                .addPathPatterns("/**");

        // 配置第二个拦截器：仅拦截/appointments的非POST请求
        registry.addInterceptor(new HandlerInterceptor() {
                    @Override
                    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
                        // 只拦截非POST请求
                        return "POST".equalsIgnoreCase(request.getMethod());
                    }
                })
                .addPathPatterns("/appointments");
    }
}