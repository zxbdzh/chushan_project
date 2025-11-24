package com.zxb.api.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 房间实体类
 * @TableName rooms
 */
@TableName(value = "rooms")
@Data
public class Room {
    /**
     * 房间ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 房间名称
     */
    private String name;

    /**
     * 房间类型
     */
    private String type;

    /**
     * 房间描述
     */
    private String description;

    /**
     * 房间图片
     */
    private String image;

    /**
     * 房间总数量
     */
    private Integer totalCount;

    /**
     * 可用数量
     */
    private Integer availableCount;

    /**
     * 房间价格
     */
    private BigDecimal price;

    /**
     * 房间状态：active-可用，inactive-不可用
     */
    private String status;

    /**
     * 房间设施
     */
    private String facilities;

    /**
     * 房间面积
     */
    private String area;

    /**
     * 最大容纳人数
     */
    private Integer maxOccupancy;

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