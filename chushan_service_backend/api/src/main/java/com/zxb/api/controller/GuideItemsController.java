package com.zxb.api.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.zxb.api.domain.GuideItems;
import com.zxb.api.service.GuideItemsService;
import com.zxb.api.utils.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/guideItems")
@RequiredArgsConstructor
@Tag(name = "攻略相关")
public class GuideItemsController {
    private final GuideItemsService guideItemsService;

    @Operation(summary = "返回所有type")
    @GetMapping("/types")
    public Result<List<Object>> getGuideTypes() {
        List<GuideItems> all = guideItemsService.query().list();
        List<Object> guideTypes = all.stream()
                .map(GuideItems::getType)
                .distinct()
                .toList();
        return Result.success(guideTypes);
    }

    @Operation(summary = "根据id查询")
    @GetMapping("/{id}")
    public Result<GuideItems> getGuideItems(@PathVariable Long id) {
        GuideItems guideItems = guideItemsService.getById(id);
        return Result.success(guideItems);
    }

    @Operation(summary = "根据type查询")
    @GetMapping("/type/{type}")
    public Result<Object> getGuideItemsByType(@PathVariable String type, @RequestParam(required = false) Integer page, @RequestParam(required = false) Integer size) {
        // 分页查询逻辑
        if (page != null && size != null) {
            Page<GuideItems> pageInfo = new Page<>(page, size);
            IPage<GuideItems> pagedData = guideItemsService.findByTypeWithPage(type, pageInfo);
            return Result.success(pagedData);
        }

        // 无分页参数时返回全部数据
        List<GuideItems> allData = guideItemsService.findByType(type);
        return Result.success(allData);
    }

    @Operation(summary = "新增攻略")
    @PostMapping
    public Result<GuideItems> createGuideItem(@RequestBody GuideItems item) {
        GuideItems savedItem = guideItemsService.saveGuideItem(item);
        return savedItem != null ? Result.success(savedItem) : Result.error("创建失败");
    }

    @Operation(summary = "获取所有攻略")
    @GetMapping
    public Result<List<GuideItems>> getAllGuideItems() {
        List<GuideItems> allItems = guideItemsService.list();
        return Result.success(allItems);
    }

    @Operation(summary = "更新攻略")
    @PutMapping("/{id}")
    public Result<GuideItems> updateGuideItem(@PathVariable Long id, @RequestBody GuideItems item) {
        item.setId(Math.toIntExact(id));
        GuideItems updatedItem = guideItemsService.updateGuideItem(item);
        return updatedItem != null ? Result.success(updatedItem) : Result.error("更新失败");
    }

    @Operation(summary = "删除攻略")
    @DeleteMapping("/{id}")
    public Result<Void> deleteGuideItem(@PathVariable Long id) {
        boolean deleted = guideItemsService.deleteGuideItem(id);
        return deleted ? Result.success() : Result.error("删除失败");
    }


}
