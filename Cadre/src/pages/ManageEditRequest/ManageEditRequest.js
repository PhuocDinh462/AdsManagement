import React, { useEffect, useState } from 'react';
import classes from './ManageEditRequest.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import Modal from '~/src/components/Modal/Modal';
import { axiosClient } from '../../api/axios';
import Swal from 'sweetalert2';
import DetailActionEdit from './components/DetailActionEdit/DetailActionEdit';
import { useSocketSubscribe } from '~/src/hook/useSocketSubscribe';

const ManageForm = () => {
  const [data, setData] = useState({ boards: [], points: [] });
  const [originalData, setOriginalData] = useState({ boards: [], points: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('Bảng quảng cáo');
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const tokenAuth = 'Bearer ' + JSON.stringify(localStorage.getItem('token')).split('"').join('');
  const headers = {
    Authorization: tokenAuth,
  };

  const fetchData = async () => {
    try {
      const responseBoards = await axiosClient.get('/cadre/getRequestEditBoard', { headers });
      const responsePoints = await axiosClient.get('/cadre/getRequestEditPoint', { headers });

      setData({
        boards: responseBoards,
        points: responsePoints,
      });
      setOriginalData({
        boards: responseBoards,
        points: responsePoints,
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePointSocketEvent = (eventData) => {
    fetchData();
  };

  const handleBoardSocketEvent = (eventData) => {
    fetchData();
  };
  // Subscribe to the socket events when the component mounts
  useSocketSubscribe('createEditPointRequest', handlePointSocketEvent);
  useSocketSubscribe('createEditBoardRequest', handleBoardSocketEvent);

  const handleFilterChange = (type) => {
    let filteredData;

    if (type === 'Bảng quảng cáo') {
      filteredData = originalData.boards;
      setSearchTerm('');
    } else if (type === 'Điểm đặt quảng cáo') {
      filteredData = originalData.points;
      setSearchTerm('');
    }

    setData({
      ...data,
      [type.toLowerCase()]: filteredData,
    });

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

  const updateDataAfterUpdate = async (newData) => {
    await fetchData();
    setModalOpen(false);
  };

  const filterData = (data) => {
    if (selectedFilter === 'Bảng quảng cáo') {
      return data.filter((row) => row.advertisement_content.toLowerCase().includes(searchTerm.toLowerCase()));
    } else {
      return data.filter((row) => row.location_type.toLowerCase().includes(searchTerm.toLowerCase()));
    }
  };

  // const handleDeleteClick = async (row) => {
  //   const confirmResult = await Swal.fire({
  //     title: 'Xác nhận xóa',
  //     text: 'Bạn có chắc muốn xóa?',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#d33',
  //     cancelButtonColor: '#3085d6',
  //     confirmButtonText: 'Xóa',
  //     cancelButtonText: 'Hủy',
  //   });
  //   if (confirmResult.isConfirmed) {
  //     try {
  //       const response = await axiosClient.delete('cadre/deleteForm', { data: { type: row.type, id: row.typeId } });

  //       if (response.status === 'success') {
  //         Swal.fire({
  //           icon: 'success',
  //           title: 'Xóa thành công!',
  //           text: 'Đã xóa thành công.',
  //         });
  //         fetchData();
  //       } else {
  //         Swal.fire({
  //           icon: 'error',
  //           title: 'Xóa thất bại!',
  //           text: 'Có lỗi xảy ra khi xóa. Vui lòng thử lại.',
  //         });
  //         console.error('Failed to delete element');
  //       }
  //     } catch (error) {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Xóa thất bại!',
  //       });
  //       console.error('Error deleting element: ', error);
  //     }
  //   }
  // };

  return (
    <div className={classes.container_wrap}>
      <div className={classes.header}>
        <p className={classes.header__title}>Danh sách loại hình quảng cáo và hình thức báo cáo</p>
      </div>
      <div className={classes.container}>
        {/* Tab Filter */}
        <div className={classes.container__header}>
          <div className={classes.container__header_filter}>
            <div onClick={() => handleFilterChange('Bảng quảng cáo')} style={getFilterStyle('Bảng quảng cáo')}>
              Bảng quảng cáo
            </div>
            <div onClick={() => handleFilterChange('Điểm đặt quảng cáo')} style={getFilterStyle('Điểm đặt quảng cáo')}>
              Điểm đặt quảng cáo
            </div>
          </div>
          <div className={classes.container__header_search}>
            <FontAwesomeIcon icon={faMagnifyingGlass} className={classes.ic} />
            <input
              type="text"
              id="inputSearch"
              placeholder={selectedFilter === 'Bảng quảng cáo' ? 'Tìm kiếm theo nội dung' : 'Tìm kiếm theo loại vị trí'}
              // placeholder="Tìm kiếm..."
              className={classes.text_input}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table Header */}
        <div className={classes.table_header}>
          <table className={classes.table__header_wrap}>
            <thead className={classes.table__header_wrap_thead}>
              {selectedFilter === 'Bảng quảng cáo' && (
                <tr>
                  <th style={{ width: '5%' }}>STT</th>
                  <th style={{ width: '25%' }}>Nội dung bảng QC</th>
                  <th style={{ width: '25%' }}>Loại bảng QC</th>
                  <th style={{ width: '15%' }}>Kích thước</th>
                  <th style={{ width: '15%' }}>Trạng thái xử lý</th>
                  <th style={{ width: '15%' }}>Xem và xét duyệt</th>
                </tr>
              )}
              {selectedFilter === 'Điểm đặt quảng cáo' && (
                <tr>
                  <th style={{ width: '5%' }}>STT</th>
                  <th style={{ width: '25%' }}>Loại vị trí</th>
                  <th style={{ width: '15%' }}>Hình thức quảng cáo</th>
                  <th style={{ width: '25%' }}>Lý do chỉnh sửa</th>
                  <th style={{ width: '15%' }}>Trạng thái quy hoạch</th>
                  <th style={{ width: '15%' }}>Xem và xét duyệt</th>
                </tr>
              )}
            </thead>
          </table>
        </div>

        {/* Table Body */}
        <div className={classes.table__body}>
          <table className={classes.table__body_wrap}>
            <tbody>
              {selectedFilter === 'Bảng quảng cáo' &&
                filterData(data.boards).map((row, rowIndex) => (
                  <tr className={classes.table__body_wrap_row} key={rowIndex}>
                    <td style={{ width: '5%' }}>{rowIndex + 1}</td>
                    <td style={{ width: '25%' }}>{row.advertisement_content}</td>
                    <td style={{ width: '25%' }}>{row.board_type_name}</td>
                    <td style={{ width: '15%' }}>
                      {row.width}m x {row.height}m
                    </td>
                    <td style={{ width: '15%' }}>
                      {row.edit_status === 'pending' && <span style={{ color: 'orange' }}>Chưa xử lý</span>}
                      {row.edit_status === 'approved' && <span style={{ color: 'green' }}>Đã duyệt</span>}
                      {row.edit_status === 'canceled' && <span style={{ color: 'red' }}>Từ chối</span>}
                    </td>

                    <td style={{ width: '15%' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRowData(row);
                          setModalOpen(true);
                        }}
                        className={classes.btn_pen}
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                    </td>
                  </tr>
                ))}
              {selectedFilter === 'Điểm đặt quảng cáo' &&
                filterData(data.points).map((row, rowIndex) => (
                  <tr className={classes.table__body_wrap_row} key={rowIndex}>
                    <td style={{ width: '5%' }}>{rowIndex + 1}</td>
                    <td style={{ width: '25%' }}>{row.location_type}</td>
                    <td style={{ width: '15%' }}>{row.advertisement_type_name}</td>
                    <td style={{ width: '25%' }}>{row.reason}</td>
                    <td style={{ width: '15%' }}>
                      {row.edit_status === 'pending' && <span style={{ color: 'orange' }}>Chưa xử lý</span>}
                      {row.edit_status === 'approved' && <span style={{ color: 'green' }}>Đã duyệt</span>}
                      {row.edit_status === 'canceled' && <span style={{ color: 'red' }}>Từ chối</span>}
                    </td>

                    <td style={{ width: '15%' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRowData(row);
                          setModalOpen(true);
                        }}
                        className={classes.btn_pen}
                      >
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
          <DetailActionEdit
            data={selectedRowData}
            onClose={() => {
              updateDataAfterUpdate();
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default ManageForm;

