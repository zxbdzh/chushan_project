package com.zxb.api.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalTimeSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

/**
 * Jackson配置类，用于处理时间格式序列化和反序列化
 */
@Configuration
public class JacksonConfig {

    /**
     * 配置ObjectMapper，支持LocalTime的多种格式
     */
    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        
        // 注册JavaTimeModule
        JavaTimeModule javaTimeModule = new JavaTimeModule();
        
        // 配置LocalTime序列化器 - 输出HH:mm:ss格式
        javaTimeModule.addSerializer(LocalTime.class, 
            new LocalTimeSerializer(DateTimeFormatter.ofPattern("HH:mm:ss")));
        
        // 配置LocalTime反序列化器 - 支持HH:mm和HH:mm:ss格式
        javaTimeModule.addDeserializer(LocalTime.class, 
            new CustomLocalTimeDeserializer());
        
        mapper.registerModule(javaTimeModule);
        
        return mapper;
    }
}