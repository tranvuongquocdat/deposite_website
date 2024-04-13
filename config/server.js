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

const moneyStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'money/');  // Thư mục lưu trữ
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadMoney = multer({ storage: moneyStorage }).single('kh_qr');

const qrStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/qr_codes/'); // Make sure this folder exists or multer will throw an error
    },
    filename: function(req, file, cb) {
        cb(null, 'qr_code-' + Date.now() + path.extname(file.originalname));
    }
});

const uploadQR = multer({ storage: qrStorage }).single('qr_code');

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
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({ message: 'Login and password are required' });
    }

    // First check the admin table
    const sqlAdmin = "SELECT * FROM admin WHERE user_name = ?";
    con.query(sqlAdmin, [login], (err, adminResult) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error", error: err.message });
        }

        if (adminResult.length > 0) {
            const admin = adminResult[0];
            if (password === admin.pass) {
                delete admin.pass;
                req.session.username = admin.user_name; // Assuming session setup
                res.json({ message: "Admin login successful", user: admin, isAdmin: true });
            } else {
                res.status(401).json({ message: "Invalid username or password" });
            }
        } else {
            // Check the user table if not found in admin
            const sqlUser = "SELECT * FROM user WHERE user_name = ? OR email = ? OR phone = ?";
            con.query(sqlUser, [login, login, login], (err, userResult) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: "Internal server error", error: err.message });
                }

                if (userResult.length > 0) {
                    const user = userResult[0];
                    bcrypt.compare(password, user.pass, function(err, isMatch) {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ message: "Error verifying password", error: err.message });
                        }

                        if (isMatch) {
                            delete user.pass;
                            req.session.username = user.user_name;
                            res.json({ message: "User login successful", user, isAdmin: false });
                        } else {
                            res.status(401).json({ message: "Invalid username or password" });
                        }
                    });
                } else {
                    res.status(401).json({ message: "Invalid username or password" });
                }
            });
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

