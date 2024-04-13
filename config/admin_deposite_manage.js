host = "localhost";

document.addEventListener('DOMContentLoaded', function() {
    fetch(`http://${host}:3000/get-deposits`) // Use a base URL variable for easier changes
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const tableBody = document.getElementById('datarow');
        tableBody.innerHTML = ''; // Clear the table body

        // Check if there are any deposits
        if (data.deposits.length === 0) {
          tableBody.innerHTML = '<tr><td colspan="6">No deposits found.</td></tr>'; // Update colspan if you add more columns
        }

        // Loop through the deposits and append them to the table
        data.deposits.forEach((deposit, index) => {
          const row = tableBody.insertRow();
          
          // Use template literals for cleaner code
          row.innerHTML = `
            <td>${index + 1}</td>
            <td>${deposit.user_name}</td>
            <td>${deposit.value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
            <td>${deposit.httt_ma}</td>
            <td>
              <img src="${deposit.img_url ? `../config/${deposit.img_url}` : 'placeholder-image.png'}" alt="Deposit Image" style="width:300px;height:auto;">
            </td>
            <td>${deposit.ma_gd}</td>
          `;
        });
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
        // Display error message to the user, maybe in a modal or a visible div
      });
});
