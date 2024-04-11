document.addEventListener('DOMContentLoaded', () => {
    const balanceButton = document.getElementById('balanceButton'); // Replace with your actual button's ID
    if (!balanceButton) {
        console.error('Balance button not found!');
        return;
    }

    balanceButton.addEventListener('click', async function () {
        const username = document.getElementById('username').value; // Replace with the field that contains the username

        if (!username) {
            alert('Username is required to check balance');
            return;
        }

        try {
            const response = await fetch(`http://84.247.148.141:3000/balance?username=${encodeURIComponent(username)}`);
            const data = await response.json();

            if (response.ok) {
                alert(`Số dư hiện tại của bạn là: ${data.balance}`);
            } else {
                throw new Error(data.message || 'Có lỗi xảy ra khi kiểm tra số dư.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`Có lỗi xảy ra khi kiểm tra số dư: ${error.message}`);
        }
    });
});
