host = "localhost";

document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
});

function fetchUsers(page = 1) {
    fetch(`http://${host}:3000/get-users?page=${page}`)
    .then(response => response.json())
    .then(data => {
        populateTable(data.users);
        setupPagination(data.totalPages, page);
    }).catch(error => {
        console.error('Error fetching users:', error);
    });
}

function populateTable(users) {
    const tableBody = document.getElementById('userAccountTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear the table

    users.forEach(user => {
        let row = tableBody.insertRow();
        Object.keys(user).forEach(key => {
            let cell = row.insertCell();
            cell.textContent = key === 'pass' ? '********' : user[key];
        });
    });
}

function setupPagination(totalPages, currentPage) {
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        let btn = document.createElement('button');
        btn.textContent = i;
        btn.onclick = () => fetchUsers(i);
        btn.disabled = i === currentPage;
        paginationDiv.appendChild(btn);
    }
}
