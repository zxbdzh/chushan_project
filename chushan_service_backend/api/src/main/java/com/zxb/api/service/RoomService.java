package com.zxb.api.service;

import com.zxb.api.domain.Room;
import com.baomidou.mybatisplus.extension.service.IService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

/**
 * 房间服务接口
 * @author zxb
 */
public interface RoomService extends IService<Room> {

    /**
     * 分页查询房间列表
     * @param page 页码
     * @param size 每页大小
     * @param type 房间类型（可选）
     * @param status 房间状态（可选）
     * @return 分页结果
     */
    Page<Room> getRoomPage(int page, int size, String type, String status);

    /**
     * 减少房间可用数量
     * @param roomId 房间ID
     * @param count 减少数量
     * @return 是否成功
     */
    boolean decreaseAvailableCount(Long roomId, Integer count);

    /**
     * 增加房间可用数量
     * @param roomId 房间ID
     * @param count 增加数量
     * @return 是否成功
     */
    boolean increaseAvailableCount(Long roomId, Integer count);

    /**
     * 检查房间是否可用
     * @param roomId 房间ID
     * @param count 需要数量
     * @return 是否可用
     */
    boolean checkRoomAvailable(Long roomId, Integer count);
}