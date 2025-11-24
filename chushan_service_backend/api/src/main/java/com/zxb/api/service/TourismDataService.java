package com.zxb.api.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.zxb.api.domain.TourismData;

import java.util.List;

/**
 * @author zxb
 * @description 针对表【tourism_data】的数据库操作Service
 * @createDate 2025-03-08 21:02:06
 */
public interface TourismDataService extends IService<TourismData> {

    /**
     * 根据类型查询
     *
     * @param type
     * @return
     */
    List<TourismData> findByType(String type);

    /**
     * 新增
     *
     * @param data
     * @return
     */
    TourismData saveTourismData(TourismData data);

    /**
     * 修改
     *
     * @param data
     * @return
     */
    TourismData updateTourismData(TourismData data);

    /**
     * 删除
     *
     * @param id
     * @param type
     * @return
     */
    boolean deleteTourismData(Long id, String type);


    IPage<TourismData> findByTypeWithPage(String type, Page<TourismData> pageInfo);
}
