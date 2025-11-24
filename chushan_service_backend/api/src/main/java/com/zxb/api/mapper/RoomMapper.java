package com.zxb.api.mapper;

import com.zxb.api.domain.Room;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

/**
 * 房间Mapper接口
 * @author zxb
 */
@Mapper
public interface RoomMapper extends BaseMapper<Room> {

    /**
     * 减少房间可用数量
     * @param roomId 房间ID
     * @param count 减少数量
     * @return 影响行数
     */
    @Update("UPDATE rooms SET available_count = available_count - #{count}, updated_at = NOW() WHERE id = #{roomId} AND available_count >= #{count}")
    int decreaseAvailableCount(@Param("roomId") Long roomId, @Param("count") Integer count);

    /**
     * 增加房间可用数量
     * @param roomId 房间ID
     * @param count 增加数量
     * @return 影响行数
     */
    @Update("UPDATE rooms SET available_count = available_count + #{count}, updated_at = NOW() WHERE id = #{roomId}")
    int increaseAvailableCount(@Param("roomId") Long roomId, @Param("count") Integer count);
}