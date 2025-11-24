package com.zxb.api.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.zxb.api.domain.GuideItems;

import java.util.List;

/**
 * @author zxb
 * @description 针对表【guide_items】的数据库操作Service
 * @createDate 2025-03-10 22:52:40
 */
public interface GuideItemsService extends IService<GuideItems> {


    List<GuideItems> findByType(String type);

    GuideItems saveGuideItem(GuideItems item);

    GuideItems updateGuideItem(GuideItems item);

    boolean deleteGuideItem(Long id);

    IPage<GuideItems> findByTypeWithPage(String type, Page<GuideItems> page);

}
