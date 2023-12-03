import React, { useState } from 'react';
import HeaderTable from '../../components/headerTable/HeaderTable';
import classes from './ManageDistrictWard.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faPlus, faClose, faTrash, faPen } from '@fortawesome/free-solid-svg-icons';

const ManageDistrictWard = () => {
    const initialData = [
        {
            stt: 1,
            area: 'Quận 1',
            managerName: 'John Doe',
            email: 'john@example.com',
            phoneNumber: '123456789',
            level: 'Quận',
            editButton: 'Edit',
        },
        {
            stt: 2,
            area: 'Quận 2',
            managerName: 'Jane Doe',
            email: 'jane@example.com',
            phoneNumber: '987654321',
            level: 'Quận',
            editButton: 'Edit',
        },
        {
            stt: 3,
            area: 'Quận 3',
            managerName: 'Jane Doe',
            email: 'jane@example.com',
            phoneNumber: '987654321',
            level: 'Phường',
            editButton: 'Edit',
        },
        {
            stt: 4,
            area: 'Quận 4',
            managerName: 'Jane Doe',
            email: 'jane@example.com',
            phoneNumber: '987654321',
            level: 'Quận',
            editButton: 'Edit',
        },
        {
            stt: 3,
            area: 'Quận 3',
            managerName: 'Jane Doe',
            email: 'jane@example.com',
            phoneNumber: '987654321',
            level: 'Phường',
            editButton: 'Edit',
        },
        {
            stt: 4,
            area: 'Quận 4',
            managerName: 'Jane Doe',
            email: 'jane@example.com',
            phoneNumber: '987654321',
            level: 'Quận',
            editButton: 'Edit',
        },
        {
            stt: 3,
            area: 'Quận 3',
            managerName: 'Jane Doe',
            email: 'jane@example.com',
            phoneNumber: '987654321',
            level: 'Phường',
            editButton: 'Edit',
        },
        {
            stt: 4,
            area: 'Quận 4',
            managerName: 'Jane Doe',
            email: 'jane@example.com',
            phoneNumber: '987654321',
            level: 'Quận',
            editButton: 'Edit',
        },
        {
            stt: 3,
            area: 'Quận 3',
            managerName: 'Jane Doe',
            email: 'jane@example.com',
            phoneNumber: '987654321',
            level: 'Phường',
            editButton: 'Edit',
        },
        {
            stt: 4,
            area: 'Quận 4',
            managerName: 'Jane Doe',
            email: 'jane@example.com',
            phoneNumber: '987654321',
            level: 'Quận',
            editButton: 'Edit',
        },
        // Thêm dữ liệu khác
    ];

    const [data, setData] = useState(initialData);
    const [selectedFilter, setSelectedFilter] = useState('All');

    const handleFilterChange = (level) => {
        const filteredData = level === 'All' ? initialData : initialData.filter((item) => item.level === level);
        setData(filteredData);
        setSelectedFilter(level);
    };

    const getFilterStyle = (filter) => ({
        color: selectedFilter === filter ? '#0A6971' : '#2f2f2f',
        borderBottom: selectedFilter === filter ? '2px solid #0A6971' : 'none',
        cursor: 'pointer',
    });

    return (
        <div>
            <HeaderTable title={'Danh sách quận, phường'} />
            <div className={classes.container}>
                {/* Tab Filter */}
                <div className={classes.container__header}>
                    <div className={classes.container__header_filter}>
                        <div onClick={() => handleFilterChange('All')} style={getFilterStyle('All')}>
                            All
                        </div>
                        <div onClick={() => handleFilterChange('Phường')} style={getFilterStyle('Phường')}>
                            Phường
                        </div>
                        <div onClick={() => handleFilterChange('Quận')} style={getFilterStyle('Quận')}>
                            Quận
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
                                <th style={{ width: '10%' }}>Khu vực</th>
                                <th style={{ width: '20%' }}>Tên cán bộ quản lý</th>
                                <th style={{ width: '20%' }}>Email</th>
                                <th style={{ width: '20%' }}>Số điện thoại</th>
                                <th style={{ width: '10%' }}>Cấp</th>
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
                                    <td style={{ width: '10%' }}>{row.area}</td>
                                    <td style={{ width: '20%' }}>{row.managerName}</td>
                                    <td style={{ width: '20%' }}>{row.email}</td>
                                    <td style={{ width: '20%' }}>{row.phoneNumber}</td>
                                    <td style={{ width: '10%' }}>{row.level}</td>
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

export default ManageDistrictWard;

