const Yup = require('yup')
const BoardRequest = async (req, res, next) => {
    const { board_id, board_type_id, edit_status, advertisement_content, advertisement_image_url, request_time, reason, width, height } = req.body;
    try {
        // Định nghĩa schema validation
        const validationSchema = Yup.object({
            board_id: Yup.number().positive().integer().required('Vui lòng nhập board_id là số nguyên dương.'),
            board_type_id: Yup.number().positive().integer().required('Vui lòng nhập board_type_id là số nguyên dương.'),
            edit_status: Yup.string().required('Vui lòng nhập edit_status.').oneOf(['pending', 'approved', 'canceled'], 'Trạng thái không hợp lệ.'),
            advertisement_content: Yup.string().required('Vui lòng nhập nội dung quảng cáo.'),
            advertisement_image_url: Yup.string().required('Vui lòng nhập URL hợp lệ cho hình ảnh quảng cáo.'),
            request_time: Yup.date().required('Vui lòng nhập thời gian yêu cầu.'),
            reason: Yup.string().required('Vui lòng nhập lý do yêu cầu.'),
            width: Yup.number().positive().required('Vui lòng nhập chiều rộng là số dương.'),
            height: Yup.number().positive().required('Vui lòng nhập chiều cao là số dương.'),
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
            advertisement_type_id: Yup.number().positive().integer().required('Vui lòng nhập advertisement_type_id là số nguyên dương.'),
            location_type: Yup.string()
                .required('Vui lòng nhập loại vị trí.')
                .oneOf(locationOptions, 'Loại vị trí không hợp lệ.'),
            is_planning: Yup.boolean().required('Vui lòng chọn trạng thái quy hoạch.'),
            image_url: Yup.string().required('Vui lòng nhập URL hình ảnh hợp lệ.'),
            point_id: Yup.number().positive().integer().required('Vui lòng nhập ID điểm là số nguyên dương.'),
            edit_status: Yup.string().oneOf(['pending', 'approved', 'canceled'], 'Trạng thái chỉ có thể là "pending", "approved" hoặc "canceled"'),
            request_time: Yup.date().required('Vui lòng nhập thời gian yêu cầu.'),
            reason: Yup.string().required('Vui lòng nhập lý do.'),
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
