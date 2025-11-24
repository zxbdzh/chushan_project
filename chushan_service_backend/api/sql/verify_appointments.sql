-- 验证预约表创建情况

-- 1. 查看表结构
DESCRIBE appointments;

-- 2. 查看表中的数据
SELECT 
    id,
    phone_number,
    name,
    scenic_name,
    appointment_date,
    appointment_time,
    visitor_count,
    status,
    created_at
FROM appointments
ORDER BY created_at DESC;

-- 3. 统计各状态的预约数量
SELECT 
    status,
    COUNT(*) as count
FROM appointments
GROUP BY status;

-- 4. 查看索引信息
SHOW INDEX FROM appointments;