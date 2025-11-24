package com.zxb.api.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.zxb.api.domain.TourismData;
import com.zxb.api.service.TourismDataService;
import com.zxb.api.utils.Result;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@Tag(name = "旅游信息相关")
@RequestMapping("/tourism")
@RequiredArgsConstructor
public class TourismController {
    private final TourismDataService tourismService;

    @GetMapping("/type")
    public Result<Object> getTourismData(
            @RequestParam String type,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {

        // 分页查询逻辑
        if (page != null && size != null) {
            Page<TourismData> pageInfo = new Page<>(page, size);
            IPage<TourismData> pagedData = tourismService.findByTypeWithPage(type, pageInfo);
            return Result.success(pagedData);
        }

        // 无分页参数时返回全部数据
        List<TourismData> allData = tourismService.findByType(type);
        return Result.success(allData);
    }
    // 新增数据（Create）
    @PostMapping
    public Result<TourismData> createTourismData(@RequestBody TourismData data) {
        TourismData savedData = tourismService.saveTourismData(data);
        return savedData != null ? Result.success(savedData) : Result.error("创建失败");
    }

    // 按type更新数据（Update）
    @PutMapping("/{id}")
    public Result<TourismData> updateTourismData(
            @PathVariable Long id,
            @RequestParam String type,
            @RequestBody TourismData data) {
        data.setId(Math.toIntExact(id));
        data.setType(type);
        TourismData updatedData = tourismService.updateTourismData(data);
        return updatedData != null ? Result.success(updatedData) : Result.error("更新失败");
    }

    // 按type删除数据（Delete）
    @DeleteMapping("/{id}")
    public Result<Void> deleteTourismData(@PathVariable Long id, @RequestParam String type) {
        boolean deleted = tourismService.deleteTourismData(id, type);
        return deleted ? Result.success() : Result.error("删除失败");
    }


}
