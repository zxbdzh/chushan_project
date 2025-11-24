package com.zxb.api.controller;

import com.zxb.api.domain.RoomType;
import com.zxb.api.service.RoomTypeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 房间类型管理控制器
 */
@RestController
@RequestMapping("/api/room-types")
@Tag(name = "房间类型管理", description = "房间类型管理相关接口")
public class RoomTypeController {

    @Autowired
    private RoomTypeService roomTypeService;

    @GetMapping
    @Operation(summary = "获取所有房间类型")
    public Map<String, Object> getRoomTypes() {
        List<RoomType> roomTypes = roomTypeService.getAllRoomTypes();
        
        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", "查询成功");
        result.put("data", roomTypes);
        return result;
    }

    @PostMapping
    @Operation(summary = "添加房间类型")
    public Map<String, Object> createRoomType(@RequestBody RoomType roomType) {
        Map<String, Object> result = new HashMap<>();
        
        // 检查类型值是否已存在
        if (roomTypeService.isValueExists(roomType.getValue(), null)) {
            result.put("code", 400);
            result.put("message", "类型值已存在");
            return result;
        }
        
        boolean success = roomTypeService.save(roomType);
        if (success) {
            result.put("code", 200);
            result.put("message", "添加成功");
            result.put("data", roomType);
        } else {
            result.put("code", 500);
            result.put("message", "添加失败");
        }
        return result;
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新房间类型")
    public Map<String, Object> updateRoomType(
            @Parameter(description = "房间类型ID") @PathVariable Long id,
            @RequestBody RoomType roomType) {
        Map<String, Object> result = new HashMap<>();
        
        // 检查房间类型是否存在
        RoomType existingRoomType = roomTypeService.getById(id);
        if (existingRoomType == null) {
            result.put("code", 404);
            result.put("message", "房间类型不存在");
            return result;
        }
        
        // 检查类型值是否已存在（排除当前记录）
        if (roomTypeService.isValueExists(roomType.getValue(), id)) {
            result.put("code", 400);
            result.put("message", "类型值已存在");
            return result;
        }
        
        roomType.setId(id);
        boolean success = roomTypeService.updateById(roomType);
        if (success) {
            result.put("code", 200);
            result.put("message", "更新成功");
            result.put("data", roomType);
        } else {
            result.put("code", 500);
            result.put("message", "更新失败");
        }
        return result;
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除房间类型")
    public Map<String, Object> deleteRoomType(
            @Parameter(description = "房间类型ID") @PathVariable Long id) {
        Map<String, Object> result = new HashMap<>();
        
        // 检查房间类型是否存在
        RoomType existingRoomType = roomTypeService.getById(id);
        if (existingRoomType == null) {
            result.put("code", 404);
            result.put("message", "房间类型不存在");
            return result;
        }
        
        boolean success = roomTypeService.removeById(id);
        if (success) {
            result.put("code", 200);
            result.put("message", "删除成功");
        } else {
            result.put("code", 500);
            result.put("message", "删除失败");
        }
        return result;
    }
}