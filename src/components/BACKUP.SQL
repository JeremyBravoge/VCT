-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Oct 31, 2025 at 03:24 PM
-- Server version: 8.0.43
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `school_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `activities`
--

CREATE TABLE `activities` (
  `id` int NOT NULL,
  `student_id` varchar(20) NOT NULL,
  `action` varchar(255) NOT NULL,
  `course` varchar(100) DEFAULT NULL,
  `type` enum('enrollment','fee','attendance','result','general') DEFAULT 'general',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `activities`
--

INSERT INTO `activities` (`id`, `student_id`, `action`, `course`, `type`, `created_at`) VALUES
(31, 'STU001', 'New Enrollment', 'Computer Packages', 'enrollment', '2025-09-13 08:58:44'),
(32, 'STU002', 'New Enrollment', 'Computer Packages', 'enrollment', '2025-09-13 08:58:44'),
(33, 'STU003', 'New Enrollment', 'Computer Packages', 'enrollment', '2025-09-13 08:58:44'),
(34, 'STU004', 'New Enrollment', 'Computer Packages', 'enrollment', '2025-09-13 08:58:44'),
(35, 'STU005', 'New Enrollment', 'Computer Packages', 'enrollment', '2025-09-13 08:58:44'),
(36, 'STU006', 'New Enrollment', 'Computer Packages', 'enrollment', '2025-09-13 08:58:44'),
(37, 'STU007', 'New Enrollment', 'Computer Packages', 'enrollment', '2025-09-13 08:58:44'),
(38, 'STU008', 'New Enrollment', 'Computer Packages', 'enrollment', '2025-09-13 08:58:44'),
(39, 'STU009', 'New Enrollment', 'Computer Packages', 'enrollment', '2025-09-13 08:58:44'),
(41, 'STU011', 'New Enrollment', 'Computer Packages', 'enrollment', '2025-09-13 08:58:44'),
(42, 'STU012', 'New Enrollment', 'Computer Packages', 'enrollment', '2025-09-13 08:58:44'),
(43, 'STU013', 'New Enrollment', 'Computer Packages', 'enrollment', '2025-09-13 08:58:44'),
(45, 'STU015', 'New Enrollment', 'Computer Packages', 'enrollment', '2025-09-13 08:58:44'),
(46, 'STU016', 'New Enrollment', 'Computer Packages', 'enrollment', '2025-09-13 08:58:44'),
(49, 'STU019', 'New Enrollment', 'Computer Packages', 'enrollment', '2025-09-13 08:58:44'),
(50, 'STU020', 'New Enrollment', 'Computer Packages', 'enrollment', '2025-09-13 08:58:44'),
(51, 'STU021', 'New Enrollment', 'Computer Packages', 'enrollment', '2025-09-13 08:58:44'),
(53, 'STU023', 'New Enrollment', 'Computer Packages', 'enrollment', '2025-09-13 08:58:44'),
(55, 'STU025', 'New Enrollment', 'Computer Packages', 'enrollment', '2025-09-13 08:58:44'),
(57, 'STU028', 'New Enrollment', 'Photography', 'enrollment', '2025-09-14 18:55:34'),
(58, 'STU029', 'New Enrollment', 'Photography', 'enrollment', '2025-09-14 19:06:08'),
(59, 'STU029', 'Fee Payment', NULL, 'fee', '2025-09-14 19:29:50'),
(60, 'STU029', 'Fee Payment', NULL, 'fee', '2025-09-14 19:36:15'),
(61, 'STU001', 'Fee Payment', NULL, 'fee', '2025-09-14 19:38:08'),
(62, 'STU001', 'Fee Payment', NULL, 'fee', '2025-09-14 19:38:28'),
(63, 'STU006', 'Fee Payment', NULL, 'fee', '2025-09-14 19:39:30'),
(64, 'STU030', 'New Enrollment', 'Computer Packages', 'enrollment', '2025-09-14 19:42:31'),
(70, 'STU031', 'New Enrollment', 'Graphics Designs', 'enrollment', '2025-09-15 07:40:05'),
(71, 'STU031', 'Fee Payment', NULL, 'fee', '2025-09-15 07:40:57'),
(72, 'STU032', 'New Enrollment', 'Computer Packages', 'enrollment', '2025-09-15 10:31:15'),
(73, 'STU032', 'Fee Payment', NULL, 'fee', '2025-09-15 10:32:07'),
(76, 'STU003', 'Fee Payment', NULL, 'fee', '2025-09-17 20:22:52'),
(77, 'STU003', 'Fee Payment', NULL, 'fee', '2025-09-17 20:23:00'),
(78, 'STU003', 'Fee Payment', NULL, 'fee', '2025-09-17 20:23:07'),
(79, 'STU003', 'Fee Payment', NULL, 'fee', '2025-09-17 20:25:24'),
(80, 'STU003', 'Fee Payment', NULL, 'fee', '2025-09-17 20:25:32'),
(81, 'STU003', 'Fee Payment', NULL, 'fee', '2025-09-17 20:26:36'),
(82, 'STU003', 'Fee Payment', NULL, 'fee', '2025-09-17 20:31:36'),
(83, 'STU003', 'Fee Payment', NULL, 'fee', '2025-09-17 20:32:20'),
(84, 'STU003', 'Fee Payment', NULL, 'fee', '2025-09-17 20:34:46'),
(86, 'STU001', 'Exam Result Added', 'Computer Packages', 'result', '2025-09-18 07:04:23'),
(87, 'STU034', 'New Enrollment', 'Computer Packages', 'enrollment', '2025-09-19 10:50:20'),
(88, 'STU034', 'Fee Payment', NULL, 'fee', '2025-09-19 10:51:48'),
(89, 'STU035', 'New Enrollment', 'Computer Packages', 'enrollment', '2025-09-19 11:04:59'),
(90, 'STU035', 'Fee Payment', NULL, 'fee', '2025-09-19 11:05:59'),
(91, 'STU036', 'New Enrollment', 'Graphics Designs', 'enrollment', '2025-09-19 14:32:43'),
(92, 'STU036', 'Fee Payment', NULL, 'fee', '2025-09-19 14:33:28'),
(93, 'STU037', 'New Enrollment', 'Web Design', 'enrollment', '2025-09-24 17:58:49'),
(94, 'STU037', 'Fee Payment', NULL, 'fee', '2025-09-24 18:01:39'),
(95, 'STU037', 'Fee Payment', NULL, 'fee', '2025-09-25 10:47:32'),
(96, 'STU038', 'New Enrollment', 'AI ', 'enrollment', '2025-09-29 06:58:03'),
(97, 'STU037', 'Fee Payment', NULL, 'fee', '2025-09-29 07:43:46'),
(98, 'STU039', 'New Enrollment', 'Videography', 'enrollment', '2025-10-01 10:24:18'),
(99, 'STU039', 'Fee Payment', NULL, 'fee', '2025-10-01 10:25:39'),
(100, 'STU040', 'New Enrollment', 'Cyber Security', 'enrollment', '2025-10-02 14:03:59'),
(101, 'STU040', 'Fee Payment', NULL, 'fee', '2025-10-02 14:05:31'),
(102, 'STU041', 'New Enrollment', 'Cyber Security', 'enrollment', '2025-10-02 20:57:43'),
(103, 'STU041', 'Fee Payment', NULL, 'fee', '2025-10-02 20:59:04'),
(104, 'STU041', 'Fee Payment', NULL, 'fee', '2025-10-02 21:00:01'),
(105, 'STU042', 'New Enrollment', 'Graphic Design', 'enrollment', '2025-10-15 23:09:53'),
(106, 'STU042', 'Fee Payment', NULL, 'fee', '2025-10-15 23:19:10'),
(107, 'STU001', 'Attendance Marked', 'Computer Packages', 'attendance', '2025-10-22 07:04:07'),
(108, 'STU001', 'Attendance Marked', 'Computer Packages', 'attendance', '2025-10-22 07:04:43');

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int NOT NULL,
  `student_id` varchar(20) NOT NULL,
  `course_id` int NOT NULL,
  `attendance_date` date NOT NULL,
  `status` varchar(20) DEFAULT 'present',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id`, `student_id`, `course_id`, `attendance_date`, `status`, `created_at`) VALUES
