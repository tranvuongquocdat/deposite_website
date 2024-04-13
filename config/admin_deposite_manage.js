host = "localhost";

document.addEventListener('DOMContentLoaded', function() {
  fetch(`http://${host}:3000/get-deposits`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const tableBody = document.getElementById('datarow');
      tableBody.innerHTML = ''; // Clear the table body

      if (data.deposits.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6">No deposits found.</td></tr>';
      }

      data.deposits.forEach((deposit, index) => {
        const row = tableBody.insertRow();

        row.innerHTML = `
          <td>${deposit.ma_gd}</td>
          <td>${deposit.user_name}</td>
          <td>${deposit.value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
          <td>${deposit.httt_ma}</td>
          <td>
            <img src="${deposit.img_url ? `../config/${deposit.img_url}` : 'placeholder-image.png'}" alt="Deposit Image" style="width:300px;height:auto;">
          </td>
          <td>
            ${deposit.transaction_check === 0 ? 
              `<button style="color: red;" onclick="updateTransactionStatus('${deposit.ma_gd}', 1)">Xác nhận</button>` : 
              `<button style="color: green;">Hoàn thành</button>`
            }
          </td>
        `;
      });
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
});

function updateTransactionStatus(ma_gd, newStatus) {
fetch(`http://${host}:3000/update-deposit-status`, {
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
