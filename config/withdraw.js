// Define the host variable
const host = "localhost";

// Event listener for when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    displayBalance();
    displayBank();
    attachFormSubmitEvent();
});

// Function to display the balance
function displayBalance() {
    const username = localStorage.getItem('username');
    fetch(`http://${host}:3000/balance?username=${encodeURIComponent(username)}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.balance !== undefined) {
                document.getElementById('available_balance').value = new Intl.NumberFormat('vi-VN').format(data.balance);
            }
        })
        .catch(error => {
            console.error('Error fetching balance:', error);
            alert('Error fetching balance. See console for more details.');
        });
}

// Function to display bank details
function displayBank() {
    const username = localStorage.getItem('username');
    fetch(`http://${host}:3000/bank_info?username=${encodeURIComponent(username)}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.bank_name && data.bank_account && data.nguoi_nhan) {
                document.getElementById('bank_name').value = data.bank_name;
                document.getElementById('bank_account').value = data.bank_account;
                document.getElementById('nguoi_nhan').value = data.nguoi_nhan;
            } else {
                console.error('No bank data available for this user.');
                alert('No bank data available. See console for more details.');
            }
        })
        .catch(error => {
            console.error('Error fetching bank information:', error);
            alert('Error fetching bank information. See console for more details.');
        });
}

// Function to attach the submit event to the form
function attachFormSubmitEvent() {
    const formElement = document.getElementById('withdrawForm');
    if (formElement) {
        formElement.addEventListener('submit', async function (event) {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            // console.log(document.getElementById('value').value)[0];
            // console.log(document.getElementById('value').value);
            const value = parseInt(document.getElementById('value').value.replace(/[^0-9]/g, ''), 10);
            const balance = parseInt(document.getElementById('available_balance').value.replace(/[^0-9]/g, ''), 10);

            var kh_lydo = "Không có lý do";
            try{
                const kh_lydo = document.getElementById('kh_lydo').value || 'Không có lý do';
                console.log(kh_lydo);
            }catch(e){
            };
            // const httt_ma = document.getElementById('httt_ma').value || "1";

            if (value > balance) {
                alert('Số dư không đủ để rút số tiền này.');
                return;
            }

            try {
                const response = await fetch(`http://${host}:3000/withdraw`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password, value, kh_lydo })
                });
                const data = await response.json();
                if (data.message) {
                    alert(data.message);
                    if (data.balanceAfterWithdraw !== undefined) {
                        document.getElementById('available_balance').value = new Intl.NumberFormat('vi-VN').format(data.balanceAfterWithdraw);
                    }
                }
            } catch (error) {
                console.error('Error during withdrawal:', error);
                alert('An error occurred during withdrawal. See console for more details.');
            }
        });
    } else {
        console.error('Withdraw form not found');
    }
}
