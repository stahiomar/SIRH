FROM openjdk:17-jdk-alpine
COPY target/api-gateway-0.0.1-SNAPSHOT.jar apigateway-service.jar
ENTRYPOINT ["java", "-jar", "apigateway-service.jar"]
EXPOSE 9000
