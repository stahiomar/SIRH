package com.omar.S3Manager;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.net.URL;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final AmazonS3 s3Client;

    public Bucket getBucket(String bucketName) {
        List<Bucket> buckets = s3Client.listBuckets();
        for (Bucket b : buckets) {
            if (b.getName().equals(bucketName)) {
                return b;
            }
        }
        return null;
    }

    public List<Bucket> listBuckets() {
        return s3Client.listBuckets();
    }

    public Bucket createBucket(String bucketName) {
        if (s3Client.doesBucketExistV2(bucketName)) {
            System.out.format("Bucket %s already exists.\n", bucketName);
            return getBucket(bucketName);
        } else {
            try {
                return s3Client.createBucket(bucketName);
            } catch (AmazonS3Exception e) {
                System.err.println(e.getErrorMessage());
                return null;
            }
        }
    }

    public void createFolder(String bucketName, String folderName) {
        // Check if the bucket exists
        if (s3Client.doesBucketExistV2(bucketName)) {
            // Create metadata for the object
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(0);

            // Create an empty InputStream
            ByteArrayInputStream emptyContent = new ByteArrayInputStream(new byte[0]);

            // Create an empty object with a key ending in '/'
            s3Client.putObject(bucketName, folderName + "/", emptyContent, metadata);
            System.out.println("Folder " + folderName + " created in bucket " + bucketName);
        } else {
            System.err.println("Bucket " + bucketName + " does not exist.");
        }
    }

    public List<String> listPdfFilesInFolder(String bucketName, String folderName) {
        ListObjectsV2Request request = new ListObjectsV2Request()
                .withBucketName(bucketName)
                .withPrefix(folderName + "/")
                .withDelimiter("/");

        ListObjectsV2Result result = s3Client.listObjectsV2(request);

        // Define the date format you want
        SimpleDateFormat sdf = new SimpleDateFormat("MM/yyyy");

        return result.getObjectSummaries().stream()
                .map(summary -> {
                    String key = summary.getKey();
                    if (key.endsWith(".pdf")) {
                        // Fetch the upload date
                        Date uploadDate = s3Client.getObjectMetadata(bucketName, key).getLastModified();
                        String formattedDate = sdf.format(uploadDate);
                        String presignedUrl = generatePresignedUrl(bucketName, key);
                        return formattedDate + "+" + presignedUrl;
                    }
                    return null;
                })
                .filter(Objects::nonNull) // Filter out any null values
                .collect(Collectors.toList());
    }

    public String generatePresignedUrl(String bucketName, String objectKey) {
        Date expiration = new Date();
        long expTimeMillis = expiration.getTime();
        expTimeMillis += 1000 * 60 * 60; // 1 hour
        expiration.setTime(expTimeMillis);

        GeneratePresignedUrlRequest generatePresignedUrlRequest =
                new GeneratePresignedUrlRequest(bucketName, objectKey)
                        .withMethod(HttpMethod.GET)
                        .withExpiration(expiration);

        URL url = s3Client.generatePresignedUrl(generatePresignedUrlRequest);
        return url.toString();
    }

    public void uploadFile(String bucketName, String key, MultipartFile file) {
        try {
            // Get the file's input stream
            InputStream inputStream = file.getInputStream();

            // Create ObjectMetadata with the file's content type and size
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.getSize());
            metadata.setContentType(file.getContentType());

            // Upload the file to S3
            s3Client.putObject(new PutObjectRequest(bucketName, key, inputStream, metadata));

        } catch (Exception e) {
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    public String getLatestBulletin(String bucketName, String folderName) {
        List<String> bulletins = listPdfFilesInFolder(bucketName, folderName);

        // Find the most recent bulletin
        Optional<String> latestBulletin = bulletins.stream()
                .max(Comparator.comparing(bulletin -> {
                    // Extract the date from the bulletin
                    String datePart = bulletin.split("\\+")[0];
                    try {
                        SimpleDateFormat sdf = new SimpleDateFormat("MM/yyyy");
                        return sdf.parse(datePart);
                    } catch (ParseException e) {
                        e.printStackTrace();
                        return new Date(0);
                    }
                }));

        return latestBulletin.orElse(null);
    }
}
