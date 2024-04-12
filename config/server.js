const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');
const app = express();
const bcrypt = require('bcrypt');
const cors = require('cors'); // Đảm bảo đã cài đặt package cors với npm install cors
const session = require('express-session');
const contact = multer();

const host = 'localhost';
const port = 3000;

const con = mysql.createConnection({
    host: host,
    port: 3306,
    user: "root",
    database: "deposite_sql"
});

app.use(cors());

app.use(session({
    secret: 'datdat202', // Sử dụng một chuỗi bí mật phức tạp
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); // Serve static files

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 20000000 }
}).single('kh_img');

const storageInfoImages = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'info_images/') // Change destination folder here
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload_cmnd = multer({
    storage: storageInfoImages, // Use the new storage configuration
    limits: { fileSize: 20000000 }
}).fields([
    { name: 'cmnd_front', maxCount: 1 },
    { name: 'cmnd_after', maxCount: 1 }
]);

con.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL");
});

app.post('/register', (req, res) => {
    upload_cmnd(req, res, function (uploadErr) {
        if (uploadErr instanceof multer.MulterError) {
            return res.status(500).json({ message: "Multer uploading error", error: uploadErr.message });
        } else if (uploadErr) {
            return res.status(500).json({ message: "General uploading error", error: uploadErr.message });
        }

        const { username, password, name, gender, address, phone, email, date, month, year, cmnd, kh_ma_moi, nguoi_nhan, bank_name, bank_account} = req.body;
        const cmndFrontUrl = req.files['cmnd_front'] ? req.files['cmnd_front'][0].path.replace(/\\/g, '/') : null;
        const cmndAfterUrl = req.files['cmnd_after'] ? req.files['cmnd_after'][0].path.replace(/\\/g, '/') : null;

        // Kiểm tra xem username hoặc email đã tồn tại chưa
        const checkSql = "SELECT * FROM user WHERE user_name = ? OR email = ? OR phone = ?";
        con.query(checkSql, [username, email, phone], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Error checking user existence",
                    error: err.message
                });
            }
            if (result.length > 0) {
                // Nếu tìm thấy ít nhất một bản ghi trùng khớp, thông báo lỗi.
                return res.status(400).json({
                    message: "Username or email already exists"
                });
            } else {
                // Băm mật khẩu trước khi lưu vào cơ sở dữ liệu
                bcrypt.hash(password, 10, (err, hash) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({
                            message: "Error hashing password",
                            error: err.message
                        });
                    }

                    // Nếu không có lỗi, tiếp tục thực hiện việc đăng ký
                    const sql = "INSERT INTO user (user_name, pass, name, gender, address, phone, email, date, month, year, cmnd, front_cmnd_url, after_cmnd_url, ma_moi, nguoi_nhan, bank_name, bank_account) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    const values = [username, hash, name, gender, address, phone, email, date, month, year, cmnd, cmndFrontUrl, cmndAfterUrl, kh_ma_moi, nguoi_nhan, bank_name, bank_account];
                    con.query(sql, values, (err, result) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({
                                message: "Error during registration",
                                error: err.message
                            });
                        }
                        console.log(result);
                        res.json({
                            message: "Registered successfully",
                            result
                        });
                    });
                });
            }
        });
    });
});



// Thêm một route cho phương thức GET để kiểm tra lỗi
app.get('/register', (req, res) => {
    res.send("Welcome to the registration server!");
});

app.post('/login', (req, res) => {
    const { login, password } = req.body; // Dùng `login` để đại diện cho username, email, hoặc phone

    if (!login || !password) {
        return res.status(400).json({ message: 'Login and password are required' });
    }

    // Cập nhật câu truy vấn để kiểm tra username, email, hoặc phone
    const sql = "SELECT * FROM user WHERE user_name = ? OR email = ? OR phone = ?";
    con.query(sql, [login, login, login], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Tài khoản không đúng", error: err.message });
        }

        if (result.length > 0) {
            const user = result[0];
            // Tiếp tục so sánh mật khẩu như trước
            // Đảm bảo bạn đã cài đặt và yêu cầu bcrypt: const bcrypt = require('bcrypt');
            bcrypt.compare(password, user.pass, function(err, isMatch) {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: "Sai mật khẩu", error: err.message });
                }

                if (isMatch) {
                    // Mật khẩu đúng, trả về thông tin người dùng (trừ mật khẩu)
                    delete user.pass; // Xóa mật khẩu ra khỏi đối tượng trả về
                    req.session.username = user.user_name;
                    res.json({ message: "Đăng nhập thành công", user});
                } else {
                    res.status(401).json({ message: "Tài khoản hoặc mật khẩu không đúng" });
                }
            });
        } else {
            res.status(401).json({ message: "Tài khoản hoặc mật khẩu không đúng" });
        }
    });
});


