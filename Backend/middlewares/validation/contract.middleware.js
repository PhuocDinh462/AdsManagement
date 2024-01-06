const Yup = require('yup');
const validationContract = async (req, res, next) => {
  const {
    company_name,
    company_email,
    company_phone,
    company_address,
    company_taxcode,
    start_date,
    end_date,
    representative,
  } = req.body;

  try {
    // Định nghĩa schema validation
    const validationSchema = Yup.object({
      company_name: Yup.string().required('Company name is required'),
      company_email: Yup.string().email('Invalid email address').required('Email is required'),
      company_phone: Yup.string()
        .matches(/^(84|0[3|5|7|8|9])+([0-9]{8})\b$/, 'Invalid phone number')
        .required('Phone is required'),
      company_address: Yup.string().required('Address is required'),
      company_taxcode: Yup.number().required('Taxcode is required'),
      start_date: Yup.date().required('Date start id is required'),
      end_date: Yup.date().required('Date end id is required'),
      representative: Yup.string().required('Representative id is required'),
    });

    // Thực hiện validation
    await validationSchema.validate({
      company_name,
      company_email,
      company_phone,
      company_address,
      company_taxcode,
      start_date,
      end_date,
      representative,
    });

    // Nếu không có lỗi, tiếp tục middleware kế tiếp
    next();
  } catch (error) {
    // Nếu có lỗi, trả về thông báo lỗi
    return res.status(400).json({ message: error.message });
  }
};

module.exports = validationContract;
