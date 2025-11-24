package com.zxb.api.utils;

import lombok.Getter;

@Getter
public class Result<T> {
    // Getter (根据需要可省略Setter)
    private int code;     // 状态码（200=成功，非200为异常）
    private String msg;   // 提示信息
    private T data;       // 响应数据
    private final long timestamp = System.currentTimeMillis(); // 自动生成时间戳

    // 成功静态方法
    public static <T> Result<T> success() {
        return success(null);
    }

    public static <T> Result<T> success(T data) {
        Result<T> result = new Result<>();
        result.code = 200;
        result.msg = "Success";
        result.data = data;
        return result;
    }

    // 错误静态方法
    public static <T> Result<T> error(String message) {
        return error(500, message);
    }

    public static <T> Result<T> error(int code, String message) {
        Result<T> result = new Result<>();
        result.code = code;
        result.msg = message;
        return result;
    }

    // 链式调用方法
    public Result<T> code(int code) {
        this.code = code;
        return this;
    }

    public Result<T> msg(String msg) {
        this.msg = msg;
        return this;
    }

    public Result<T> data(T data) {
        this.data = data;
        return this;
    }

}