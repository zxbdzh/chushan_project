package com.zxb.api.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

/**
 * 预约表实体类
 * @TableName appointments
 */
@TableName(value = "appointments")
@Data
public class Appointment {
    /**
     * 预约ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 预约人手机号
     */
    private String phoneNumber;

    /**
     * 预约人姓名
     */
    private String name;

    /**
     * 景点ID，关联tourism_data表
     */
    private Integer scenicId;

    /**
     * 预约景点名称
     */
    private String scenicName;

    /**
     * 预约日期
     */
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate appointmentDate;

    /**
     * 预约时间
     */
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime appointmentTime;

    /**
     * 预约人数
     */
    private Integer visitorCount;

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