const Yup = require('yup');
const validationCreate = async (req, res, next) => {
  const { username, password, email, phone, dob, user_type } = req.body;

  try {
    // Định nghĩa schema validation
    const validationSchema = Yup.object({
      username: Yup.string().required('Username is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      phone: Yup.string()
        .matches(/^(84|0[3|5|7|8|9])+([0-9]{8})\b$/, 'Invalid phone number')
        .required('Phone is required'),
      dob: Yup.date().required('Date of birth is required'), // Kiểm tra ngày sinh
      user_type: Yup.string()
        .oneOf(['ward', 'district', 'department'], 'Invalid user type')
        .required('User type is required'),
    });

    // Thực hiện validation
    await validationSchema.validate({
      username,
      password,
      email,
      phone,
      dob,
      user_type,
    });

    // Nếu không có lỗi, tiếp tục middleware kế tiếp
    next();
  } catch (error) {
    // Nếu có lỗi, trả về thông báo lỗi
    return res.status(400).json({ message: error.message });
  }
};

const validationRegister = async (req, res, next) => {
  const { username, password, email, phone, dob, user_type, officer_id } = req.body;

  try {
    // Định nghĩa schema validation
    const validationSchema = Yup.object({
      username: Yup.string().required('Username is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      phone: Yup.string()
        .matches(/^(84|0[3|5|7|8|9])+([0-9]{8})\b$/, 'Invalid phone number')
        .required('Phone is required'),
      dob: Yup.date().required('Date of birth is required'), // Kiểm tra ngày sinh
      user_type: Yup.string()
        .oneOf(['ward', 'district', 'department'], 'Invalid user type')
        .required('User type is required'),
      officer_id: Yup.string(),
    });

    console.log(req.body);

    // Thực hiện validation
    await validationSchema.validate({
      username,
      password,
      email,
      phone,
      dob,
      user_type,
      officer_id,
    });

    // Nếu không có lỗi, tiếp tục middleware kế tiếp
    next();
  } catch (error) {
    // Nếu có lỗi, trả về thông báo lỗi
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { validationCreate, validationRegister };

