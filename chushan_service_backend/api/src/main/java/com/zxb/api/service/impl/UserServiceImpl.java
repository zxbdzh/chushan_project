package com.zxb.api.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zxb.api.domain.User;
import com.zxb.api.mapper.UserMapper;
import com.zxb.api.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

/**
 * @author zxb
 * @description 针对表【user】的数据库操作Service实现
 * @createDate 2025-03-08 18:45:38
 */
@Service
@Transactional
public class UserServiceImpl extends ServiceImpl<UserMapper, User>
        implements UserService {

    public User login(String username, String password) {
        User user = query().eq("username", username).one();
        if (user == null) return null;
        if (!Objects.equals(user.getPassword(), password)) return null;
        return user;
    }

    /**
     * 查找头像
     * @param userId
     * @return
     */
    public String findAvatar(Long userId) {
        User user = query().eq("id", userId).select("avatar").one();
        return user.getAvatar();
    }
}




