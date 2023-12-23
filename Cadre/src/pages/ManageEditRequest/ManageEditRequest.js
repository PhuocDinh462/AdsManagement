import React, { useEffect, useState } from 'react';
import classes from './ManageEditRequest.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faPlus, faClose, faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import ModalAdd from './components/ModalAdd';
import Modal from '~/src/components/Modal/Modal';
import ModalUpdate from './components/ModalUpdate';
import { axiosClient } from '../../api/axios';
import Swal from 'sweetalert2';

const ManageForm = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('Tất cả');
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [modalType, setModalType] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axiosClient.get('/cadre/form');
      setData(response);
      setOriginalData(response);
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

  const handleFilterChange = (type) => {
    let filteredData;

    if (type === 'Tất cả') {
      filteredData = originalData;
    } else if (type === 'Hình thức quảng cáo') {
      filteredData = originalData.filter((item) => item.type === 'advertisement');
    } else if (type === 'Hình thức báo cáo') {
      filteredData = originalData.filter((item) => item.type === 'report');
    } else if (type === 'Bảng') {
      filteredData = originalData.filter((item) => item.type === 'board');
    }

    setData(filteredData);
    setSelectedFilter(type);
  };

  const getFilterStyle = (filter) => ({
    color: selectedFilter === filter ? '#0A6971' : '#2f2f2f',
    borderBottom: selectedFilter === filter ? '2px solid #0A6971' : 'none',
    cursor: 'pointer',
  });

  const handleCloseModal = () => {
    setModalOpen(false);
  };

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

  const handleDeleteClick = async (row) => {
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
        const response = await axiosClient.delete('cadre/deleteForm', { data: { type: row.type, id: row.typeId } });

        if (response.status === 'success') {
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
          console.error('Failed to delete element');
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Xóa thất bại!',
        });
        console.error('Error deleting element: ', error);
      }
    }
  };

  return (
    <div className={classes.container_wrap}>
      <div className={classes.header}>
        <p className={classes.header__title}>Danh sách loại hình quảng cáo và hình thức báo cáo</p>
        <div className={classes.header__buttonAdd} onClick={handleAddClick}>
          <FontAwesomeIcon icon={faPlus} />
          <p className={classes.add}>Thêm</p>
        </div>
      </div>
      <div className={classes.container}>
        {/* Tab Filter */}
        <div className={classes.container__header}>
          <div className={classes.container__header_filter}>
            <div onClick={() => handleFilterChange('Tất cả')} style={getFilterStyle('Tất cả')}>
              Tất cả
            </div>
            <div
              onClick={() => handleFilterChange('Hình thức quảng cáo')}
              style={getFilterStyle('Hình thức quảng cáo')}
            >
              Các loại hình quảng cáo
            </div>
            <div onClick={() => handleFilterChange('Hình thức báo cáo')} style={getFilterStyle('Hình thức báo cáo')}>
              Các loại hình thức báo cáo
            </div>
            <div onClick={() => handleFilterChange('Bảng')} style={getFilterStyle('Bảng')}>
              Các loại bảng
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
                  <td style={{ width: '5%' }}>{rowIndex + 1}</td>
                  <td style={{ width: '40%' }}>{row.typeName}</td>
                  <td style={{ width: '20%' }}>
                    {row.type === 'report' && 'Hình thức báo cáo'}
                    {row.type === 'advertisement' && 'Hình thức quảng cáo'}
                    {row.type === 'board' && 'Loại bảng quảng cáo'}
                  </td>

                  <td style={{ width: '15%' }}>
                    <button className={classes.btn_trash} onClick={() => handleDeleteClick(row)}>
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

export default ManageForm;

