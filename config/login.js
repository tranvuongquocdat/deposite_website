host = "localhost";
document.addEventListener('DOMContentLoaded', () => {
    const formElement = document.getElementById('frmdangnhap');
    if (!formElement) {
        console.error('Form element not found!');
        return;
    }

    formElement.addEventListener('submit', async function (e) {
        e.preventDefault();

        const loginData = {
            login: document.getElementsByName('username')[0].value,
            password: document.getElementsByName('password')[0].value,
        };

        try {
            const response = await fetch(`http://${host}:3000/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('userInfo', JSON.stringify(data.user));
                localStorage.setItem('username', data.user.user_name);
                alert(data.message);
                if (data.isAdmin) {
                    window.location.href = '../index_login_admin.html'; // Redirect for admin
                } else {
                    window.location.href = '../index_login.html'; // Redirect for regular users
                }
            } else {
                throw new Error(data.message || 'Error during login.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`Error during login: ${error.message}`);
        }
    });
});
