host = 'localhost';

document.addEventListener("DOMContentLoaded", function () {
    // Fetch existing data when the page loads
    fetch(`http://${host}:3000/get-page-info`)
      .then(response => response.json())
      .then(data => {
        // Populate form with existing data
        if (data && data.page) {
          document.querySelector('input[name="page_name"]').value = data.page.page_name || '';
          document.querySelector('input[name="phone"]').value = data.page.phone || '';
          document.querySelector('input[name="nguoi_nhan"]').value = data.page.nguoi_nhan || '';
          document.querySelector('input[name="bank_name"]').value = data.page.bank_name || '';
          document.querySelector('input[name="bank_account"]').value = data.page.bank_account || '';
          // If you wish to display the QR image, set it here
        //   document.querySelector('img#qr_code_preview').src = '../config/uploads/' + data.page.qr_link || '';
        }
      })
      .catch(error => console.error('Error fetching page info:', error));
  
    // Handle form submission
    document.getElementById('frmupdate').addEventListener('submit', function (e) {
      e.preventDefault();
  
      // Gather form data including the file for QR code
      const formData = new FormData(this);
  
      // Send AJAX request to update the data
      fetch(`http://${host}:3000/update-page-info`, {
        method: 'POST',
        body: formData // Just pass the FormData object as the body
      })
      .then(response => response.json())
      .then(data => {
        // Handle response data
        console.log(data);
        alert('Cập nhật thông tin thành công!');
        // Update the QR code preview if necessary
        // document.querySelector('img#qr_code_preview').src = '/uploads/' + data.qr_link;
      })
      .catch(error => {
        console.error('Error updating page info:', error);
        alert('Có lỗi xảy ra khi cập nhật thông tin:', error);
      });
    });
});
