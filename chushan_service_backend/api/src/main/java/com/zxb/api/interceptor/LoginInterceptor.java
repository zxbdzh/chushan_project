package com.zxb.api.interceptor;

import com.zxb.api.utils.JwtUtils;
import com.zxb.api.utils.ThreadLocalUtil;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import java.util.Objects;

@Slf4j
@Configuration
public class LoginInterceptor implements HandlerInterceptor {

    ThreadLocalUtil<Long> threadLocalUtil = new ThreadLocalUtil<>();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (Objects.equals(request.getMethod(), "OPTIONS")) return true;
        // 获取token
        String token = request.getHeader("authorization");
        log.info("token: {}", token);
        if (token == null) {
            response.setStatus(401);
            return false;
        }
        // 解析token, 将id存入threadLocal
        long userId;
        try {
            userId = Long.parseLong(JwtUtils.extractAllClaims(token).getSubject());
        } catch (SignatureException | ExpiredJwtException e) {
            response.setStatus(401);
            return false;
        }
        threadLocalUtil.set(userId);
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        HandlerInterceptor.super.postHandle(request, response, handler, modelAndView);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        HandlerInterceptor.super.afterCompletion(request, response, handler, ex);
    }
}
