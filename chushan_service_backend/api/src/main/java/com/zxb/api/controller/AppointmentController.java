package com.zxb.api.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.zxb.api.domain.Appointment;
import com.zxb.api.service.AppointmentService;
import com.zxb.api.utils.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 预约管理控制器
 * @author zxb
 */
@Slf4j
@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
@Tag(name = "预约管理相关")
public class AppointmentController {
    
    private final AppointmentService appointmentService;

    @Operation(summary = "创建预约")
    @PostMapping
    public Result<String> createAppointment(@RequestBody Appointment appointment) {
        try {
            // 基本参数验证
            if (appointment.getPhoneNumber() == null || appointment.getPhoneNumber().trim().isEmpty()) {
                return Result.error("手机号不能为空");
            }
            if (appointment.getName() == null || appointment.getName().trim().isEmpty()) {
                return Result.error("姓名不能为空");
            }
            if (appointment.getScenicName() == null || appointment.getScenicName().trim().isEmpty()) {
                return Result.error("景点名称不能为空");
            }
            if (appointment.getAppointmentDate() == null) {
                return Result.error("预约日期不能为空");
            }
            if (appointment.getAppointmentTime() == null) {
                return Result.error("预约时间不能为空");
            }
            
            // 检查预约日期是否为未来日期
            if (appointment.getAppointmentDate().isBefore(LocalDate.now())) {
                return Result.error("预约日期不能早于今天");
            }
            
            // 检查是否已存在重复预约
            boolean isDuplicate = appointmentService.checkDuplicateAppointment(
                    appointment.getPhoneNumber(), 
                    appointment.getScenicId(), 
                    appointment.getAppointmentDate());
            if (isDuplicate) {
                return Result.error("您已经为该景点在此日期创建过预约，请勿重复预约");
            }
            
            boolean success = appointmentService.createAppointment(appointment);
            if (success) {
                return Result.success("预约创建成功");
            } else {
                return Result.error("预约创建失败");
            }
        } catch (Exception e) {
            log.error("创建预约异常: {}", e.getMessage(), e);
            return Result.error("系统异常，请稍后重试");
        }
    }

    @Operation(summary = "根据手机号查询预约记录")
    @GetMapping("/phone/{phoneNumber}")
    public Result<List<Appointment>> getAppointmentsByPhone(
            @Parameter(description = "手机号") @PathVariable String phoneNumber) {
        try {
            List<Appointment> appointments = appointmentService.findByPhoneNumber(phoneNumber);
            return Result.success(appointments);
        } catch (Exception e) {
            log.error("查询预约记录异常: {}", e.getMessage(), e);
            return Result.error("查询失败");
        }
    }

