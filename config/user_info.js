// user_info.js

function displayUserInfo() {
    // Replace 'yourUsernameVariable' with how you're storing the logged-in username
    const username = localStorage.getItem('username');

    if (!username) {
        alert('Username not found. Redirecting to home page.');
        window.location.href = '../index_login.html';
        return;
    }

    fetch(`http://84.247.148.141:3000/user-info?username=${encodeURIComponent(username)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        // Không cần credentials: 'include' vì không sử dụng session trong trường hợp này
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(user => {
            // Populate the data in your table or wherever you're displaying it
            document.getElementById('username').textContent = user.user_name;
            document.getElementById('name').textContent = user.name;
            const formattedBalance = user.balance.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
            document.getElementById('balance').textContent = `${formattedBalance}`;
            document.getElementById('gender').textContent = user.gender;
            document.getElementById('phone').textContent = user.phone;
            document.getElementById('email').textContent = user.email;
            document.getElementById('address').textContent = user.address;
            // Assume you have img elements for CMND images
            document.getElementById('front_cmnd').setAttribute('src', "../config/" + user.front_cmnd_url);
            document.getElementById('after_cmnd').setAttribute('src', "../config/" + user.after_cmnd_url);
        })
        .catch(error => {
            console.error('Failed to fetch user info:', error);
            alert('There was an error fetching user information.');
        });
}

// Trigger the displayUserInfo function when the page has loaded
document.addEventListener('DOMContentLoaded', displayUserInfo);
