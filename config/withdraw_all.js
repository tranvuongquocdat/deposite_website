document.addEventListener('DOMContentLoaded', function () {
    // Gọi hàm này để hiển thị số dư ngay khi trang tải xong
    displayBalance();
});

// Hàm displayBalance tương tự như trong `withdraw.js`

document.getElementById('withdrawAllForm').onsubmit = function (event) {
    event.preventDefault(); // Ngăn chặn form gửi thông thường

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const kh_lydo = 'Thu hồi vốn'; // Lý do cố định cho việc thu hồi vốn
    
    fetch('http://localhost:3000/withdraw-all', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, kh_lydo })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message); // Hiển thị thông báo từ server
        if (data.transactionId) {
            // Cập nhật giao diện hoặc thực hiện chuyển hướng nếu cần
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Có lỗi xảy ra khi thực hiện thu hồi vốn');
    });
};