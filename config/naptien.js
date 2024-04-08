document.addEventListener('DOMContentLoaded', () => {
    const formElement = document.getElementById('frmnaptien');
    if (!formElement) {
        console.error('Form element not found!');
        return;
    }

    formElement.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Use FormData to accommodate file upload along with other fields
        const formData = new FormData(this);

        try {
            const response = await fetch('http://localhost:3000/deposit', {
                method: 'POST',
                body: formData, // FormData will be sent as 'multipart/form-data'
            });

            const data = await response.json();

            if (response.ok) {
                alert("Nạp tiền thành công, quay trở về trang chủ!");
                window.location.href = '../index.html'; // Redirect or handle the UI update accordingly
            } else {
                throw new Error(data.message || 'Có lỗi xảy ra khi nạp tiền.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`Có lỗi xảy ra khi nạp tiền: ${error.message}`);
        }
    });
});
