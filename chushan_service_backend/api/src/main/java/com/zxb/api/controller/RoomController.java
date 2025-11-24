package com.zxb.api.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.zxb.api.domain.Room;
import com.zxb.api.service.RoomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 房间管理控制器
 * @author zxb
 */
@RestController
@RequestMapping("/api/rooms")
@Tag(name = "房间管理", description = "房间管理相关接口")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @GetMapping("/page")
    @Operation(summary = "分页查询房间列表")
    public Map<String, Object> getRoomPage(
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "房间类型") @RequestParam(required = false) String type,
            @Parameter(description = "房间状态") @RequestParam(required = false) String status) {
        
        Page<Room> roomPage = roomService.getRoomPage(page, size, type, status);
        
        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", "查询成功");
        result.put("data", roomPage);
        return result;
    }

    @GetMapping("/list")
    @Operation(summary = "查询所有房间列表")
    public Map<String, Object> getRoomList() {
        List<Room> rooms = roomService.list();
        
        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", "查询成功");
        result.put("data", rooms);
        return result;
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID查询房间详情")
    public Map<String, Object> getRoomById(@PathVariable Long id) {
        Room room = roomService.getById(id);
        
        Map<String, Object> result = new HashMap<>();
        if (room != null) {
            result.put("code", 200);
            result.put("message", "查询成功");
            result.put("data", room);
        } else {
            result.put("code", 404);
            result.put("message", "房间不存在");
        }
        return result;
    }

    @PostMapping
    @Operation(summary = "创建房间")
    public Map<String, Object> createRoom(@RequestBody Room room) {
        boolean success = roomService.save(room);
        
        Map<String, Object> result = new HashMap<>();
        if (success) {
            result.put("code", 200);
            result.put("message", "创建成功");
            result.put("data", room);
        } else {
            result.put("code", 500);
            result.put("message", "创建失败");
        }
        return result;
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新房间信息")
    public Map<String, Object> updateRoom(@PathVariable Long id, @RequestBody Room room) {
        room.setId(id);
        boolean success = roomService.updateById(room);
        
        Map<String, Object> result = new HashMap<>();
        if (success) {
            result.put("code", 200);
            result.put("message", "更新成功");
            result.put("data", room);
        } else {
            result.put("code", 500);
            result.put("message", "更新失败");
        }
        return result;
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除房间")
    public Map<String, Object> deleteRoom(@PathVariable Long id) {
        boolean success = roomService.removeById(id);
        
        Map<String, Object> result = new HashMap<>();
        if (success) {
            result.put("code", 200);
            result.put("message", "删除成功");
        } else {
            result.put("code", 500);
            result.put("message", "删除失败");
        }
        return result;
    }

    @GetMapping("/check-available/{id}")
    @Operation(summary = "检查房间是否可用")
    public Map<String, Object> checkRoomAvailable(
            @PathVariable Long id,
            @Parameter(description = "需要数量") @RequestParam Integer count) {
        
        boolean available = roomService.checkRoomAvailable(id, count);
        
        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", available ? "房间可用" : "房间不可用或数量不足");
        result.put("data", available);
        return result;
    }

}