package com.example.back.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.auth.credentials.ProfileCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class S3Config {

    @Value("${app.s3.region:ap-southeast-1}")
    private String region;

    //  로컬/서버에서 aws configure로 만든 프로필명 사용 (없으면 Default 체인)
    @Value("${app.s3.profile:}")
    private String profile;

    @Bean
    public S3Client s3Client() {
        AwsCredentialsProvider provider =
                (StringUtils.hasText(profile))
                        ? ProfileCredentialsProvider.builder().profileName(profile).build()
                        : DefaultCredentialsProvider.create();

        return S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(provider)
                .build();
    }
}
