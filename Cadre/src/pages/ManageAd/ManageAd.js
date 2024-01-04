import { faMagnifyingGlass, faPenToSquare, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import classes from './ManageAd.module.scss';
import DetailsAd from './components/DetailsAd/DetailsAd';
import UpdateAd from './components/UpdateAdLocation/UpdateAd';

const ManageAd = () => {
  const initialData = [
    {
      stt: 1,
      content: 'Đồng Khởi - Nguyễn Du',
      area: 'Phường Bến Nghé, Quận 1',
      img: 'Jane Doe',
      status: 'Đã quy hoạch',
    },
    {
      stt: 1,
      content: 'Đồng Khởi - Nguyễn Du',
      area: 'Phường Bến Nghé, Quận 1',
      img: 'Jane Doe',
      status: 'Chưa quy hoạch',
    },
    {
      stt: 1,
      content: 'Đồng Khởi - Nguyễn Du',
      area: 'Phường Bến Nghé, Quận 1',
      img: 'Jane Doe',
      status: 'Đã quy hoạch',
    },
    {
      stt: 1,
      content: 'Đồng Khởi - Nguyễn Du',
      area: 'Phường Bến Nghé, Quận 1',
      img: 'Jane Doe',
      status: 'Chưa quy hoạch',
    },
    // Thêm dữ liệu khác
  ];

  const [data, setData] = useState(initialData);
  const [selectedFilter, setSelectedFilter] = useState('Tất cả');
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [modalType, setModalType] = useState(null);

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

  const handleAddClick = () => {
    setSelectedRowData(null);
    setModalType('add');
    setModalOpen(true);
  };

  return (
    <div className={classes.container__wrap}>
      <div className={classes.header}>
        <p className={classes.header__title}>Danh sách các quảng cáo</p>
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
                <th style={{ width: '30%' }}>Địa chỉ</th>
                <th style={{ width: '30%' }}>Điểm đặt</th>
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
                  }}
                >
                  <td style={{ width: '5%' }}>{row.stt}</td>
                  <td style={{ width: '30%' }}>{row.content}</td>
                  <td style={{ width: '30%' }}>{row.area}</td>
                  <td style={{ width: '25%', color: row.status === 'Đã quy hoạch' ? '#2A591E' : '#EF1414' }}>
                    {row.status}
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
        <UpdateAd
          onClose={() => {
            setIsOpenUpdate(false);
          }}
        />
      )}
      {isOpenDetails && (
        <DetailsAd
          onClose={() => {
            setIsOpenDetails(false);
          }}
        />
      )}
    </div>
  );
};

export default ManageAd;
