document.addEventListener('DOMContentLoaded', function () {
    // Gọi hàm này để hiển thị số dư ngay khi trang tải xong
    displayBalance();
});

function displayBalance() {
    const username = localStorage.getItem('username');
    // Sử dụng endpoint cung cấp bởi server để lấy số dư hiện tại
    fetch(`http://localhost:3000/balance?username=${encodeURIComponent(username)}`)
        .then(response => response.json())
        .then(data => {
            if(data && data.balance !== undefined) {
                document.getElementById('available_balance').textContent = data.balance.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

document.getElementById('withdrawForm').onsubmit = function (event) {
    event.preventDefault(); // Ngăn chặn form gửi thông thường

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const value = parseInt(document.getElementById('value').value.replace(/[^0-9]/g, ''));
    
    fetch('http://localhost:3000/withdraw', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, value })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            if (data.balanceAfterWithdraw !== undefined) {
                document.getElementById('available_balance').textContent = data.balanceAfterWithdraw.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Có lỗi xảy ra khi thực hiện rút tiền');
    });
};