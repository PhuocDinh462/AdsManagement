const Yup = require('yup');

const validationAddDistrictReq = async (req, res, next) => {
  const { districtName, user_id } = req.body;
  console.log(req.body);

  try {
    // Định nghĩa schema validation cho thêm quận
    const addDistrictSchema = Yup.object({
      districtName: Yup.string().required('District name is required'),
      user_id: Yup.number().integer('Manager ID must be an integer'),
    });

    // Thực hiện validation cho thêm quận
    await addDistrictSchema.validate({ districtName, user_id });

    // Nếu không có lỗi, tiếp tục middleware kế tiếp
    next();
  } catch (error) {
    // Nếu có lỗi, trả về thông báo lỗi
    return res.status(400).json({ message: error.message });
  }
};

const validationAddWardReq = async (req, res, next) => {
  const { wardName, selectedDistrict, user_id } = req.body;

  try {
    // Định nghĩa schema validation cho thêm phường
    const addWardSchema = Yup.object({
      wardName: Yup.string().required('Ward name is required'),
      selectedDistrict: Yup.number().integer('District ID must be an integer').required('District ID is required'),
      user_id: Yup.number().integer('Manager ID must be an integer'),
    });

    // Thực hiện validation cho thêm phường
    await addWardSchema.validate({ wardName, selectedDistrict, user_id });

    // Nếu không có lỗi, tiếp tục middleware kế tiếp
    next();
  } catch (error) {
    // Nếu có lỗi, trả về thông báo lỗi
    return res.status(400).json({ message: error.message });
  }
};

// Middleware chung để xác định loại dữ liệu và chuyển hướng
const validateCreateAddressReq = async (req, res, next) => {
  const { addressType } = req.body;

  try {
    // Kiểm tra nếu district_id tồn tại để xác định loại dữ liệu
    if (addressType === 'ward') {
      // Nếu district_id tồn tại, đó là yêu cầu thêm phường
      return validationAddWardReq(req, res, next);
    } else {
      // Nếu district_id không tồn tại, đó là yêu cầu thêm quận
      return validationAddDistrictReq(req, res, next);
    }
  } catch (error) {
    // Nếu có lỗi, trả về thông báo lỗi
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { validateCreateAddressReq, validationAddDistrictReq, validationAddWardReq };
