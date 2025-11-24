package com.zxb.api.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.zxb.api.domain.RoomReservation;
import com.zxb.api.service.RoomReservationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 房间预约控制器
 * @author zxb
 */
@RestController
@RequestMapping("/api/room-reservations")
@Tag(name = "房间预约管理", description = "房间预约管理相关接口")
public class RoomReservationController {

    @Autowired
    private RoomReservationService roomReservationService;

    @PostMapping
    @Operation(summary = "创建房间预约")
    public Map<String, Object> createReservation(@RequestBody RoomReservation reservation) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            RoomReservation createdReservation = roomReservationService.createReservation(reservation);
            result.put("code", 200);
            result.put("message", "预约成功");
            result.put("data", createdReservation);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        
        return result;
    }

    @GetMapping("/page")
    @Operation(summary = "分页查询预约记录")
    public Map<String, Object> getReservationPage(
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "预约状态") @RequestParam(required = false) String status,
            @Parameter(description = "手机号") @RequestParam(required = false) String phoneNumber) {
        
        Page<RoomReservation> reservationPage = roomReservationService.getReservationPage(page, size, status, phoneNumber);
        
        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", "查询成功");
        result.put("data", reservationPage);
        return result;
    }

    @GetMapping("/by-phone/{phoneNumber}")
    @Operation(summary = "根据手机号查询预约记录")
    public Map<String, Object> getReservationsByPhone(@PathVariable String phoneNumber) {
        List<RoomReservation> reservations = roomReservationService.getReservationsByPhone(phoneNumber);
        
        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", "查询成功");
        result.put("data", reservations);
        return result;
    }

    @GetMapping("/by-phone")
    @Operation(summary = "根据手机号查询预约记录（查询参数方式）")
    public Map<String, Object> getReservationsByPhoneParam(@RequestParam String phoneNumber) {
        List<RoomReservation> reservations = roomReservationService.getReservationsByPhone(phoneNumber);
        
        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", "查询成功");
        result.put("data", reservations);
        return result;
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID查询预约详情")
    public Map<String, Object> getReservationById(@PathVariable Long id) {
        RoomReservation reservation = roomReservationService.getById(id);
        
        Map<String, Object> result = new HashMap<>();
        if (reservation != null) {
            result.put("code", 200);
            result.put("message", "查询成功");
            result.put("data", reservation);
        } else {
            result.put("code", 404);
            result.put("message", "预约记录不存在");
        }
        return result;
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "取消预约")
    public Map<String, Object> cancelReservation(@PathVariable Long id) {
        boolean success = roomReservationService.cancelReservation(id);
        
        Map<String, Object> result = new HashMap<>();
        if (success) {
            result.put("code", 200);
            result.put("message", "取消成功");
        } else {
            result.put("code", 400);
            result.put("message", "取消失败，预约不存在或已取消");
        }
        return result;
    }

    @PutMapping("/{id}/confirm")
    @Operation(summary = "确认预约")
    public Map<String, Object> confirmReservation(@PathVariable Long id) {
        boolean success = roomReservationService.confirmReservation(id);
        
        Map<String, Object> result = new HashMap<>();
        if (success) {
            result.put("code", 200);
            result.put("message", "确认成功");
        } else {
            result.put("code", 400);
            result.put("message", "确认失败，预约不存在或状态不正确");
        }
        return result;
    }

    @PutMapping("/{id}/complete")
    @Operation(summary = "完成预约")
    public Map<String, Object> completeReservation(@PathVariable Long id) {
        boolean success = roomReservationService.completeReservation(id);
        
        Map<String, Object> result = new HashMap<>();
        if (success) {
            result.put("code", 200);
            result.put("message", "完成成功");
        } else {
            result.put("code", 400);
            result.put("message", "完成失败，预约不存在或状态不正确");
        }
        return result;
    }

    @GetMapping("/by-room-date")
    @Operation(summary = "根据房间ID和日期查询预约记录")
    public Map<String, Object> getReservationsByRoomAndDate(
            @Parameter(description = "房间ID") @RequestParam Long roomId,
            @Parameter(description = "预约日期") @RequestParam String date) {
        
        LocalDate reservationDate = LocalDate.parse(date);
        List<RoomReservation> reservations = roomReservationService.getReservationsByRoomAndDate(roomId, reservationDate);
        
        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", "查询成功");
        result.put("data", reservations);
        return result;
    }


}