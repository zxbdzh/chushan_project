package com.zxb.api.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.zxb.api.domain.User;

/**
 * @author zxb
 * @description 针对表【user】的数据库操作Service
 * @createDate 2025-03-08 18:45:38
 */
public interface UserService extends IService<User> {

    /**
     * 用户登录
     *
     * @param username
     * @param password
     * @return
     */
    User login(String username, String password);

    /**
     * 查询用户头像
     * @param userId
     * @return
     */
    String findAvatar(Long userId);

}
