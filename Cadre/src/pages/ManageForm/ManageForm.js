import React, { useState } from 'react';
import HeaderTable from '../../components/headerTable/HeaderTable';
import classes from './ManageForm.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faPlus, faClose, faTrash, faPen } from '@fortawesome/free-solid-svg-icons';

const ManageForm = () => {
    const initialData = [
        {
            stt: 1,
            content: 'Quận 4',
            img: 'Jane Doe',
            type: 'Hình quảng cáo',
        },
        {
            stt: 1,
            content: 'Quận 4',
            img: 'Jane Doe',
            type: 'Hình thức báo cáo',
        },
        {
            stt: 1,
            content: 'Quận 4',
            img: 'Jane Doe',
            type: 'Hình quảng cáo',
        },
        {
            stt: 1,
            content: 'Quận 4',
            img: 'Jane Doe',
            type: 'Hình thức báo cáo',
        },
        // Thêm dữ liệu khác
    ];

    const [data, setData] = useState(initialData);
    const [selectedFilter, setSelectedFilter] = useState('Tất cả');

    const handleFilterChange = (type) => {
        const filteredData = type === 'Tất cả' ? initialData : initialData.filter((item) => item.type === type);
        setData(filteredData);
        setSelectedFilter(type);
    };

    const getFilterStyle = (filter) => ({
        color: selectedFilter === filter ? '#0A6971' : '#2f2f2f',
        borderBottom: selectedFilter === filter ? '2px solid #0A6971' : 'none',
        cursor: 'pointer',
    });

    return (
        <div>
            <HeaderTable title={'Danh sách các loại hình'} />
            <div className={classes.container}>
                {/* Tab Filter */}
                <div className={classes.container__header}>
                    <div className={classes.container__header_filter}>
                        <div onClick={() => handleFilterChange('Tất cả')} style={getFilterStyle('Tất cả')}>
                            Tất cả
                        </div>
                        <div
                            onClick={() => handleFilterChange('Hình quảng cáo')}
                            style={getFilterStyle('Hình quảng cáo')}
                        >
                            Các loại hình quảng cáo
                        </div>
                        <div
                            onClick={() => handleFilterChange('Hình thức báo cáo')}
                            style={getFilterStyle('Hình thức báo cáo')}
                        >
                            Các loại hình thức báo cáo
                        </div>
                    </div>
                    <div className={classes.container__header_search}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} className={classes.ic} />
                        <input type="text" id="inputSearch" placeholder="Tìm kiếm..." className={classes.text_input} />
                    </div>
                </div>

                {/* Table Header */}
                <div className={classes.table_header}>
                    <table className={classes.table__header_wrap}>
                        <thead className={classes.table__header_wrap_thead}>
                            <tr>
                                <th style={{ width: '5%' }}>STT</th>
                                <th style={{ width: '40%' }}>Nội dung</th>
                                <th style={{ width: '20%' }}>Loại</th>
                                <th style={{ width: '15%' }}>Chỉnh sửa</th>
                            </tr>
                        </thead>
                    </table>
                </div>

                {/* Table Body */}
                <div className={classes.table__body}>
                    <table className={classes.table__body_wrap}>
                        <tbody>
                            {data.map((row, rowIndex) => (
                                <tr className={classes.table__body_wrap_row} key={rowIndex}>
                                    <td style={{ width: '5%' }}>{row.stt}</td>
                                    <td style={{ width: '40%' }}>{row.content}</td>
                                    <td style={{ width: '20%' }}>{row.type}</td>
                                    <td style={{ width: '15%' }}>
                                        <button className={classes.btn_trash}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                        <button className={classes.btn_pen}>
                                            <FontAwesomeIcon icon={faPen} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageForm;

