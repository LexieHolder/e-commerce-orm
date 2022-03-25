-- DROP DATABASE
DROP DATABASE IF EXISTS ecommerce_db;

-- CREATE DATABASE
CREATE DATABASE ecommerce_db;

CREATE TABLE Category (
    id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
    category_name STRING NOT NULL
);

CREATE TABLE Product (
    id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
    product_name STRING NOT NULL,
    price DECIMAL(6,2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT '10',
    category_id INTEGER REFERENCES category(id),
    FOREIGN KEY(category)
);

CREATE TABLE Tag (
    id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    tag_name STRING,
    FOREIGN KEY(product)
);

CREATE TABLE ProductTag (
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_id INTEGER REFERENCES product(id)
);
