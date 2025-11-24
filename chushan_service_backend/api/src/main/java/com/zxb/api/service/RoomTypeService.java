package com.zxb.api.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.zxb.api.domain.RoomType;

import java.util.List;

/**
 * 房间类型服务接口
 * @author zxb
 */
public interface RoomTypeService extends IService<RoomType> {
    
    /**
     * 获取所有房间类型列表
     * @return 房间类型列表
     */
    List<RoomType> getAllRoomTypes();
    
    /**
     * 根据值查询房间类型
     * @param value 类型值
     * @return 房间类型
     */
    RoomType getRoomTypeByValue(String value);
    
    /**
     * 检查类型值是否已存在
     * @param value 类型值
     * @param excludeId 排除的ID（用于编辑时检查）
     * @return 是否存在
     */
    boolean isValueExists(String value, Long excludeId);
}