app.post('/deposit', (req, res) => {
    upload(req, res, (uploadErr) => {
        if (uploadErr) {
            return res.status(500).json({ message: "Error uploading file", error: uploadErr.message });
        }
        // After uploading the file, the text fields are available in req.body
        const { username, password, value, httt_ma } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Assuming that the 'email' field is being sent from the client, but we will also check the session or database for the authenticated user's email.

        const sql = "SELECT * FROM user WHERE user_name = ?";
        con.query(sql, [username], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error during user authentication", error: err.message });
            }

            if (result.length > 0) {
                const user = result[0];
                bcrypt.compare(password, user.pass, function(err, isMatch) {
                    if (err || !isMatch) {
                        return res.status(401).json({ message: "Authentication failed" });
                    }

                    // After successful authentication, proceed with inserting the deposit data
                    const imageUrl = req.file ? req.file.path.replace(/\\/g, '/') : ''; // Ensure forward slashes for URLs
                    const insertSql = "INSERT INTO money (user_name, value, httt_ma, img_url) VALUES (?, ?, ?, ?)";
                    con.query(insertSql, [username, value, httt_ma, imageUrl], (insertErr, insertResult) => {
                        if (insertErr) {
                            console.error(insertErr);
                            return res.status(500).json({
                                message: "Error during deposit",
                                error: insertErr.message
                            });
                        }
                        res.json({
                            message: "Deposit successful",
                            transactionId: insertResult.insertId,
                            imageUrl: `http://${host}:${port}/uploads/${imageUrl}` ,// Construct the full URL to the uploaded image
                            value: value
                        });
                    });
                });
            } else {
                res.status(401).json({ message: "User not found" });
            }
        });
    });
});

// Endpoint to handle form submissions for inquiries
app.post('/contact', contact.none(), (req, res) => {
    const { user_name, message } = req.body;

    if (!user_name) {
        return res.status(400).json({ message: 'Username error' });
    }

    // Verify the username exists
    const sqlVerifyUser = "SELECT * FROM user WHERE user_name = ?";
    con.query(sqlVerifyUser, [user_name], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error checking user existence", error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Username not found" });
        }

        // Save the inquiry message to the 'contact' table
        const sqlInsertMessage = "INSERT INTO contact (user_name, message) VALUES (?, ?)";
        con.query(sqlInsertMessage, [user_name, message], (insertErr, insertResult) => {
            if (insertErr) {
                console.error(insertErr);
                return res.status(500).json({
                    message: "Error saving message",
                    error: insertErr.message
                });
            }

            res.json({
                message: "Inquiry submitted successfully",
                result: insertResult
            });
        });
    });
});


// Endpoint to get the current balance of a user
app.get('/balance', (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    // Replace 'deposit_table' and 'withdraw_table' with your actual table names
    const balanceSql = `
        SELECT 
            (SELECT COALESCE(SUM(value), 0) FROM money WHERE email = (SELECT email FROM user WHERE user_name = ?)) AS total_deposit,
            (SELECT COALESCE(SUM(value), 0) FROM withdraw_table WHERE user_id = (SELECT id FROM user WHERE user_name = ?)) AS total_withdraw
    `;

    con.query(balanceSql, [username, username], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error fetching balance", error: err.message });
        }
        if (results.length > 0) {
            const { total_deposit, total_withdraw } = results[0];
            const balance = total_deposit - total_withdraw;
            res.json({ balance });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    });
});

app.get('/user-info', (req, res) => {
    const username = req.query.username;
    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    const balanceSql = `
        SELECT 
            (SELECT COALESCE(SUM(value), 0) FROM money WHERE user_name = ?) AS total_deposit,
            (SELECT COALESCE(SUM(value), 0) FROM ruttien WHERE user_name = ?) AS total_withdraw
    `;

    con.query(balanceSql, [username, username], (err, balanceResults) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error fetching balance", error: err.message });
        }

        const userInfoSql = "SELECT user_name, name, gender, phone, email, address, front_cmnd_url, after_cmnd_url, nguoi_nhan, bank_name, bank_account FROM user WHERE user_name = ?";
        con.query(userInfoSql, [username], (err, userInfoResults) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error fetching user information", error: err.message });
            }

            if (userInfoResults.length > 0) {
                const user = userInfoResults[0];
                const { total_deposit, total_withdraw } = balanceResults[0] || { total_deposit: 0, total_withdraw: 0 };
                const balance = total_deposit - total_withdraw;
                // Thêm thông tin số dư vào đối tượng người dùng
                user.balance = balance;

                res.json(user);
            } else {
                res.status(404).json({ message: "User not found" });
            }
        });
    });
});

