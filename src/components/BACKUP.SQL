-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: school_system
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `activities`
--

DROP TABLE IF EXISTS `activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` varchar(20) NOT NULL,
  `action` varchar(255) NOT NULL,
  `course` varchar(100) DEFAULT NULL,
  `type` enum('enrollment','fee','attendance','result','general') DEFAULT 'general',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `activities_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activities`
--

LOCK TABLES `activities` WRITE;
/*!40000 ALTER TABLE `activities` DISABLE KEYS */;
INSERT INTO `activities` VALUES (31,'STU001','New Enrollment','Computer Packages','enrollment','2025-09-13 08:58:44'),(32,'STU002','New Enrollment','Computer Packages','enrollment','2025-09-13 08:58:44'),(33,'STU003','New Enrollment','Computer Packages','enrollment','2025-09-13 08:58:44'),(34,'STU004','New Enrollment','Computer Packages','enrollment','2025-09-13 08:58:44'),(35,'STU005','New Enrollment','Computer Packages','enrollment','2025-09-13 08:58:44'),(36,'STU006','New Enrollment','Computer Packages','enrollment','2025-09-13 08:58:44'),(37,'STU007','New Enrollment','Computer Packages','enrollment','2025-09-13 08:58:44'),(38,'STU008','New Enrollment','Computer Packages','enrollment','2025-09-13 08:58:44'),(39,'STU009','New Enrollment','Computer Packages','enrollment','2025-09-13 08:58:44'),(41,'STU011','New Enrollment','Computer Packages','enrollment','2025-09-13 08:58:44'),(42,'STU012','New Enrollment','Computer Packages','enrollment','2025-09-13 08:58:44'),(43,'STU013','New Enrollment','Computer Packages','enrollment','2025-09-13 08:58:44'),(45,'STU015','New Enrollment','Computer Packages','enrollment','2025-09-13 08:58:44'),(46,'STU016','New Enrollment','Computer Packages','enrollment','2025-09-13 08:58:44'),(49,'STU019','New Enrollment','Computer Packages','enrollment','2025-09-13 08:58:44'),(50,'STU020','New Enrollment','Computer Packages','enrollment','2025-09-13 08:58:44'),(51,'STU021','New Enrollment','Computer Packages','enrollment','2025-09-13 08:58:44'),(53,'STU023','New Enrollment','Computer Packages','enrollment','2025-09-13 08:58:44'),(55,'STU025','New Enrollment','Computer Packages','enrollment','2025-09-13 08:58:44'),(57,'STU028','New Enrollment','Photography','enrollment','2025-09-14 18:55:34'),(58,'STU029','New Enrollment','Photography','enrollment','2025-09-14 19:06:08'),(59,'STU029','Fee Payment',NULL,'fee','2025-09-14 19:29:50'),(60,'STU029','Fee Payment',NULL,'fee','2025-09-14 19:36:15'),(61,'STU001','Fee Payment',NULL,'fee','2025-09-14 19:38:08'),(62,'STU001','Fee Payment',NULL,'fee','2025-09-14 19:38:28'),(63,'STU006','Fee Payment',NULL,'fee','2025-09-14 19:39:30'),(64,'STU030','New Enrollment','Computer Packages','enrollment','2025-09-14 19:42:31'),(70,'STU031','New Enrollment','Graphics Designs','enrollment','2025-09-15 07:40:05'),(71,'STU031','Fee Payment',NULL,'fee','2025-09-15 07:40:57'),(72,'STU032','New Enrollment','Computer Packages','enrollment','2025-09-15 10:31:15'),(73,'STU032','Fee Payment',NULL,'fee','2025-09-15 10:32:07'),(76,'STU003','Fee Payment',NULL,'fee','2025-09-17 20:22:52'),(77,'STU003','Fee Payment',NULL,'fee','2025-09-17 20:23:00'),(78,'STU003','Fee Payment',NULL,'fee','2025-09-17 20:23:07'),(79,'STU003','Fee Payment',NULL,'fee','2025-09-17 20:25:24'),(80,'STU003','Fee Payment',NULL,'fee','2025-09-17 20:25:32'),(81,'STU003','Fee Payment',NULL,'fee','2025-09-17 20:26:36'),(82,'STU003','Fee Payment',NULL,'fee','2025-09-17 20:31:36'),(83,'STU003','Fee Payment',NULL,'fee','2025-09-17 20:32:20'),(84,'STU003','Fee Payment',NULL,'fee','2025-09-17 20:34:46'),(86,'STU001','Exam Result Added','Computer Packages','result','2025-09-18 07:04:23'),(87,'STU034','New Enrollment','Computer Packages','enrollment','2025-09-19 10:50:20'),(88,'STU034','Fee Payment',NULL,'fee','2025-09-19 10:51:48'),(89,'STU035','New Enrollment','Computer Packages','enrollment','2025-09-19 11:04:59'),(90,'STU035','Fee Payment',NULL,'fee','2025-09-19 11:05:59'),(91,'STU036','New Enrollment','Graphics Designs','enrollment','2025-09-19 14:32:43'),(92,'STU036','Fee Payment',NULL,'fee','2025-09-19 14:33:28'),(93,'STU037','New Enrollment','Web Design','enrollment','2025-09-24 17:58:49'),(94,'STU037','Fee Payment',NULL,'fee','2025-09-24 18:01:39'),(95,'STU037','Fee Payment',NULL,'fee','2025-09-25 10:47:32'),(96,'STU038','New Enrollment','AI ','enrollment','2025-09-29 06:58:03'),(97,'STU037','Fee Payment',NULL,'fee','2025-09-29 07:43:46'),(98,'STU039','New Enrollment','Videography','enrollment','2025-10-01 10:24:18'),(99,'STU039','Fee Payment',NULL,'fee','2025-10-01 10:25:39'),(100,'STU040','New Enrollment','Cyber Security','enrollment','2025-10-02 14:03:59'),(101,'STU040','Fee Payment',NULL,'fee','2025-10-02 14:05:31'),(102,'STU041','New Enrollment','Cyber Security','enrollment','2025-10-02 20:57:43'),(103,'STU041','Fee Payment',NULL,'fee','2025-10-02 20:59:04'),(104,'STU041','Fee Payment',NULL,'fee','2025-10-02 21:00:01'),(105,'STU042','New Enrollment','Graphic Design','enrollment','2025-10-15 23:09:53'),(106,'STU042','Fee Payment',NULL,'fee','2025-10-15 23:19:10'),(107,'STU001','Attendance Marked','Computer Packages','attendance','2025-10-22 07:04:07'),(108,'STU001','Attendance Marked','Computer Packages','attendance','2025-10-22 07:04:43');
/*!40000 ALTER TABLE `activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` varchar(20) NOT NULL,
  `course_id` int NOT NULL,
  `attendance_date` date NOT NULL,
  `status` varchar(20) DEFAULT 'present',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_attendance_student` (`student_id`),
  KEY `fk_attendance_course` (`course_id`),
  CONSTRAINT `fk_attendance_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  CONSTRAINT `fk_attendance_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  CONSTRAINT `fk_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  CONSTRAINT `fk_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES (1,'STU001',1,'2025-08-08','present','2025-10-22 07:04:07'),(3,'STU001',1,'2025-08-08','present','2025-10-22 07:04:43');
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `log_attendance_activity` AFTER INSERT ON `attendance` FOR EACH ROW BEGIN
  DECLARE course_name VARCHAR(100);
  SELECT name INTO course_name FROM courses WHERE id = NEW.course_id;

  INSERT INTO activities (student_id, action, course, type)
  VALUES (NEW.student_id, 'Attendance Marked', course_name, 'attendance');
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `branches`
--

DROP TABLE IF EXISTS `branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `location` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branches`
--

LOCK TABLES `branches` WRITE;
/*!40000 ALTER TABLE `branches` DISABLE KEYS */;
INSERT INTO `branches` VALUES (1,'Main Branch','Mathare','2025-09-11 05:52:01'),(2,'Sub-Branch','Kakamega','2025-10-15 00:43:37');
/*!40000 ALTER TABLE `branches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_facilities`
--

DROP TABLE IF EXISTS `course_facilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_facilities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `facility_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `course_id` (`course_id`),
  KEY `facility_id` (`facility_id`),
  CONSTRAINT `course_facilities_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `course_facilities_ibfk_2` FOREIGN KEY (`facility_id`) REFERENCES `facilities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_facilities`
--

LOCK TABLES `course_facilities` WRITE;
/*!40000 ALTER TABLE `course_facilities` DISABLE KEYS */;
INSERT INTO `course_facilities` VALUES (1,1,1),(2,2,1),(3,2,2),(6,5,3);
/*!40000 ALTER TABLE `course_facilities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `department_id` int DEFAULT NULL,
  `duration_months` int DEFAULT '3',
  `description` text,
  `fee` decimal(10,2) DEFAULT NULL,
  `capacity` int DEFAULT '30',
  `enrolled` int DEFAULT '0',
  `start_date` datetime DEFAULT NULL,
  `status` enum('Upcoming','Active','Completed') DEFAULT 'Upcoming',
  PRIMARY KEY (`id`),
  KEY `fk_course_department` (`department_id`),
  CONSTRAINT `fk_course_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  CONSTRAINT `fk_courses_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,'Computer Packages',1,3,'AI Generation',NULL,50,0,'2025-02-01 21:00:00','Active'),(2,'AI ',1,3,'Focus on Kali Linux',15000.00,50,0,NULL,'Active'),(5,'Photography',1,4,NULL,4000.00,50,0,NULL,'Active'),(10,'Cyber Sec',1,3,'Focus on Kali Linux',1350.00,59,0,NULL,'Active'),(11,'Graphic Design',1,3,'AI Generating Designs',490.00,45,0,NULL,'Active');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `CustomerID` int DEFAULT NULL,
  `CustomerName` char(20) DEFAULT NULL,
  `Description` char(30) DEFAULT NULL,
  `Amount` decimal(10,0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `fee_charge` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'ICT',1350.00),(3,'Film Production',4000.00),(4,'Fashion Design',3500.00),(5,'Business',2500.00);
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enrollments`
--

DROP TABLE IF EXISTS `enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enrollments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` varchar(20) DEFAULT NULL,
  `course_id` int DEFAULT NULL,
  `intake_id` int DEFAULT NULL,
  `enrollment_date` date NOT NULL DEFAULT (curdate()),
  `status` enum('Enrolled','Completed','Dropped') DEFAULT 'Enrolled',
  PRIMARY KEY (`id`),
  KEY `fk_enroll_student` (`student_id`),
  KEY `fk_enroll_course` (`course_id`),
  KEY `fk_enroll_intake` (`intake_id`),
  CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `enrollments_ibfk_3` FOREIGN KEY (`intake_id`) REFERENCES `intakes` (`id`),
  CONSTRAINT `fk_enroll_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  CONSTRAINT `fk_enroll_intake` FOREIGN KEY (`intake_id`) REFERENCES `intakes` (`id`),
  CONSTRAINT `fk_enroll_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  CONSTRAINT `fk_enrollment_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  CONSTRAINT `fk_enrollment_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollments`
--

LOCK TABLES `enrollments` WRITE;
/*!40000 ALTER TABLE `enrollments` DISABLE KEYS */;
INSERT INTO `enrollments` VALUES (29,'STU001',1,3,'2025-09-13','Enrolled'),(30,'STU002',1,3,'2025-09-13','Enrolled'),(31,'STU003',1,3,'2025-09-13','Enrolled'),(32,'STU004',1,3,'2025-09-13','Enrolled'),(33,'STU005',1,3,'2025-09-13','Enrolled'),(34,'STU006',1,3,'2025-09-13','Enrolled'),(35,'STU007',1,3,'2025-09-13','Enrolled'),(36,'STU008',1,3,'2025-09-13','Enrolled'),(37,'STU009',1,3,'2025-09-13','Enrolled'),(39,'STU011',1,3,'2025-09-13','Enrolled'),(40,'STU012',1,3,'2025-09-13','Enrolled'),(41,'STU013',1,3,'2025-09-13','Enrolled'),(43,'STU015',1,3,'2025-09-13','Enrolled'),(44,'STU016',1,3,'2025-09-13','Enrolled'),(47,'STU019',1,3,'2025-09-13','Enrolled'),(48,'STU020',1,3,'2025-09-13','Enrolled'),(49,'STU021',1,3,'2025-09-13','Enrolled'),(51,'STU023',5,3,'2025-09-13','Enrolled'),(53,'STU025',1,3,'2025-09-13','Enrolled'),(55,'STU028',5,2,'2025-09-14','Enrolled'),(56,'STU029',5,3,'2025-09-14','Enrolled'),(57,'STU030',1,1,'2025-09-14','Enrolled'),(59,'STU031',2,3,'2025-09-15','Enrolled'),(60,'STU032',1,3,'2025-09-15','Enrolled'),(62,'STU034',1,3,'2025-09-19','Enrolled'),(63,'STU035',1,3,'2025-09-19','Enrolled'),(64,'STU036',2,3,'2025-09-19','Enrolled'),(66,'STU038',2,2,'2025-09-29','Enrolled'),(68,'STU040',10,2,'2025-10-02','Enrolled'),(69,'STU041',10,3,'2025-10-02','Enrolled'),(70,'STU042',11,2,'2025-10-16','Enrolled');
/*!40000 ALTER TABLE `enrollments` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `set_default_enrollment_date` BEFORE INSERT ON `enrollments` FOR EACH ROW SET NEW.enrollment_date = CURDATE() */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `log_enrollment_activity` AFTER INSERT ON `enrollments` FOR EACH ROW BEGIN
  DECLARE course_name VARCHAR(100);
  SELECT name INTO course_name FROM courses WHERE id = NEW.course_id;

  INSERT INTO activities (student_id, action, course, type)
  VALUES (NEW.student_id, 'New Enrollment', course_name, 'enrollment');
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `update_student_department_accurate` AFTER INSERT ON `enrollments` FOR EACH ROW BEGIN
    DECLARE new_department_id INT;

    -- Get the department of the latest course enrollment for this student
    SELECT c.department_id
    INTO new_department_id
    FROM courses c
    JOIN enrollments e ON c.id = e.course_id
    WHERE e.student_id = NEW.student_id
    ORDER BY e.id DESC
    LIMIT 1;

    -- Update the student's department to match the latest enrollment
    IF new_department_id IS NOT NULL THEN
        UPDATE students
        SET department_id = new_department_id
        WHERE id = NEW.student_id;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_update_student_department_after_insert` AFTER INSERT ON `enrollments` FOR EACH ROW BEGIN
    DECLARE new_department_id INT;

    -- Get the department of the enrolled course
    SELECT department_id INTO new_department_id
    FROM courses
    WHERE id = NEW.course_id;

    -- Update student's department
    IF new_department_id IS NOT NULL THEN
        UPDATE students
        SET department_id = new_department_id
        WHERE id = NEW.student_id;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `set_student_department_after_enroll` AFTER INSERT ON `enrollments` FOR EACH ROW BEGIN
    DECLARE dept_id INT;

    -- Get the department of the course
    SELECT department_id INTO dept_id
    FROM courses
    WHERE id = NEW.course_id;

    -- Update student's department
    IF dept_id IS NOT NULL THEN
        UPDATE students
        SET department_id = dept_id
        WHERE id = NEW.student_id;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `update_student_department_after_enroll` AFTER INSERT ON `enrollments` FOR EACH ROW BEGIN
    DECLARE dept_id INT;

    -- Fix here: use id instead of course_id
    SELECT department_id INTO dept_id
    FROM courses
    WHERE id = NEW.course_id;

    IF dept_id IS NOT NULL THEN
        UPDATE students
        SET department_id = dept_id
        WHERE id = NEW.student_id;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `create_fee_record_after_enrollment` AFTER INSERT ON `enrollments` FOR EACH ROW BEGIN
    DECLARE dept_fee DECIMAL(10,2);

    -- Get the department fee from the course
    SELECT d.fee_charge
    INTO dept_fee
    FROM courses c
    JOIN departments d ON c.department_id = d.id
    WHERE c.id = NEW.course_id
    LIMIT 1;

    -- Insert into fees if not already existing
    IF NOT EXISTS (SELECT 1 FROM fees WHERE student_id = NEW.student_id) THEN
        INSERT INTO fees (student_id, total_amount, amount_paid, payment_method, payment_date)
        VALUES (NEW.student_id, dept_fee, 0, NULL, NULL);
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `update_student_department` AFTER UPDATE ON `enrollments` FOR EACH ROW BEGIN
    DECLARE new_department_id INT;

    -- Get the department of the new course
    SELECT department_id INTO new_department_id
    FROM courses
    WHERE id = NEW.course_id;

    -- Update the student's department if different
    IF new_department_id IS NOT NULL AND new_department_id != OLD.course_id THEN
        UPDATE students
        SET department_id = new_department_id
        WHERE id = NEW.student_id;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `update_student_department_safe` AFTER UPDATE ON `enrollments` FOR EACH ROW BEGIN
    DECLARE new_department_id INT;

    -- Get the department of the new course
    SELECT department_id INTO new_department_id
    FROM courses
    WHERE id = NEW.course_id;

    -- Only update if student has no department yet
    IF new_department_id IS NOT NULL THEN
        UPDATE students
        SET department_id = new_department_id
        WHERE id = NEW.student_id
          AND (department_id IS NULL OR department_id = 0);
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `update_student_department_after_enroll_update` AFTER UPDATE ON `enrollments` FOR EACH ROW BEGIN
    DECLARE dept_id INT;

    SELECT department_id INTO dept_id
    FROM courses
    WHERE id = NEW.course_id;

    IF dept_id IS NOT NULL THEN
        UPDATE students
        SET department_id = dept_id
        WHERE id = NEW.student_id;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `exam_results`
--

DROP TABLE IF EXISTS `exam_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_results` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` varchar(20) NOT NULL,
  `average_mark` int DEFAULT NULL,
  `exam_status` enum('Pass','Fail','Incomplete') DEFAULT 'Incomplete',
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `exam_results_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_results`
--

