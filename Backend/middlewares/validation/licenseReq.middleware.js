const Yup = require('yup');
const validationLicenseReq = async (req, res, next) => {
  const { advertisement_content, advertisement_image_url, point_id, width, height, contract_id, board_type_id } =
    req.body;

  try {
    // Định nghĩa schema validation
    const validationSchema = Yup.object({
      advertisement_content: Yup.string().required('Content is required'),
      advertisement_image_url: Yup.string().required('Image is required'),
      board_type_id: Yup.string().required('Type of board id is required'),
      point_id: Yup.string().required('Point id is required'),
      width: Yup.number().required('Width is required'),
      height: Yup.number().required('Height is required'),
      contract_id: Yup.string().required('Contract id is required'), // Kiểm tra ngày sinh
    });

    // Thực hiện validation
    await validationSchema.validate({
      advertisement_content,
      advertisement_image_url,
      point_id,
      width,
      height,
      contract_id,
      board_type_id,
    });

    // Nếu không có lỗi, tiếp tục middleware kế tiếp
    next();
  } catch (error) {
    // Nếu có lỗi, trả về thông báo lỗi
    return res.status(400).json({ message: error.message });
  }
};

module.exports = validationLicenseReq;
