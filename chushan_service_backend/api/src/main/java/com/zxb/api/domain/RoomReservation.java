package com.zxb.api.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

/**
 * 房间预约实体类
 * @TableName room_reservations
 */
@TableName(value = "room_reservations")
@Data
public class RoomReservation {
    /**
     * 预约ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 房间ID
     */
    private Long roomId;

    /**
     * 房间名称
     */
    private String roomName;

    /**
     * 房间类型
     */
    private String roomType;

    /**
     * 预约人姓名
     */
    private String customerName;

    /**
     * 预约人手机号
     */
    private String phoneNumber;



    /**
     * 预约日期
     */
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate reservationDate;

    /**
     * 入住时间
     */
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime checkInTime;

    /**
     * 退房时间
     */
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime checkOutTime;

    /**
     * 预约房间数量
     */
    private Integer roomCount;

    /**
     * 总价格
     */
    private BigDecimal totalPrice;

    /**
     * 预约状态：pending-待确认，confirmed-已确认，cancelled-已取消，completed-已完成
     */
    private String status;

    /**
     * 备注信息
     */
    private String notes;

    /**
     * 创建时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
}