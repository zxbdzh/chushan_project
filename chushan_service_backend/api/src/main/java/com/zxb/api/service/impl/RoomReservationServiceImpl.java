package com.zxb.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import com.zxb.api.domain.RoomReservation;
import com.zxb.api.mapper.RoomReservationMapper;
import com.zxb.api.service.RoomReservationService;
import com.zxb.api.service.RoomService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 房间预约服务实现类
 *
 * @author zxb
 */
@Service
public class RoomReservationServiceImpl extends ServiceImpl<RoomReservationMapper, RoomReservation> implements RoomReservationService {


    @Autowired
    private RoomService roomService;


    @Override
    @Transactional
    public RoomReservation createReservation(RoomReservation reservation) {
        // 验证房间是否可用
        if (!roomService.checkRoomAvailable(reservation.getRoomId(), reservation.getRoomCount())) {
            throw new RuntimeException("房间数量不足或房间不可用");
        }

        // 身份证校验已移除，只需要基本信息验证
        if (!StringUtils.hasText(reservation.getCustomerName()) || reservation.getCustomerName().trim().length() < 2) {
            throw new RuntimeException("请输入正确的预约人姓名");
        }
        
        if (!StringUtils.hasText(reservation.getPhoneNumber()) || !reservation.getPhoneNumber().matches("^1[3-9]\\d{9}$")) {
            throw new RuntimeException("请输入正确的手机号");
        }

        // 设置创建时间
        reservation.setCreatedAt(LocalDateTime.now());
        reservation.setUpdatedAt(LocalDateTime.now());
        reservation.setStatus("pending");

        // 保存预约记录
        this.save(reservation);

        // 减少房间可用数量
        roomService.decreaseAvailableCount(reservation.getRoomId(), reservation.getRoomCount());

        return reservation;
    }

    @Override
    @Transactional
    public boolean cancelReservation(Long reservationId) {
        RoomReservation reservation = this.getById(reservationId);
        if (reservation == null || "cancelled".equals(reservation.getStatus())) {
            return false;
        }

        // 更新预约状态
        reservation.setStatus("cancelled");
        reservation.setUpdatedAt(LocalDateTime.now());
        this.updateById(reservation);

        // 恢复房间可用数量
        roomService.increaseAvailableCount(reservation.getRoomId(), reservation.getRoomCount());

        return true;
    }

    @Override
    public boolean confirmReservation(Long reservationId) {
        RoomReservation reservation = this.getById(reservationId);
        if (reservation == null || !"pending".equals(reservation.getStatus())) {
            return false;
        }

        reservation.setStatus("confirmed");
        reservation.setUpdatedAt(LocalDateTime.now());
        return this.updateById(reservation);
    }

    @Override
    public boolean completeReservation(Long reservationId) {
        RoomReservation reservation = this.getById(reservationId);
        if (reservation == null || !"confirmed".equals(reservation.getStatus())) {
            return false;
        }

        reservation.setStatus("completed");
        reservation.setUpdatedAt(LocalDateTime.now());
        return this.updateById(reservation);
    }

    @Override
    public Page<RoomReservation> getReservationPage(int page, int size, String status, String phoneNumber) {
        Page<RoomReservation> pageParam = new Page<>(page, size);
        QueryWrapper<RoomReservation> queryWrapper = new QueryWrapper<>();

        if (StringUtils.hasText(status)) {
            queryWrapper.eq("status", status);
        }
        if (StringUtils.hasText(phoneNumber)) {
            queryWrapper.like("phone_number", phoneNumber);
        }

        queryWrapper.orderByDesc("created_at");
        return this.page(pageParam, queryWrapper);
    }

    @Override
    public List<RoomReservation> getReservationsByRoomAndDate(Long roomId, LocalDate reservationDate) {
        return baseMapper.findByRoomIdAndDate(roomId, reservationDate);
    }

    @Override
    public List<RoomReservation> getReservationsByPhone(String phoneNumber) {
        return baseMapper.findByPhoneNumber(phoneNumber);
    }


}