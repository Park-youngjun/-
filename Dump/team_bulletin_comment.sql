-- MySQL dump 10.13  Distrib 8.0.27, for Win64 (x86_64)
--
-- Host: localhost    Database: team
-- ------------------------------------------------------
-- Server version	8.0.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bulletin_comment`
--

DROP TABLE IF EXISTS `bulletin_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bulletin_comment` (
  `bulletin_comment_no` int NOT NULL AUTO_INCREMENT,
  `bulletin_comment_content` varchar(20) DEFAULT NULL,
  `bulletin_comment_date` varchar(20) DEFAULT NULL,
  `bulletin_cmment_like_count` int DEFAULT NULL,
  `user_id` varchar(20) NOT NULL,
  `bulletin_no` int NOT NULL,
  `bulletin_comment_no2` int DEFAULT NULL,
  PRIMARY KEY (`bulletin_comment_no`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bulletin_comment`
--

LOCK TABLES `bulletin_comment` WRITE;
/*!40000 ALTER TABLE `bulletin_comment` DISABLE KEYS */;
INSERT INTO `bulletin_comment` VALUES (1,'10','2021-12-09 16:30:08',NULL,'a',1,NULL),(2,'100','2021-12-09 16:31:23',NULL,'a',1,NULL),(3,'1000','2021-12-09 16:32:07',NULL,'a',1,NULL),(4,'10000','2021-12-09 16:32:30',NULL,'a',1,NULL),(5,'100000','2021-12-09 16:33:05',NULL,'a',1,NULL),(6,'100000','2021-12-09 16:33:43',NULL,'a',1,NULL),(7,'100000','2021-12-09 16:34:23',NULL,'a',1,NULL),(8,'100000','2021-12-09 16:35:07',NULL,'a',1,NULL),(9,'100000\\','2021-12-09 16:35:29',NULL,'a',1,NULL),(10,'1000','2021-12-12 01:26:39',NULL,'a',1,NULL),(11,'10000','2021-12-12 01:28:29',NULL,'a',1,NULL),(12,'10000','2021-12-12 01:28:30',NULL,'a',1,NULL),(13,'10000','2021-12-12 01:28:44',NULL,'a',1,NULL),(14,'1000','2021-12-12 01:30:23',NULL,'a',1,NULL),(15,'1000','2021-12-12 01:30:37',NULL,'a',1,NULL),(16,'가','2021-12-12 01:39:10',NULL,'a',1,NULL);
/*!40000 ALTER TABLE `bulletin_comment` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-12-12  1:55:22
