import React, { useState } from 'react';
import HeaderTable from '../../components/headerTable/HeaderTable';
import classes from './ManageForm.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faPlus, faClose, faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import ModalAdd from './components/ModalAdd';
import Modal from '~/src/components/Modal/Modal';
import ModalUpdate from './components/ModalUpdate';
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
const ManageForm = () => {
  const [data, setData] = useState(initialData);
  const [selectedFilter, setSelectedFilter] = useState('Tất cả');
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [modalType, setModalType] = useState(null);

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
            <div onClick={() => handleFilterChange('Hình quảng cáo')} style={getFilterStyle('Hình quảng cáo')}>
              Các loại hình quảng cáo
            </div>
            <div onClick={() => handleFilterChange('Hình thức báo cáo')} style={getFilterStyle('Hình thức báo cáo')}>
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
                  <td style={{ width: '5%' }}>{rowIndex + 1}</td>
                  <td style={{ width: '40%' }}>{row.content}</td>
                  <td style={{ width: '20%' }}>{row.type}</td>
                  <td style={{ width: '15%' }}>
                    <button className={classes.btn_trash}>
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
            <ModalAdd onClose={handleCloseModal} />
          ) : modalType === 'update' ? (
            <ModalUpdate data={selectedRowData} onClose={handleCloseModal} />
          ) : null}
        </Modal>
      )}
    </div>
  );
};

export default ManageForm;

