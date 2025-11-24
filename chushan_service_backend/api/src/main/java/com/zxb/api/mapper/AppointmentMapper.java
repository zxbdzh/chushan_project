package com.zxb.api.mapper;

import com.zxb.api.domain.Appointment;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/**
 * @author zxb
 * @description 针对表【appointments】的数据库操作Mapper
 * @createDate 2025-01-13
 * @Entity com.zxb.api.domain.Appointment
 */
@Mapper
public interface AppointmentMapper extends BaseMapper<Appointment> {

    /**
     * 根据手机号查询预约记录
     * @param phoneNumber 手机号
     * @return 预约记录列表
     */
    List<Appointment> findByPhoneNumber(@Param("phoneNumber") String phoneNumber);

    /**
     * 根据景点ID和日期查询预约记录
     * @param scenicId 景点ID
     * @param appointmentDate 预约日期
     * @return 预约记录列表
     */
    List<Appointment> findByScenicIdAndDate(@Param("scenicId") Integer scenicId, 
                                           @Param("appointmentDate") LocalDate appointmentDate);

    /**
     * 根据状态查询预约记录
     * @param status 预约状态
     * @return 预约记录列表
     */
    List<Appointment> findByStatus(@Param("status") String status);

    /**
     * 统计某个景点某天的预约人数
     * @param scenicId 景点ID
     * @param appointmentDate 预约日期
     * @return 预约总人数
     */
    Integer countVisitorsByScenicIdAndDate(@Param("scenicId") Integer scenicId, 
                                          @Param("appointmentDate") LocalDate appointmentDate);
}