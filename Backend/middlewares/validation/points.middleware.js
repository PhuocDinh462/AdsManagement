const Yup = require('yup');
const validationAddPointReq = async (req, res, next) => {
  const { address, location_type, image_url, lat, lng, is_planning, ward_id, advertisement_type_id } = req.body;

  try {
    // Định nghĩa schema validation cho thêm điểm
    const addPointSchema = Yup.object({
      address: Yup.string().required('Address is required'),
      location_type: Yup.string().required('Location type is required'),
      image_url: Yup.string().required('Image URL is required'),
      lat: Yup.number().required('Latitude is required'),
      lng: Yup.number().required('Longitude is required'),
      is_planning: Yup.boolean().required('Is planning is required'),
      ward_id: Yup.number().required('Ward ID is required'),
      advertisement_type_id: Yup.number().required('Advertisement type ID is required'),
    });

    // Thực hiện validation cho thêm điểm
    await addPointSchema.validate({
      address,
      location_type,
      image_url,
      lat,
      lng,
      is_planning,
      ward_id,
      advertisement_type_id,
    });

    // Nếu không có lỗi, tiếp tục middleware kế tiếp
    next();
  } catch (error) {
    // Nếu có lỗi, trả về thông báo lỗi
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { validationAddPointReq };
