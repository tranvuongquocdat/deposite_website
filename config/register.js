const host = 'localhost';

function signup(e) {
    e.preventDefault();

    const formElement = document.getElementById('frmdangky');
    const formData = new FormData(formElement);
    

    fetch(`http://${host}:3000/register`, {
        method: 'POST',
        body: formData, // Không cần thiết đặt header 'Content-Type' vì FormData tự động thiết lập
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errData => {
                    // Đây có thể là một Error object hoặc bất kỳ cấu trúc dữ liệu nào bạn chọn
                    throw new Error(errData.message || 'Có lỗi xảy ra');
                });
            }
            return response.json();
        })
        .then(data => {
            if(data.error) {
                throw new Error(data.error); // Nếu có lỗi từ server, ném lỗi này để catch bắt được
            }
            alert("Đăng ký thành công, đăng nhập ngay!!!");
            window.location.href = '../pages/login.html';
        })
        .catch((error) => {
            console.error('Error:', error);
            alert(`Có lỗi xảy ra khi đăng ký: ${error.message}`);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('frmdangky').addEventListener('submit', signup);
});
