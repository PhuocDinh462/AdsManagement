import React, { useEffect, useState } from 'react';
import classes from './ManageDistrictWard.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faPlus, faClose, faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import ModalAdd from './components/ModalAdd';
import Modal from '../../components/Modal/Modal';
import { axiosClient } from '../../api/axios';
import ModalUpdate from './components/ModalUpdate';
import Swal from 'sweetalert2';
import setLocalStorageFromCookie from '~/src/utils/setLocalStorageFromCookie';

const ManageDistrictWard = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  useEffect(() => {
    setLocalStorageFromCookie('user-state');
    setLocalStorageFromCookie('user_type');
    setLocalStorageFromCookie('user_id');
    setLocalStorageFromCookie('token');
  }, []);
  const fetchData = async () => {
    try {
      const response = await axiosClient.get('/cadre');

      const convertedData = response.reduce((accumulator, district) => {
        const districtManager = district.districtManager || {};
        const districtInfo = {
          id: district.districtId,
          area: district.districtName,
          managerName: districtManager.name || '',
          email: districtManager.email || '',
          phoneNumber: districtManager.phone || '',
          level: 'Quận',
        };

        const wardInfoArray = district.wards.map((ward) => {
          const wardManager = ward.manager || {};
          return {
            id: ward.id,
            area: ward.name,
            managerName: wardManager.name || '',
            district_id: district.districtId,
            district_name: district.districtName,
            email: wardManager.email || '',
            phoneNumber: wardManager.phone || '',
            level: 'Phường',
          };
        });

        return [...accumulator, districtInfo, ...wardInfoArray];
      }, []);

      setData(convertedData);
      setOriginalData(convertedData);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateDataAfterAdd = async (newData) => {
    await fetchData();
    setModalOpen(false);
  };

  const handleFilterChange = (level) => {
    const filteredData = level === 'All' ? originalData : originalData.filter((item) => item.level === level);
    setData(filteredData);
    setSelectedFilter(level);
  };

  const getFilterStyle = (filter) => ({
    color: selectedFilter === filter ? '#0A6971' : '#2f2f2f',
    borderBottom: selectedFilter === filter ? '2px solid #0A6971' : 'none',
    cursor: 'pointer',
  });

  const handleAddClick = () => {
    setSelectedRowData(null);
    setModalType('add');
    setModalOpen(true);
  };

  const handleEditClick = (rowData) => {
    setSelectedRowData(rowData);
    setModalType('update');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleDeleteClick = async (id, type) => {
    const confirmResult = await Swal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc muốn xóa?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    });

    if (confirmResult.isConfirmed) {
      try {
        const response = await axiosClient.delete('/cadre/deleteAddress', {
          data: { id, type },
        });

        if (response.status === 'success') {
          // Update local state after successful delete
          Swal.fire({
            icon: 'success',
            title: 'Xóa thành công!',
            text: 'Đã xóa thành công.',
          });
          fetchData();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Xóa thất bại!',
            text: 'Có lỗi xảy ra khi xóa. Vui lòng thử lại.',
          });
        }
      } catch (error) {
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Xóa thất bại!',
          text: 'Có lỗi xảy ra khi xóa. Vui lòng thử lại.',
        });
      }
    }
  };

  return (
    <div className={classes.container_wrap}>
      <div className={classes.header}>
        <p className={classes.header__title}>Danh sách quận, phường</p>
        <div className={classes.header__buttonAdd} onClick={handleAddClick}>
          <FontAwesomeIcon icon={faPlus} />
          <p className={classes.add}>Thêm</p>
        </div>
      </div>
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
                <th style={{ width: '20%' }}>Khu vực</th>
                <th style={{ width: '20%' }}>Tên cán bộ quản lý</th>
                <th style={{ width: '15%' }}>Email</th>
                <th style={{ width: '15%' }}>Số điện thoại</th>
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
                  <td style={{ width: '5%' }}>{rowIndex + 1}</td>
                  <td style={{ width: '20%' }}>{row.area}</td>
                  <td style={{ width: '20%' }}>{row.managerName}</td>
                  <td style={{ width: '15%' }}>{row.email}</td>
                  <td style={{ width: '15%' }}>{row.phoneNumber}</td>
                  <td style={{ width: '10%' }}>{row.level}</td>
                  <td style={{ width: '15%' }}>
                    <button
                      onClick={() => handleDeleteClick(row.id, row.level === 'Phường' ? 'ward' : 'district')}
                      className={classes.btn_trash}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button onClick={() => handleEditClick(row)} className={classes.btn_pen}>
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          {modalType === 'add' ? (
            <ModalAdd onClose={updateDataAfterAdd} />
          ) : modalType === 'update' ? (
            <ModalUpdate data={selectedRowData} onClose={updateDataAfterAdd} />
          ) : null}
        </Modal>
      )}
    </div>
  );
};

export default ManageDistrictWard;

