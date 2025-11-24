package com.zxb.api.mapper;

import com.zxb.api.domain.RoomReservation;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDate;
import java.util.List;

/**
 * 房间预约Mapper接口
 * @author zxb
 */
@Mapper
public interface RoomReservationMapper extends BaseMapper<RoomReservation> {

    /**
     * 根据房间ID和日期查询预约记录
     * @param roomId 房间ID
     * @param reservationDate 预约日期
     * @return 预约记录列表
     */
    @Select("SELECT * FROM room_reservations WHERE room_id = #{roomId} AND reservation_date = #{reservationDate} AND status != 'cancelled'")
    List<RoomReservation> findByRoomIdAndDate(@Param("roomId") Long roomId, @Param("reservationDate") LocalDate reservationDate);

    /**
     * 根据手机号查询预约记录
     * @param phoneNumber 手机号
     * @return 预约记录列表
     */
    @Select("SELECT * FROM room_reservations WHERE phone_number = #{phoneNumber} ORDER BY created_at DESC")
    List<RoomReservation> findByPhoneNumber(@Param("phoneNumber") String phoneNumber);


}