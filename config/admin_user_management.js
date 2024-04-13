host = "localhost";
var editing_user_name = "";  // Biến để lưu trữ userName của người dùng đang được chỉnh sửa

document.addEventListener('DOMContentLoaded', function() {
  fetch(`http://${host}:3000/get-users`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const tableBody = document.getElementById('datarow');
      tableBody.innerHTML = '';

      data.users.forEach((user, index) => {
        const dob = `${user.date}/${user.month}/${user.year}`;
        const row = tableBody.insertRow();
    
        row.innerHTML = `
            <td>${index + 1}</td>
            <td data-key="user_name">${user.user_name}</td>
            <td data-key="name">${user.name}</td>
            <td data-key="gender">${user.gender === 1 ? 'Nam' : 'Nữ'}</td>
            <td data-key="address">${user.address}</td>
            <td data-key="phone">${user.phone}</td>
            <td data-key="email">${user.email}</td>
            <td data-key="dob">${dob}</td>
            <td data-key="nguoi_nhan">${user.nguoi_nhan}</td>
            <td data-key="bank_name">${user.bank_name}</td>
            <td data-key="bank_account">${user.bank_account}</td>
            <td>
            <img src="config/${user.front_cmnd_url}" alt="CMND mặt trước" style="width:200px; height:120px;">
            </td>
            <td>
                <img src="config/${user.after_cmnd_url}" alt="CMND mặt sau" style="width:200px; height:120px;">
            </td>
            <td>
                <button class="btn btn-primary btn-edit" data-original-data='${JSON.stringify(user)}'>
                    <i class="fa fa-edit"></i> Edit
                </button>
            </td>
        `;
    
        row.querySelector('.btn-edit').addEventListener('click', function() {
            var userData = JSON.parse(this.getAttribute('data-original-data'));
            editing_user_name = userData.user_name;  // Cập nhật biến khi nhấn edit
            showEditUserModal(userData, this);
        });
      });
    })
    .catch(error => console.error('Error:', error));
});

function showEditUserModal(user, btn) {
  const form = document.getElementById('editUserForm');
  const fieldMapping = {
    name: 'Họ và tên',
    address: 'Địa chỉ',
    phone: 'Số điện thoại',
    email: 'Email',
    nguoi_nhan: 'Người nhận',
    bank_name: 'Tên ngân hàng',
    bank_account: 'Số tài khoản'
  };

  form.innerHTML = '';

  Object.keys(fieldMapping).forEach((key) => {
    const inputGroup = document.createElement('div');
    inputGroup.className = 'form-group';

    const label = document.createElement('label');
    label.setAttribute('for', 'edit' + key.charAt(0).toUpperCase() + key.slice(1));
    label.innerText = fieldMapping[key];

    const input = document.createElement('input');
    input.type = key === 'email' ? 'email' : 'text';
    input.className = 'form-control';
    input.id = 'edit' + key.charAt(0).toUpperCase() + key.slice(1);
    input.value = user[key] || '';

    inputGroup.appendChild(label);
    inputGroup.appendChild(input);
    form.appendChild(inputGroup);
  });

  $('#editUserModal').modal('show');
}

document.getElementById('saveEditUser').addEventListener('click', function() {
  const originalData = JSON.parse(document.querySelector('.btn-edit[data-original-data]').getAttribute('data-original-data'));
  const updatedData = {};

  Object.keys(originalData).forEach(key => {
      const input = document.getElementById('edit' + key.charAt(0).toUpperCase() + key.slice(1));
      if (input && input.value !== originalData[key] && input.value !== '') {
          updatedData[key] = input.value;
      }
  });

  if (Object.keys(updatedData).length > 0) {
      fetch(`http://${host}:3000/update-user/${editing_user_name}`, {  // Sử dụng biến cục bộ
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
      })
      .then(response => {
          if (!response.ok) throw new Error('Server response was not ok');
          return response.json();
      })
      .then(data => {
          console.log('Update response:', data);
          alert('Cập nhật thông tin người dùng thành công');
          location.reload(); // Reload the page to update the UI
      })
      .catch(error => {
          console.error('Error:', error);
          alert('Có lỗi xảy ra khi cập nhật thông tin người dùng');
      });
  } else {
      alert('Không có thay đổi nào để cập nhật');
  }

  $('#editUserModal').modal('hide');
});
