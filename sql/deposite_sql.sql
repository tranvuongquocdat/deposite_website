-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3636
-- Generation Time: Apr 10, 2024 at 05:05 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `deposite_sql`
--

-- --------------------------------------------------------

--
-- Table structure for table `money`
--

CREATE TABLE `money` (
  `user_name` text NOT NULL,
  `value` text NOT NULL,
  `httt_ma` text NOT NULL,
  `img_url` text NOT NULL,
  `ma_gd` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `money`
--

INSERT INTO `money` (`user_name`, `value`, `httt_ma`, `img_url`, `ma_gd`) VALUES
('email_from_session_or_db', '15000', '1', 'uploads/kh_img-1712604159182.jpg', 1),
('email_from_session_or_db', '15000000', '1', 'uploads/kh_img-1712604479079.jpg', 2),
('email_from_session_or_db', '20000000', '2', 'uploads/kh_img-1712604543935.jpg', 3),
('r', '12545454', '1', 'uploads/kh_img-1712604772493.jpg', 4),
('r', '15000000', '1', 'uploads/kh_img-1712609346726.jpg', 5);

-- --------------------------------------------------------

--
-- Table structure for table `thuhoivon`
--

CREATE TABLE `thuhoivon` (
  `ID` int(100) NOT NULL,
  `email` text NOT NULL,
  `cmnd` text NOT NULL,
  `value` text NOT NULL,
  `lydo` text NOT NULL,
  `qr_link` text DEFAULT NULL,
  `nguoi_nhan` text DEFAULT NULL,
  `bank_name` text DEFAULT NULL,
  `bank_account` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_name` varchar(255) NOT NULL,
  `pass` varchar(100) NOT NULL,
  `name` text NOT NULL,
  `gender` int(1) NOT NULL,
  `address` text DEFAULT NULL,
  `phone` varchar(15) NOT NULL,
  `email` varchar(50) NOT NULL,
  `date` text NOT NULL,
  `month` text NOT NULL,
  `year` text NOT NULL,
  `cmnd` text NOT NULL,
  `front_cmnd_url` text NOT NULL,
  `after_cmnd_url` text NOT NULL,
  `ma_moi` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_name`, `pass`, `name`, `gender`, `address`, `phone`, `email`, `date`, `month`, `year`, `cmnd`, `front_cmnd_url`, `after_cmnd_url`, `ma_moi`) VALUES
('1', '$2b$10$USZ1rr6laJCEXnYnR/tcFOR1EQTg2B9B1gH1LjebVJ19/yVogaanW', '1', 0, '1', '1@1', '1@1', '1', '1', '1', '1', '', '', NULL),
('5', '$2b$10$mCt/RvLicZOMcAOXUKNvyORqUoYHB204iYG7jNi3O.hcdwLUh3Npe', '5', 0, '5', '5', '5@5', '5', '5', '5', '5', 'info_images/cmnd_front-1712676571950.jpg', 'info_images/cmnd_after-1712676571951.jpg', '0'),
('6', '$2b$10$phtrUixxbXiUCdpsLJX0xesLsy4A/vEzpzR6ZIZ9KP2HzoRMpRlem', '6', 0, '6', '6', '6@6', '6', '6', '6', '6', 'info_images/cmnd_front-1712676680795.jpg', 'info_images/cmnd_after-1712676680795.jpg', ''),
('7', '$2b$10$OaTFFlTBlUUr/O3JRKXoBekZlOqtAl5XBiQDANB1TwUFyIuO/VtK.', '7', 0, '7', '7', '7@7', '7', '7', '7', '7', 'info_images/cmnd_front-1712687518385.jpg', 'info_images/cmnd_after-1712687518385.png', ''),
('8', '$2b$10$rHmjQj8G3TAAx9FE8BtNXOj1hsK7lVNo6yIZCGZ5SMRXp1sbVDZAy', '8', 0, '8', '8', '8@8', '8', '8', '8', '8', 'info_images/cmnd_front-1712688138539.jpg', 'info_images/cmnd_after-1712688138541.jpg', ''),
('9', '$2b$10$PpIz.3n65qBNXwoZP2MA.eWKMb/s.FVGG6fkGKuy1WzQa7bnB6mZ6', '9', 0, '9', '9', '9@9', '9', '9', '9', '9', 'info_images/cmnd_front-1712688911496.jpg', 'info_images/cmnd_after-1712688911499.jpg', ''),
('p', '$2b$10$dkcgZJvUU.cbWxWMJWbgk.aEntP/B54W2LNeEAdMjkl.PM8pWKGwq', 'p', 0, 'p', 'p', 'p@p', 'p', 'p', 'p', 'p', '', '', NULL),
('r', '$2b$10$3Fl33R45ATbwAosurKXzj.qlpiL5ZnKS9/8anS0e0jJskSAArv9Wu', 'r', 0, 'r', 'r', 'r@r', 'r', 'r', 'r', 'r', '', '', NULL),
('y', '$2b$10$PyDenN2R4D3Qm9VpEEgB6uNAKPss55/gQA0cer/J8l2UhXsc1JlOG', 'y', 0, 'y', 'y', 'y@y', 'y', 'y', 'y', 'y', '', '', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `money`
--
ALTER TABLE `money`
  ADD PRIMARY KEY (`ma_gd`);

--
-- Indexes for table `thuhoivon`
--
ALTER TABLE `thuhoivon`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_name`,`phone`,`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `money`
--
ALTER TABLE `money`
  MODIFY `ma_gd` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
