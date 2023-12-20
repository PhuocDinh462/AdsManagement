const Yup = require('yup')
const AccountInfor = async (req, res, next) => {
    const { username, email, phone, dob } = req.body;
    try {
        // Định nghĩa schema validation
        const validationSchema = Yup.object({
            username: Yup.string().required('Username is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            phone: Yup.string()
                .matches(/^(84|0[3|5|7|8|9])+([0-9]{8})\b$/, 'Invalid phone number')
                .required('Phone is required'),
            dob: Yup.date().required('Date of birth is required'), // Kiểm tra ngày sinh
        });

        // Thực hiện validation
        await validationSchema.validate({
            username,
            email,
            phone,
            dob,
        });

        // Nếu không có lỗi, tiếp tục middleware kế tiếp
        next();
    } catch (error) {
        // Nếu có lỗi, trả về thông báo lỗi
        return res.status(400).json({ message: error.message });
    }
};


const AccountPassword = async (req, res, next) => {
    const { password, new_password } = req.body;
    try {
        // Định nghĩa schema validation
        const validationSchema = Yup.object({
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
            new_password: Yup.string().min(6, 'New Password must be at least 6 characters').required('New Password is required'),
        });

        // Thực hiện validation
        await validationSchema.validate({
            password,
            new_password
        });

        // Nếu không có lỗi, tiếp tục middleware kế tiếp
        next();
    } catch (error) {
        // Nếu có lỗi, trả về thông báo lỗi
        return res.status(400).json({ message: error.message });
    }
};
module.exports = { AccountPassword, AccountInfor };
