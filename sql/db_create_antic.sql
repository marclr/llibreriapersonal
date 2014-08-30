SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`Client`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `mydb`.`Client` (
  `customer_id` INT NOT NULL ,
  `name` VARCHAR(255) NULL ,
  `surname` VARCHAR(255) NULL ,
  `address` VARCHAR(512) NULL ,
  `city` VARCHAR(255) NULL ,
  `post_code` VARCHAR(10) NULL ,
  `country` VARCHAR(255) NULL ,
  `born_date` DATETIME NULL ,
  `sex` CHAR(1) NULL ,
  `e-mail` VARCHAR(255) NULL ,
  `phone` VARCHAR(45) NULL ,
  `date_add` DATETIME NULL ,
  `date_update` DATETIME NULL ,
  `Clientcol` VARCHAR(45) NULL ,
  PRIMARY KEY (`customer_id`) ,
  UNIQUE INDEX `e-mail_UNIQUE` (`e-mail` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Order`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `mydb`.`Order` (
  `order_id` INT NOT NULL ,
  `description` VARCHAR(1024) NULL ,
  `date` DATETIME NULL ,
  `token` VARCHAR(45) NULL ,
  `date_add` DATETIME NULL ,
  `date_update` DATETIME NULL ,
  `customer_id` INT NOT NULL ,
  PRIMARY KEY (`order_id`) ,
  INDEX `fk_Orders_Customers1_idx` (`customer_id` ASC) ,
  CONSTRAINT `fk_Orders_Customers1`
    FOREIGN KEY (`customer_id` )
    REFERENCES `mydb`.`Client` (`customer_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`OrderLine`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `mydb`.`OrderLine` (
  `order_line_id` INT NOT NULL ,
  `product_code` VARCHAR(200) NULL ,
  `product_name` VARCHAR(1024) NULL ,
  `price` DECIMAL(17,2) NULL ,
  `date_add` DATETIME NULL ,
  `date_update` DATETIME NULL ,
  `order_id` INT NOT NULL ,
  PRIMARY KEY (`order_line_id`) ,
  INDEX `fk_OrderLines_Orders1_idx` (`order_id` ASC) ,
  CONSTRAINT `fk_OrderLines_Orders1`
    FOREIGN KEY (`order_id` )
    REFERENCES `mydb`.`Order` (`order_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Opinion`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `mydb`.`Opinion` (
  `opinion_id` INT NOT NULL ,
  `description` VARCHAR(4000) NULL ,
  `rating` INT NULL ,
  `date` DATETIME NULL ,
  `date_add` DATETIME NULL ,
  `date_update` DATETIME NULL ,
  `order_id` INT NOT NULL ,
  `lang` VARCHAR(3) NULL ,
  PRIMARY KEY (`opinion_id`) ,
  INDEX `fk_Opinions_Orders1_idx` (`order_id` ASC) ,
  CONSTRAINT `fk_Opinions_Orders1`
    FOREIGN KEY (`order_id` )
    REFERENCES `mydb`.`Order` (`order_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Shop`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `mydb`.`Shop` (
  `user_id` INT NOT NULL ,
  `name` VARCHAR(255) NULL ,
  `address` VARCHAR(512) NULL ,
  `url` VARCHAR(512) NULL ,
  `phone` VARCHAR(45) NULL ,
  `email` VARCHAR(255) NULL ,
  `logo_url` VARCHAR(1024) NULL ,
  `hours_to_email` INT NULL ,
  `username` VARCHAR(45) NULL ,
  `password` VARCHAR(45) NULL ,
  `token` VARCHAR(45) NULL ,
  `data_add` DATETIME NULL ,
  `date_update` DATETIME NULL ,
  `is_client` TINYINT NOT NULL DEFAULT 0 ,
  `url_scrap` VARCHAR(512) NULL ,
  PRIMARY KEY (`user_id`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Shop_Client`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `mydb`.`Shop_Client` (
  `Users_user_id` INT NOT NULL ,
  `Customers_customer_id` INT NOT NULL ,
  PRIMARY KEY (`Users_user_id`, `Customers_customer_id`) ,
  INDEX `fk_Users_has_Customers_Customers1_idx` (`Customers_customer_id` ASC) ,
  INDEX `fk_Users_has_Customers_Users1_idx` (`Users_user_id` ASC) ,
  CONSTRAINT `fk_Users_has_Customers_Users1`
    FOREIGN KEY (`Users_user_id` )
    REFERENCES `mydb`.`Shop` (`user_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Users_has_Customers_Customers1`
    FOREIGN KEY (`Customers_customer_id` )
    REFERENCES `mydb`.`Client` (`customer_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`OrderPending`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `mydb`.`OrderPending` (
  `Orders_order_id` INT NOT NULL ,
  INDEX `fk_OrderPending_Orders1_idx` (`Orders_order_id` ASC) ,
  PRIMARY KEY (`Orders_order_id`) ,
  CONSTRAINT `fk_OrderPending_Orders1`
    FOREIGN KEY (`Orders_order_id` )
    REFERENCES `mydb`.`Order` (`order_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
