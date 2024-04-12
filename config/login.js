const host = 'localhost';

document.addEventListener('DOMContentLoaded', () => {

    const formElement = document.getElementById('frmdangnhap');
    if (!formElement) {
        console.error('Form element not found!');
        return;
    }


    formElement.addEventListener('submit', async function (e) {
        e.preventDefault();

        const loginData = {
            login: document.getElementsByName('username')[0].value,
            password: document.getElementsByName('password')[0].value,
        };


        try {
            const response = await fetch(`http://${host}:3000/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });

            const data = await response.json(); // Lấy dữ liệu JSON từ phản hồi, không quan trọng response có ok hay không.

            // Xử lý dựa trên mã trạng thái của phản hồi.
            if (response.ok) {
                localStorage.setItem('userInfo', JSON.stringify(data.user));
                localStorage.setItem('username', data.user.user_name); // Lưu username riêng
                alert(data.message);
                window.location.href = '../index_login.html';
            } else {
                // Hiển thị thông điệp lỗi từ server.
                throw new Error(data.message || 'Có lỗi xảy ra khi đăng nhập.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`Có lỗi xảy ra khi đăng nhập: ${error.message}`);
        }
    });
});
