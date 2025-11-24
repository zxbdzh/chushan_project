-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: scenic_db
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `guide_items`
--

DROP TABLE IF EXISTS `guide_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guide_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `views` int NOT NULL,
  `type` enum('全部','线路','吃喝','住宿','购物','其他') DEFAULT '全部',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guide_items`
--

LOCK TABLES `guide_items` WRITE;
/*!40000 ALTER TABLE `guide_items` DISABLE KEYS */;
INSERT INTO `guide_items` VALUES (1,'西贡小筑','揽月、摘星、观澜 听风、倚楼、闲涛 坐落在宜恩风情小镇','https://cn-sy1.rains3.com/webstack-vue/eb70c1a00e2e464c9abac8f02a4c429c.jpg',2416,'住宿'),(2,'石头院子民宿给给','石头院子的浪漫大概在于与世独立。这里有篝火、美食、温泉、星空','https://images.unsplash.com/photo-1577971132997-c10be9572b4a?q=80&w=1600&auto=format&fit=crop',955,'住宿'),(3,'茶舍小憩','一盏清茶，一段时光，体验传统茶文化的魅力','https://images.unsplash.com/photo-1545579133-99bb5ab189bd?q=80&w=1600&auto=format&fit=crop',383,'吃喝'),(4,'古街夜景','灯火阑珊处，感受古街的夜晚魅力','https://images.unsplash.com/photo-1495562569060-2eec283d3391?q=80&w=1600&auto=format&fit=crop',965,'其他'),(5,'这是住宿测试','123','https://cn-sy1.rains3.com/webstack-vue/b474c7f426c94afa85fc787ff7672cf6.webp',0,'其他');
/*!40000 ALTER TABLE `guide_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tourism_data`
--

DROP TABLE IF EXISTS `tourism_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tourism_data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` enum('parking','carousel','popular','featured','news','scenic','product') NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  `capacity` int DEFAULT NULL,
  `available` int DEFAULT NULL,
  `price` varchar(50) DEFAULT NULL,
  `tags` json DEFAULT NULL,
  `score` float DEFAULT NULL,
  `visit_count` varchar(50) DEFAULT NULL,
  `reservation_days` int DEFAULT NULL,
  `reservation_count` int DEFAULT NULL,
  `date` date DEFAULT NULL,
  `content` text,
  `url` varchar(255) DEFAULT NULL,
  `specs` json DEFAULT NULL,
  `time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建或修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tourism_data`
--

LOCK TABLES `tourism_data` WRITE;
/*!40000 ALTER TABLE `tourism_data` DISABLE KEYS */;
INSERT INTO `tourism_data` VALUES (1,'parking','锄山党校停车场','位于锄山党校正门右侧，可容纳小型车辆50辆，配备充电桩4个。停车场24小时开放，设有照明和监控设施。',NULL,52,33,'免费',NULL,NULL,NULL,8,NULL,NULL,NULL,NULL,NULL,'2025-03-10 22:45:35'),(2,'parking','内厝革命老区史迹馆停车场','位于史迹馆东侧，可停放小型车辆30辆。配备基础照明和安保设施，方便游客参观。',NULL,30,18,'免费',NULL,NULL,NULL,7,NULL,NULL,NULL,NULL,NULL,'2025-03-08 21:08:42'),(3,'parking','锄山公社停车场','锄山公社专属停车场，可容纳小型车辆40辆。24小时开放，配备完善的照明、监控和充电设施。',NULL,40,25,'免费',NULL,NULL,NULL,30,NULL,NULL,NULL,NULL,NULL,'2025-03-08 21:08:42'),(4,'carousel','锄山乡村党校',NULL,'https://picgo.cn-sy1.rains3.com/2025/03/9b7d5f177afc6f26e32a84bd407c6332.jpeg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-03-08 21:08:42'),(5,'carousel','内厝革命老区史迹馆',NULL,'https://picgo.cn-sy1.rains3.com/2025/03/05d79b27b8203c10cd8a694098761943.jpeg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-03-08 21:08:42'),(6,'carousel','锄山公社',NULL,'https://picgo.cn-sy1.rains3.com/2025/03/59828c87f1d49ee2706414050b02651c.jpeg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-03-08 21:08:42'),(7,'popular','锄山乡村党校',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'/pages/index/reservation/detail?id=18',NULL,'2025-03-08 21:08:42'),(8,'popular','内厝革命老区史迹馆',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'/pages/index/reservation/detail?id=19',NULL,'2025-03-08 21:08:42'),(9,'popular','锄山党校大礼堂',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'/pages/index/reservation/detail?id=20',NULL,'2025-03-08 21:08:42'),(10,'popular','锄山公社',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'/pages/index/reservation/detail?id=21',NULL,'2025-03-08 21:08:42'),(11,'featured','锄山乡村党校','进士楼改造，成乡村振兴基地','https://picgo.cn-sy1.rains3.com/2025/03/cc6cb8ada62aadd3b3dabe0516722edb.jpeg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'/pages/index/reservation/detail?id=18',NULL,'2025-03-08 21:08:42'),(12,'featured','内厝革命老区史迹馆','抗战历史中汲取爱国主义财富，为幸福生活而奋斗','https://picgo.cn-sy1.rains3.com/2025/03/f0ad7a218bb61caaac74be526ce1abd4.png',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'/pages/index/reservation/detail?id=19',NULL,'2025-03-08 21:08:42'),(13,'featured','锄山党校大礼堂','党员同志集中学习、举办文艺活动的理想场所','https://picgo.cn-sy1.rains3.com/2025/03/dbb9ae77a487f45b4524787de7097bc1.jpeg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'/pages/index/reservation/detail?id=20',NULL,'2025-03-08 21:08:42'),(14,'featured','锄山公社','一间以红色人文与泥土精神为主题的锄山公社','https://picgo.cn-sy1.rains3.com/2025/03/7959c6ed22e43ed68f4a2ca7507749ad.jpeg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'/pages/index/reservation/detail?id=21',NULL,'2025-03-08 21:08:42'),(15,'news','锄山野菊花文化节即将开幕','本届文化节将展示野菊花种植技艺，推出菊花茶品鉴、中药材知识讲座等特色活动','https://cn-sy1.rains3.com/webstack-vue/fb89096161f1437e914aca7b786c34c5.jpg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-09-15',NULL,NULL,NULL,'2025-03-10 15:59:27'),(16,'news','高山茶叶采摘体验开放预约','推出茶园观光采摘项目，游客可参与传统制茶工艺体验，了解有机茶叶种植技术','https://images.pexels.com/photos/8053655/pexels-photo-8053655.jpeg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-08-20',NULL,NULL,NULL,'2025-03-08 21:08:42'),(17,'news','乡村生态观光车正式运营','新增5条生态观光路线，连接高山茶园、竹林步道和传统民居群落','https://ts1.cn.mm.bing.net/th/id/R-C.30c774c1d9c6dafeed8b8e5e3e5e7d4f',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-08-01',NULL,NULL,NULL,'2025-03-08 21:08:42'),(18,'scenic','锄山乡村党校预约','锄山乡村党校是在进士楼基础上改造而成的乡村振兴基地,是新时代党员教育的重要场所。','https://picgo.cn-sy1.rains3.com/2025/03/cc6cb8ada62aadd3b3dabe0516722edb.jpeg',NULL,NULL,NULL,'[\"红色教育\", \"党建基地\", \"乡村振兴\"]',5,'2.3w',7,156,NULL,NULL,NULL,NULL,'2025-03-10 21:50:56'),(19,'scenic','内厝革命老区史迹馆预约','内厝革命老区史迹馆展示了当地革命历史,是重要的爱国主义教育基地。','https://picgo.cn-sy1.rains3.com/2025/03/f0ad7a218bb61caaac74be526ce1abd4.png',NULL,NULL,NULL,'[\"红色教育\", \"革命历史\", \"爱国主义教育\"]',4.7,'1.8w',7,89,NULL,NULL,NULL,NULL,'2025-03-08 21:08:42'),(20,'scenic','锄山党校大礼堂预约','锄山党校大礼堂是党员同志集中学习、举办文艺活动的理想场所。','https://picgo.cn-sy1.rains3.com/2025/03/dbb9ae77a487f45b4524787de7097bc1.jpeg',NULL,NULL,NULL,'[\"党建活动\", \"文化场所\", \"红色教育\"]',4.6,'1.5w',7,45,NULL,NULL,NULL,NULL,'2025-03-08 21:08:42'),(21,'scenic','锄山公社预约','一间以红色人文与泥土精神为主题的锄山公社。在锄山公社旧址上，改建民宿，食堂、住宿一应俱全。','https://picgo.cn-sy1.rains3.com/2025/03/7959c6ed22e43ed68f4a2ca7507749ad.jpeg',NULL,NULL,NULL,'[\"红色文化\", \"民宿体验\", \"乡村旅游\"]',4.9,'3.1w',30,267,NULL,NULL,NULL,NULL,'2025-03-08 21:08:42'),(22,'product','野菊花','野菊花是锄山地区常见的传统中药材，具有清热解毒，泻火平肝的功效。可用于治疗疔疮痈肿，目赤肿痛，头痛眩晕等病症。锄山野菊花生长在海拔800米以上的山区，无污染，药效显著。','https://picgo.cn-sy1.rains3.com/2025/03/1242b7eb4b2098ca1c5c0ef5b1952cfc.jpeg',NULL,NULL,NULL,'[\"传统中药\", \"清热解毒\", \"地道药材\"]',NULL,NULL,NULL,NULL,'2022-07-30',NULL,NULL,'{\"产地\": \"厦门市翔安区内厝镇锄山村\", \"功效\": \"清热解毒、明目、降压\", \"使用方法\": \"可泡茶饮用\", \"储存方法\": \"避光、通风、干燥处保存\", \"采摘时节\": \"秋季9-10月\"}','2025-03-08 21:08:42'),(23,'product','小米蕉','小米蕉是锄山特有的香蕉品种，果实细长，果肉细腻，香甜可口。富含维生素和矿物质，营养价值高，是当地特色水果之一','https://picgo.cn-sy1.rains3.com/2025/03/40ad49c3938bc8c7074781654fe7082c.jpg',NULL,NULL,NULL,'[\"天然纯正\", \"营养丰富\", \"本地特产\"]',NULL,NULL,NULL,NULL,'2022-07-30',NULL,NULL,'{\"产地\": \"厦门市翔安区内厝镇锄山村\", \"功效\": \"补充营养、润肺止咳、改善睡眠\", \"保质期\": \"24个月\", \"使用方法\": \"可直接食用或冲调饮用\", \"储存方法\": \"密封、避光、常温保存\", \"采收季节\": \"春秋两季\"}','2025-03-08 21:08:42'),(24,'product','蜂蜜','锄山蜂蜜采自深山野花，蜜源纯正，口感醇厚。富含多种维生素、矿物质和氨基酸，具有滋补养颜、润肺止咳的功效。采用传统养蜂技术，保证蜂蜜的天然品质。','https://picgo.cn-sy1.rains3.com/2025/03/3bdddc0e21040300128501709a607a38.jpg',NULL,NULL,NULL,'[\"新鲜采摘\", \"绿色食品\", \"应季美味\"]',NULL,NULL,NULL,NULL,'2022-07-30',NULL,NULL,'{\"产地\": \"厦门市翔安区内厝镇锄山村\", \"保质期\": \"7天\", \"储存方法\": \"冷藏保存\", \"营养价值\": \"富含膳食纤维、蛋白质、维生素\", \"采摘时节\": \"春季3-4月\", \"食用方法\": \"可炒食、煮汤或腌制\"}','2025-03-08 21:08:42'),(25,'product','高山茶叶','锄山高山茶采自海拔800米以上的茶园，采用有机种植方式，不使用化肥农药。茶叶形态优美，香气高雅，滋味醇厚，具有独特的高山茶韵。富含茶多酚、氨基酸等有益成分。','https://picgo.cn-sy1.rains3.com/2025/03/c36cb59ae5d4a8637d472a87ce5ded63.jpg',NULL,NULL,NULL,'[\"高山茶\", \"有机种植\", \"品质保证\"]',NULL,NULL,NULL,NULL,'2022-07-30',NULL,NULL,'{\"产地\": \"厦门市翔安区内厝镇锄山村\", \"功效\": \"提神醒脑、降火消暑、抗氧化\", \"等级\": \"特级\", \"保质期\": \"18个月\", \"储存方法\": \"密封、避光、干燥处保存\", \"采摘季节\": \"春季和秋季\"}','2025-03-08 21:08:42'),(26,'product','本地特色萝卜干','本地特色萝卜干采用传统工艺制作，选用新鲜本地萝卜，经过腌制、晾晒等工序精制而成。口感清脆爽口，咸鲜适中，可开胃健脾，是餐桌上的美味小菜。','https://picgo.cn-sy1.rains3.com/2025/03/91753a07ba06dd5b49f3bacad0148da1.jpeg',NULL,NULL,NULL,'[\"传统工艺\", \"开胃小菜\", \"地方特产\"]',NULL,NULL,NULL,NULL,'2022-07-30',NULL,NULL,'{\"产地\": \"厦门市翔安区内厝镇锄山村\", \"原料\": \"本地新鲜萝卜\", \"特色\": \"传统工艺制作，无添加剂\", \"保质期\": \"12个月\", \"储存方法\": \"密封、干燥处保存\", \"食用方法\": \"可直接食用或炒菜\"}','2025-03-08 21:08:42'),(27,'product','人参何首乌','人参何首乌是传统名贵中药材，具有补气养血、益精强身的功效。锄山所产人参何首乌生长环境优越，品质上乘，是滋补养生的上品。','https://picgo.cn-sy1.rains3.com/2025/03/3bdddc0e21040300128501709a607a38.jpg',NULL,NULL,NULL,'[\"名贵中药\", \"养生保健\", \"品质保证\"]',NULL,NULL,NULL,NULL,'2022-07-30',NULL,NULL,'{\"产地\": \"厦门市翔安区内厝镇锄山村\", \"功效\": \"补气养血、益精强身\", \"使用方法\": \"可泡酒或煲汤\", \"储存方法\": \"通风干燥处保存\", \"适用人群\": \"中老年人群\", \"采收时间\": \"秋季\"}','2025-03-08 21:08:42'),(28,'product','茶油','锄山茶油采用本地山茶籽冷榨而成，具有独特的茶香，富含不饱和脂肪酸。可用于烹饪，也可直接食用，具有降血脂、抗氧化的保健功效。','https://picgo.cn-sy1.rains3.com/2025/03/9629851e09669a2b9ce9d7de09bd3e12.png',NULL,NULL,NULL,'[\"纯天然\", \"压榨工艺\", \"健康食用油\"]',NULL,NULL,NULL,NULL,'2022-07-30',NULL,NULL,'{\"产地\": \"厦门市翔安区内厝镇锄山村\", \"原料\": \"山茶籽\", \"特色\": \"传统冷榨工艺，无添加\", \"保质期\": \"18个月\", \"储存方法\": \"避光、密封保存\", \"适用范围\": \"烹饪、凉拌、直接食用\"}','2025-03-08 21:08:42');
/*!40000 ALTER TABLE `tourism_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` bigint NOT NULL,
  `username` varchar(15) NOT NULL,
  `password` varchar(20) NOT NULL,
  `avatar` text NOT NULL,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'zxb','1q2w3e4r5t6y7u8i','https://picgo.cn-sy1.rains3.com/2025/02/a3afdbb7f0c3ada619fdfe7d16692fab.png','2025-03-08 19:13:58','2025-03-08 19:13:58'),(2,'Administrator','1q2w3e4r5t6y7u8i','https://picgo.cn-sy1.rains3.com/2025/02/a3afdbb7f0c3ada619fdfe7d16692fab.png','2025-03-09 20:44:45','2025-03-09 20:44:45');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-11 20:36:59
