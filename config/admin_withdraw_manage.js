const host = "localhost";

document.addEventListener('DOMContentLoaded', function() {
    fetchWithdrawals();
});

function fetchWithdrawals() {
    fetch(`http://${host}:3000/get-withdrawals`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const tableBody = document.getElementById('datarow');
        tableBody.innerHTML = ''; // Clear the table body

        // Process each withdrawal entry
        data.withdrawals.forEach((withdrawal) => {
            fetchBankInfo(withdrawal.user_name, (bankInfo) => {
                // Once bank info is fetched, populate the row
                const row = tableBody.insertRow();
                populateRow(row, withdrawal, bankInfo);
            });
        });
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}

function fetchBankInfo(username, callback) {
    fetch(`http://${host}:3000/bank_info?username=${encodeURIComponent(username)}`)
    .then(response => response.json())
    .then(bankInfo => {
        callback(bankInfo); // Call the callback function with the fetched bank info
    })
    .catch(error => {
        console.error('Failed to fetch bank information for username:', username, error);
        callback({}); // Pass empty object on error
    });
}

function populateRow(row, withdrawal, bankInfo) {
    const formattedTime = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'full', timeStyle: 'short' }).format(new Date(withdrawal.time));

    row.insertCell(0).textContent = withdrawal.ma_gd;
    row.insertCell(1).textContent = formattedTime;
    row.insertCell(2).textContent = withdrawal.user_name;
    row.insertCell(3).textContent = withdrawal.value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    row.insertCell(4).textContent = withdrawal.kh_lydo;
    row.insertCell(5).textContent = withdrawal.httt_ma;
    row.insertCell(6).textContent = bankInfo.nguoi_nhan || 'N/A';
    row.insertCell(7).textContent = bankInfo.bank_name || 'N/A';
    row.insertCell(8).textContent = bankInfo.bank_account || 'N/A';
    row.insertCell(9).innerHTML = withdrawal.qr_url ? `<img src="${withdrawal.qr_url}" alt="QR Code" style="width:100px;height:auto;">` : 'N/A';
    const statusButton = row.insertCell(10);
    statusButton.innerHTML = withdrawal.transaction_check === 0 
        ? `<button style="color: red;" onclick="updateStatus('${withdrawal.ma_gd}', 1)">Xác nhận</button>` 
        : `<button style="color: green;">Hoàn thành</button>`;
}

function updateStatus(ma_gd, newStatus) {
    fetch(`http://${host}:3000/update-withdrawal-status`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ma_gd, newStatus }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Status updated successfully');
            window.location.reload(); // Reload the page to reflect the change
        } else {
            alert('Error updating status');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
