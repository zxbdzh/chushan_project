package com.zxb.api.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zxb.api.domain.Appointment;
import com.zxb.api.mapper.AppointmentMapper;
import com.zxb.api.service.AppointmentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author zxb
 * @description 针对表【appointments】的业务逻辑Service实现
 * @createDate 2025-01-13
 */
@Slf4j
@Service
public class AppointmentServiceImpl extends ServiceImpl<AppointmentMapper, Appointment>
        implements AppointmentService {

    @Override
    @Transactional
    public boolean createAppointment(Appointment appointment) {
        try {
            // 设置默认值
            if (appointment.getStatus() == null) {
                appointment.setStatus("pending");
            }
            if (appointment.getVisitorCount() == null) {
                appointment.setVisitorCount(1);
            }
            if (appointment.getCreatedAt() == null) {
                appointment.setCreatedAt(LocalDateTime.now());
            }
            if (appointment.getUpdatedAt() == null) {
                appointment.setUpdatedAt(LocalDateTime.now());
            }
            
            return save(appointment);
        } catch (Exception e) {
            log.error("创建预约失败: {}", e.getMessage(), e);
            return false;
        }
    }

    @Override
    public List<Appointment> findByPhoneNumber(String phoneNumber) {
        return lambdaQuery()
                .eq(Appointment::getPhoneNumber, phoneNumber)
                .orderByDesc(Appointment::getCreatedAt)
                .list();
    }

    @Override
    public IPage<Appointment> findByPhoneNumberWithPage(String phoneNumber, Page<Appointment> page) {
        return lambdaQuery()
                .eq(Appointment::getPhoneNumber, phoneNumber)
                .orderByDesc(Appointment::getCreatedAt)
                .page(page);
    }

    @Override
    public List<Appointment> findByScenicIdAndDate(Integer scenicId, LocalDate appointmentDate) {
        return lambdaQuery()
                .eq(Appointment::getScenicId, scenicId)
                .eq(Appointment::getAppointmentDate, appointmentDate)
                .orderByAsc(Appointment::getAppointmentTime)
                .list();
    }

    @Override
    public List<Appointment> findByStatus(String status) {
        return lambdaQuery()
                .eq(Appointment::getStatus, status)
                .orderByDesc(Appointment::getCreatedAt)
                .list();
    }

    @Override
    public IPage<Appointment> findByStatusWithPage(String status, Page<Appointment> page) {
        return lambdaQuery()
                .eq(Appointment::getStatus, status)
                .orderByDesc(Appointment::getCreatedAt)
                .page(page);
    }

    @Override
    @Transactional
    public boolean updateStatus(Long id, String status) {
        try {
            return lambdaUpdate()
                    .eq(Appointment::getId, id)
                    .set(Appointment::getStatus, status)
                    .set(Appointment::getUpdatedAt, LocalDateTime.now())
                    .update();
        } catch (Exception e) {
            log.error("更新预约状态失败: {}", e.getMessage(), e);
            return false;
        }
    }

    @Override
    @Transactional
    public boolean cancelAppointment(Long id, String phoneNumber) {
        try {
            return lambdaUpdate()
                    .eq(Appointment::getId, id)
                    .eq(Appointment::getPhoneNumber, phoneNumber)
                    .set(Appointment::getStatus, "cancelled")
                    .set(Appointment::getUpdatedAt, LocalDateTime.now())
                    .update();
        } catch (Exception e) {
            log.error("取消预约失败: {}", e.getMessage(), e);
            return false;
        }
    }

    @Override
    public Integer countVisitorsByScenicIdAndDate(Integer scenicId, LocalDate appointmentDate) {
        return baseMapper.countVisitorsByScenicIdAndDate(scenicId, appointmentDate);
    }

    @Override
    public boolean checkTimeConflict(Integer scenicId, LocalDate appointmentDate, String appointmentTime) {
        try {
            LocalTime time = LocalTime.parse(appointmentTime);
            long count = lambdaQuery()
                    .eq(Appointment::getScenicId, scenicId)
                    .eq(Appointment::getAppointmentDate, appointmentDate)
                    .eq(Appointment::getAppointmentTime, time)
                    .ne(Appointment::getStatus, "cancelled")
                    .count();
            return count > 0;
        } catch (Exception e) {
            log.error("检查时间冲突失败: {}", e.getMessage(), e);
            return false;
        }
    }

    @Override
    public Object getAppointmentStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        // 总预约数
        long totalCount = count();
        statistics.put("totalCount", totalCount);
        
        // 各状态统计
        Map<String, Long> statusCount = new HashMap<>();
        statusCount.put("pending", lambdaQuery().eq(Appointment::getStatus, "pending").count());
        statusCount.put("confirmed", lambdaQuery().eq(Appointment::getStatus, "confirmed").count());
        statusCount.put("cancelled", lambdaQuery().eq(Appointment::getStatus, "cancelled").count());
        statusCount.put("completed", lambdaQuery().eq(Appointment::getStatus, "completed").count());
        statistics.put("statusCount", statusCount);
        
        // 今日预约数
        LocalDate today = LocalDate.now();
        long todayCount = lambdaQuery().eq(Appointment::getAppointmentDate, today).count();
        statistics.put("todayCount", todayCount);
        
        return statistics;
    }

    @Override
    public boolean checkDuplicateAppointment(String phoneNumber, Integer scenicId, LocalDate appointmentDate) {
        try {
            long count = lambdaQuery()
                    .eq(Appointment::getPhoneNumber, phoneNumber)
                    .eq(Appointment::getScenicId, scenicId)
                    .eq(Appointment::getAppointmentDate, appointmentDate)
                    .ne(Appointment::getStatus, "cancelled")
                    .count();
            return count > 0;
        } catch (Exception e) {
            log.error("检查重复预约失败: {}", e.getMessage(), e);
            return false;
        }
    }
}