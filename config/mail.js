const host = "localhost";

// This script assumes you have a 'userInfo' object stored in localStorage with a 'user_name' property
document.addEventListener('DOMContentLoaded', function() {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (userInfo) {
    const username = userInfo.user_name;
    fetch(`http://${host}:3000/get-mails?username=${encodeURIComponent(username)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const tableBody = document.getElementById('datarow');
        tableBody.innerHTML = ''; // Clear the table body

        // Loop through the mails and append them to the table
        data.mails.forEach((mail, index) => {
          const row = tableBody.insertRow();
          const cell1 = row.insertCell(0);
          const cell2 = row.insertCell(1);
          const cell3 = row.insertCell(2);
          const cell4 = row.insertCell(3);
          
          const date = new Date(mail.time);
          const formattedTime = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'full', timeStyle: 'short' }).format(date);
          cell4.innerHTML = formattedTime;
        });
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
        // Optionally implement error handling logic here
      });
  } else {
    // Redirect or handle the case where there is no user info in localStorage
    window.location.href = 'login.html'; // Replace with your login page
  }
});

function deleteMail(mailId) {
  // Implement the delete functionality here
  console.log('Deleting mail with ID:', mailId);
  // You would typically make a fetch DELETE request to your API endpoint
}
