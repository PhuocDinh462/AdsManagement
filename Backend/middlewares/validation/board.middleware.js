const Yup = require('yup');
const validationBoard = async (req, res, next) => {
  const { board_type_id, advertisement_content, advertisement_image_url, width, height, point_id } = req.body;

  try {
    // Định nghĩa schema validation
    const validationSchema = Yup.object({
      board_type_id: Yup.number().typeError('Loại bảng quảng cáo phải là số').required('Company name is required'),
      advertisement_content: Yup.string().required('Nội dung quảng cáo là yêu cầu'),
      advertisement_image_url: Yup.string().required('Hình ảnh là yêu cầu'),
      width: Yup.number().typeError('Độ dài bảng quảng cáo phải là số').required('Độ dài là yêu cầu'),
      height: Yup.number().typeError('Độ cao quảng cáo phải là số').required('Độ cao là yêu cầu'),
      point_id: Yup.string().required('Thông tin của điểm quảng quảng chưa đúng'),
    });

    // Thực hiện validation
    await validationSchema.validate({
      board_type_id,
      advertisement_content,
      advertisement_image_url,
      width,
      height,
      point_id,
    });

    // Nếu không có lỗi, tiếp tục middleware kế tiếp
    next();
  } catch (error) {
    // Nếu có lỗi, trả về thông báo lỗi
    return res.status(400).json({ message: error.message });
  }
};

module.exports = validationBoard;
