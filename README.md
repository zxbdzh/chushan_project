# 锄山智慧旅游服务平台

## 项目简介

锄山智慧旅游服务平台是一个集成了地图服务、移动应用、管理后台和API接口的综合性旅游服务平台。该平台为游客提供景区导览、预约服务、特产购买等一站式旅游服务体验。

## 项目图片

![](https://minio.zxbdwy.online:443/picgo/21-47-43.png)
![](https://minio.zxbdwy.online:443/picgo/21-47-46.png)
![](https://minio.zxbdwy.online:443/picgo/21-47-49.png)
![](https://minio.zxbdwy.online:443/picgo/21-47-53.png)
![](https://minio.zxbdwy.online:443/picgo/21-47-58.png)
![](https://minio.zxbdwy.online:443/picgo/21-48-04.png)
![](https://minio.zxbdwy.online:443/picgo/21-46-23.png)
![](https://minio.zxbdwy.online:443/picgo/21-46-48.png)
![](https://minio.zxbdwy.online:443/picgo/21-46-51.png)
![](https://minio.zxbdwy.online:443/picgo/21-46-55.png)
![](https://minio.zxbdwy.online:443/picgo/21-46-58.png)
![](https://minio.zxbdwy.online:443/picgo/21-47-03.png)
![](https://minio.zxbdwy.online:443/picgo/21-47-07.png)
![](https://minio.zxbdwy.online:443/picgo/21-47-10.png)
![](https://minio.zxbdwy.online:443/picgo/21-47-15.png)
![](https://minio.zxbdwy.online:443/picgo/21-47-18.png)
![](https://minio.zxbdwy.online:443/picgo/21-47-34.png)

## 项目DEMO

- 锄山地图：https://project.zxbdwy.online/chushan-map
- 锄山服务h5版：https://project.zxbdwy.online/chushan/
- 锄山服务后台管理系统：https://project.zxbdwy.online/chushan-admin/

## 项目架构

本项目采用前后端分离的微服务架构，包含以下四个主要模块：

```
chushan_project/
├── chushan_map/              # 地图服务前端 (Vue 3 + Vite)
├── chushan_service/          # 移动端应用 (uni-app)
├── chushan_service_backend/  # 后端服务
│   ├── admin-vue/           # 管理后台 (Vue 3 + TypeScript)
│   └── api/                 # API服务 (Spring Boot 3 + Java 21)
└── README.md                # 项目说明文档
```

## 功能模块

### 1. 锄山地图 (chushan_map)
- **技术栈**: Vue 3 + Vite + 腾讯地图API + ECharts
- **主要功能**: 
  - 景区地图展示
  - 标记点管理
  - 数据可视化图表
- **开发环境**: Node.js + pnpm

### 2. 锄山服务 (chushan_service)
- **技术栈**: uni-app + Vue 3
- **支持平台**: 微信小程序、Android、iOS
- **主要功能**:
  - 🏠 首页：轮播图、景点推荐、人气榜单
  - 📰 景区动态：最新资讯和活动信息
  - 🎫 景点预约：在线预约景点门票
  - 🏨 房间预约：住宿预订服务
  - 🚗 停车预约：停车位在线预约
  - 🛍️ 特产商城：当地特产展示和购买
  - 🛠️ 服务中心：各类便民服务

### 3. 管理后台 (admin-vue)
- **技术栈**: Vue 3 + TypeScript + Element Plus + Vite
- **主要功能**:
  - 👤 用户管理：用户信息维护
  - 🏛️ 内容管理：景点、特产、攻略等内容管理
  - 📅 预约管理：景点预约、房间预约、停车预约管理
  - 📊 数据统计：平台运营数据分析

### 4. API服务 (api)
- **技术栈**: Spring Boot 3 + Java 21 + MyBatis Plus + MySQL
- **主要功能**:
  - RESTful API接口
  - JWT身份认证
  - 数据库操作
  - 文件上传 (S3)
  - API文档 (Knife4j)

## 技术特性

### 前端技术
- **Vue 3**: 采用Composition API和响应式系统
- **TypeScript**: 类型安全和更好的开发体验
- **Element Plus**: 企业级UI组件库
- **uni-app**: 跨平台移动应用开发
- **Vite**: 快速的构建工具
- **Pinia**: 现代化状态管理

### 后端技术
- **Spring Boot 3**: 最新的Spring Boot框架
- **Java 21**: LTS版本的Java语言
- **MyBatis Plus**: 强大的ORM框架
- **MySQL**: 关系型数据库
- **JWT**: 安全的身份认证机制
- **Knife4j**: API文档生成工具

### 开发工具
- **pnpm**: 高效的包管理器
- **ESLint + Prettier**: 代码质量和格式化
- **Maven**: Java项目构建工具

## 快速开始

### 环境要求
- Node.js >= 16.0.0
- Java >= 21
- MySQL >= 8.0
- pnpm >= 8.0.0

### 安装步骤

#### 1. 克隆项目
```bash
git clone <repository-url>
cd chushan_project
```

#### 2. 安装前端依赖
```bash
# 地图服务
cd chushan_map
pnpm install

# 移动端应用
cd ../chushan_service
pnpm install

# 管理后台
cd ../chushan_service_backend/admin-vue
pnpm install
```

#### 3. 配置后端服务
```bash
cd ../../api
# 配置数据库连接 (application-dev.yml)
# 运行SQL脚本创建数据库表
mvn clean install
```

#### 4. 启动服务

**启动API服务**
```bash
cd chushan_service_backend/api
mvn spring-boot:run
```

**启动地图服务**
```bash
cd chushan_map
pnpm dev
```

**启动管理后台**
```bash
cd chushan_service_backend/admin-vue
pnpm dev
```

**启动移动端开发**
```bash
cd chushan_service
# 使用HBuilderX或uni-app CLI进行开发
```

## 项目配置

### 数据库配置
在 `chushan_service_backend/api/src/main/resources/application-dev.yml` 中配置数据库连接：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/chushan_service?useUnicode=true&characterEncoding=utf8&serverTimezone=GMT%2B8
    username: your_username
    password: your_password
```

### API接口文档
启动后端服务后，访问：`http://localhost:8080/doc.html` 查看API文档

## 开发规范

### 代码规范
- 使用ESLint和Prettier进行代码格式化
- 遵循Vue 3 Composition API最佳实践
- TypeScript项目严格类型检查

### 提交规范
- 使用语义化提交信息
- 功能开发使用feature分支
- 代码审查后合并到主分支

## 部署说明

### 前端部署
```bash
# 构建地图服务
cd chushan_map
pnpm build

# 构建管理后台
cd ../chushan_service_backend/admin-vue
pnpm build
```

### 后端部署
```bash
cd chushan_service_backend/api
mvn clean package
java -jar target/api-0.0.1-SNAPSHOT.jar
```

### 移动端部署
- 微信小程序：通过微信开发者工具发布
- Android/iOS：通过uni-app云打包或本地打包

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

如有问题或建议，请通过以下方式联系：

- 项目维护者：[Your Name]
- 邮箱：[your.email@example.com]
- 项目地址：[repository-url]

## 更新日志

### v1.0.0 (2024-01-01)
- 初始版本发布
- 完成基础功能开发
- 支持地图服务、移动应用、管理后台和API服务

---

