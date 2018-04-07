-- MySQL Script generated by MySQL Workbench
-- Sat Apr  7 17:38:26 2018
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema GK2018
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema GK2018
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `GK2018` DEFAULT CHARACTER SET utf8 ;
USE `GK2018` ;

-- -----------------------------------------------------
-- Table `GK2018`.`PORTPOLIO`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `GK2018`.`PORTPOLIO` ;

CREATE TABLE IF NOT EXISTS `GK2018`.`PORTPOLIO` (
  `POTRPOLIO_ID` INT NOT NULL,
  `PORTPOLIO_IMG` TEXT NULL COMMENT '각 페이지의 이미지를 ,로 구분하여 입력한다.',
  `PORTPOLIO_NAME` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`POTRPOLIO_ID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `GK2018`.`BOARD_INQUIRY`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `GK2018`.`BOARD_INQUIRY` ;

CREATE TABLE IF NOT EXISTS `GK2018`.`BOARD_INQUIRY` (
  `BOARD_INQUIRY_ID` INT NOT NULL,
  `BOARD_INQUIRY_TITLE` VARCHAR(50) NOT NULL,
  `BOARD_INQUIRY_CONTENT` TEXT NULL,
  `BOARD_INQUIRY_PW` VARCHAR(15) NOT NULL,
  `BOARD_INQUIRY_WRITER` VARCHAR(10) NOT NULL,
  `BOARD_INQUIRY_DATE` DATE NULL,
  `BOARD_INQUIRY_CNT` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`BOARD_INQUIRY_ID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `GK2018`.`COMMENT_INQUIRY`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `GK2018`.`COMMENT_INQUIRY` ;

CREATE TABLE IF NOT EXISTS `GK2018`.`COMMENT_INQUIRY` (
  `COMMENT_INQUIRY_ID` INT NOT NULL,
  `BOARD_INQUIRY_ID` INT NULL,
  `COMMENT_INQUIRY_CONTENT` TEXT NULL,
  `COMMENT_INQUIRY_WRITER` VARCHAR(10) NULL,
  `COMMENT_INQUIRY_DATE` DATE NULL,
  PRIMARY KEY (`COMMENT_INQUIRY_ID`),
  INDEX `BOARD_INQUIRY_ID_idx` (`BOARD_INQUIRY_ID` ASC),
  CONSTRAINT `BOARD_INQUIRY_ID`
    FOREIGN KEY (`BOARD_INQUIRY_ID`)
    REFERENCES `GK2018`.`BOARD_INQUIRY` (`BOARD_INQUIRY_ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `GK2018`.`BOARD_NOTICE`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `GK2018`.`BOARD_NOTICE` ;

CREATE TABLE IF NOT EXISTS `GK2018`.`BOARD_NOTICE` (
  `BOARD_NOTICE_ID` INT NOT NULL,
  `BOARD_NOTICE_TITLE` VARCHAR(50) NULL,
  `BOARD_NOTICE_CONTENT` TEXT NULL,
  `BOARD_NOTICE_WRITER` VARCHAR(10) NULL,
  `BOARD_NOTICE_DATE` DATE NULL,
  PRIMARY KEY (`BOARD_NOTICE_ID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `GK2018`.`BOARD_REVIEW`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `GK2018`.`BOARD_REVIEW` ;

CREATE TABLE IF NOT EXISTS `GK2018`.`BOARD_REVIEW` (
  `BOARD_REVIEW_ID` INT NOT NULL,
  `BOARD_REVIEW_TITLE` VARCHAR(50) NULL,
  `BOARD_REVIEW_CONTENT` TEXT NULL,
  `BOARD_REVIEW_WRITER` VARCHAR(10) NULL,
  `BOARD_REVIEW_DATE` DATE NULL,
  PRIMARY KEY (`BOARD_REVIEW_ID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `GK2018`.`GK_USERS`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `GK2018`.`GK_USERS` ;

CREATE TABLE IF NOT EXISTS `GK2018`.`GK_USERS` (
  `GK_USERS_ID` VARCHAR(10) NOT NULL,
  `GK_USERSc_PW` VARCHAR(15) NOT NULL,
  `GK_USERS_NAME` VARCHAR(20) NULL,
  `GK_USERS_EMAIL` VARCHAR(50) NOT NULL,
  `GK_USERS_PHONE` VARCHAR(11) NOT NULL,
  `GK_USERS_DATE` DATE NULL,
  `GK_USERS_STATUS` CHAR(2) NOT NULL COMMENT '가입 : T / 탈퇴 : F',
  PRIMARY KEY (`GK_USERS_ID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;