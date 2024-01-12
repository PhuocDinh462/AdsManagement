const Yup = require('yup')
const BoardRequest = async (req, res, next) => {
    const { board_id, board_type_id, edit_status, advertisement_content, advertisement_image_url, request_time, reason, width, height } = req.body;
    try {
        // Định nghĩa schema validation
        const validationSchema = Yup.object({
            board_id: Yup.number().positive().integer().required('Please enter a positive integer for board_id.'),
            board_type_id: Yup.number().positive().integer().required('Please enter a positive integer for board_type_id.'),
            edit_status: Yup.string().required('Please enter edit_status.').oneOf(['pending', 'approved', 'canceled'], 'Invalid status.'),
            advertisement_content: Yup.string().required('Please enter advertisement content.'),
            advertisement_image_url: Yup.string().required('Please enter a valid URL for the advertisement image.'),
            request_time: Yup.date().required('Please enter request time.'),
            reason: Yup.string().required('Please enter the reason for the request.'),
            width: Yup.number().positive().required('Please enter a positive number for width.'),
            height: Yup.number().positive().required('Please enter a positive number for height.'),
        });

        // Thực hiện validation
        await validationSchema.validate({
            board_id,
            board_type_id,
            edit_status,
            advertisement_content,
            advertisement_image_url,
            request_time,
            reason,
            width,
            height,
        });

        // Nếu không có lỗi, tiếp tục middleware kế tiếp
        next();
    } catch (error) {
        // Nếu có lỗi, trả về thông báo lỗi
        return res.status(400).json({ message: error.message });
    }
};

const locationOptions = [
    'Đất công/Công viên/Hành lang an toàn giao thông',
    'Đất tư nhân/Nhà ở riêng lẻ',
    'Trung tâm thương mại',
    'Chợ',
    'Cây xăng',
    'Nhà chờ xe buýt',
];
const PointRequest = async (req, res, next) => {
    const { advertisement_type_id, location_type, is_planning, image_url, point_id, edit_status, request_time, reason } = req.body;
    try {
        // Định nghĩa schema validation
        const validationSchema = Yup.object({
            advertisement_type_id: Yup.number().positive().integer().required('Please enter a positive integer for advertisement_type_id.'),
            location_type: Yup.string()
                .required('Please enter the location type.')
                .oneOf(locationOptions, 'Invalid location type.'),
            is_planning: Yup.boolean().required('Please select the planning status.'),
            image_url: Yup.string().required('Please enter a valid image URL.'),
            point_id: Yup.number().positive().integer().required('Please enter a positive integer for point_id.'),
            edit_status: Yup.string().oneOf(['pending', 'approved', 'canceled'], 'Status must be "pending", "approved", or "canceled".'),
            request_time: Yup.date().required('Please enter the request time.'),
            reason: Yup.string().required('Please enter the reason.'),
        });


        // Thực hiện validation
        await validationSchema.validate({
            advertisement_type_id,
            location_type,
            is_planning,
            image_url,
            point_id,
            edit_status,
            request_time,
            reason,
        });

        // Nếu không có lỗi, tiếp tục middleware kế tiếp
        next();
    } catch (error) {
        // Nếu có lỗi, trả về thông báo lỗi
        return res.status(400).json({ message: error.message });
    }
};
module.exports = { PointRequest, BoardRequest };
