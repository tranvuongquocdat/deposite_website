// Hàm để lấy thông tin trang và cập nhật nội dung trang web
host = "localhost";

function fetchAndUpdatePageInfo() {
    // Gọi API để lấy thông tin
    fetch(`http://${host}:3000/get-page-info`)
        .then(response => response.json())
        .then(data => {
            // Cập nhật nội dung trang web
            if (data && data.page) {
                // Cập nhật tất cả các phần tử có class 'pageName'
                let pageNameElements = document.getElementsByClassName('pageName');
                for (let elem of pageNameElements) {
                    elem.textContent = data.page.page_name;
                }

                // Cập nhật tất cả các phần tử có class 'phoneNumber'
                let phoneNumberElements = document.getElementsByClassName('phoneNumber');
                for (let elem of phoneNumberElements) {
                    elem.textContent = "SĐT: " + data.page.phone;
                }
                // Tiếp tục cập nhật các thông tin khác
            }
        })
        .catch(error => console.error('Error fetching page info:', error));
}

// Gọi hàm này khi trang web tải xong hoặc theo định kỳ
document.addEventListener('DOMContentLoaded', fetchAndUpdatePageInfo);