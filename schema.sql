DROP DATABASE IF EXISTS trackerDB;

CREATE DATABASE trackerDB;

USE trackerDB;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  primary key(id),
  name VARCHAR(30)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY(id),
  first_name varchar(50),
  last_name varchar(50),
  title VARCHAR(50),
  salary DECIMAL
);
