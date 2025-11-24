package com.zxb.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zxb.api.domain.Room;
import com.zxb.api.mapper.RoomMapper;
import com.zxb.api.service.RoomService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

/**
 * 房间服务实现类
 * @author zxb
 */
@Service
public class RoomServiceImpl extends ServiceImpl<RoomMapper, Room> implements RoomService {

    @Override
    public Page<Room> getRoomPage(int page, int size, String type, String status) {
        Page<Room> pageParam = new Page<>(page, size);
        QueryWrapper<Room> queryWrapper = new QueryWrapper<>();
        
        if (StringUtils.hasText(type)) {
            queryWrapper.eq("type", type);
        }
        if (StringUtils.hasText(status)) {
            queryWrapper.eq("status", status);
        }
        
        queryWrapper.orderByDesc("created_at");
        return this.page(pageParam, queryWrapper);
    }

    @Override
    public boolean decreaseAvailableCount(Long roomId, Integer count) {
        if (roomId == null || count == null || count <= 0) {
            return false;
        }
        
        int result = baseMapper.decreaseAvailableCount(roomId, count);
        return result > 0;
    }

    @Override
    public boolean increaseAvailableCount(Long roomId, Integer count) {
        if (roomId == null || count == null || count <= 0) {
            return false;
        }
        
        int result = baseMapper.increaseAvailableCount(roomId, count);
        return result > 0;
    }

    @Override
    public boolean checkRoomAvailable(Long roomId, Integer count) {
        if (roomId == null || count == null || count <= 0) {
            return false;
        }
        
        Room room = this.getById(roomId);
        if (room == null || !"active".equals(room.getStatus())) {
            return false;
        }
        
        return room.getAvailableCount() >= count;
    }

    @Override
    public boolean save(Room entity) {
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());
        return super.save(entity);
    }

    @Override
    public boolean updateById(Room entity) {
        entity.setUpdatedAt(LocalDateTime.now());
        return super.updateById(entity);
    }
}