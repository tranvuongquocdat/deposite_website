host = "localhost";

document.addEventListener('DOMContentLoaded', function() {
  const host = "localhost";
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

      // Loop through the withdrawals and append them to the table
      data.withdrawals.forEach((withdrawal, index) => {
        const row = tableBody.insertRow();
        const formattedTime = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'full', timeStyle: 'short' }).format(new Date(withdrawal.time));
        const bankInfo = withdrawal.bankInfo || {}; // Assuming bankInfo is joined in the data received

        row.insertCell(0).innerHTML = withdrawal.ma_gd;
        row.insertCell(1).innerHTML = formattedTime;
        row.insertCell(2).innerHTML = withdrawal.user_name;
        row.insertCell(3).innerHTML = withdrawal.value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        row.insertCell(4).innerHTML = withdrawal.kh_lydo;
        row.insertCell(5).innerHTML = withdrawal.httt_ma;
        row.insertCell(6).innerHTML = bankInfo.nguoi_nhan || '';
        row.insertCell(7).innerHTML = bankInfo.bank_name || '';
        row.insertCell(8).innerHTML = bankInfo.bank_account || '';
        row.insertCell(9).innerHTML = withdrawal.qr_url ? `<img src="${withdrawal.qr_url}" alt="QR Code" style="width:100px;height:auto;">` : 'N/A';
        const statusButton = row.insertCell(10);
        statusButton.innerHTML = withdrawal.transaction_check === 0 
          ? `<button style="color: red;" onclick="updateStatus('${withdrawal.ma_gd}', 1)">Xác nhận</button>` 
          : `<button style="color: green;">Hoàn thành</button>`;
      });
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
});

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
          window.location.reload(); // Reload the page to reflect the change
      } else {
          alert('Error updating status');
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
}

  