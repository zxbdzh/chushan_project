-- 创建房间类型表
CREATE TABLE IF NOT EXISTS `room_types` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '房间类型ID',
  `label` varchar(50) NOT NULL COMMENT '类型名称',
  `value` varchar(50) NOT NULL COMMENT '类型值',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_value` (`value`) COMMENT '类型值唯一索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='房间类型表';

-- 插入默认房间类型数据
INSERT INTO `room_types` (`label`, `value`) VALUES
('单人间', '单人间'),
('双人间', '双人间'),
('套房', '套房'),
('总统套房', '总统套房')
ON DUPLICATE KEY UPDATE `label` = VALUES(`label`);