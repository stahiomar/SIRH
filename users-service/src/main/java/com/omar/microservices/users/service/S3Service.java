/*
package com.omar.microservices.users.service;

import lombok.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;

@Service
public class S3Service {
    private final S3Client s3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    public S3Service(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public String uploadFile(String fileName, byte[] fileContent) {
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .build();

        s3Client.putObject(request, RequestBody.fromBytes(fileContent));
        return "https://" + bucketName + ".s3.amazonaws.com/" + fileName;
    }
}
*/