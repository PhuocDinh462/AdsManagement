import { faMagnifyingGlass, faPenToSquare, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { axiosClient } from '~/src/api/axios';
import Pagination from '~/src/components/Pagination';
import { selectUser } from '~/src/store/reducers';
import classes from './ManageAd.module.scss';
import BoardDetails from './components/DetailsAd';
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

  const [dataInit, setDataInit] = useState([]);
  const [data, setData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('Tất cả');
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [modalType, setModalType] = useState(null);

  const [selected, setSelected] = useState(null);

  const user = useSelector(selectUser);
  const tokenAuth = 'Bearer ' + user.token.split('"').join('');
  const headers = {
    Authorization: tokenAuth,
  };

  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;

    return data.slice(firstPageIndex, lastPageIndex);
  }, [pageSize, currentPage, data]);

  // const handleFilterChange = (status) => {
  //   const filteredData = status === 'Tất cả' ? initialData : initialData.filter((item) => item.status === status);
  //   setData(filteredData);
  //   setSelectedFilter(status);
  // };

  // const getFilterStyle = (filter) => ({
  //   color: selectedFilter === filter ? '#0A6971' : '#2f2f2f',
  //   borderBottom: selectedFilter === filter ? '2px solid #0A6971' : 'none',
  //   cursor: 'pointer',
  // });

  const handleAddClick = () => {
    setSelectedRowData(null);
    setModalType('add');
    setModalOpen(true);
  };

  const fetchDataAdsBoard = async () => {
    try {
      const res = await axiosClient.get('/board', { headers });
      console.log(res);
      setDataInit(res.boards);
      setData(res.boards);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDataAdsBoard();
  }, []);

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
                <th style={{ width: '22%' }}>Loại bảng</th>
                <th style={{ width: '15%' }}>Hình ảnh minh họa</th>
                <th style={{ width: '33%' }}>Địa chỉ</th>
                <th style={{ width: '10%' }}>Kích thước</th>
                <th style={{ width: '15%' }}>Chỉnh sửa</th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Table Body */}
        <div className={classes.table__body}>
          <table className={classes.table__body_wrap}>
            <tbody>
              {currentTableData.map((row, rowIndex) => (
                <tr
                  className={classes.table__body_wrap_row}
                  key={row.board_id}
                  onClick={() => {
                    setSelected(row);
                    setIsOpenDetails(true);
                  }}
                >
                  <td style={{ width: '5%' }}>{rowIndex + 1 + (currentPage - 1) * pageSize}</td>
                  <td style={{ width: '22%' }}>{row.type_name}</td>
                  <td style={{ width: '15%' }}>
                    {' '}
                    <img src={row.advertisement_image_url} alt="none" />
                  </td>
                  <td style={{ width: '33%' }}>{row.address}</td>
                  <td style={{ width: '10%' }}>{`${row.width}m x ${row.height}m`}</td>
                  <td style={{ width: '15%' }}>
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
      <div className={classes.paginationBar_container}>
        <Pagination
          currentPage={currentPage}
          totalCount={data.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
      {isOpenUpdate && (
        <UpdateAd
          onClose={() => {
            setIsOpenUpdate(false);
          }}
        />
      )}
      {isOpenDetails && (
        <BoardDetails
          data={selected}
          onClose={() => {
            setIsOpenDetails(false);
          }}
        />
      )}
    </div>
  );
};

export default ManageAd;
