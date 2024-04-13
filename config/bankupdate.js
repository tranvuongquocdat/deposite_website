document.addEventListener("DOMContentLoaded", function () {
    const host = 'localhost';
    fetch(`http://${host}:3000/get-page-info`)
        .then(response => response.json())
        .then(data => {
            if (data && data.page) {
                // Update the divs with the information from the database
                document.getElementById('nguoi_nhan').innerHTML = 'Chủ tài khoản: ' + (data.page.nguoi_nhan || 'N/A');
                document.getElementById('bank_name').innerHTML = 'Ngân hàng: ' + (data.page.bank_name || 'N/A');
                document.getElementById('bank_account').innerHTML = 'Số tài khoản: ' + (data.page.bank_account || 'N/A');

                // If you wish to display the QR image, set it here
                // document.querySelector('img#qr_code_preview').src = '../config/uploads/' + data.page.qr_link || '';
            }
        })
        .catch(error => console.error('Error fetching page info:', error));
});