function signup(e) {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form (tức là, ngăn chặn việc gửi form)

    const formData = {
    // Lấy giá trị từ input
        username : document.getElementsByName('kh_tendangnhap')[0].value,
        password : document.getElementsByName('kh_matkhau')[0].value,
        name : document.getElementsByName('kh_ten')[0].value,
        gender : document.getElementsByName('kh_gioitinh')[0].value,
        address : document.getElementsByName('kh_diachi')[0].value,
        phone : document.getElementsByName('kh_dienthoai')[0].value,
        email : document.getElementsByName('kh_email')[0].value,
        date : document.getElementsByName('kh_ngaysinh')[0].value,
        month : document.getElementsByName('kh_thangsinh')[0].value,
        year : document.getElementsByName('kh_namsinh')[0].value,
        cmnd : document.getElementsByName('kh_cmnd')[0].value
    };
    fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Thông tin đã được sử dụng');
            }
            return response.json();
        })
        .then(data => {
            if(data.error) {
                throw new Error(data.error); // Nếu có lỗi từ server, ném lỗi này để catch bắt được
            }
            alert("Đăng ký thành công");
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
