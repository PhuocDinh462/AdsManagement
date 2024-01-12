const Yup = require('yup');
const validationBoard = async (req, res, next) => {
  const { board_type_id, advertisement_content, advertisement_image_url, width, height, point_id } = req.body;

  try {
    // Định nghĩa schema validation
    const validationSchema = Yup.object({
      board_type_id: Yup.number().typeError('Board type must be a number').required('Board type is required'),
      advertisement_content: Yup.string().required('Advertisement content is required'),
      advertisement_image_url: Yup.string().required('Image URL is required'),
      width: Yup.number().typeError('Width must be a number').required('Width is required'),
      height: Yup.number().typeError('Height must be a number').required('Height is required'),
      point_id: Yup.number().required('Point information for the advertisement is incorrect'),
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