    @Operation(summary = "根据手机号分页查询预约记录")
    @GetMapping("/phone/{phoneNumber}/page")
    public Result<IPage<Appointment>> getAppointmentsByPhoneWithPage(
            @Parameter(description = "手机号") @PathVariable String phoneNumber,
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") Integer page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") Integer size) {
        try {
            Page<Appointment> pageInfo = new Page<>(page, size);
            IPage<Appointment> result = appointmentService.findByPhoneNumberWithPage(phoneNumber, pageInfo);
            return Result.success(result);
        } catch (Exception e) {
            log.error("分页查询预约记录异常: {}", e.getMessage(), e);
            return Result.error("查询失败");
        }
    }

    @Operation(summary = "根据景点ID和日期查询预约记录")
    @GetMapping("/scenic/{scenicId}")
    public Result<List<Appointment>> getAppointmentsByScenicAndDate(
            @Parameter(description = "景点ID") @PathVariable Integer scenicId,
            @Parameter(description = "预约日期") @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date) {
        try {
            List<Appointment> appointments = appointmentService.findByScenicIdAndDate(scenicId, date);
            return Result.success(appointments);
        } catch (Exception e) {
            log.error("查询景点预约记录异常: {}", e.getMessage(), e);
            return Result.error("查询失败");
        }
    }

    @Operation(summary = "根据状态查询预约记录")
    @GetMapping("/status/{status}")
    public Result<Object> getAppointmentsByStatus(
            @Parameter(description = "预约状态") @PathVariable String status,
            @Parameter(description = "页码") @RequestParam(required = false) Integer page,
            @Parameter(description = "每页大小") @RequestParam(required = false) Integer size) {
        try {
            // 分页查询逻辑
            if (page != null && size != null) {
                Page<Appointment> pageInfo = new Page<>(page, size);
                IPage<Appointment> result = appointmentService.findByStatusWithPage(status, pageInfo);
                return Result.success(result);
            }
            
            // 无分页参数时返回全部数据
            List<Appointment> appointments = appointmentService.findByStatus(status);
            return Result.success(appointments);
        } catch (Exception e) {
            log.error("根据状态查询预约记录异常: {}", e.getMessage(), e);
            return Result.error("查询失败");
        }
    }

    @Operation(summary = "更新预约状态")
    @PutMapping("/{id}/status")
    public Result<String> updateAppointmentStatus(
            @Parameter(description = "预约ID") @PathVariable Long id,
            @Parameter(description = "新状态") @RequestParam(required = false) String status) {
        try {
            // 验证状态参数是否提供
            if (status == null || status.trim().isEmpty()) {
                return Result.error("状态参数不能为空");
            }
            
            // 验证状态值
            if (!status.matches("pending|confirmed|cancelled|completed")) {
                return Result.error("无效的状态值，支持的状态: pending, confirmed, cancelled, completed");
            }
            
            boolean success = appointmentService.updateStatus(id, status);
            if (success) {
                return Result.success("状态更新成功");
            } else {
                return Result.error("状态更新失败");
            }
        } catch (Exception e) {
            log.error("更新预约状态异常: {}", e.getMessage(), e);
            return Result.error("更新失败");
        }
    }

    @Operation(summary = "取消预约")
    @PutMapping("/{id}/cancel")
    public Result<String> cancelAppointment(
            @Parameter(description = "预约ID") @PathVariable Long id,
            @Parameter(description = "手机号") @RequestParam String phoneNumber) {
        try {
            boolean success = appointmentService.cancelAppointment(id, phoneNumber);
            if (success) {
                return Result.success("预约取消成功");
            } else {
                return Result.error("预约取消失败，请检查预约ID和手机号是否正确");
            }
        } catch (Exception e) {
            log.error("取消预约异常: {}", e.getMessage(), e);
            return Result.error("取消失败");
        }
    }

    @Operation(summary = "更新预约记录")
    @PutMapping("/{id}")
    public Result<String> updateAppointment(
            @Parameter(description = "预约ID") @PathVariable Long id,
            @RequestBody Appointment appointment) {
        try {
            // 验证预约记录是否存在
            Appointment existingAppointment = appointmentService.getById(id);
            if (existingAppointment == null) {
                return Result.error("预约记录不存在");
            }
            
            // 基本参数验证
            if (appointment.getPhoneNumber() == null || appointment.getPhoneNumber().trim().isEmpty()) {
                return Result.error("手机号不能为空");
            }
            if (appointment.getName() == null || appointment.getName().trim().isEmpty()) {
                return Result.error("姓名不能为空");
            }
            if (appointment.getScenicName() == null || appointment.getScenicName().trim().isEmpty()) {
                return Result.error("景点名称不能为空");
            }
            if (appointment.getAppointmentDate() == null) {
                return Result.error("预约日期不能为空");
            }
            if (appointment.getVisitorCount() == null || appointment.getVisitorCount() <= 0) {
                return Result.error("预约人数必须大于0");
            }
            
            // 设置ID和更新时间
            appointment.setId(id);
            appointment.setUpdatedAt(LocalDateTime.now());
            
            boolean success = appointmentService.updateById(appointment);
            if (success) {
                return Result.success("预约更新成功");
            } else {
                return Result.error("预约更新失败");
            }
        } catch (Exception e) {
            log.error("更新预约异常: {}", e.getMessage(), e);
            return Result.error("更新失败");
        }
    }

    @Operation(summary = "获取预约详情")
    @GetMapping("/{id}")
    public Result<Appointment> getAppointmentById(
            @Parameter(description = "预约ID") @PathVariable Long id) {
        try {
            Appointment appointment = appointmentService.getById(id);
            if (appointment != null) {
                return Result.success(appointment);
            } else {
                return Result.error("预约记录不存在");
            }
        } catch (Exception e) {
            log.error("查询预约详情异常: {}", e.getMessage(), e);
            return Result.error("查询失败");
        }
    }

    @Operation(summary = "统计某景点某日预约人数")
    @GetMapping("/count/visitors")
    public Result<Integer> countVisitors(
            @Parameter(description = "景点ID") @RequestParam Integer scenicId,
            @Parameter(description = "预约日期") @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date) {
        try {
            Integer count = appointmentService.countVisitorsByScenicIdAndDate(scenicId, date);
            return Result.success(count != null ? count : 0);
        } catch (Exception e) {
            log.error("统计预约人数异常: {}", e.getMessage(), e);
            return Result.error("统计失败");
        }
    }

    @Operation(summary = "获取预约统计信息")
    @GetMapping("/statistics")
    public Result<Object> getStatistics() {
        try {
            Object statistics = appointmentService.getAppointmentStatistics();
            return Result.success(statistics);
        } catch (Exception e) {
            log.error("获取预约统计信息异常: {}", e.getMessage(), e);
            return Result.error("获取统计信息失败");
        }
    }

    @Operation(summary = "分页查询所有预约记录")
    @GetMapping("/page")
    public Result<IPage<Appointment>> getAppointmentsWithPage(
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") Integer page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") Integer size) {
        try {
            Page<Appointment> pageInfo = new Page<>(page, size);
            IPage<Appointment> result = appointmentService.page(pageInfo);
            return Result.success(result);
        } catch (Exception e) {
            log.error("分页查询预约记录异常: {}", e.getMessage(), e);
            return Result.error("查询失败");
        }
    }

    @Operation(summary = "获取所有预约记录")
    @GetMapping
    public Result<List<Appointment>> getAllAppointments() {
        try {
            List<Appointment> appointments = appointmentService.list();
            return Result.success(appointments);
        } catch (Exception e) {
            log.error("查询所有预约记录异常: {}", e.getMessage(), e);
            return Result.error("查询失败");
        }
    }

    @Operation(summary = "删除预约记录")
    @DeleteMapping("/{id}")
    public Result<String> deleteAppointment(
            @Parameter(description = "预约ID") @PathVariable Long id) {
        try {
            // 验证预约记录是否存在
            Appointment existingAppointment = appointmentService.getById(id);
            if (existingAppointment == null) {
                return Result.error("预约记录不存在");
            }
            
            boolean success = appointmentService.removeById(id);
            if (success) {
                return Result.success("预约删除成功");
            } else {
                return Result.error("预约删除失败");
            }
        } catch (Exception e) {
            log.error("删除预约异常: {}", e.getMessage(), e);
            return Result.error("删除失败");
        }
    }
}