-- 创建预约表
-- 使用手机号而不是用户ID进行预约登记

CREATE TABLE `appointments` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '预约ID',
  `phone_number` varchar(20) NOT NULL COMMENT '预约人手机号',
  `name` varchar(50) NOT NULL COMMENT '预约人姓名',
  `scenic_id` int DEFAULT NULL COMMENT '景点ID，关联tourism_data表',
  `scenic_name` varchar(255) NOT NULL COMMENT '预约景点名称',
  `appointment_date` date NOT NULL COMMENT '预约日期',
  `appointment_time` time NOT NULL COMMENT '预约时间',
  `visitor_count` int NOT NULL DEFAULT 1 COMMENT '预约人数',
  `status` enum('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'pending' COMMENT '预约状态：待确认、已确认、已取消、已完成',
  `notes` text COMMENT '备注信息',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_phone_number` (`phone_number`),
  KEY `idx_appointment_date` (`appointment_date`),
  KEY `idx_status` (`status`),
  KEY `idx_scenic_id` (`scenic_id`),
  CONSTRAINT `fk_appointments_scenic` FOREIGN KEY (`scenic_id`) REFERENCES `tourism_data` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='预约表';

-- 插入示例数据
INSERT INTO `appointments` (`phone_number`, `name`, `scenic_id`, `scenic_name`, `appointment_date`, `appointment_time`, `visitor_count`, `status`, `notes`) VALUES
('13800138001', 'Zhang San', 18, 'Chushan Village Party School', '2025-01-15', '09:00:00', 2, 'confirmed', 'Group visit'),
('13800138002', 'Li Si', 19, 'Neicuo Revolutionary Site Museum', '2025-01-16', '14:00:00', 1, 'pending', 'Individual visit'),
('13800138003', 'Wang Wu', 21, 'Chushan Commune', '2025-01-17', '10:30:00', 4, 'confirmed', 'Family trip');