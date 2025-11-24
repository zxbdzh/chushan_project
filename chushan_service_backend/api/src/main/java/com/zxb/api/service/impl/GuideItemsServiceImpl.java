package com.zxb.api.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zxb.api.domain.GuideItems;
import com.zxb.api.service.GuideItemsService;
import com.zxb.api.mapper.GuideItemsMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

/**
* @author zxb
* @description 针对表【guide_items】的数据库操作Service实现
* @createDate 2025-03-10 22:52:40
*/
@Service
public class GuideItemsServiceImpl extends ServiceImpl<GuideItemsMapper, GuideItems>
    implements GuideItemsService{

    /**
     * 根据类型查询
     *
     * @param type
     * @return
     */
    public List<GuideItems> findByType(String type) {
        return lambdaQuery().eq(GuideItems::getType, type).list();
    }

    // 新增数据（修正）
    @Override
    public GuideItems saveGuideItem(GuideItems item) {
        if (item == null) return null;

        this.save(item);
        return item; // 返回包含生成ID的完整对象
    }

    // 更新数据（修正）
    @Override
    public GuideItems updateGuideItem(GuideItems item) {
        if (item.getId() == null) return null;

        // 双条件验证（ID+TYPE）
        boolean exists = lambdaQuery()
                .eq(GuideItems::getId, item.getId())
                .exists();

        if (!exists) return null;

        this.updateById(item);
        return item;
    }

    // 删除数据（修正）
    @Override
    public boolean deleteGuideItem(Long id) {
        return lambdaUpdate()
                .eq(GuideItems::getId, id)
                .remove();
    }

    @Override
    public IPage<GuideItems> findByTypeWithPage(String type, Page<GuideItems> page) {
        if (Objects.equals(type, "all")) return lambdaQuery().page(page);
        return lambdaQuery()
                .eq(GuideItems::getType, type)
                .page(page);
    }

}




