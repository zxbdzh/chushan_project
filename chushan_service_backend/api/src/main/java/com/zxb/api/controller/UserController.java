package com.zxb.api.controller;

import com.zxb.api.domain.User;
import com.zxb.api.service.UserService;
import com.zxb.api.utils.JwtUtils;
import com.zxb.api.utils.Result;
import com.zxb.api.utils.ThreadLocalUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Tag(name = "用户相关")
@RequestMapping("/user")
@RestController
@RequiredArgsConstructor
public class UserController {

    ThreadLocalUtil<Long> threadLocalUtil = new ThreadLocalUtil<>();

    private final UserService userService;

    @Operation(summary = "用户登录")
    @PostMapping("/login")
    public Result<String> login(@RequestParam String username, @RequestParam String password) {
        User result = userService.login(username, password);
        log.info("result: {}", result);
        if (result == null) return Result.error("用户名或密码错误");
        String token = JwtUtils.generateToken(String.valueOf(result.getId()));
        return Result.success(token);
    }

    @Operation(summary = "头像获取")
    @GetMapping("/avatar")
    public Result<String> getAvatar() {
        Long userId = threadLocalUtil.get();
        if (userId == null) return Result.error("请先登录");
        String avatar = userService.findAvatar(userId);
        return Result.success(avatar);
    }

}
