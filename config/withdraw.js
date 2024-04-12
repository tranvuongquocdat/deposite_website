host = "localhost"

document.addEventListener('DOMContentLoaded', function () {
    displayBalance();
    displayBank();
});

function displayBalance() {
    const username = localStorage.getItem('username');
    fetch(`http://${host}:3000/balance?username=${encodeURIComponent(username)}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.balance !== undefined) {
                document.getElementById('available_balance').value = new Intl.NumberFormat('vi-VN').format(data.balance);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayBank() {
    const username = localStorage.getItem('username');

    fetch(`http://${host}:3000/bank_info?username=${encodeURIComponent(username)}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.bank_name !== undefined && data.bank_account !== undefined) {
                document.getElementById('bank_name').value = data.bank_name;   // Populate bank name
                document.getElementById('bank_account').value = data.bank_account;  // Populate bank account
                document.getElementById('nguoi_nhan').value = data.nguoi_nhan;  // Populate account holder name
            } else {
                console.error('No bank data available for this user.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

document.getElementById('withdrawForm').onsubmit = function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const value = parseInt(document.getElementById('value').value.replace(/[^0-9]/g, ''), 10);
    const balance = parseInt(document.getElementById('available_balance').value.replace(/[^0-9]/g, ''), 10);

    if (value > balance) {
        alert('Số dư không đủ để rút số tiền này.');
        return;
    }

    fetch(`http://${host}:3000/withdraw`, {
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
                document.getElementById('available_balance').value = new Intl.NumberFormat('vi-VN').format(data.balanceAfterWithdraw);
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Có lỗi xảy ra khi thực hiện rút tiền');
    });
};