app.post('/withdraw', (req, res) => {
    const { username, password, value, kh_lydo } = req.body;

    // Verify user existence and password
    con.query('SELECT pass FROM user WHERE user_name = ?', [username], (err, userResults) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi server", error: err.message });
        }
        if (userResults.length === 0) {
            return res.status(404).json({ message: "Tên người dùng không tồn tại" });
        }

        const user = userResults[0];
        bcrypt.compare(password, user.pass, function(err, isMatch) {
            if (err || !isMatch) {
                return res.status(401).json({ message: "Sai mật khẩu" });
            }

            // Fetch the total confirmed deposits
            const depositSql = 'SELECT COALESCE(SUM(value), 0) AS total_deposit FROM money WHERE user_name = ? AND transaction_check = 1';
            const withdrawSql = 'SELECT COALESCE(SUM(value), 0) AS total_withdraw FROM ruttien WHERE user_name = ? AND transaction_check = 1';

            con.query(depositSql, [username], (err, depositResults) => {
                if (err) {
                    return res.status(500).json({ message: "Error fetching deposits", error: err.message });
                }
                const total_deposit = depositResults[0].total_deposit;

                con.query(withdrawSql, [username], (err, withdrawResults) => {
                    if (err) {
                        return res.status(500).json({ message: "Error fetching withdrawals", error: err.message });
                    }
                    const total_withdraw = withdrawResults[0].total_withdraw;
                    const currentBalance = total_deposit - total_withdraw;

                    if (value > currentBalance) {
                        return res.status(400).json({ message: "Số dư không đủ để rút số tiền này" });
                    }

                    // Perform the withdrawal transaction
                    con.query('INSERT INTO ruttien (user_name, value, kh_lydo, transaction_check) VALUES (?, ?, ?, 0)', [username, value, kh_lydo], (err, insertResult) => {
                        if (err) {
                            return res.status(500).json({ message: "Lỗi khi thực hiện giao dịch rút tiền", error: err.message });
                        }

                        res.json({ 
                            message: "Rút tiền thành công, giao dịch đang được xử lý!!!", 
                            transactionId: insertResult.insertId, 
                            balanceAfterWithdraw: currentBalance - value 
                        });
                    });
                });
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

    // Adjust the queries to check for transaction_check = 1 in both deposits and withdrawals
    const balanceSql = `
        SELECT 
            (SELECT COALESCE(SUM(value), 0) FROM money WHERE user_name = ? AND transaction_check = 1) AS total_deposit,
            (SELECT COALESCE(SUM(value), 0) FROM ruttien WHERE user_name = ? AND transaction_check = 1) AS total_withdraw
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
app.get('/bank_info', (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    const sql = "SELECT nguoi_nhan, bank_name, bank_account FROM user WHERE user_name = ?";
    con.query(sql, [username], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error fetching bank information", error: err.message });
        }
        if (results.length > 0) {
            const { nguoi_nhan, bank_name, bank_account } = results[0];
            res.json({ nguoi_nhan, bank_name, bank_account });  // Successfully return the bank details
        } else {
            res.status(404).json({ message: "User not found" });  // Handle no user found
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
            (SELECT COALESCE(SUM(value), 0) FROM money WHERE user_name = ? AND transaction_check = 1) AS total_deposit,
            (SELECT COALESCE(SUM(value), 0) FROM ruttien WHERE user_name = ? AND transaction_check = 1) AS total_withdraw
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

app.get('/get-mails', (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    const sql = "SELECT * FROM mail WHERE user_name = ? ORDER BY time DESC";
    con.query(sql, [username], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error fetching mails", error: err.message });
        }
        res.json({ mails: results });
    });
});



////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
///ADMIN INFO SET UP////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// Endpoint to handle form submissions for inquiries
app.post('/admin_send', contact.none(), (req, res) => {
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
        const sqlInsertMessage = "INSERT INTO mail (user_name, message) VALUES (?, ?)";
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

app.get('/admin-get-mails', (req, res) => {
    const sql = "SELECT * FROM contact ORDER BY time DESC";
    con.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error fetching mails", error: err.message });
        }
        res.json({ mails: results });
    });
});

app.get('/get-deposits', (req, res) => {
    const sql = "SELECT * FROM money"; // Replace 'deposit_table' with your actual table name
    con.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error fetching deposits", error: err.message });
        }
        res.json({ deposits: results });
    });
});

app.post('/update-deposit-status', (req, res) => {
    const { ma_gd, newStatus } = req.body;
    const sql = "UPDATE money SET transaction_check = ? WHERE ma_gd = ?";

    con.query(sql, [newStatus, ma_gd], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error updating deposit status", error: err.message });
        }
        res.json({ success: true, message: 'Deposit status updated successfully' });
    });
});

app.get('/get-withdrawals', (req, res) => {
    const sql = `
        SELECT r.time, r.ma_gd, r.user_name, r.value, r.kh_lydo, r.httt_ma, r.qr_url, r.transaction_check
        FROM ruttien r
        ORDER BY r.time DESC
    `;

    con.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error fetching withdrawals", error: err.message });
        }
        res.json({ withdrawals: results });
    });
});

app.post('/update-withdrawal-status', (req, res) => {
    const { ma_gd, newStatus } = req.body;
    const sql = `
        UPDATE ruttien SET transaction_check = ? WHERE ma_gd = ?
    `;

    con.query(sql, [newStatus, ma_gd], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error updating withdrawal status", error: err.message });
        }
        res.json({ success: true, message: 'Status updated successfully' });
    });
});

app.get('/get-users', (req, res) => {
    const sql = `SELECT * FROM user`;

    con.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error fetching users", error: err.message });
        }
        res.json({ users: results });
    });
});

app.post('/update-user/:userName', (req, res) => {
    const { userName } = req.params;
    const { name, address, phone, email, nguoi_nhan, bank_name, bank_account, balance } = req.body;
    console.log('Received data for update:', req.body);

    // Update user details
    const updateUserSql = `
        UPDATE user 
        SET name = ?, address = ?, phone = ?, email = ?, nguoi_nhan = ?, bank_name = ?, bank_account = ? 
        WHERE user_name = ?
    `;
    con.query(updateUserSql, [name, address, phone, email, nguoi_nhan, bank_name, bank_account, userName], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error updating user", error: err.message });
        }
        
        // Now, check for balance updates
        if (balance !== undefined) {
            const balanceSql = `
                SELECT 
                    (SELECT COALESCE(SUM(value), 0) FROM money WHERE user_name = ? AND transaction_check = 1) AS total_deposit,
                    (SELECT COALESCE(SUM(value), 0) FROM ruttien WHERE user_name = ? AND transaction_check = 1) AS total_withdraw
            `;

            con.query(balanceSql, [userName, userName], (balanceErr, balanceResults) => {
                if (balanceErr) {
                    console.error(balanceErr);
                    return res.status(500).json({ message: "Error fetching balance", error: balanceErr.message });
                }

                if (balanceResults.length > 0) {
                    const { total_deposit, total_withdraw } = balanceResults[0];
                    const currentBalance = total_deposit - total_withdraw;
                    const balanceDifference = balance - currentBalance;

                    if (balanceDifference !== 0) {
                        let balanceUpdateSql;
                        let values;

                        if (balanceDifference > 0) {
                            // Add difference to money table
                            balanceUpdateSql = 'INSERT INTO money (user_name, value, transaction_check) VALUES (?, ?, 1)';
                            values = [userName, balanceDifference];
                        } else {
                            // Add difference to ruttien table
                            balanceUpdateSql = 'INSERT INTO ruttien (user_name, value, transaction_check) VALUES (?, ?, 1)';
                            values = [userName, -balanceDifference];
                        }

                        con.query(balanceUpdateSql, values, (balanceUpdateErr, balanceUpdateResult) => {
                            if (balanceUpdateErr) {
                                console.error(balanceUpdateErr);
                                return res.status(500).json({ message: "Error updating balance", error: balanceUpdateErr.message });
                            }
                            res.json({ message: "User and balance updated successfully" });
                        });
                    } else {
                        res.json({ message: "User updated successfully, no balance change" });
                    }
                } else {
                    res.status(404).json({ message: "User not found" });
                }
            });
        } else {
            res.json({ message: "User updated successfully" });
        }
    });
});
  
// Endpoint to get page info
app.get('/get-page-info', (req, res) => {
    con.query("SELECT * FROM page LIMIT 1", (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching page info", error: err.message });
      }
      res.json({ page: result[0] });
    });
  });
  
  // Endpoint to update page info
  app.post('/update-page-info', uploadQR, (req, res) => {
    const { page_name, phone, nguoi_nhan, bank_name, bank_account } = req.body;
    const qr_link = req.file ? req.file.path.replace(/\\/g, '/') : ''; // Correct the slashes if on Windows
    
    const sql = "UPDATE page SET page_name = ?, phone = ?, nguoi_nhan = ?, bank_name = ?, bank_account = ?, qr_link = ? WHERE id = 1";
    
    con.query(sql, [page_name, phone, nguoi_nhan, bank_name, bank_account, qr_link], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error updating page info", error: err.message });
      }
      res.json({ message: "Page info updated successfully", qr_link: qr_link });
    });
});

// ... any other routes you have
app.listen(port, () => {
    console.log(`Server running at http://${host}:${port}`);
});