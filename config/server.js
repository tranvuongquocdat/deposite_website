const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

const bcrypt = require('bcrypt');

const cors = require('cors'); // Đảm bảo đã cài đặt package cors với npm install cors
app.use(cors());

const session = require('express-session');

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


const con = mysql.createConnection({
    host: "localhost",
    port: 3636,
    user: "root",
    password: "",
    database: "deposite_sql"
});

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

        const { username, password, name, gender, address, phone, email, date, month, year, cmnd, kh_ma_moi} = req.body;
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
                    const sql = "INSERT INTO user (user_name, pass, name, gender, address, phone, email, date, month, year, cmnd, front_cmnd_url, after_cmnd_url, ma_moi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    const values = [username, hash, name, gender, address, phone, email, date, month, year, cmnd, cmndFrontUrl, cmndAfterUrl, kh_ma_moi];
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
                            imageUrl: `http://localhost:${port}/uploads/${imageUrl}` ,// Construct the full URL to the uploaded image
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
    const username = req.query.username; // Lấy username từ query string

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    const sql = "SELECT user_name, name, gender, phone, email, address, front_cmnd_url, after_cmnd_url FROM user WHERE user_name = ?";
    con.query(sql, [username], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error fetching user information", error: err.message });
        }
        if (result.length > 0) {
            const user = result[0];
            delete user.password; // Giả định có trường password
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    });
});

// ... any other routes you have
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});