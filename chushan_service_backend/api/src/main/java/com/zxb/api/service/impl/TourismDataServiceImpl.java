package com.zxb.api.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zxb.api.domain.TourismData;
import com.zxb.api.mapper.TourismDataMapper;
import com.zxb.api.service.TourismDataService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * @author zxb
 * @description 针对表【tourism_data】的数据库操作Service实现
 * @createDate 2025-03-08 21:02:06
 */
@Service
@Transactional
public class TourismDataServiceImpl extends ServiceImpl<TourismDataMapper, TourismData>
        implements TourismDataService {

    /**
     * 根据类型查询
     *
     * @param type
     * @return
     */
    public List<TourismData> findByType(String type) {
        return query().eq("type", type).list();
    }


    // 新增数据（修正）
    @Override
    public TourismData saveTourismData(TourismData data) {
        if (data == null) return null;

        // 自动填充创建时间（需实体类添加@TableField注解）
        data.setTime(LocalDateTime.now());

        this.save(data);
        return data; // 返回包含生成ID的完整对象
    }

    // 更新数据（修正）
    @Override
    public TourismData updateTourismData(TourismData data) {
        if (data.getId() == null) return null;

        // 双条件验证（ID+TYPE）
        boolean exists = lambdaQuery()
                .eq(TourismData::getId, data.getId())
                .eq(TourismData::getType, data.getType())
                .exists();

        if (!exists) return null;

        // 自动更新修改时间
        data.setTime(LocalDateTime.now());
        this.updateById(data);
        return data;
    }

    // 删除数据（修正）
    @Override
    public boolean deleteTourismData(Long id, String type) {
        return lambdaUpdate()
                .eq(TourismData::getId, id)
                .eq(TourismData::getType, type)
                .remove();
    }

    @Override
    public IPage<TourismData> findByTypeWithPage(String type, Page<TourismData> page) {
        return lambdaQuery()
                .eq(TourismData::getType, type)
                .page(page);
    }

}




