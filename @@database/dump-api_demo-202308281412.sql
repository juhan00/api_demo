-- MariaDB dump 10.17  Distrib 10.4.11-MariaDB, for osx10.10 (x86_64)
--
-- Host: localhost    Database: api_demo
-- ------------------------------------------------------
-- Server version	10.4.11-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `board_1`
--

DROP TABLE IF EXISTS `board_1`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `board_1` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `content` varchar(500) DEFAULT NULL,
  `uuid` varchar(100) NOT NULL,
  `datetime` datetime NOT NULL,
  `video_type` varchar(100) DEFAULT NULL,
  `video_link` varchar(100) DEFAULT NULL,
  `category_uuid` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `board_1`
--

LOCK TABLES `board_1` WRITE;
/*!40000 ALTER TABLE `board_1` DISABLE KEYS */;
INSERT INTO `board_1` VALUES (6,'235423','45235325234','b20a9075-4bec-4524-82c2-678bd88294a2','2023-08-23 20:47:15','youtube','5435435','16a68677-c2e7-4d4f-8281-62f8162dee07'),(7,'435353','45345345','d2cd4ecd-6ae8-4327-a38c-521ee71b7020','2023-08-24 10:18:02','youtube','','16a68677-c2e7-4d4f-8281-62f8162dee07'),(8,'435353','45345345','929cea0f-35c5-4e4d-a905-667cd68c388a','2023-08-24 10:18:04','youtube','','16a68677-c2e7-4d4f-8281-62f8162dee07'),(9,'647464','4562424','63540a24-6579-4ee3-893f-a042377f13eb','2023-08-24 10:20:00','youtube','435435345345','d96fbf40-02b3-4eeb-920c-49adb375677e'),(10,'23','235235235','4602ff5e-8e06-4536-a97a-fda0800e406c','2023-08-24 10:20:27','youtube','','d96fbf40-02b3-4eeb-920c-49adb375677e'),(11,'4326246436433','345345345345345','f9e37966-b3a5-4363-8d1d-83fe64ded1ba','2023-08-24 10:21:30','youtube','','d96fbf40-02b3-4eeb-920c-49adb375677e'),(12,'3424234','23534534535325','e72a568b-8369-463a-9465-90d5380314aa','2023-08-24 10:22:28','youtube','','d96fbf40-02b3-4eeb-920c-49adb375677e'),(13,'ㅎㅇㅁㅎ','ㄹㅎㅁㅎㅎㄷㄱㅎㄷㄱㅎ','202f91d0-5031-47c7-bac1-38028a870038','2023-08-24 10:23:40','youtube','','d96fbf40-02b3-4eeb-920c-49adb375677e'),(14,'2452ㅎㅇㄹㅎㅇㄹㅎ','ㅇㅎㄹㅇㅎㅇㅎㄹㄷㄱㅎ','c82b21bf-8b2a-4764-99cc-51df4fabd7d4','2023-08-24 10:23:46','youtube','','5f8839de-e88f-470f-8790-2d9abd97ed1a'),(15,'32423ㄱㄷㄹㄴㅇㄹㄴ','ㄹㄴㅇㄹㄹㅈㄹㅎㄷ','415c5eb5-8911-47b8-9f5f-081193afca4c','2023-08-24 10:23:52','youtube','','5f8839de-e88f-470f-8790-2d9abd97ed1a'),(16,'324234ㅈㄹ','ㄷㄱㄹㄷㄱㅈㄹㅎㅈㄷㄱㄹㅈㄷㄹ','ed0ca343-8b5f-44eb-b1a2-77d22dbdde34','2023-08-24 10:23:57','youtube','','5f8839de-e88f-470f-8790-2d9abd97ed1a'),(17,'ㄱ45322344','ㄱㄹㄷㄹㅎㄷㄱㅎㄹㄷㄱㄹㄱㅅ','602edf23-9e0e-4e46-8c1a-9283c2b0332d','2023-08-24 10:24:04','youtube','','5f8839de-e88f-470f-8790-2d9abd97ed1a'),(18,'42423ㄱㅈ','ㅇㄱㅎㅍㅇㄹㅎㄷㅇㄹㅎ','15a96051-d299-4af1-ae1d-ca3420eb6feb','2023-08-24 10:24:09','youtube','',''),(19,'234234ㅈ3','ㄱㄹㅈㄷㄹㄴㄷㄱㄹㅎㄷㄱㄹㄷ','67363ca7-579e-43ae-bd48-0165df5d112a','2023-08-24 10:24:15','youtube','','342424324'),(20,'435345','55345','669b6609-0eac-440f-b007-92e3b12844f1','2023-08-25 21:27:32','youtube','',''),(21,'435435','4355','531d9f33-63ea-4441-b885-640d514c5db0','2023-08-25 21:28:33','youtube','',''),(22,'435435','435435','fdbe8f40-5dbb-48ed-a474-d24ef66778c4','2023-08-25 21:29:00','youtube','',''),(23,'4353453','','aa035d14-a7eb-4f82-a970-3ed6061f77e7','2023-08-25 21:30:41','youtube','',''),(24,'34534545435','','3f80a054-23b7-46d5-ab07-fb8a4ad9b89b','2023-08-25 21:31:05','youtube','',''),(25,'43534535','','d3a60941-96ba-4c4b-b2de-25409be611c8','2023-08-25 21:31:34','youtube','',''),(26,'345435','34534534535','1963be26-c055-4866-a616-43da6cec9159','2023-08-25 21:32:53','youtube','',''),(27,'3534543','534543535','0f4654dd-453c-4117-ba4f-acaf452f35a7','2023-08-25 21:33:55','youtube','',''),(28,'53534','5435345','fef9b530-976a-45a6-9843-a85574ba3a41','2023-08-25 21:35:38','youtube','',''),(29,'5345345','345345435','105c101a-1bc6-405b-9959-cdfeff127645','2023-08-25 21:35:53','youtube','',''),(30,'535','3454353','c5c63869-b882-49a9-8264-d6c03bcac448','2023-08-25 21:36:09','youtube','',''),(31,'435345','43534535','cb971139-0f6f-4b13-95db-435a5b062e8d','2023-08-25 21:37:45','youtube','',''),(32,'34234','234234242','1c416279-6bff-496f-baee-8478ab735f5b','2023-08-25 21:42:14','youtube','','16a68677-c2e7-4d4f-8281-62f8162dee07'),(33,'345435','345345','60cd2b89-ede4-431a-8d64-37ebb297ddb5','2023-08-25 22:02:04','youtube','','16a68677-c2e7-4d4f-8281-62f8162dee07'),(34,'43535','345345','1198700c-cd72-4f07-ad59-ae3375fd88e1','2023-08-25 22:05:10','youtube','','16a68677-c2e7-4d4f-8281-62f8162dee07'),(35,'453535','4353535','d28b0061-d097-411c-9d2f-04955908f7d5','2023-08-25 22:09:49','youtube','','16a68677-c2e7-4d4f-8281-62f8162dee07'),(38,'43543','54353454325','25a8e7c5-2df6-4190-934b-0a97c1182851','2023-08-26 17:13:09','youtube','435355','16a68677-c2e7-4d4f-8281-62f8162dee07'),(39,'0000001','000000','01128fda-a97b-4075-812d-82d0b529dd97','2023-08-26 17:31:36','vimeo','3453453455345','16a68677-c2e7-4d4f-8281-62f8162dee07'),(40,'4352345','1111112','d79d778a-0ed1-480f-a946-91f6ef0bae60','2023-08-26 19:26:20','youtube','111111','16a68677-c2e7-4d4f-8281-62f8162dee07'),(41,'dsfsdfasadf','sdafgasdfdsafsadf','19476523-b1b6-4229-97cf-a8c59aeba8cd','2023-08-26 23:27:10','vimeo','45r345324','16a68677-c2e7-4d4f-8281-62f8162dee07');
/*!40000 ALTER TABLE `board_1` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `board_name` varchar(100) NOT NULL,
  `datetime` datetime NOT NULL,
  `category_uuid` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (11,'테스트11','board_1','2023-08-25 21:39:35','16a68677-c2e7-4d4f-8281-62f8162dee07'),(16,'4535345','board_1','2023-08-25 15:41:41','32aeb73c-c7aa-4e25-87f7-bb1421da7a20'),(18,'24','board_1','2023-08-25 21:16:08','528a65aa-ed72-4f43-982b-97cc4013008e');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `image_file`
--

DROP TABLE IF EXISTS `image_file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `image_file` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `file_name` varchar(100) NOT NULL,
  `board_uuid` varchar(100) NOT NULL,
  `og_file_name` varchar(100) NOT NULL,
  `datetime` datetime NOT NULL,
  `file_use_type` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `image_file`
--

LOCK TABLES `image_file` WRITE;
/*!40000 ALTER TABLE `image_file` DISABLE KEYS */;
INSERT INTO `image_file` VALUES (21,'64e9b09157cff.jpg','7d0299b2-bf32-45ba-aae9-373f501ea1a2','플랜디브로고.jpg','2023-08-26 16:58:09','image1'),(22,'64e9b6b845770.png','fa5d0ef6-2072-48c2-8fe2-17abf6fba2b9','PLANDIV.png','2023-08-26 17:24:24','image2'),(23,'64e9b6b8459cc.jpg','fa5d0ef6-2072-48c2-8fe2-17abf6fba2b9','플랜디브로고.jpg','2023-08-26 17:24:24','image1'),(24,'64e9b754e5ce6.png','020a7b45-0515-4d3f-a569-125701a91830','PLANDIV.png','2023-08-26 17:27:00','image2'),(25,'64e9b754e5f93.jpg','020a7b45-0515-4d3f-a569-125701a91830','플랜디브로고.jpg','2023-08-26 17:27:00','image1'),(26,'64e9b767c82c7.png','0dfc4894-3163-4ed2-b8ad-30ad24b7b6d2','PLANDIV.png','2023-08-26 17:27:19','image2'),(27,'64e9b767c84cf.jpg','0dfc4894-3163-4ed2-b8ad-30ad24b7b6d2','플랜디브로고.jpg','2023-08-26 17:27:19','image1'),(28,'64e9b78cde620.png','345cb854-e1b7-4433-b115-9f750965cde9','PLANDIV.png','2023-08-26 17:27:56','image2'),(29,'64e9b78cde5f5.jpg','345cb854-e1b7-4433-b115-9f750965cde9','플랜디브로고.jpg','2023-08-26 17:27:56','image1'),(30,'64e9b801116ad.jpg','0e36b8e6-169a-44fe-934f-7f10ea190401','플랜디브로고.jpg','2023-08-26 17:29:53','image1'),(31,'64e9b801115ed.png','0e36b8e6-169a-44fe-934f-7f10ea190401','PLANDIV.png','2023-08-26 17:29:53','image2'),(77,'64ebec65d222f.png','19476523-b1b6-4229-97cf-a8c59aeba8cd','PLANDIV.png','2023-08-28 09:37:57','image1');
/*!40000 ALTER TABLE `image_file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'api_demo'
--
