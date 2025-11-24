-- 创建房间表
CREATE TABLE `rooms` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '房间ID',
  `name` varchar(100) NOT NULL COMMENT '房间名称',
  `type` varchar(50) NOT NULL COMMENT '房间类型',
  `description` text COMMENT '房间描述',
  `image` varchar(500) COMMENT '房间图片',
  `total_count` int NOT NULL DEFAULT 0 COMMENT '房间总数量',
  `available_count` int NOT NULL DEFAULT 0 COMMENT '可用数量',
  `price` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT '房间价格',
  `status` enum('active','inactive') NOT NULL DEFAULT 'active' COMMENT '房间状态：可用、不可用',
  `facilities` text COMMENT '房间设施',
  `area` varchar(50) COMMENT '房间面积',
  `max_occupancy` int COMMENT '最大容纳人数',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='房间表';

-- 创建房间预约表
CREATE TABLE `room_reservations` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '预约ID',
  `room_id` bigint NOT NULL COMMENT '房间ID',
  `room_name` varchar(100) NOT NULL COMMENT '房间名称',
  `room_type` varchar(50) NOT NULL COMMENT '房间类型',
  `customer_name` varchar(50) NOT NULL COMMENT '预约人姓名',
  `phone_number` varchar(20) NOT NULL COMMENT '预约人手机号',
  `id_card` varchar(18) NOT NULL COMMENT '预约人身份证号',
  `reservation_date` date NOT NULL COMMENT '预约日期',
  `check_in_time` time NOT NULL COMMENT '入住时间',
  `check_out_time` time NOT NULL COMMENT '退房时间',
  `room_count` int NOT NULL DEFAULT 1 COMMENT '预约房间数量',
  `total_price` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT '总价格',
  `status` enum('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'pending' COMMENT '预约状态：待确认、已确认、已取消、已完成',
  `notes` text COMMENT '备注信息',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_room_id` (`room_id`),
  KEY `idx_phone_number` (`phone_number`),
  KEY `idx_id_card` (`id_card`),
  KEY `idx_reservation_date` (`reservation_date`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_room_reservations_room_id` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='房间预约表';

-- 插入示例房间数据
INSERT INTO `rooms` (`name`, `type`, `description`, `total_count`, `available_count`, `price`, `status`, `facilities`, `area`, `max_occupancy`) VALUES
('标准单人间', '单人间', '舒适的标准单人间，配备基础设施', 10, 10, 128.00, 'active', '空调,WiFi,电视,独立卫浴', '20㎡', 1),
('豪华双人间', '双人间', '宽敞的豪华双人间，设施齐全', 8, 8, 268.00, 'active', '空调,WiFi,电视,独立卫浴,迷你吧', '35㎡', 2),
('家庭套房', '套房', '适合家庭入住的套房，空间宽敞', 5, 5, 388.00, 'active', '空调,WiFi,电视,独立卫浴,客厅,厨房', '60㎡', 4),
('商务套房', '套房', '高端商务套房，适合商务人士', 3, 3, 588.00, 'active', '空调,WiFi,电视,独立卫浴,办公区,会客厅', '80㎡', 2),
('总统套房', '总统套房', '顶级总统套房，奢华体验', 1, 1, 1288.00, 'active', '空调,WiFi,电视,独立卫浴,客厅,餐厅,书房,阳台', '150㎡', 6);

-- 验证表创建
SELECT 'rooms表创建成功' as message;
DESCRIBE rooms;

SELECT 'room_reservations表创建成功' as message;
DESCRIBE room_reservations;

SELECT '示例数据插入成功' as message;
SELECT * FROM rooms;