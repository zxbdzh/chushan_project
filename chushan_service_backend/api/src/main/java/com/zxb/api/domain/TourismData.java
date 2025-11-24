package com.zxb.api.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * @TableName tourism_data
 */
@TableName(value = "tourism_data")
@Data
public class TourismData {
    /**
     *
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     *
     */
    private Object type;

    /**
     *
     */
    private String name;

    /**
     *
     */
    private String description;

    /**
     *
     */
    private String image;

    /**
     *
     */
    private Integer capacity;

    /**
     *
     */
    private Integer available;

    /**
     *
     */
    private String price;

    /**
     *
     */
    private Object tags;

    /**
     *
     */
    private Double score;

    /**
     *
     */
    private String visitCount;

    /**
     *
     */
    private Integer reservationDays;

    /**
     *
     */
    private Integer reservationCount;

    /**
     *
     */
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    /**
     *
     */
    private String content;

    /**
     *
     */
    private String url;

    /**
     *
     */
    private Object specs;

    /**
     * 创建或修改时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime time;
}