package com.zxb.api.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.zxb.api.domain.Appointment;

import java.time.LocalDate;
import java.util.List;

/**
 * @author zxb
 * @description 针对表【appointments】的业务逻辑Service
 * @createDate 2025-01-13
 */
public interface AppointmentService extends IService<Appointment> {

    /**
     * 创建预约
     * @param appointment 预约信息
     * @return 创建结果
     */
    boolean createAppointment(Appointment appointment);

    /**
     * 根据手机号查询预约记录
     * @param phoneNumber 手机号
     * @return 预约记录列表
     */
    List<Appointment> findByPhoneNumber(String phoneNumber);

    /**
     * 根据手机号分页查询预约记录
     * @param phoneNumber 手机号
     * @param page 分页信息
     * @return 分页预约记录
     */
    IPage<Appointment> findByPhoneNumberWithPage(String phoneNumber, Page<Appointment> page);

    /**
     * 根据景点ID和日期查询预约记录
     * @param scenicId 景点ID
     * @param appointmentDate 预约日期
     * @return 预约记录列表
     */
    List<Appointment> findByScenicIdAndDate(Integer scenicId, LocalDate appointmentDate);

    /**
     * 根据状态查询预约记录
     * @param status 预约状态
     * @return 预约记录列表
     */
    List<Appointment> findByStatus(String status);

    /**
     * 根据状态分页查询预约记录
     * @param status 预约状态
     * @param page 分页信息
     * @return 分页预约记录
     */
    IPage<Appointment> findByStatusWithPage(String status, Page<Appointment> page);

    /**
     * 更新预约状态
     * @param id 预约ID
     * @param status 新状态
     * @return 更新结果
     */
    boolean updateStatus(Long id, String status);

    /**
     * 取消预约
     * @param id 预约ID
     * @param phoneNumber 手机号（用于验证）
     * @return 取消结果
     */
    boolean cancelAppointment(Long id, String phoneNumber);

    /**
     * 统计某个景点某天的预约人数
     * @param scenicId 景点ID
     * @param appointmentDate 预约日期
     * @return 预约总人数
     */
    Integer countVisitorsByScenicIdAndDate(Integer scenicId, LocalDate appointmentDate);

    /**
     * 检查预约时间冲突
     * @param scenicId 景点ID
     * @param appointmentDate 预约日期
     * @param appointmentTime 预约时间
     * @return 是否有冲突
     */
    boolean checkTimeConflict(Integer scenicId, LocalDate appointmentDate, String appointmentTime);

    /**
     * 获取预约统计信息
     * @return 统计信息
     */
    Object getAppointmentStatistics();

    /**
     * 检查手机号是否已经为指定景点在指定日期创建过预约
     * @param phoneNumber 手机号
     * @param scenicId 景点ID
     * @param appointmentDate 预约日期
     * @return 是否已存在预约
     */
    boolean checkDuplicateAppointment(String phoneNumber, Integer scenicId, LocalDate appointmentDate);
}