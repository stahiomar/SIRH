package com.omar.S3Manager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class })
public class S3ManagerApplication {

	public static void main(String[] args) {
		SpringApplication.run(S3ManagerApplication.class, args);
	}

}
