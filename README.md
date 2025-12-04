# Backend API – Cồng Chiêng Lâm Đồng

Backend API cho hệ thống **Cồng chiêng Lâm Đồng**

---

# Công nghệ sử dụng

* **Node.js:** v20.19.5
* **Framework:** Express.js
* **Database:** MongoDB
* **Auth:** JWT + OAuth2
* **Mail:** Nodemailer


## Yêu cầu môi trường

* Node.js 20.19.5
* NPM 
* MongoDB (Local hoặc MongoDB Atlas)


## Cài đặt dự án

```bash
npm install
```

---

## Biến môi trường (.env) – BẮT BUỘC

Tạo file `.env` từ `.env.example` và sửa đổi


**Lưu ý:** Sau khi chạy `npm run init`, dữ liệu `oauth_clients` sinh ra phải **copy sang FE (.env)**

---

## Chạy server

```bash
npm run start
```

Hoặc chế độ dev (nếu có):

```bash
npm run dev
```

---

## Khởi tạo Admin + OAuth

```bash
npm run init
```

Lệnh này sẽ:

* Tạo tài khoản **Admin mặc định**
* Tạo dữ liệu **oauth_clients**
* In thông tin ra terminal

⚠️ Sau khi init:

* Phải copy `client_id` và `client_secret` sang **FE (.env)**

---

## Cấu trúc thư mục

```
src/
 ├── modules/        # Controller
 ├── services/       # Business Logic
 ├── plugins/        # Mail, JWT, OAuth
 ├── models/         # MongoDB Schema
 ├── routes/         # Routes
 ├── middlewares/    # Middleware
 └── app.js
```

---

## Chức năng chính

* Xác thực JWT + OAuth2
* Quản lý người dùng
* Quản lý tin tức
* Gửi mail liên hệ
* Upload hình ảnh
* Phân quyền Admin / User

---

## Tác giả
TeamX
