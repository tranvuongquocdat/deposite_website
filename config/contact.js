const host = 'localhost';

document.addEventListener('DOMContentLoaded', () => {
    const formElement = document.getElementById('formInquiry');
    if (!formElement) {
        console.error('Form element not found!');
        return;
    }

    formElement.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Use FormData to accommodate simple text fields
        const formData = new FormData(this);
        const username = formData.get('user_name');
        console.log(username); // This will print the value of 'user_name' field


        try {
            const response = await fetch(`http://${host}:3000/contact`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                alert("Lời nhắn đã được gửi thành công!");
                window.location.href = '../pages/contact.html'; // Redirect or handle the UI update accordingly
            } else {
                throw new Error(data.message || 'Có lỗi xảy ra khi gửi lời nhắn.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`Có lỗi xảy ra khi gửi lời nhắn: ${error.message}`);
        }
    });
});
