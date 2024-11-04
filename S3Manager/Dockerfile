FROM openjdk:17-jdk-alpine
COPY target/S3Manager-0.0.1-SNAPSHOT.jar s3manager-service.jar
ENTRYPOINT ["java", "-jar", "s3manager-service.jar"]
EXPOSE 8082