LOCK TABLES `exam_results` WRITE;
/*!40000 ALTER TABLE `exam_results` DISABLE KEYS */;
/*!40000 ALTER TABLE `exam_results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `facilities`
--

DROP TABLE IF EXISTS `facilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facilities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `status` enum('Good','Needs Repair','Broken') DEFAULT 'Good',
  `image_url` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facilities`
--

LOCK TABLES `facilities` WRITE;
/*!40000 ALTER TABLE `facilities` DISABLE KEYS */;
INSERT INTO `facilities` VALUES (1,'Computer Lab','Modern lab with 50+ computers','Good',NULL),(2,'Graphics Studio','Equipped with design software','Good',NULL),(3,'Photography Studio','Professional cameras and lighting','Good',NULL),(4,'Fashion Workshop','Sewing machines and materials','Good',NULL),(5,'Computer Lab','Modern lab with 50+ computers','Good',NULL),(6,'Graphics Studio','Equipped with design software','Needs Repair',NULL),(7,'Photography Studio','Professional cameras and lighting','Broken',NULL),(8,'Fashion Workshop','Sewing machines and tailoring tools','Good',NULL),(9,'Library','Collection of reference and study materials','Good',NULL);
/*!40000 ALTER TABLE `facilities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `facility_repairs`
--

DROP TABLE IF EXISTS `facility_repairs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facility_repairs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `facility_id` int NOT NULL,
  `issue_reported` text NOT NULL,
  `repair_date` date DEFAULT NULL,
  `status` enum('Pending','In Progress','Completed') DEFAULT 'Pending',
  `image_url` text,
  PRIMARY KEY (`id`),
  KEY `facility_id` (`facility_id`),
  CONSTRAINT `facility_repairs_ibfk_1` FOREIGN KEY (`facility_id`) REFERENCES `facilities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facility_repairs`
--

LOCK TABLES `facility_repairs` WRITE;
/*!40000 ALTER TABLE `facility_repairs` DISABLE KEYS */;
INSERT INTO `facility_repairs` VALUES (1,2,'Software outdated, some PCs crash','2025-09-15','Completed',NULL),(2,3,'Main camera lens cracked','2025-09-15','Completed',NULL),(3,4,'2 sewing machines not working properly','2025-09-15','Completed',NULL),(4,1,'Air conditioning system failure','2025-08-20','Completed',NULL);
/*!40000 ALTER TABLE `facility_repairs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fees`
--

DROP TABLE IF EXISTS `fees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` varchar(20) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `amount_paid` decimal(10,2) DEFAULT NULL,
  `amount_pending` decimal(10,2) GENERATED ALWAYS AS (greatest((`total_amount` - `amount_paid`),0)) STORED,
  `is_paid` tinyint(1) GENERATED ALWAYS AS ((case when (`amount_pending` = 0) then 1 else 0 end)) STORED,
  `payment_method` enum('bank-transfer','credit-card','mobile-money','cash') DEFAULT NULL,
  `payment_date` timestamp NULL DEFAULT NULL,
  `overpaid` decimal(10,2) GENERATED ALWAYS AS (greatest((`amount_paid` - `total_amount`),0)) STORED,
  PRIMARY KEY (`id`),
  KEY `fk_fee_student` (`student_id`),
  CONSTRAINT `fees_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  CONSTRAINT `fk_fee_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  CONSTRAINT `fk_fees_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=194 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fees`
--

LOCK TABLES `fees` WRITE;
/*!40000 ALTER TABLE `fees` DISABLE KEYS */;
INSERT INTO `fees` (`id`, `student_id`, `total_amount`, `amount_paid`, `payment_method`, `payment_date`) VALUES (147,'STU001',1350.00,1550.00,'cash','2025-09-14 19:38:28'),(148,'STU002',1350.00,1350.00,NULL,NULL),(149,'STU003',1350.00,1270.00,'bank-transfer','2025-09-17 20:34:46'),(150,'STU004',1350.00,1350.00,NULL,NULL),(151,'STU005',1350.00,1000.00,NULL,NULL),(152,'STU006',1350.00,1100.00,'cash','2025-09-14 19:39:30'),(153,'STU007',1350.00,1350.00,NULL,NULL),(154,'STU008',1350.00,1000.00,NULL,NULL),(155,'STU009',1350.00,1000.00,NULL,NULL),(157,'STU011',1350.00,500.00,NULL,NULL),(158,'STU012',1350.00,850.00,NULL,NULL),(159,'STU013',1350.00,1350.00,NULL,NULL),(161,'STU015',1350.00,0.00,NULL,NULL),(162,'STU016',1350.00,1350.00,NULL,NULL),(165,'STU019',1350.00,1350.00,NULL,NULL),(166,'STU020',1350.00,1350.00,NULL,NULL),(167,'STU021',1350.00,0.00,NULL,NULL),(171,'STU025',1350.00,1350.00,NULL,NULL),(178,'STU023',4000.00,13500.00,'mobile-money','2025-09-14 13:13:23'),(179,'STU029',4000.00,4000.00,'cash','2025-09-14 19:36:15'),(180,'STU030',1350.00,0.00,NULL,NULL),(182,'STU031',1350.00,1000.00,'cash','2025-09-15 07:40:57'),(183,'STU032',1350.00,1000.00,'cash','2025-09-15 10:32:07'),(185,'STU034',1350.00,700.00,'cash','2025-09-19 10:51:48'),(186,'STU035',1350.00,1000.00,'mobile-money','2025-09-19 11:05:59'),(187,'STU036',1350.00,1350.00,'cash','2025-09-19 14:33:28'),(188,'STU037',1350.00,1200.00,'cash','2025-09-29 07:43:46'),(189,'STU038',1350.00,0.00,NULL,NULL),(190,'STU039',4000.00,2000.00,'cash','2025-10-01 10:25:39'),(191,'STU040',1350.00,2000.00,'cash','2025-10-02 14:05:31'),(192,'STU041',1350.00,1300.00,'cash','2025-10-02 21:00:01'),(193,'STU042',1350.00,500.00,'cash','2025-10-15 23:19:10');
/*!40000 ALTER TABLE `fees` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `set_total_amount_from_department` BEFORE INSERT ON `fees` FOR EACH ROW BEGIN
    DECLARE dept_fee DECIMAL(10,2);

    -- Get the fee from the student's department
    SELECT fee_charge INTO dept_fee
    FROM departments d
    JOIN students s ON s.department_id = d.id
    WHERE s.id = NEW.student_id
    LIMIT 1;

    -- Set the total_amount
    SET NEW.total_amount = dept_fee;

    -- Optionally, if amount_paid is NULL, default to 0
    IF NEW.amount_paid IS NULL THEN
        SET NEW.amount_paid = 0;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `log_fee_payment_activity` AFTER UPDATE ON `fees` FOR EACH ROW BEGIN
  IF NEW.amount_paid > OLD.amount_paid THEN
    INSERT INTO activities (student_id, action, course, type)
    VALUES (NEW.student_id, 'Fee Payment', NULL, 'fee');
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `instructor_courses`
--

DROP TABLE IF EXISTS `instructor_courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instructor_courses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `instructor_id` int NOT NULL,
  `course_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `instructor_id` (`instructor_id`,`course_id`),
  KEY `fk_instructor_course_course` (`course_id`),
  CONSTRAINT `fk_instructor_course_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  CONSTRAINT `fk_instructor_course_instructor` FOREIGN KEY (`instructor_id`) REFERENCES `instructors` (`id`),
  CONSTRAINT `instructor_courses_ibfk_1` FOREIGN KEY (`instructor_id`) REFERENCES `instructors` (`id`),
  CONSTRAINT `instructor_courses_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instructor_courses`
--

LOCK TABLES `instructor_courses` WRITE;
/*!40000 ALTER TABLE `instructor_courses` DISABLE KEYS */;
INSERT INTO `instructor_courses` VALUES (8,1,1);
/*!40000 ALTER TABLE `instructor_courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instructors`
--

DROP TABLE IF EXISTS `instructors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instructors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `department_id` int NOT NULL,
  `hire_date` date DEFAULT (curdate()),
  `status` enum('Active','Inactive') DEFAULT 'Active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_instructor_department` (`department_id`),
  CONSTRAINT `fk_instructor_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  CONSTRAINT `instructors_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instructors`
--

LOCK TABLES `instructors` WRITE;
/*!40000 ALTER TABLE `instructors` DISABLE KEYS */;
INSERT INTO `instructors` VALUES (1,'Tr. Sam Onditi','sam.onditi@gmail.com','0123457575','Male',1,'2025-09-13','Active'),(2,'Jacob','jacob@example.com','01447474848','Male',3,'2025-09-13','Active');
/*!40000 ALTER TABLE `instructors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `intakes`
--

DROP TABLE IF EXISTS `intakes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `intakes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `intake_name` varchar(100) NOT NULL,
  `year` year NOT NULL,
  `term` enum('January','May','September') NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `intakes`
--

LOCK TABLES `intakes` WRITE;
/*!40000 ALTER TABLE `intakes` DISABLE KEYS */;
INSERT INTO `intakes` VALUES (1,'January 2025 Intake',2025,'January','2025-01-10','2025-04-10'),(2,'May 2025 Intake',2025,'May','2025-04-15','2025-07-15'),(3,'September 2025 Intake',2025,'September','2025-07-20','2025-10-20');
/*!40000 ALTER TABLE `intakes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `levels`
--

DROP TABLE IF EXISTS `levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `levels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `levels`
--

LOCK TABLES `levels` WRITE;
/*!40000 ALTER TABLE `levels` DISABLE KEYS */;
INSERT INTO `levels` VALUES (1,'Level 1',NULL,NULL),(2,'Level 2',NULL,NULL),(3,'Level 3',NULL,NULL);
/*!40000 ALTER TABLE `levels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modules`
--

DROP TABLE IF EXISTS `modules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(20) NOT NULL,
  `title` varchar(100) NOT NULL,
  `course_id` int DEFAULT NULL,
  `level_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `course_id` (`course_id`),
  KEY `level_id` (`level_id`),
  CONSTRAINT `modules_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `modules_ibfk_2` FOREIGN KEY (`level_id`) REFERENCES `levels` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modules`
--

LOCK TABLES `modules` WRITE;
/*!40000 ALTER TABLE `modules` DISABLE KEYS */;
INSERT INTO `modules` VALUES (2,'MOD001','Ms Word',1,1),(3,'MOD001','Introduction to Computers',1,1),(5,'MOD001','Ms Excel',1,1),(6,'MOD001','Ms Access',1,1),(7,'MOD001','Ms Publisher',1,1),(8,'MOD001','Ms Internet & Email',1,1),(9,'MOD001','Networking',1,1),(10,'MOD001','Operating System',1,1);
/*!40000 ALTER TABLE `modules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_modules`
--

DROP TABLE IF EXISTS `student_modules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_modules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` varchar(20) NOT NULL,
  `module_id` int NOT NULL,
  `level_id` int NOT NULL,
  `enrollment_date` date NOT NULL DEFAULT (curdate()),
  `status` enum('Enrolled','Completed','Dropped') DEFAULT 'Enrolled',
  PRIMARY KEY (`id`),
  KEY `fk_student_module_student` (`student_id`),
  KEY `fk_student_module_module` (`module_id`),
  KEY `fk_student_module_level` (`level_id`),
  CONSTRAINT `fk_student_module_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_student_module_module` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_student_module_level` FOREIGN KEY (`level_id`) REFERENCES `levels` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_modules`
--

LOCK TABLES `student_modules` WRITE;
/*!40000 ALTER TABLE `student_modules` DISABLE KEYS */;
-- Insert sample data here if needed (e.g., based on existing student_performance or enrollments)
-- For example: INSERT INTO `student_modules` VALUES (1,'STU001',2,1,'2025-09-13','Enrolled');
/*!40000 ALTER TABLE `student_modules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `results`
--

DROP TABLE IF EXISTS `results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `results` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` varchar(20) DEFAULT NULL,
  `course_id` int DEFAULT NULL,
  `grade` decimal(5,2) DEFAULT NULL,
  `grade_letter` varchar(2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `results_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  CONSTRAINT `results_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `results`
--

LOCK TABLES `results` WRITE;
/*!40000 ALTER TABLE `results` DISABLE KEYS */;
INSERT INTO `results` VALUES (32,'STU001',1,NULL,NULL,'2025-09-18 07:04:23');
/*!40000 ALTER TABLE `results` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `log_result_activity` AFTER INSERT ON `results` FOR EACH ROW BEGIN
  DECLARE course_name VARCHAR(100);
  SELECT name INTO course_name FROM courses WHERE id = NEW.course_id;

  INSERT INTO activities (student_id, action, course, type)
  VALUES (NEW.student_id, 'Exam Result Added', course_name, 'result');
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `student_performance`
--

DROP TABLE IF EXISTS `student_performance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_performance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` varchar(20) NOT NULL,
  `module_id` int NOT NULL,
  `theory_marks` int DEFAULT NULL,
  `practical_marks` int DEFAULT NULL,
  `grade` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `module_id` (`module_id`),
  CONSTRAINT `student_performance_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `student_performance_ibfk_2` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_performance`
--

LOCK TABLES `student_performance` WRITE;
/*!40000 ALTER TABLE `student_performance` DISABLE KEYS */;
INSERT INTO `student_performance` VALUES (4,'STU001',3,74,80,'CREDIT'),(5,'STU001',2,60,70,'PASS'),(6,'STU001',7,60,70,'PASS'),(7,'STU001',10,70,80,'CREDIT'),(8,'STU001',6,74,70,'CREDIT'),(9,'STU001',7,71,90,'DISTINCTION'),(10,'STU001',8,60,60,'PASS'),(11,'STU001',9,80,80,'DISTINCTION');
/*!40000 ALTER TABLE `student_performance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `student_summary`
--

DROP TABLE IF EXISTS `student_summary`;
/*!50001 DROP VIEW IF EXISTS `student_summary`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `student_summary` AS SELECT 
 1 AS `student_id`,
 1 AS `student_name`,
 1 AS `total_modules`,
 1 AS `average_mark`,
 1 AS `exam_status`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `id` varchar(20) NOT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `id_number` varchar(20) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `nationality` varchar(50) DEFAULT NULL,
  `county` varchar(50) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  `intake_id` int DEFAULT NULL,
  `admission_date` date DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `branch_id` int DEFAULT NULL,
  `guardian_name` varchar(100) DEFAULT NULL,
  `guardian_contact` varchar(20) DEFAULT NULL,
  `course_id` int DEFAULT NULL,
  `level_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `id_number` (`id_number`),
  KEY `fk_students_department` (`department_id`),
  KEY `fk_students_intake` (`intake_id`),
  KEY `fk_student_branch` (`branch_id`),
  KEY `fk_student_course` (`course_id`),
  KEY `fk_student_level` (`level_id`),
  CONSTRAINT `fk_student_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `fk_student_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  CONSTRAINT `fk_student_level` FOREIGN KEY (`level_id`) REFERENCES `levels` (`id`),
  CONSTRAINT `fk_students_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_students_intake` FOREIGN KEY (`intake_id`) REFERENCES `intakes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES ('STU001','John','Maina',NULL,'2024-02-02',NULL,NULL,NULL,'johnole@gmail.com','0712345678',NULL,'Male',1,NULL,NULL,'Active',NULL,NULL,NULL,NULL,NULL),('STU002','MERCY','VAATI',NULL,'2025-02-02',NULL,NULL,NULL,'mercy@example.com',NULL,NULL,NULL,1,NULL,NULL,'Active',1,NULL,NULL,NULL,NULL),('STU003','SALIMA','WANJALA',NULL,NULL,NULL,NULL,NULL,'salima@example.com',NULL,NULL,NULL,1,NULL,NULL,'Active',1,NULL,NULL,NULL,NULL),('STU004','MARY','KALIMI',NULL,NULL,NULL,NULL,NULL,'mary@example.com',NULL,NULL,NULL,1,NULL,NULL,'Active',1,NULL,NULL,NULL,NULL),('STU005','MITCHEL','ATIENO',NULL,NULL,NULL,NULL,NULL,'mitchel@example.com',NULL,NULL,NULL,1,NULL,NULL,'Active',1,NULL,NULL,NULL,NULL),('STU006','MARRYANNE','AKOTH',NULL,NULL,NULL,NULL,NULL,'marryanne@example.com',NULL,NULL,NULL,1,NULL,NULL,'Active',1,NULL,NULL,NULL,NULL),('STU007','MERCY','NEKESA',NULL,NULL,NULL,NULL,NULL,'mercynekesa@example.com',NULL,NULL,NULL,1,NULL,NULL,'Active',1,NULL,NULL,NULL,NULL),('STU008','VALLARY','GOZERO',NULL,NULL,NULL,NULL,NULL,'vallary@example.com',NULL,NULL,NULL,1,NULL,NULL,'Active',1,NULL,NULL,NULL,NULL),('STU009','SHEILA','ATIENO',NULL,NULL,NULL,NULL,NULL,'sheila@example.com',NULL,NULL,NULL,1,NULL,NULL,'Active',1,NULL,NULL,NULL,NULL),('STU011','Anne','Adhiambo',NULL,NULL,NULL,NULL,NULL,'anne.new@example.com','0712345678',22,'Female',1,NULL,NULL,'Active',NULL,NULL,NULL,NULL,NULL),('STU012','SAMMY','KITUKU',NULL,NULL,NULL,NULL,NULL,'sammy@example.com',NULL,NULL,NULL,1,NULL,NULL,'Active',1,NULL,NULL,NULL,NULL),('STU013','PATRICK','KYLO',NULL,NULL,NULL,NULL,NULL,'patrick@example.com',NULL,NULL,NULL,1,NULL,NULL,'Active',1,NULL,NULL,NULL,NULL),('STU015','MITCHAEL','GACHUMA',NULL,NULL,NULL,NULL,NULL,'michael@example.com',NULL,NULL,NULL,1,NULL,NULL,'Active',1,NULL,NULL,NULL,NULL),('STU016','JANE','AKOCHI',NULL,NULL,NULL,NULL,NULL,'jane@example.com',NULL,NULL,NULL,1,NULL,NULL,'Active',1,NULL,NULL,NULL,NULL),('STU019','VALLARY','ASIKO',NULL,NULL,NULL,NULL,NULL,'vallaryasiko@example.com',NULL,NULL,NULL,1,NULL,NULL,'Active',1,NULL,NULL,NULL,NULL),('STU020','LINET','KAGEMA',NULL,NULL,NULL,NULL,NULL,'linet@example.com',NULL,NULL,NULL,1,NULL,NULL,'Active',1,NULL,NULL,NULL,NULL),('STU021','STEPHEN','NGALA',NULL,NULL,NULL,NULL,NULL,'stephen@example.com',NULL,NULL,NULL,1,NULL,NULL,'Active',1,NULL,NULL,NULL,NULL),('STU023','TRACY','OBIERO',NULL,NULL,NULL,NULL,NULL,'tracy@example.com',NULL,NULL,NULL,3,NULL,NULL,'Active',1,NULL,NULL,NULL,NULL),('STU025','SARA','WANJIKO',NULL,NULL,NULL,NULL,NULL,'sara@example.com',NULL,NULL,NULL,1,NULL,NULL,'Active',1,NULL,NULL,NULL,NULL),('STU028','Anne','Adhiambo',NULL,NULL,NULL,NULL,NULL,'annew@example.com','0712345678',22,'Female',1,NULL,NULL,'Active',NULL,NULL,NULL,NULL,NULL),('STU029','Jeremy','Bravoge',NULL,NULL,NULL,NULL,NULL,'cndid@jndj','02020202',NULL,'Male',3,NULL,'2025-09-14','Active',NULL,NULL,NULL,NULL,NULL),('STU030','Eshter ','Adhiambo','1782729','2022-12-12','KIM','KIM','kim','cnddsid@jndj','02020202',NULL,'Female',1,NULL,'2025-09-14','Active',1,'KIM','0718292',NULL,NULL),('STU031','Dan ','Dantez',NULL,NULL,NULL,NULL,NULL,'dan@gmail.com','0115000514',NULL,'Male',NULL,NULL,NULL,'Active',NULL,NULL,NULL,NULL,NULL),('STU032','Sam','Onditi',NULL,NULL,NULL,NULL,NULL,'sam@gmail.com','043746464',NULL,'Male',1,NULL,'2025-09-15','Active',NULL,NULL,NULL,NULL,NULL),('STU034','Gorge','Maina',NULL,NULL,NULL,NULL,NULL,'music@gmail.com','02020202',NULL,'Male',3,NULL,NULL,'Active',NULL,NULL,NULL,NULL,NULL),('STU035','Jeremy','Codemaster',NULL,NULL,NULL,NULL,NULL,'codemasterr@gmail.com','0115000514',NULL,'Male',1,NULL,'2025-09-19','Active',NULL,NULL,NULL,NULL,NULL),('STU036','Steve','Stevo',NULL,NULL,NULL,NULL,NULL,'stevo@gmail.com','0748484848',NULL,'Male',1,NULL,'2025-09-19','Active',NULL,NULL,NULL,NULL,NULL),('STU037','Evans ','Maina','646554t46','2006-12-13','Kenyan','Vihiga','Naks','Ekwanda@gmail.com','0115000514',NULL,'Male',1,NULL,'2025-09-24','Active',1,'Gaki','07849494',NULL,NULL),('STU038','Jeremy','Bravoge',NULL,NULL,NULL,NULL,NULL,'codej@gmail.com','0115000514',NULL,'Male',1,NULL,'2025-09-29','Active',NULL,NULL,NULL,NULL,NULL),('STU039','Gorge','Muchini',NULL,NULL,NULL,NULL,NULL,'codemuchini@gmail.com','0115000514',NULL,'Male',3,NULL,'2025-10-01','Active',NULL,NULL,NULL,NULL,NULL),('STU040','JOY ','KAWIRA',NULL,NULL,NULL,NULL,NULL,'kukumoto@gmail.com','0115000514',NULL,'Female',1,NULL,'2025-10-02','Active',NULL,NULL,NULL,NULL,NULL),('STU041','Collins','Omorro','263737','2000-12-12','kim','kim','kim','collins@gmail.com','03984949',NULL,'Male',1,NULL,'2025-10-02','Active',1,'kim','083838388',NULL,NULL),('STU042','Jeremy','Omollo',NULL,NULL,NULL,NULL,NULL,'f@gmail.com','0115000514',NULL,'Male',1,NULL,'2025-10-16','Active',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `transaction_details`
--

DROP TABLE IF EXISTS `transaction_details`;
/*!50001 DROP VIEW IF EXISTS `transaction_details`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `transaction_details` AS SELECT 
 1 AS `transaction_no`,
 1 AS `student_name`,
 1 AS `amount`,
 1 AS `payment_method`,
 1 AS `reference`,
 1 AS `date`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` varchar(20) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `payment_method` enum('cash','bank-transfer','mobile-money','credit-card') DEFAULT NULL,
  `reference` varchar(50) DEFAULT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,'STU030',5000.00,'cash','MPESA123XYZ','2025-09-14 19:22:30'),(2,'STU029',3000.00,'cash','MPESA123XYZ','2025-09-14 19:29:50'),(3,'STU029',1000.00,'cash','122434','2025-09-14 19:36:16'),(4,'STU001',100.00,'cash','122434','2025-09-14 19:38:28'),(5,'STU006',600.00,'cash','212122','2025-09-14 19:39:30'),(6,'STU018',300.00,'cash','12121212','2025-09-14 20:29:23'),(7,'STU018',49.00,'cash','212122','2025-09-14 20:30:25'),(8,'STU018',1.00,'cash','122434','2025-09-14 20:31:24'),(9,'STU031',1000.00,'cash','BWWT1112','2025-09-15 06:54:58'),(10,'STU031',1000.00,'cash','BWWT1112','2025-09-15 07:40:57'),(11,'STU032',1000.00,'cash','RYFREWSA','2025-09-15 10:32:07'),(12,'STU033',1000.00,'cash','BWWT1112','2025-09-16 06:57:14'),(13,'STU003',30.00,'bank-transfer','BWWT1112','2025-09-17 20:34:46'),(14,'STU033',349.00,'mobile-money','212122','2025-09-17 20:36:23'),(15,'STU034',700.00,'cash','BWWT1112','2025-09-19 10:51:48'),(16,'STU035',1000.00,'mobile-money','BWWT1112','2025-09-19 11:05:59'),(17,'STU036',1350.00,'cash','BWWT1112','2025-09-19 14:33:28'),(18,'STU037',1000.00,'cash','QWWRERTEE','2025-09-24 18:01:39'),(19,'STU037',50.00,'cash','BWWT1112','2025-09-25 10:47:32'),(20,'STU037',150.00,'cash','7878877#','2025-09-29 07:43:46'),(21,'STU039',2000.00,'cash','122434','2025-10-01 10:25:39'),(22,'STU040',2000.00,'cash',NULL,'2025-10-02 14:05:31'),(23,'STU041',1200.00,'cash',NULL,'2025-10-02 20:59:04'),(24,'STU041',100.00,'cash',NULL,'2025-10-02 21:00:01'),(25,'STU042',500.00,'cash','122434','2025-10-15 23:19:10');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(150) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('super_admin','admin','teacher','student','accountant','clerk') NOT NULL,
  `branch_id` int DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `profile_image` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_branch` (`branch_id`),
  CONSTRAINT `fk_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (15,'Bravoge','bravoge','cohacohat@gmail.com','$2b$10$Q1Yqp9fHz18lQWX3Iw1Ukurcg8vTv7ZYGqrJruoIRyUjAYclGy.I.','admin',1,'07458173599',NULL,NULL,'active','1760447339070-711431376.jpg','2025-09-13 11:23:19','2025-10-14 13:09:16',NULL,NULL),(50,'Masharia','munene','mashariamunene@gmail.com','$2b$10$/BfXqxMXeuQZXK8Hm4uiyOaLOqxD9hSW6/q3Wet/GMBipXtcv.FmG','admin',1,'0115000514',NULL,NULL,'active','1760507096534-247292598.jpg','2025-10-14 13:31:52','2025-10-15 05:44:56',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `student_summary`
--

/*!50001 DROP VIEW IF EXISTS `student_summary`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = cp850 */;
/*!50001 SET character_set_results     = cp850 */;
/*!50001 SET collation_connection      = cp850_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `student_summary` AS select `s`.`id` AS `student_id`,concat(`s`.`first_name`,' ',`s`.`last_name`) AS `student_name`,count(`sp`.`module_id`) AS `total_modules`,round(avg(((`sp`.`theory_marks` + `sp`.`practical_marks`) / 2)),2) AS `average_mark`,(case when (count(`sp`.`module_id`) = 0) then 'Incomplete' when (round(avg(((`sp`.`theory_marks` + `sp`.`practical_marks`) / 2)),2) >= 50) then 'Pass' else 'Fail' end) AS `exam_status` from (`students` `s` left join `student_performance` `sp` on((`s`.`id` = `sp`.`student_id`))) group by `s`.`id`,`s`.`first_name`,`s`.`last_name` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `transaction_details`
--

/*!50001 DROP VIEW IF EXISTS `transaction_details`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `transaction_details` AS select `t`.`id` AS `transaction_no`,concat(`s`.`first_name`,' ',`s`.`last_name`) AS `student_name`,`t`.`amount` AS `amount`,`t`.`payment_method` AS `payment_method`,`t`.`reference` AS `reference`,`t`.`date` AS `date` from (`transactions` `t` left join `students` `s` on((`t`.`student_id` = `s`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-22 11:41:20 ...........................................BASED ON THAT DATABASE WHAAT DO YOU SUGGEST TO BE ON ENROLLMENT OF STUDENTS IN MODULE  IN MY PROJECT