app.post('/withdraw', (req, res) => {
    const { username, password, value, kh_lydo, httt_ma, qr_url, nguoi_nhan, bank_name, bank_account } = req.body;

    // Xác minh người dùng và mật khẩu
    con.query('SELECT pass FROM user WHERE user_name = ?', [username], (err, userResults) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi server", error: err.message });
        }
        if (userResults.length === 0) {
            return res.status(404).json({ message: "Tên người dùng không tồn tại" });
        }

        const user = userResults[0];
        bcrypt.compare(password, user.pass, function(err, isMatch) {
            if (err) {
                return res.status(500).json({ message: "Lỗi xác thực", error: err.message });
            }
            if (!isMatch) {
                return res.status(401).json({ message: "Sai mật khẩu" });
            }

            // Tính số dư hiện có
            con.query('SELECT (SELECT COALESCE(SUM(value), 0) FROM money WHERE user_name = ?) - (SELECT COALESCE(SUM(value), 0) FROM ruttien WHERE user_name = ?) AS balance', [username, username], (err, balanceResults) => {
                if (err) {
                    return res.status(500).json({ message: "Lỗi khi lấy số dư", error: err.message });
                }

                const currentBalance = balanceResults[0].balance;
                if (value > currentBalance) {
                    return res.status(400).json({ message: "Số dư không đủ để rút số tiền này" });
                }

                // Thực hiện giao dịch rút tiền
                con.query('INSERT INTO ruttien (user_name, value, kh_lydo, httt_ma, qr_url, nguoi_nhan, bank_name, bank_account) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
                    [username, value, kh_lydo, httt_ma, qr_url || null, nguoi_nhan || null, bank_name || null, bank_account || null], (err, insertResult) => {
                        if (err) {
                            return res.status(500).json({ message: "Lỗi khi thực hiện giao dịch rút tiền", error: err.message });
                        }

                        // Giao dịch rút tiền thành công
                        res.json({ 
                            message: "Rút tiền thành công", 
                            transactionId: insertResult.insertId, 
                            balanceAfterWithdraw: currentBalance - value 
                        });
                    }
                );
            });
        });
    });
});

app.post('/withdraw-all', (req, res) => {
    const { username, password } = req.body;

    // Đầu tiên xác minh người dùng dựa trên username và password
    con.query('SELECT pass FROM user WHERE user_name = ?', [username], (err, userResults) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi server", error: err.message });
        }
        if (userResults.length === 0) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        const user = userResults[0];
        bcrypt.compare(password, user.pass, function(err, isMatch) {
            if (err || !isMatch) {
                return res.status(401).json({ message: "Sai mật khẩu" });
            }

            // Tính số dư hiện có bằng cách lấy tổng value từ bảng 'money' và trừ đi tổng value từ bảng 'ruttien'
            con.query('SELECT (SELECT COALESCE(SUM(value), 0) FROM money WHERE user_name = ?) - (SELECT COALESCE(SUM(value), 0) FROM ruttien WHERE user_name = ?) AS balance', [username, username], (err, results) => {
                if (err) {
                    return res.status(500).json({ message: "Lỗi khi lấy số dư", error: err.message });
                }

                const currentBalance = results[0].balance;
                if (currentBalance <= 0) {
                    return res.status(400).json({ message: "Không có đủ số dư để rút" });
                }

                // Thực hiện giao dịch rút tiền
                con.query('INSERT INTO ruttien (user_name, value, kh_lydo, httt_ma, qr_url, nguoi_nhan, bank_name, bank_account) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
                    [username, currentBalance, 'Thu hồi vốn', req.body.httt_ma, req.body.qr_url || null, req.body.nguoi_nhan || null, req.body.bank_name || null, req.body.bank_account || null], (err, insertResult) => {
                        if (err) {
                            return res.status(500).json({ message: "Lỗi khi thực hiện giao dịch rút tiền", error: err.message });
                        }

                        // Giao dịch rút tiền thành công
                        res.json({ 
                            message: "Thu hồi vốn thành công", 
                            transactionId: insertResult.insertId, 
                            balanceAfterWithdraw: 0 
                        });
                    }
                );
            });
        });
    });
});


// ... any other routes you have
app.listen(port, () => {
    console.log(`Server running at http://${host}:${port}`);
});