const Yup = require('yup');

// Middleware validation cho bảng report_type
const validateAddReportTypeReq = async (req, res, next) => {
  const { typeName } = req.body;

  try {
    // Định nghĩa schema validation cho thêm loại báo cáo
    const addReportTypeSchema = Yup.object({
      typeName: Yup.string().required('Report type name is required'),
    });

    // Thực hiện validation cho thêm loại báo cáo
    await addReportTypeSchema.validate({ typeName });

    // Nếu không có lỗi, tiếp tục middleware kế tiếp
    next();
  } catch (error) {
    // Nếu có lỗi, trả về thông báo lỗi
    return res.status(400).json({ message: error.message });
  }
};

// Middleware validation cho bảng advertisement_type
const validateAddAdvertisementTypeReq = async (req, res, next) => {
  const { typeName } = req.body;

  try {
    // Định nghĩa schema validation cho thêm loại quảng cáo
    const addAdvertisementTypeSchema = Yup.object({
      typeName: Yup.string().required('Advertisement type name is required'),
    });

    // Thực hiện validation cho thêm loại quảng cáo
    await addAdvertisementTypeSchema.validate({ typeName });

    // Nếu không có lỗi, tiếp tục middleware kế tiếp
    next();
  } catch (error) {
    // Nếu có lỗi, trả về thông báo lỗi
    return res.status(400).json({ message: error.message });
  }
};

// Middleware validation cho bảng board_type
const validateAddBoardTypeReq = async (req, res, next) => {
  const { typeName } = req.body;

  try {
    // Định nghĩa schema validation cho thêm loại bảng
    const addBoardTypeSchema = Yup.object({
      typeName: Yup.string().required('Board type name is required'),
    });

    // Thực hiện validation cho thêm loại bảng
    await addBoardTypeSchema.validate({ typeName });

    // Nếu không có lỗi, tiếp tục middleware kế tiếp
    next();
  } catch (error) {
    // Nếu có lỗi, trả về thông báo lỗi
    return res.status(400).json({ message: error.message });
  }
};

const validateFormType = async (req, res, next) => {
  const { type } = req.body;

  try {
    if (type === 'board') {
      return validateAddBoardTypeReq(req, res, next);
    } else if (type === 'report') {
      return validateAddReportTypeReq(req, res, next);
    } else {
      return validateAddAdvertisementTypeReq(req, res, next);
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  validateAddReportTypeReq,
  validateAddAdvertisementTypeReq,
  validateAddBoardTypeReq,
  validateFormType,
};

