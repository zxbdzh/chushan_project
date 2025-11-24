package com.zxb.api.controller;

import com.zxb.api.config.AmazonS3Config;
import com.zxb.api.utils.AmazonS3Util;
import com.zxb.api.utils.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RequestMapping("/common")
@RestController
@Slf4j
@Tag(name = "通用接口")
public class CommonController {
    private final AmazonS3Config amazonS3Config;

    public CommonController(AmazonS3Config amazonS3Config) {
        this.amazonS3Config = amazonS3Config;
    }

    @PostMapping("/upload")
    @Operation(summary = "上传文件")
    public Result<String> handleFileUpload(@RequestParam MultipartFile file) {

        // s3上传文件
        String s = AmazonS3Util.uploadFile(file, "webstack-vue");
        // 拼接返回地址
        s = amazonS3Config.getS3Url() + s;

        return Result.success(s);
    }
}
