package com.omar.S3Manager;

import com.amazonaws.services.s3.model.Bucket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/s3")
public class S3Controller {

    private final S3Service s3Service;

    @Autowired
    public S3Controller(S3Service s3Service) {
        this.s3Service = s3Service;
    }

    @GetMapping("/buckets")
    public List<Bucket> listBuckets() {
        return s3Service.listBuckets();
    }

    @PostMapping("/buckets/{bucketName}")
    public Bucket createBucket(@PathVariable String bucketName) {
        return s3Service.createBucket(bucketName);
    }

    @GetMapping("/buckets/{bucketName}")
    public Bucket getBucket(@PathVariable String bucketName) {
        return s3Service.getBucket(bucketName);
    }

    @PostMapping("/buckets/{bucketName}/folders/{folderName}")
    public void createFolder(@PathVariable String bucketName, @PathVariable String folderName) {
        s3Service.createFolder(bucketName, folderName);
    }

    @GetMapping("/buckets/{bucketName}/folders/{folderName}/pdfs")
    public List<String> listPdfFilesInFolder(@PathVariable String bucketName, @PathVariable String folderName) {
        return s3Service.listPdfFilesInFolder(bucketName, folderName);
    }

    @PostMapping("/buckets/bulletins/folders/{folderName}")
    public ResponseEntity<String> uploadFileToFolder(
            @PathVariable String folderName,
            @RequestParam("file") MultipartFile file) {

        try {
            // Validate the file
            if (file.isEmpty()) {
                return new ResponseEntity<>("File is empty", HttpStatus.BAD_REQUEST);
            }

            // Build the full path in S3 (folder + file name)
            String key = folderName + "/" + file.getOriginalFilename();

            // Upload the file using the S3 service
            s3Service.uploadFile("bulletins", key, file);

            return new ResponseEntity<>("File uploaded successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to upload file: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/buckets/{bucketName}/folders/{folderName}/latest")
    public String getLatestBulletin(@PathVariable String bucketName, @PathVariable String folderName) {
        return s3Service.getLatestBulletin(bucketName, folderName);
    }
}

