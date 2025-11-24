package com.zxb.api.utils;

public class ThreadLocalUtil<T> {
    private static final ThreadLocal<Object> threadLocal = new ThreadLocal<>();

    /**
     * 设置当前线程的上下文数据
     *
     * @param value 要设置的值
     */
    public void set(T value) {
        threadLocal.set(value);
    }

    /**
     * 获取当前线程的上下文数据
     *
     * @return 当前线程存储的值
     */
    @SuppressWarnings("unchecked")
    public T get() {
        return (T) threadLocal.get();
    }

    /**
     * 清除当前线程的上下文数据
     */
    public void remove() {
        threadLocal.remove();
    }

}
