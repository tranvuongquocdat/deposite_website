# Hướng dẫn sử dụng Deposite Website

## Giới thiệu

Deposite Website là một nền tảng quản lý giao dịch tài chính cho phép người dùng thực hiện các hoạt động nạp tiền, rút tiền và liên hệ với quản trị viên. Hệ thống bao gồm giao diện người dùng thân thiện và bảng điều khiển quản trị viên để quản lý tất cả các giao dịch và thông tin người dùng.

## Tính năng chính

### Dành cho người dùng
- Đăng ký và đăng nhập tài khoản
- Nạp tiền vào tài khoản
- Rút tiền từ tài khoản
- Xem lịch sử giao dịch
- Liên hệ với quản trị viên qua hệ thống tin nhắn
- Cập nhật thông tin cá nhân và thông tin ngân hàng

### Dành cho quản trị viên
- Quản lý người dùng (xem, chỉnh sửa thông tin)
- Xác nhận giao dịch nạp tiền
- Xác nhận giao dịch rút tiền
- Quản lý tin nhắn từ người dùng
- Gửi tin nhắn đến người dùng
- Cập nhật thông tin trang web (tên trang, thông tin ngân hàng, v.v.)

## Cài đặt và Thiết lập

### Yêu cầu hệ thống
- Node.js (v14.0.0 trở lên)
- MySQL (v5.7 trở lên)
- Web browser hiện đại (Chrome, Firefox, Safari, Edge)

