package com.omar.SRH.api_gateway.routes;

import org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RequestPredicates;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

@Configuration
public class Routes {
    @Bean
    public RouterFunction<ServerResponse> holidayServiceRoute(){
        return GatewayRouterFunctions.route("holiday_service")
                .route(RequestPredicates.path("api/holiday"), HandlerFunctions.http("http://holidaysservice-service:8080"))
                .route(RequestPredicates.path("api/holiday/role-based-holidays"), HandlerFunctions.http("http://holidaysservice-service:8080"))
                .route(RequestPredicates.path("api/holiday/{id}/approve"), HandlerFunctions.http("http://holidaysservice-service:8080"))
                .route(RequestPredicates.path("api/holiday/{id}/disapprove"), HandlerFunctions.http("http://holidaysservice-service:8080"))
                .route(RequestPredicates.path("api/holiday/me/holidays"), HandlerFunctions.http("http://holidaysservice-service:8080"))
                .route(RequestPredicates.path("api/holiday/me/upcoming-holidays"), HandlerFunctions.http("http://holidaysservice-service:8080"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> userServiceRoute(){
        return GatewayRouterFunctions.route("user_service")
                .route(RequestPredicates.path("api/users"), HandlerFunctions.http("http://usersservice-service:8081"))
//                .route(RequestPredicates.path("api/users/login"), HandlerFunctions.http("http://localhost:8081"))
                .route(RequestPredicates.path("api/users/me"), HandlerFunctions.http("http://usersservice-service:8081"))
                .route(RequestPredicates.path("api/users/{id}"), HandlerFunctions.http("http://usersservice-service:8081"))
                .route(RequestPredicates.path("logout"), HandlerFunctions.http("http://usersservice-service:8081"))
                .route(RequestPredicates.path("api/users/me/solde"), HandlerFunctions.http("http://usersservice-service:8081"))
                .build();
    }
    
    @Bean
    public RouterFunction<ServerResponse> bulletinServiceRoute(){
        return GatewayRouterFunctions.route("s3_manager_service")
                .route(RequestPredicates.path("s3/buckets/{bucketName}/folders/{folderName}/pdfs"), HandlerFunctions.http("http://s3manager-service:8082"))
                .route(RequestPredicates.path("s3/buckets/bulletins/folders/{folderName}"), HandlerFunctions.http("http://s3manager-service:8082"))
                .route(RequestPredicates.path("s3/buckets/{bucketName}/folders/{folderName}/latest"), HandlerFunctions.http("http://s3manager-service:8082"))
                .route(RequestPredicates.path("s3/buckets/{bucketName}/files/{fileName}/upload-date"), HandlerFunctions.http("http://localhost:8082"))
                .build();
    }
}

