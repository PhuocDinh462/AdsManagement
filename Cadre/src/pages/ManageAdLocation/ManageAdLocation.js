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

const ManageAdLocation = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axiosClient.get('/cadre/adsPoint');
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

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleAddClick = () => {
    setSelectedRowData(null);
    setModalOpen(true);
  };

  const handleEditClick = (rowData) => {
    setSelectedRowData(rowData);
    setModalOpen(true);
  };

  const handleFilterChange = (status) => {
    const filteredData = status === 'Tất cả' ? initialData : initialData.filter((item) => item.status === status);
    setData(filteredData);
    setSelectedFilter(status);
  };

  const getFilterStyle = (filter) => ({
    color: selectedFilter === filter ? '#0A6971' : '#2f2f2f',
    borderBottom: selectedFilter === filter ? '2px solid #0A6971' : 'none',
    cursor: 'pointer',
  });

  const convertToDegrees = (decimalDegrees) => {
    const degrees = Math.floor(decimalDegrees);
    const minutes = Math.floor((decimalDegrees - degrees) * 60);
    const seconds = ((decimalDegrees - degrees - minutes / 60) * 3600).toFixed(2);
    return `${degrees}° ${minutes}' ${seconds}"`;
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
            <input status="text" id="inputSearch" placeholder="Tìm kiếm..." className={classes.text_input} />
          </div>
        </div>

        {/* Table Header */}
        <div className={classes.table_header}>
          <table className={classes.table__header_wrap}>
            <thead className={classes.table__header_wrap_thead}>
              <tr>
                <th style={{ width: '5%' }}>STT</th>
                <th style={{ width: '20%' }}>Tọa độ (Vĩ độ - Kinh độ)</th>
                <th style={{ width: '20%' }}>Khu vực</th>
                <th style={{ width: '20%' }}>Loại vị trí</th>
                <th style={{ width: '25%' }}>Trạng thái</th>
                <th style={{ width: '10%' }}>Chỉnh sửa</th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Table Body */}
        <div className={classes.table__body}>
          <table className={classes.table__body_wrap}>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr
                  className={classes.table__body_wrap_row}
                  key={rowIndex}
                  onClick={() => {
                    setIsOpenDetails(true);
                    setSelectedRowData(row);
                  }}
                >
                  <td style={{ width: '5%' }}>{rowIndex + 1}</td>
                  <td style={{ width: '20%' }}>
                    {convertToDegrees(row.lat)} | {convertToDegrees(row.lng)}
                  </td>
                  <td style={{ width: '20%' }}>{row.ward_name}</td>
                  <td style={{ width: '20%' }}>{row.location_type}</td>
                  <td style={{ width: '25%', color: row.is_planning === 1 ? '#2A591E' : '#EF1414' }}>
                    {row.is_planning === 1 ? 'Đã quy hoạch' : 'Chưa quy hoạch'}
                  </td>
                  <td style={{ width: '10%' }}>
                    <button className={classes.btn_trash}>
                      <FontAwesomeIcon icon={faTrashCan} className={classes.icon} />
                    </button>
                    <button
                      className={classes.btn_pen}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpenUpdate(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} className={classes.icon} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isOpenUpdate && (
        <UpdateAdLocation
          data={selectedRowData}
          onClose={() => {
            setIsOpenUpdate(false);
          }}
        />
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
          <AddAdLocation onClose={updateDataAfterAdd} />
        </Modal>
      )}
    </div>
  );
};

export default ManageAdLocation;