### Thư viện bắt buộc
- Download PopperJS: [https://unpkg.com/popper.js](https://unpkg.com/popper.js)
- Download FontAwesome 4.7.0: [https://fontawesome.com/v4.7.0/assets/font-awesome-4.7.0.zip](https://fontawesome.com/v4.7.0/assets/font-awesome-4.7.0.zip)

### Cài đặt
1. Clone repository từ GitHub:
   ```
   git clone https://github.com/your-username/deposite-website.git
   ```

2. Di chuyển vào thư mục dự án:
   ```
   cd deposite-website
   ```

3. Cài đặt các dependencies:
   ```
   npm install
   ```

4. Thiết lập cơ sở dữ liệu:
   - Tạo cơ sở dữ liệu MySQL có tên `deposite_sql`
   - Import file SQL từ thư mục `database/deposite_sql.sql`

5. Cấu hình kết nối cơ sở dữ liệu:
   - Mở file `config/config.php` và cập nhật thông tin kết nối MySQL

6. Khởi động server:
   ```
   node server.js
   ```

7. Truy cập website tại địa chỉ:
   ```
   http://localhost:3000
   ```

## Hướng dẫn sử dụng

### Đăng ký tài khoản
1. Truy cập trang chủ và nhấp vào "Đăng ký"
2. Điền đầy đủ thông tin cá nhân, bao gồm:
   - Tên đăng nhập
   - Mật khẩu
   - Họ tên
   - Địa chỉ
   - Số điện thoại
   - Email
   - Ngày sinh
   - Giới tính
   - Thông tin ngân hàng (tên người nhận, tên ngân hàng, số tài khoản)
   - Tải lên ảnh CMND/CCCD (mặt trước và mặt sau)
3. Nhấp vào "Đăng ký" để hoàn tất

![Ảnh đăng ký tài khoản](/docs/images/register.png)

### Đăng nhập
1. Truy cập trang chủ và nhấp vào "Đăng nhập"
2. Nhập tên đăng nhập và mật khẩu
3. Nhấp vào "Đăng nhập"

![Ảnh đăng nhập](/docs/images/login.png)

### Nạp tiền
1. Sau khi đăng nhập, truy cập mục "Nạp tiền"
2. Chọn phương thức thanh toán (chuyển khoản ngân hàng)
3. Nhập số tiền muốn nạp
4. Thực hiện chuyển khoản theo thông tin được cung cấp
5. Tải lên ảnh biên lai chuyển khoản
6. Nhấp vào "Xác nhận" để gửi yêu cầu nạp tiền

![Ảnh nạp tiền](./images/deposit.png)

### Rút tiền
1. Sau khi đăng nhập, truy cập mục "Rút tiền"
2. Nhập số tiền muốn rút
3. Kiểm tra thông tin tài khoản ngân hàng nhận tiền
4. Nhập lý do rút tiền (nếu cần)
5. Nhấp vào "Xác nhận" để gửi yêu cầu rút tiền

![Ảnh rút tiền](./images/withdraw.png)

### Liên hệ với quản trị viên
1. Sau khi đăng nhập, truy cập mục "Liên hệ"
2. Nhập nội dung tin nhắn
3. Nhấp vào "Gửi" để gửi tin nhắn đến quản trị viên

![Ảnh liên hệ](./images/contact.png)

### Xem tin nhắn
1. Sau khi đăng nhập, truy cập mục "Tin nhắn"
2. Xem danh sách các tin nhắn đã nhận từ quản trị viên

![Ảnh xem tin nhắn](./images/message.png)

## Quản trị viên

### Đăng nhập quản trị viên
1. Truy cập trang đăng nhập và sử dụng tài khoản quản trị viên
2. Sau khi đăng nhập thành công, bạn sẽ được chuyển hướng đến bảng điều khiển quản trị viên

![Ảnh đăng nhập quản trị viên](./images/admin_login.png)

### Quản lý người dùng
1. Từ bảng điều khiển quản trị viên, truy cập mục "Quản lý người dùng"
2. Xem danh sách tất cả người dùng
3. Nhấp vào nút "Edit" để chỉnh sửa thông tin người dùng
4. Cập nhật thông tin và nhấp vào "Lưu" để lưu thay đổi

![Ảnh quản lý người dùng](./images/admin_user.png)

### Quản lý giao dịch nạp tiền
1. Từ bảng điều khiển quản trị viên, truy cập mục "Quản lý nạp tiền"
2. Xem danh sách các yêu cầu nạp tiền
3. Kiểm tra thông tin và biên lai chuyển khoản
4. Nhấp vào "Xác nhận" để phê duyệt giao dịch

![Ảnh quản lý nạp tiền](./images/admin_deposit.png)

### Quản lý giao dịch rút tiền
1. Từ bảng điều khiển quản trị viên, truy cập mục "Quản lý rút tiền"
2. Xem danh sách các yêu cầu rút tiền
3. Kiểm tra thông tin và thực hiện chuyển khoản cho người dùng
4. Nhấp vào "Xác nhận" sau khi đã hoàn tất chuyển khoản

![Ảnh quản lý rút tiền](./images/admin_withdraw.png)

### Quản lý tin nhắn
1. Từ bảng điều khiển quản trị viên, truy cập mục "Quản lý tin nhắn"
2. Xem danh sách tin nhắn từ người dùng
3. Trả lời tin nhắn bằng cách truy cập mục "Gửi tin nhắn"
4. Chọn người dùng, nhập nội dung và nhấp vào "Gửi"

![Ảnh quản lý tin nhắn](./images/admin_message.png)

### Cập nhật thông tin trang web
1. Từ bảng điều khiển quản trị viên, truy cập mục "Cập nhật trang"
2. Cập nhật thông tin như tên trang, số điện thoại liên hệ, thông tin ngân hàng
3. Tải lên mã QR thanh toán (nếu cần)
4. Nhấp vào "Cập nhật" để lưu thay đổi

![Ảnh cập nhật trang](./images/admin_update.png)

## Cấu trúc thư mục

deposite_website/
├── assets/
│ ├── css/
│ ├── img/
│ └── js/
├── config/
│ ├── admin_.js
│ ├── config.js
│ ├── config.php
│ └── .js
├── database/
│ └── deposite_sql.sql
├── pages/
│ └── .html
├── pages_admin/
│ └── .html
├── server.js
├── index.html
├── index_login.html
└── index_login_admin.html

## Xử lý sự cố

### Không thể kết nối đến cơ sở dữ liệu
- Kiểm tra thông tin kết nối trong file `config/config.php`
- Đảm bảo MySQL đang chạy
- Kiểm tra tên người dùng và mật khẩu MySQL

### Không thể đăng nhập
- Kiểm tra tên đăng nhập và mật khẩu
- Đảm bảo tài khoản đã được đăng ký
- Kiểm tra kết nối đến cơ sở dữ liệu

### Không thể tải lên ảnh
- Kiểm tra quyền ghi vào thư mục uploads
- Đảm bảo kích thước ảnh không vượt quá giới hạn
- Kiểm tra định dạng ảnh được hỗ trợ (JPG, PNG, GIF)

### Không thể xác nhận giao dịch
- Kiểm tra kết nối đến cơ sở dữ liệu
- Đảm bảo bạn có quyền quản trị viên
- Kiểm tra mã giao dịch có tồn tại

## Liên hệ hỗ trợ

Nếu bạn gặp bất kỳ vấn đề nào hoặc cần hỗ trợ, vui lòng liên hệ:
- Email: support@deposite-website.com
- Điện thoại: [Số điện thoại hỗ trợ]
- Giờ hỗ trợ: 8:00 - 17:00, Thứ Hai - Thứ Sáu

## Phiên bản

Phiên bản hiện tại: 1.0.0

## Giấy phép

© 2023 Deposite Website. Bản quyền thuộc về [Tên công ty/tổ chức].


