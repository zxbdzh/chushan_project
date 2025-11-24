package com.zxb.api.service;

import com.zxb.api.domain.RoomReservation;
import com.baomidou.mybatisplus.extension.service.IService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import java.time.LocalDate;
import java.util.List;

/**
 * 房间预约服务接口
 * @author zxb
 */
public interface RoomReservationService extends IService<RoomReservation> {

    /**
     * 创建房间预约
     * @param reservation 预约信息
     * @return 预约结果
     */
    RoomReservation createReservation(RoomReservation reservation);

    /**
     * 取消预约
     * @param reservationId 预约ID
     * @return 是否成功
     */
    boolean cancelReservation(Long reservationId);

    /**
     * 确认预约
     * @param reservationId 预约ID
     * @return 是否成功
     */
    boolean confirmReservation(Long reservationId);

    /**
     * 完成预约
     * @param reservationId 预约ID
     * @return 是否成功
     */
    boolean completeReservation(Long reservationId);

    /**
     * 分页查询预约记录
     * @param page 页码
     * @param size 每页大小
     * @param status 预约状态（可选）
     * @param phoneNumber 手机号（可选）
     * @return 分页结果
     */
    Page<RoomReservation> getReservationPage(int page, int size, String status, String phoneNumber);

    /**
     * 根据房间ID和日期查询预约记录
     * @param roomId 房间ID
     * @param reservationDate 预约日期
     * @return 预约记录列表
     */
    List<RoomReservation> getReservationsByRoomAndDate(Long roomId, LocalDate reservationDate);

    /**
     * 根据手机号查询预约记录
     * @param phoneNumber 手机号
     * @return 预约记录列表
     */
    List<RoomReservation> getReservationsByPhone(String phoneNumber);


}