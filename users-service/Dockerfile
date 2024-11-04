FROM openjdk:17-jdk-alpine
COPY target/users-service-0.0.1-SNAPSHOT.jar user-service.jar
ENTRYPOINT ["java", "-jar", "user-service.jar"]
EXPOSE 8081
