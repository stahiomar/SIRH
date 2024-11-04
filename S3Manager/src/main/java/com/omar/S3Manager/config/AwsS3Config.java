package com.omar.S3Manager.config;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.client.builder.AwsClientBuilder.EndpointConfiguration;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Data
@Configuration
public class AwsS3Config {

    @Value("${config.aws.region}") private String region;
    @Value("${config.aws.s3.url}") private String s3EndpointUrl;
    @Value("${config.aws.s3.bucket-name}") private String bucketName;
    @Value("${config.aws.s3.access-key}") private String accessKey;
    @Value("${config.aws.s3.secret-key}") private String secretKey;


    @Bean
    public AmazonS3 s3client() {
        BasicAWSCredentials awsCreds = new BasicAWSCredentials(accessKey, secretKey);
        return AmazonS3ClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(awsCreds))
                .withEndpointConfiguration(getEndpointConfiguration(s3EndpointUrl))
             //   .withPathStyleAccessEnabled(true) // Important for LocalStack
                .build();
    }

    private EndpointConfiguration getEndpointConfiguration(String url) {
        return new EndpointConfiguration(url, region);
    }
}
