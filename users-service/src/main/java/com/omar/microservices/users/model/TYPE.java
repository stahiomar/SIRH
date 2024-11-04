package com.omar.microservices.users.model;

import lombok.Getter;

@Getter
public enum TYPE {
    PAID_LEAVE,
    UNPAID_LEAVE,
    SICK_LEAVE,
    MATERNITY_LEAVE,
    PATERNITY_LEAVE
}