package com.zxb.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zxb.api.domain.RoomType;
import com.zxb.api.mapper.RoomTypeMapper;
import com.zxb.api.service.RoomTypeService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 房间类型服务实现类
 * @author zxb
 */
@Service
public class RoomTypeServiceImpl extends ServiceImpl<RoomTypeMapper, RoomType> implements RoomTypeService {
    
    @Override
    public List<RoomType> getAllRoomTypes() {
        return this.list(new QueryWrapper<RoomType>().orderByAsc("id"));
    }
    
    @Override
    public RoomType getRoomTypeByValue(String value) {
        return this.getOne(new QueryWrapper<RoomType>().eq("value", value));
    }
    
    @Override
    public boolean isValueExists(String value, Long excludeId) {
        QueryWrapper<RoomType> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("value", value);
        if (excludeId != null) {
            queryWrapper.ne("id", excludeId);
        }
        return this.count(queryWrapper) > 0;
    }
    
    @Override
    public boolean save(RoomType entity) {
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());
        return super.save(entity);
    }
    
    @Override
    public boolean updateById(RoomType entity) {
        entity.setUpdatedAt(LocalDateTime.now());
        return super.updateById(entity);
    }
}