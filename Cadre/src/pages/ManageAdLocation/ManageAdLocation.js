import React, { useEffect, useState } from 'react';
import HeaderTable from '../../components/headerTable/HeaderTable';
import classes from './ManageAdLocation.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faPlus, faClose, faTrashCan, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import DetailsAdLocation from './components/DetailsAdLocation/DetailsAdLocation';
import UpdateAdLocation from './components/UpdateAdLocation/UpdateAdLocation';
import { axiosClient } from '../../api/axios';
import Swal from 'sweetalert2';
import Modal from '~/src/components/Modal/Modal';
import AddAdLocation from './components/AddAdLocation/AddAdLocation';
import useAxiosPrivate from '~/src/hook/useAxiosPrivate';

const ManageAdLocation = () => {
  const axiosPrivate = useAxiosPrivate();

  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const fetchData = async () => {
    try {
      const response = await axiosPrivate.get('/cadre/adsPoint');
      setData(response.data);
      setOriginalData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    const searchValue = event.target.value;

    if (!originalData) {
      return;
    }

    const filteredData = originalData.filter((item) => {
      const address = (item && item.address) || '';
      return address.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1;
    });

    setData(filteredData);
  };

  const updateDataAfterAdd = async () => {
    await fetchData();
    setModalOpen(false);
  };

  const updateDataAfterUpdate = async () => {
    await fetchData();
    setIsOpenUpdate(false);
  };

  const cancelUpdate = async () => {
    setIsOpenUpdate(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleAddClick = () => {
    setSelectedRowData(null);
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
        const response = await axiosPrivate.delete('cadre/deleteAdsPoint', {
          data: { point_id: row.point_id },
        });

        if (response.data.status === 'success') {
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
    <div className={classes.container__wrap}>
      <div className={classes.header}>
        <p className={classes.header__title}>Danh sách các điểm đặt quảng cáo</p>
        <div className={classes.header__buttonAdd} onClick={handleAddClick}>
          <FontAwesomeIcon icon={faPlus} />
          <p className={classes.add}>Thêm</p>
        </div>
      </div>

      <div className={classes.container}>
        {/* Tab Search */}
        <div className={classes.container__header}>
          <div className={classes.container__header_search}>
            <FontAwesomeIcon icon={faMagnifyingGlass} className={classes.ic} />
            <input
              type="text"
              id="inputSearch"
              placeholder="Tìm kiếm địa chỉ..."
              className={classes.text_input}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Table Header */}
        <div className={classes.table_header}>
          <table className={classes.table__header_wrap}>
            <thead className={classes.table__header_wrap_thead}>
              <tr>
                <th style={{ width: '5%' }}>STT</th>
                <th style={{ width: '30%' }}>Địa chỉ</th>
                <th style={{ width: '20%' }}>Khu vực</th>
                <th style={{ width: '20%' }}>Loại vị trí</th>
                <th style={{ width: '15%' }}>Trạng thái</th>
                <th style={{ width: '10%' }}>Chỉnh sửa</th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Table Body */}
        <div className={classes.table__body}>
          <table className={classes.table__body_wrap}>
            <tbody>
              {data && data.length > 0 ? (
                data.map((row, rowIndex) => (
                  <tr
                    className={classes.table__body_wrap_row}
                    key={rowIndex}
                    onClick={() => {
                      setIsOpenDetails(true);
                      setSelectedRowData(row);
                    }}
                  >
                    <td style={{ width: '5%' }}>{rowIndex + 1}</td>
                    <td style={{ width: '30%' }}>{row.address}</td>
                    <td style={{ width: '20%' }}>
                      {row.ward_name}, {row.district_name}
                    </td>
                    <td style={{ width: '20%' }}>{row.location_type}</td>
                    <td style={{ width: '15%', color: row.is_planning === 1 ? '#2A591E' : '#EF1414' }}>
                      {row.is_planning === 1 ? 'Đã quy hoạch' : 'Chưa quy hoạch'}
                    </td>
                    <td style={{ width: '10%' }}>
                      <button
                        className={classes.btn_trash}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(row);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrashCan} className={classes.icon} />
                      </button>
                      <button
                        className={classes.btn_pen}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRowData(row);
                          setIsOpenUpdate(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} className={classes.icon} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', fontStyle: 'italic', paddingTop: '20px' }}>
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isOpenUpdate && (
        <Modal onClose={handleCloseModal}>
          <UpdateAdLocation
            data={selectedRowData}
            onClose={() => {
              updateDataAfterUpdate();
            }}
            cancel={cancelUpdate}
          />
        </Modal>
      )}
      {isOpenDetails && (
        <Modal onClose={handleCloseModal}>
          <DetailsAdLocation
            data={selectedRowData}
            onClose={() => {
              setIsOpenDetails(false);
            }}
          />
        </Modal>
      )}

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <AddAdLocation onClose={updateDataAfterAdd} cancel={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
};

export default ManageAdLocation;