(1, 'STU001', 1, '2025-08-08', 'present', '2025-10-22 07:04:07'),
(3, 'STU001', 1, '2025-08-08', 'present', '2025-10-22 07:04:43');

--
-- Triggers `attendance`
--
DELIMITER $$
CREATE TRIGGER `log_attendance_activity` AFTER INSERT ON `attendance` FOR EACH ROW BEGIN
  DECLARE course_name VARCHAR(100);
  SELECT name INTO course_name FROM courses WHERE id = NEW.course_id;

  INSERT INTO activities (student_id, action, course, type)
  VALUES (NEW.student_id, 'Attendance Marked', course_name, 'attendance');
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `branches`
--

CREATE TABLE `branches` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `location` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`id`, `name`, `location`, `created_at`) VALUES
(1, 'Main Branch', 'Mathare', '2025-09-11 05:52:01'),
(2, 'Sub-Branch', 'Kakamega', '2025-10-15 00:43:37');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `department_id` int DEFAULT NULL,
  `duration_months` int DEFAULT '3',
  `description` text,
  `fee` decimal(10,2) DEFAULT NULL,
  `capacity` int DEFAULT '30',
  `enrolled` int DEFAULT '0',
  `start_date` datetime DEFAULT NULL,
  `status` enum('Upcoming','Active','Completed') DEFAULT 'Upcoming'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `name`, `department_id`, `duration_months`, `description`, `fee`, `capacity`, `enrolled`, `start_date`, `status`) VALUES
