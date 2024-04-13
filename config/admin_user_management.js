host = "localhost";
var editing_user_name = "";  // Variable to store the userName of the user being edited
var editing_user_balance = 0; // Variable to store the current balance of the user being edited

document.addEventListener('DOMContentLoaded', function() {
    fetch(`http://${host}:3000/get-users`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('datarow');
            tableBody.innerHTML = '';

            data.users.forEach((user, index) => {
                fetchBalance(user.user_name, (balance) => {
                    const dob = `${user.date}/${user.month}/${user.year}`;
                    const row = tableBody.insertRow();
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${user.user_name}</td>
                        <td>${user.name}</td>
                        <td>${user.gender === 1 ? 'Nam' : 'Nữ'}</td>
                        <td>${user.address}</td>
                        <td>${user.phone}</td>
                        <td>${user.email}</td>
                        <td>${dob}</td>
                        <td>${user.nguoi_nhan}</td>
                        <td>${user.bank_name}</td>
                        <td>${user.bank_account}</td>
                        <td>${balance}</td>
                        <td><img src="config/${user.front_cmnd_url}" alt="CMND mặt trước" style="width:100px; height:60px;"></td>
                        <td><img src="config/${user.after_cmnd_url}" alt="CMND mặt sau" style="width:100px; height:60px;"></td>
                        <td>
                            <button class="btn btn-primary btn-edit" data-original-data='${JSON.stringify(user)}' data-balance='${balance}'>
                                <i class="fa fa-edit"></i> Edit
                            </button>
                        </td>
                    `;

                    row.querySelector('.btn-edit').addEventListener('click', function() {
                        var userData = JSON.parse(this.getAttribute('data-original-data'));
                        editing_user_name = userData.user_name;
                        editing_user_balance = balance;
                        showEditUserModal(userData, balance);
                    });
                });
            });
        })
        .catch(error => console.error('Error:', error));
});

function fetchBalance(username, callback) {
  fetch(`http://${host}:3000/balance?username=${encodeURIComponent(username)}`)
      .then(response => response.json())
      .then(data => {
          // Parse the balance as an integer and format it with dot as thousands separator
          const formattedBalance = parseInt(data.balance).toLocaleString('en-US');
          callback(formattedBalance);
      })
      .catch(error => {
          console.error('Error fetching balance:', error);
          callback('Error');
      });
}

function showEditUserModal(user, currentBalance) {
    const modal = $('#editUserModal');
    modal.find('#editUserName').val(user.user_name);
    modal.find('#editFullName').val(user.name);
    modal.find('#editAddress').val(user.address);
    modal.find('#editPhone').val(user.phone);
    modal.find('#editEmail').val(user.email);
    modal.find('#editRecipient').val(user.nguoi_nhan);
    modal.find('#editBankName').val(user.bank_name);
    modal.find('#editAccountNumber').val(user.bank_account);
    modal.find('#editBalance').val(currentBalance);

    modal.modal('show');
}

document.getElementById('saveEditUser').addEventListener('click', function() {
    const modal = $('#editUserModal');
    const updatedData = {
        name: modal.find('#editFullName').val(),
        address: modal.find('#editAddress').val(),
        phone: modal.find('#editPhone').val(),
        email: modal.find('#editEmail').val(),
        nguoi_nhan: modal.find('#editRecipient').val(),
        bank_name: modal.find('#editBankName').val(),
        bank_account: modal.find('#editAccountNumber').val(),
        balance: modal.find('#editBalance').val()
    };

    console.log(updatedData);

    fetch(`http://${host}:3000/update-user/${editing_user_name}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        alert('User information updated successfully');
        location.reload(); // Reload the page to update the UI
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error updating the user information');
    });

    modal.modal('hide');
});
