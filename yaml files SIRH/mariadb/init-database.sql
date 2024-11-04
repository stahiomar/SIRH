CREATE DATABASE IF NOT EXISTS mydb;
USE mydb;

create table if not exists user
(
    id int auto_increment primary key,
    address          varchar(255)                                null,
    email            varchar(255)                                null,
    first_name       varchar(255)                                null,
    integration_date date                                        null,
    last_name        varchar(255)                                null,
    password         varchar(255)                                null,
    role             enum ('ADMIN', 'EMPLOYEE', 'HR', 'MANAGER') null,
    solde            int                                         null,
    team             varchar(255)                                null,
    username         varchar(255)                                null
);



create table if not exists holiday
(
    id int auto_increment primary key,
    end_date   date         null,
    note       varchar(255) null,
    start_date date         null,
    status     varchar(255) null,
    type       tinyint      null
        check (`type` between 0 and 4),
    user_id    int          null,
    constraint FKhglmpwbghyvuiv1b18vimsawc
        foreign key (user_id) references user (id)
);