(1, 'Computer Packages', 1, 3, 'AI Generation', NULL, 50, 0, '2025-02-01 21:00:00', 'Active'),
(2, 'AI ', 1, 3, 'Focus on Kali Linux', 15000.00, 50, 0, NULL, 'Active'),
(5, 'Photography', 1, 4, NULL, 4000.00, 50, 0, NULL, 'Active'),
(10, 'Cyber Sec', 1, 3, 'Focus on Kali Linux', 1350.00, 59, 0, NULL, 'Active'),
(11, 'Graphic Design', 1, 3, 'AI Generating Designs', 490.00, 45, 0, NULL, 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `course_facilities`
--

CREATE TABLE `course_facilities` (
  `id` int NOT NULL,
  `course_id` int NOT NULL,
  `facility_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `course_facilities`
--

INSERT INTO `course_facilities` (`id`, `course_id`, `facility_id`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 2, 2),
(6, 5, 3);

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `CustomerID` int DEFAULT NULL,
  `CustomerName` char(20) DEFAULT NULL,
  `Description` char(30) DEFAULT NULL,
  `Amount` decimal(10,0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `fee_charge` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `fee_charge`) VALUES
(1, 'ICT', 1350.00),
(3, 'Film Production', 4000.00),
(4, 'Fashion Design', 3500.00),
(5, 'Business', 2500.00);

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `id` int NOT NULL,
  `student_id` varchar(20) DEFAULT NULL,
  `course_id` int DEFAULT NULL,
  `intake_id` int DEFAULT NULL,
  `enrollment_date` date NOT NULL DEFAULT (curdate()),
  `status` enum('Enrolled','Completed','Dropped') DEFAULT 'Enrolled'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `enrollments`
--

INSERT INTO `enrollments` (`id`, `student_id`, `course_id`, `intake_id`, `enrollment_date`, `status`) VALUES
(29, 'STU001', 1, 3, '2025-09-13', 'Enrolled'),
(30, 'STU002', 1, 3, '2025-09-13', 'Enrolled'),
(31, 'STU003', 1, 3, '2025-09-13', 'Enrolled'),
(32, 'STU004', 1, 3, '2025-09-13', 'Enrolled'),
(33, 'STU005', 1, 3, '2025-09-13', 'Enrolled'),
(34, 'STU006', 1, 3, '2025-09-13', 'Enrolled'),
(35, 'STU007', 1, 3, '2025-09-13', 'Enrolled'),
(36, 'STU008', 1, 3, '2025-09-13', 'Enrolled'),
(37, 'STU009', 1, 3, '2025-09-13', 'Enrolled'),
(39, 'STU011', 1, 3, '2025-09-13', 'Enrolled'),
(40, 'STU012', 1, 3, '2025-09-13', 'Enrolled'),
(41, 'STU013', 1, 3, '2025-09-13', 'Enrolled'),
(43, 'STU015', 1, 3, '2025-09-13', 'Enrolled'),
(44, 'STU016', 1, 3, '2025-09-13', 'Enrolled'),
(47, 'STU019', 1, 3, '2025-09-13', 'Enrolled'),
(48, 'STU020', 1, 3, '2025-09-13', 'Enrolled'),
(49, 'STU021', 1, 3, '2025-09-13', 'Enrolled'),
(51, 'STU023', 5, 3, '2025-09-13', 'Enrolled'),
(53, 'STU025', 1, 3, '2025-09-13', 'Enrolled'),
(55, 'STU028', 5, 2, '2025-09-14', 'Enrolled'),
(56, 'STU029', 5, 3, '2025-09-14', 'Enrolled'),
(57, 'STU030', 1, 1, '2025-09-14', 'Enrolled'),
(59, 'STU031', 2, 3, '2025-09-15', 'Enrolled'),
(60, 'STU032', 1, 3, '2025-09-15', 'Enrolled'),
(62, 'STU034', 1, 3, '2025-09-19', 'Enrolled'),
(63, 'STU035', 1, 3, '2025-09-19', 'Enrolled'),
(64, 'STU036', 2, 3, '2025-09-19', 'Enrolled'),
(66, 'STU038', 2, 2, '2025-09-29', 'Enrolled'),
(68, 'STU040', 10, 2, '2025-10-02', 'Enrolled'),
(69, 'STU041', 10, 3, '2025-10-02', 'Enrolled'),
(70, 'STU042', 11, 2, '2025-10-16', 'Enrolled');

--
-- Triggers `enrollments`
--
DELIMITER $$
CREATE TRIGGER `create_fee_record_after_enrollment` AFTER INSERT ON `enrollments` FOR EACH ROW BEGIN
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
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `log_enrollment_activity` AFTER INSERT ON `enrollments` FOR EACH ROW BEGIN
  DECLARE course_name VARCHAR(100);
  SELECT name INTO course_name FROM courses WHERE id = NEW.course_id;

  INSERT INTO activities (student_id, action, course, type)
  VALUES (NEW.student_id, 'New Enrollment', course_name, 'enrollment');
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `set_default_enrollment_date` BEFORE INSERT ON `enrollments` FOR EACH ROW SET NEW.enrollment_date = CURDATE()
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `set_student_department_after_enroll` AFTER INSERT ON `enrollments` FOR EACH ROW BEGIN
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
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_update_student_department_after_insert` AFTER INSERT ON `enrollments` FOR EACH ROW BEGIN
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
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_student_department` AFTER UPDATE ON `enrollments` FOR EACH ROW BEGIN
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
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_student_department_accurate` AFTER INSERT ON `enrollments` FOR EACH ROW BEGIN
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
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_student_department_after_enroll` AFTER INSERT ON `enrollments` FOR EACH ROW BEGIN
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
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_student_department_after_enroll_update` AFTER UPDATE ON `enrollments` FOR EACH ROW BEGIN
    DECLARE dept_id INT;

    SELECT department_id INTO dept_id
    FROM courses
    WHERE id = NEW.course_id;

    IF dept_id IS NOT NULL THEN
        UPDATE students
        SET department_id = dept_id
        WHERE id = NEW.student_id;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_student_department_safe` AFTER UPDATE ON `enrollments` FOR EACH ROW BEGIN
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
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `exam_results`
--

CREATE TABLE `exam_results` (
  `id` int NOT NULL,
  `student_id` varchar(20) NOT NULL,
  `average_mark` int DEFAULT NULL,
  `exam_status` enum('Pass','Fail','Incomplete') DEFAULT 'Incomplete'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `facilities`
--

CREATE TABLE `facilities` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `status` enum('Good','Needs Repair','Broken') DEFAULT 'Good',
  `image_url` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `facilities`
--

INSERT INTO `facilities` (`id`, `name`, `description`, `status`, `image_url`) VALUES
(1, 'Computer Lab', 'Modern lab with 50+ computers', 'Good', NULL),
(2, 'Graphics Studio', 'Equipped with design software', 'Good', NULL),
(3, 'Photography Studio', 'Professional cameras and lighting', 'Good', NULL),
(4, 'Fashion Workshop', 'Sewing machines and materials', 'Good', NULL),
(5, 'Computer Lab', 'Modern lab with 50+ computers', 'Good', NULL),
(6, 'Graphics Studio', 'Equipped with design software', 'Needs Repair', NULL),
(7, 'Photography Studio', 'Professional cameras and lighting', 'Broken', NULL),
(8, 'Fashion Workshop', 'Sewing machines and tailoring tools', 'Good', NULL),
(9, 'Library', 'Collection of reference and study materials', 'Good', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `facility_repairs`
--

CREATE TABLE `facility_repairs` (
  `id` int NOT NULL,
  `facility_id` int NOT NULL,
  `issue_reported` text NOT NULL,
  `repair_date` date DEFAULT NULL,
  `status` enum('Pending','In Progress','Completed') DEFAULT 'Pending',
  `image_url` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `facility_repairs`
--

INSERT INTO `facility_repairs` (`id`, `facility_id`, `issue_reported`, `repair_date`, `status`, `image_url`) VALUES
(1, 2, 'Software outdated, some PCs crash', '2025-09-15', 'Completed', NULL),
(2, 3, 'Main camera lens cracked', '2025-09-15', 'Completed', NULL),
(3, 4, '2 sewing machines not working properly', '2025-09-15', 'Completed', NULL),
(4, 1, 'Air conditioning system failure', '2025-08-20', 'Completed', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `fees`
--

CREATE TABLE `fees` (
  `id` int NOT NULL,
  `student_id` varchar(20) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `amount_paid` decimal(10,2) DEFAULT NULL,
  `amount_pending` decimal(10,2) GENERATED ALWAYS AS (greatest((`total_amount` - `amount_paid`),0)) STORED,
  `is_paid` tinyint(1) GENERATED ALWAYS AS ((case when (`amount_pending` = 0) then 1 else 0 end)) STORED,
  `payment_method` enum('bank-transfer','credit-card','mobile-money','cash') DEFAULT NULL,
  `payment_date` timestamp NULL DEFAULT NULL,
  `overpaid` decimal(10,2) GENERATED ALWAYS AS (greatest((`amount_paid` - `total_amount`),0)) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `fees`
--

INSERT INTO `fees` (`id`, `student_id`, `total_amount`, `amount_paid`, `payment_method`, `payment_date`) VALUES
(147, 'STU001', 1350.00, 1550.00, 'cash', '2025-09-14 19:38:28'),
(148, 'STU002', 1350.00, 1350.00, NULL, NULL),
(149, 'STU003', 1350.00, 1270.00, 'bank-transfer', '2025-09-17 20:34:46'),
(150, 'STU004', 1350.00, 1350.00, NULL, NULL),
(151, 'STU005', 1350.00, 1000.00, NULL, NULL),
(152, 'STU006', 1350.00, 1100.00, 'cash', '2025-09-14 19:39:30'),
(153, 'STU007', 1350.00, 1350.00, NULL, NULL),
(154, 'STU008', 1350.00, 1000.00, NULL, NULL),
(155, 'STU009', 1350.00, 1000.00, NULL, NULL),
(157, 'STU011', 1350.00, 500.00, NULL, NULL),
(158, 'STU012', 1350.00, 850.00, NULL, NULL),
(159, 'STU013', 1350.00, 1350.00, NULL, NULL),
(161, 'STU015', 1350.00, 0.00, NULL, NULL),
(162, 'STU016', 1350.00, 1350.00, NULL, NULL),
(165, 'STU019', 1350.00, 1350.00, NULL, NULL),
(166, 'STU020', 1350.00, 1350.00, NULL, NULL),
(167, 'STU021', 1350.00, 0.00, NULL, NULL),
(171, 'STU025', 1350.00, 1350.00, NULL, NULL),
(178, 'STU023', 4000.00, 13500.00, 'mobile-money', '2025-09-14 13:13:23'),
(179, 'STU029', 4000.00, 4000.00, 'cash', '2025-09-14 19:36:15'),
(180, 'STU030', 1350.00, 0.00, NULL, NULL),
(182, 'STU031', 1350.00, 1000.00, 'cash', '2025-09-15 07:40:57'),
(183, 'STU032', 1350.00, 1000.00, 'cash', '2025-09-15 10:32:07'),
(185, 'STU034', 1350.00, 700.00, 'cash', '2025-09-19 10:51:48'),
(186, 'STU035', 1350.00, 1000.00, 'mobile-money', '2025-09-19 11:05:59'),
(187, 'STU036', 1350.00, 1350.00, 'cash', '2025-09-19 14:33:28'),
(188, 'STU037', 1350.00, 1200.00, 'cash', '2025-09-29 07:43:46'),
(189, 'STU038', 1350.00, 0.00, NULL, NULL),
(190, 'STU039', 4000.00, 2000.00, 'cash', '2025-10-01 10:25:39'),
(191, 'STU040', 1350.00, 2000.00, 'cash', '2025-10-02 14:05:31'),
(192, 'STU041', 1350.00, 1300.00, 'cash', '2025-10-02 21:00:01'),
(193, 'STU042', 1350.00, 500.00, 'cash', '2025-10-15 23:19:10');

--
-- Triggers `fees`
--
DELIMITER $$
CREATE TRIGGER `log_fee_payment_activity` AFTER UPDATE ON `fees` FOR EACH ROW BEGIN
  IF NEW.amount_paid > OLD.amount_paid THEN
    INSERT INTO activities (student_id, action, course, type)
    VALUES (NEW.student_id, 'Fee Payment', NULL, 'fee');
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `set_total_amount_from_department` BEFORE INSERT ON `fees` FOR EACH ROW BEGIN
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
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `instructors`
--

CREATE TABLE `instructors` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `department_id` int NOT NULL,
  `hire_date` date DEFAULT (curdate()),
  `status` enum('Active','Inactive') DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `instructors`
--

INSERT INTO `instructors` (`id`, `name`, `email`, `phone`, `gender`, `department_id`, `hire_date`, `status`) VALUES
(1, 'Tr. Sam Onditi', 'sam.onditi@gmail.com', '0123457575', 'Male', 1, '2025-09-13', 'Active'),
(2, 'Jacob', 'jacob@example.com', '01447474848', 'Male', 3, '2025-09-13', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `instructor_courses`
--

CREATE TABLE `instructor_courses` (
  `id` int NOT NULL,
  `instructor_id` int NOT NULL,
  `course_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `instructor_courses`
--

INSERT INTO `instructor_courses` (`id`, `instructor_id`, `course_id`) VALUES
(8, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `intakes`
--

CREATE TABLE `intakes` (
  `id` int NOT NULL,
  `intake_name` varchar(100) NOT NULL,
  `year` year NOT NULL,
  `term` enum('January','May','September') NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `intakes`
--

INSERT INTO `intakes` (`id`, `intake_name`, `year`, `term`, `start_date`, `end_date`) VALUES
(1, 'January 2025 Intake', '2025', 'January', '2025-01-10', '2025-04-10'),
(2, 'May 2025 Intake', '2025', 'May', '2025-04-15', '2025-07-15'),
(3, 'September 2025 Intake', '2025', 'September', '2025-07-20', '2025-10-20');

-- --------------------------------------------------------

--
-- Table structure for table `levels`
--

CREATE TABLE `levels` (
  `id` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `levels`
--

INSERT INTO `levels` (`id`, `name`, `duration`, `description`) VALUES
(1, 'Level 1', NULL, NULL),
(2, 'Level 2', NULL, NULL),
(3, 'Level 3', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `modules`
--

CREATE TABLE `modules` (
  `id` int NOT NULL,
  `code` varchar(20) NOT NULL,
  `title` varchar(100) NOT NULL,
  `course_id` int DEFAULT NULL,
  `level_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `modules`
--

INSERT INTO `modules` (`id`, `code`, `title`, `course_id`, `level_id`) VALUES
(2, 'MOD001', 'Ms Word', 1, 1),
(3, 'MOD001', 'Introduction to Computers', 1, 1),
(5, 'MOD001', 'Ms Excel', 1, 1),
(6, 'MOD001', 'Ms Access', 1, 1),
(7, 'MOD001', 'Ms Publisher', 1, 1),
(8, 'MOD001', 'Ms Internet & Email', 1, 1),
(9, 'MOD001', 'Networking', 1, 1),
(10, 'MOD001', 'Operating System', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `results`
--

CREATE TABLE `results` (
  `id` int NOT NULL,
  `student_id` varchar(20) DEFAULT NULL,
  `course_id` int DEFAULT NULL,
  `grade` decimal(5,2) DEFAULT NULL,
  `grade_letter` varchar(2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `results`
--

INSERT INTO `results` (`id`, `student_id`, `course_id`, `grade`, `grade_letter`, `created_at`) VALUES
(32, 'STU001', 1, NULL, NULL, '2025-09-18 07:04:23');

--
-- Triggers `results`
--
DELIMITER $$
CREATE TRIGGER `log_result_activity` AFTER INSERT ON `results` FOR EACH ROW BEGIN
  DECLARE course_name VARCHAR(100);
  SELECT name INTO course_name FROM courses WHERE id = NEW.course_id;

  INSERT INTO activities (student_id, action, course, type)
  VALUES (NEW.student_id, 'Exam Result Added', course_name, 'result');
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

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
  `level_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `first_name`, `last_name`, `id_number`, `date_of_birth`, `nationality`, `county`, `address`, `email`, `phone`, `age`, `gender`, `department_id`, `intake_id`, `admission_date`, `status`, `branch_id`, `guardian_name`, `guardian_contact`, `course_id`, `level_id`) VALUES
('STU001', 'John', 'Maina', NULL, '2024-02-02', 'Kenyan', NULL, NULL, 'johnole@gmail.com', '0712345678', NULL, 'Male', 1, NULL, NULL, 'Active', NULL, NULL, NULL, NULL, NULL),
('STU002', 'MERCY', 'VAATI', NULL, '2025-02-02', 'Kenyan', NULL, NULL, 'mercy@example.com', NULL, NULL, NULL, 1, NULL, NULL, 'Active', 1, NULL, NULL, NULL, NULL),
('STU003', 'SALIMA', 'WANJALA', NULL, NULL, 'Kenyan', NULL, NULL, 'salima@example.com', NULL, NULL, NULL, 1, NULL, NULL, 'Active', 1, NULL, NULL, NULL, NULL),
('STU004', 'MARY', 'KALIMI', NULL, NULL, 'Kenyan', NULL, NULL, 'mary@example.com', NULL, NULL, NULL, 1, NULL, NULL, 'Active', 1, NULL, NULL, NULL, NULL),
('STU005', 'MITCHEL', 'ATIENO', NULL, NULL, 'Kenyan', NULL, NULL, 'mitchel@example.com', NULL, NULL, NULL, 1, NULL, NULL, 'Active', 1, NULL, NULL, NULL, NULL),
('STU006', 'MARRYANNE', 'AKOTH', NULL, NULL, 'Kenyan', NULL, NULL, 'marryanne@example.com', NULL, NULL, NULL, 1, NULL, NULL, 'Active', 1, NULL, NULL, NULL, NULL),
('STU007', 'MERCY', 'NEKESA', NULL, NULL, 'Kenyan', NULL, NULL, 'mercynekesa@example.com', NULL, NULL, NULL, 1, NULL, NULL, 'Active', 1, NULL, NULL, NULL, NULL),
('STU008', 'VALLARY', 'GOZERO', NULL, NULL, 'Kenyan', NULL, NULL, 'vallary@example.com', NULL, NULL, NULL, 1, NULL, NULL, 'Active', 1, NULL, NULL, NULL, NULL),
('STU009', 'SHEILA', 'ATIENO', NULL, NULL, 'Kenyan', NULL, NULL, 'sheila@example.com', NULL, NULL, NULL, 1, NULL, NULL, 'Active', 1, NULL, NULL, NULL, NULL),
('STU011', 'Anne', 'Adhiambo', NULL, NULL, 'Kenyan', NULL, NULL, 'anne.new@example.com', '0712345678', 22, 'Female', 1, NULL, NULL, 'Active', NULL, NULL, NULL, NULL, NULL),
('STU012', 'SAMMY', 'KITUKU', NULL, NULL, 'Kenyan', NULL, NULL, 'sammy@example.com', NULL, NULL, NULL, 1, NULL, NULL, 'Active', 1, NULL, NULL, NULL, NULL),
('STU013', 'PATRICK', 'KYLO', NULL, NULL, 'Kenyan', NULL, NULL, 'patrick@example.com', NULL, NULL, NULL, 1, NULL, NULL, 'Active', 1, NULL, NULL, NULL, NULL),
('STU015', 'MITCHAEL', 'GACHUMA', NULL, NULL, 'Kenyan', NULL, NULL, 'michael@example.com', NULL, NULL, NULL, 1, NULL, NULL, 'Active', 1, NULL, NULL, NULL, NULL),
('STU016', 'JANE', 'AKOCHI', NULL, NULL, 'Kenyan', NULL, NULL, 'jane@example.com', NULL, NULL, NULL, 1, NULL, NULL, 'Active', 1, NULL, NULL, NULL, NULL),
('STU019', 'VALLARY', 'ASIKO', NULL, NULL, 'Kenyan', NULL, NULL, 'vallaryasiko@example.com', NULL, NULL, NULL, 1, NULL, NULL, 'Active', 1, NULL, NULL, NULL, NULL),
('STU020', 'LINET', 'KAGEMA', NULL, NULL, 'Kenyan', NULL, NULL, 'linet@example.com', NULL, NULL, NULL, 1, NULL, NULL, 'Active', 1, NULL, NULL, NULL, NULL),
('STU021', 'STEPHEN', 'NGALA', NULL, NULL, 'Kenyan', NULL, NULL, 'stephen@example.com', NULL, NULL, NULL, 1, NULL, NULL, 'Active', 1, NULL, NULL, NULL, NULL),
('STU023', 'TRACY', 'OBIERO', NULL, NULL, 'Kenyan', NULL, NULL, 'tracy@example.com', NULL, NULL, NULL, 3, NULL, NULL, 'Active', 1, NULL, NULL, NULL, NULL),
('STU025', 'SARA', 'WANJIKO', NULL, NULL, 'Kenyan', NULL, NULL, 'sara@example.com', NULL, NULL, NULL, 1, NULL, NULL, 'Active', 1, NULL, NULL, NULL, NULL),
('STU028', 'Anne', 'Adhiambo', NULL, NULL, 'Kenyan', NULL, NULL, 'annew@example.com', '0712345678', 22, 'Female', 1, NULL, NULL, 'Active', NULL, NULL, NULL, NULL, NULL),
('STU029', 'Jeremy', 'Bravoge', NULL, NULL, 'Kenyan', NULL, NULL, 'cndid@jndj', '02020202', NULL, 'Male', 3, NULL, '2025-09-14', 'Active', NULL, NULL, NULL, NULL, NULL),
('STU030', 'Eshter ', 'Adhiambo', '1782729', '2022-12-12', 'Kenyan', 'KIM', 'kim', 'cnddsid@jndj', '02020202', NULL, 'Female', 1, NULL, '2025-09-14', 'Active', 1, 'KIM', '0718292', NULL, NULL),
('STU031', 'Dan ', 'Dantez', NULL, NULL, 'Kenyan', NULL, NULL, 'dan@gmail.com', '0115000514', NULL, 'Male', NULL, NULL, NULL, 'Active', NULL, NULL, NULL, NULL, NULL),
('STU032', 'Sam', 'Onditi', NULL, NULL, 'Kenyan', NULL, NULL, 'sam@gmail.com', '043746464', NULL, 'Male', 1, NULL, '2025-09-15', 'Active', NULL, NULL, NULL, NULL, NULL),
('STU034', 'Gorge', 'Maina', NULL, NULL, 'Kenyan', NULL, NULL, 'music@gmail.com', '02020202', NULL, 'Male', 3, NULL, NULL, 'Active', NULL, NULL, NULL, NULL, NULL),
('STU035', 'Jeremy', 'Codemaster', NULL, NULL, 'Kenyan', NULL, NULL, 'codemasterr@gmail.com', '0115000514', NULL, 'Male', 1, NULL, '2025-09-19', 'Active', NULL, NULL, NULL, NULL, NULL),
('STU036', 'Steve', 'Stevo', NULL, NULL, 'Kenyan', NULL, NULL, 'stevo@gmail.com', '0748484848', NULL, 'Male', 1, NULL, '2025-09-19', 'Active', NULL, NULL, NULL, NULL, NULL),
('STU037', 'Evans ', 'Maina', '646554t46', '2006-12-13', 'Kenyan', 'Vihiga', 'Naks', 'Ekwanda@gmail.com', '0115000514', NULL, 'Male', 1, NULL, '2025-09-24', 'Active', 1, 'Gaki', '07849494', NULL, NULL),
('STU038', 'Jeremy', 'Bravoge', NULL, NULL, 'Kenyan', NULL, NULL, 'codej@gmail.com', '0115000514', NULL, 'Male', 1, NULL, '2025-09-29', 'Active', NULL, NULL, NULL, NULL, NULL),
('STU039', 'Gorge', 'Muchini', NULL, NULL, 'Kenyan', NULL, NULL, 'codemuchini@gmail.com', '0115000514', NULL, 'Male', 3, NULL, '2025-10-01', 'Active', NULL, NULL, NULL, NULL, NULL),
('STU040', 'JOY ', 'KAWIRA', NULL, NULL, 'Kenyan', NULL, NULL, 'kukumoto@gmail.com', '0115000514', NULL, 'Female', 1, NULL, '2025-10-02', 'Active', NULL, NULL, NULL, NULL, NULL),
('STU041', 'Collins', 'Omorro', '263737', '2000-12-12', 'Kenyan', 'kim', 'kim', 'collins@gmail.com', '03984949', NULL, 'Male', 1, NULL, '2025-10-02', 'Active', 1, 'kim', '083838388', NULL, NULL),
('STU042', 'Jeremy', 'Omollo', NULL, NULL, 'Kenyan', NULL, NULL, 'f@gmail.com', '0115000514', NULL, 'Male', 1, NULL, '2025-10-16', 'Active', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `student_performance`
--

CREATE TABLE `student_performance` (
  `id` int NOT NULL,
  `student_id` varchar(20) NOT NULL,
  `module_id` int NOT NULL,
  `theory_marks` int DEFAULT NULL,
  `practical_marks` int DEFAULT NULL,
  `grade` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `student_performance`
--

INSERT INTO `student_performance` (`id`, `student_id`, `module_id`, `theory_marks`, `practical_marks`, `grade`) VALUES
(4, 'STU001', 3, 74, 80, 'CREDIT'),
(5, 'STU001', 2, 60, 70, 'PASS'),
(6, 'STU001', 7, 60, 70, 'PASS'),
(7, 'STU001', 10, 70, 80, 'CREDIT'),
(8, 'STU001', 6, 74, 70, 'CREDIT'),
(9, 'STU001', 7, 71, 90, 'DISTINCTION'),
(10, 'STU001', 8, 60, 60, 'PASS'),
(11, 'STU001', 9, 80, 80, 'DISTINCTION');

-- --------------------------------------------------------

--
-- Stand-in structure for view `student_summary`
-- (See below for the actual view)
--
CREATE TABLE `student_summary` (
`average_mark` decimal(14,2)
,`exam_status` varchar(10)
,`student_id` varchar(20)
,`student_name` varchar(101)
,`total_modules` bigint
);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int NOT NULL,
  `student_id` varchar(20) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `payment_method` enum('cash','bank-transfer','mobile-money','credit-card') DEFAULT NULL,
  `reference` varchar(50) DEFAULT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `student_id`, `amount`, `payment_method`, `reference`, `date`) VALUES
(1, 'STU030', 5000.00, 'cash', 'MPESA123XYZ', '2025-09-14 19:22:30'),
(2, 'STU029', 3000.00, 'cash', 'MPESA123XYZ', '2025-09-14 19:29:50'),
(3, 'STU029', 1000.00, 'cash', '122434', '2025-09-14 19:36:16'),
(4, 'STU001', 100.00, 'cash', '122434', '2025-09-14 19:38:28'),
(5, 'STU006', 600.00, 'cash', '212122', '2025-09-14 19:39:30'),
(6, 'STU018', 300.00, 'cash', '12121212', '2025-09-14 20:29:23'),
(7, 'STU018', 49.00, 'cash', '212122', '2025-09-14 20:30:25'),
(8, 'STU018', 1.00, 'cash', '122434', '2025-09-14 20:31:24'),
(9, 'STU031', 1000.00, 'cash', 'BWWT1112', '2025-09-15 06:54:58'),
(10, 'STU031', 1000.00, 'cash', 'BWWT1112', '2025-09-15 07:40:57'),
(11, 'STU032', 1000.00, 'cash', 'RYFREWSA', '2025-09-15 10:32:07'),
(12, 'STU033', 1000.00, 'cash', 'BWWT1112', '2025-09-16 06:57:14'),
(13, 'STU003', 30.00, 'bank-transfer', 'BWWT1112', '2025-09-17 20:34:46'),
(14, 'STU033', 349.00, 'mobile-money', '212122', '2025-09-17 20:36:23'),
(15, 'STU034', 700.00, 'cash', 'BWWT1112', '2025-09-19 10:51:48'),
(16, 'STU035', 1000.00, 'mobile-money', 'BWWT1112', '2025-09-19 11:05:59'),
(17, 'STU036', 1350.00, 'cash', 'BWWT1112', '2025-09-19 14:33:28'),
(18, 'STU037', 1000.00, 'cash', 'QWWRERTEE', '2025-09-24 18:01:39'),
(19, 'STU037', 50.00, 'cash', 'BWWT1112', '2025-09-25 10:47:32'),
(20, 'STU037', 150.00, 'cash', '7878877#', '2025-09-29 07:43:46'),
(21, 'STU039', 2000.00, 'cash', '122434', '2025-10-01 10:25:39'),
(22, 'STU040', 2000.00, 'cash', NULL, '2025-10-02 14:05:31'),
(23, 'STU041', 1200.00, 'cash', NULL, '2025-10-02 20:59:04'),
(24, 'STU041', 100.00, 'cash', NULL, '2025-10-02 21:00:01'),
(25, 'STU042', 500.00, 'cash', '122434', '2025-10-15 23:19:10');

-- --------------------------------------------------------

--
-- Stand-in structure for view `transaction_details`
-- (See below for the actual view)
--
CREATE TABLE `transaction_details` (
`amount` decimal(10,2)
,`date` timestamp
,`payment_method` enum('cash','bank-transfer','mobile-money','credit-card')
,`reference` varchar(50)
,`student_name` varchar(101)
,`transaction_no` int
);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
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
  `created_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `username`, `email`, `password`, `role`, `branch_id`, `phone`, `address`, `date_of_birth`, `status`, `profile_image`, `created_at`, `updated_at`, `last_login`, `created_by`) VALUES
(15, 'Bravoge', 'bravoge', 'cohacohat@gmail.com', '$2b$10$Q1Yqp9fHz18lQWX3Iw1Ukurcg8vTv7ZYGqrJruoIRyUjAYclGy.I.', 'admin', 1, '07458173599', NULL, NULL, 'active', '1760447339070-711431376.jpg', '2025-09-13 11:23:19', '2025-10-14 13:09:16', NULL, NULL),
(50, 'Masharia', 'munene', 'mashariamunene@gmail.com', '$2b$10$/BfXqxMXeuQZXK8Hm4uiyOaLOqxD9hSW6/q3Wet/GMBipXtcv.FmG', 'admin', 1, '0115000514', NULL, NULL, 'active', '1760507096534-247292598.jpg', '2025-10-14 13:31:52', '2025-10-15 05:44:56', NULL, NULL),
(51, '', 'Jeremy bravoge', '', '$2b$10$o/gwvApK8GL3Xvgkgd9aDOy6viY4wVbupjKSTI4RFAvDvGUMLvWuy', 'student', NULL, '', NULL, NULL, 'active', NULL, '2025-10-22 16:26:54', '2025-10-22 16:26:54', NULL, NULL),
(56, '', 'teacher1', 'codemaster5362@gmail.com', '$2b$10$NStPkyjx742aN8uVSpEv8.Udkrnc6Yu9GnxKX4JsHWhm.XiyEgK0e', 'student', NULL, '', NULL, NULL, 'active', NULL, '2025-10-23 09:12:01', '2025-10-23 09:12:01', NULL, NULL);

-- --------------------------------------------------------

--
-- Structure for view `student_summary`
--
DROP TABLE IF EXISTS `student_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `student_summary`  AS SELECT `s`.`id` AS `student_id`, concat(`s`.`first_name`,' ',`s`.`last_name`) AS `student_name`, count(`sp`.`module_id`) AS `total_modules`, round(avg(((`sp`.`theory_marks` + `sp`.`practical_marks`) / 2)),2) AS `average_mark`, (case when (count(`sp`.`module_id`) = 0) then 'Incomplete' when (round(avg(((`sp`.`theory_marks` + `sp`.`practical_marks`) / 2)),2) >= 50) then 'Pass' else 'Fail' end) AS `exam_status` FROM (`students` `s` left join `student_performance` `sp` on((`s`.`id` = `sp`.`student_id`))) GROUP BY `s`.`id`, `s`.`first_name`, `s`.`last_name` ;

-- --------------------------------------------------------

--
-- Structure for view `transaction_details`
--
DROP TABLE IF EXISTS `transaction_details`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `transaction_details`  AS SELECT `t`.`id` AS `transaction_no`, concat(`s`.`first_name`,' ',`s`.`last_name`) AS `student_name`, `t`.`amount` AS `amount`, `t`.`payment_method` AS `payment_method`, `t`.`reference` AS `reference`, `t`.`date` AS `date` FROM (`transactions` `t` left join `students` `s` on((`t`.`student_id` = `s`.`id`))) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activities`
--
ALTER TABLE `activities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_attendance_student` (`student_id`),
  ADD KEY `fk_attendance_course` (`course_id`);

--
-- Indexes for table `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_course_department` (`department_id`);

--
-- Indexes for table `course_facilities`
--
ALTER TABLE `course_facilities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `facility_id` (`facility_id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_enroll_student` (`student_id`),
  ADD KEY `fk_enroll_course` (`course_id`),
  ADD KEY `fk_enroll_intake` (`intake_id`);

--
-- Indexes for table `exam_results`
--
ALTER TABLE `exam_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `facilities`
--
ALTER TABLE `facilities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `facility_repairs`
--
ALTER TABLE `facility_repairs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `facility_id` (`facility_id`);

--
-- Indexes for table `fees`
--
ALTER TABLE `fees`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_fee_student` (`student_id`);

--
-- Indexes for table `instructors`
--
ALTER TABLE `instructors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_instructor_department` (`department_id`);

--
-- Indexes for table `instructor_courses`
--
ALTER TABLE `instructor_courses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `instructor_id` (`instructor_id`,`course_id`),
  ADD KEY `fk_instructor_course_course` (`course_id`);

--
-- Indexes for table `intakes`
--
ALTER TABLE `intakes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `levels`
--
ALTER TABLE `levels`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `modules`
--
ALTER TABLE `modules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `level_id` (`level_id`);

--
-- Indexes for table `results`
--
ALTER TABLE `results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `id_number` (`id_number`),
  ADD KEY `fk_students_department` (`department_id`),
  ADD KEY `fk_students_intake` (`intake_id`),
  ADD KEY `fk_student_branch` (`branch_id`),
  ADD KEY `fk_student_course` (`course_id`),
  ADD KEY `fk_student_level` (`level_id`);

--
-- Indexes for table `student_performance`
--
ALTER TABLE `student_performance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `module_id` (`module_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_branch` (`branch_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activities`
--
ALTER TABLE `activities`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=109;

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `branches`
--
ALTER TABLE `branches`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `course_facilities`
--
ALTER TABLE `course_facilities`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `exam_results`
--
ALTER TABLE `exam_results`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `facilities`
--
ALTER TABLE `facilities`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `facility_repairs`
--
ALTER TABLE `facility_repairs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `fees`
--
ALTER TABLE `fees`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=194;

--
-- AUTO_INCREMENT for table `instructors`
--
ALTER TABLE `instructors`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `instructor_courses`
--
ALTER TABLE `instructor_courses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `intakes`
--
ALTER TABLE `intakes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `levels`
--
ALTER TABLE `levels`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `modules`
--
ALTER TABLE `modules`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `results`
--
ALTER TABLE `results`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `student_performance`
--
ALTER TABLE `student_performance`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activities`
--
ALTER TABLE `activities`
  ADD CONSTRAINT `activities_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `fk_attendance_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  ADD CONSTRAINT `fk_attendance_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `fk_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  ADD CONSTRAINT `fk_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`);

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `fk_course_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  ADD CONSTRAINT `fk_courses_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`);

--
-- Constraints for table `course_facilities`
--
ALTER TABLE `course_facilities`
  ADD CONSTRAINT `course_facilities_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `course_facilities_ibfk_2` FOREIGN KEY (`facility_id`) REFERENCES `facilities` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `enrollments_ibfk_3` FOREIGN KEY (`intake_id`) REFERENCES `intakes` (`id`),
  ADD CONSTRAINT `fk_enroll_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  ADD CONSTRAINT `fk_enroll_intake` FOREIGN KEY (`intake_id`) REFERENCES `intakes` (`id`),
  ADD CONSTRAINT `fk_enroll_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `fk_enrollment_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  ADD CONSTRAINT `fk_enrollment_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`);

--
-- Constraints for table `exam_results`
--
ALTER TABLE `exam_results`
  ADD CONSTRAINT `exam_results_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `facility_repairs`
--
ALTER TABLE `facility_repairs`
  ADD CONSTRAINT `facility_repairs_ibfk_1` FOREIGN KEY (`facility_id`) REFERENCES `facilities` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `fees`
--
ALTER TABLE `fees`
  ADD CONSTRAINT `fees_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `fk_fee_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `fk_fees_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`);

--
-- Constraints for table `instructors`
--
ALTER TABLE `instructors`
  ADD CONSTRAINT `fk_instructor_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  ADD CONSTRAINT `instructors_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`);

--
-- Constraints for table `instructor_courses`
--
ALTER TABLE `instructor_courses`
  ADD CONSTRAINT `fk_instructor_course_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  ADD CONSTRAINT `fk_instructor_course_instructor` FOREIGN KEY (`instructor_id`) REFERENCES `instructors` (`id`),
  ADD CONSTRAINT `instructor_courses_ibfk_1` FOREIGN KEY (`instructor_id`) REFERENCES `instructors` (`id`),
  ADD CONSTRAINT `instructor_courses_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`);

--
-- Constraints for table `modules`
--
ALTER TABLE `modules`
  ADD CONSTRAINT `modules_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `modules_ibfk_2` FOREIGN KEY (`level_id`) REFERENCES `levels` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `results`
--
ALTER TABLE `results`
  ADD CONSTRAINT `results_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `results_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`);

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `fk_student_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  ADD CONSTRAINT `fk_student_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  ADD CONSTRAINT `fk_student_level` FOREIGN KEY (`level_id`) REFERENCES `levels` (`id`),
  ADD CONSTRAINT `fk_students_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_students_intake` FOREIGN KEY (`intake_id`) REFERENCES `intakes` (`id`);

--
-- Constraints for table `student_performance`
--
ALTER TABLE `student_performance`
  ADD CONSTRAINT `student_performance_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `student_performance_ibfk_2` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;