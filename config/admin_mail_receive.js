const host = "localhost";

document.addEventListener('DOMContentLoaded', function() {
  fetch(`http://${host}:3000/admin-get-mails`)
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
        
        cell1.innerHTML = index + 1;
        cell2.innerHTML = mail.user_name; // Assuming this is the sender's name
        cell3.innerHTML = mail.message;
        // Format the time
        const date = new Date(mail.time);
        const formattedTime = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'full', timeStyle: 'short' }).format(date);
        cell4.innerHTML = formattedTime;
      });
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
      // Optionally implement error handling logic here
    });
});

function deleteMail(mailId) {
  // Implement the delete functionality here
  console.log('Deleting mail with ID:', mailId);
  // You would typically make a fetch DELETE request to your API endpoint
}
