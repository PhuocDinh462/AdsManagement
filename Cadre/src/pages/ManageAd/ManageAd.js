import { faMagnifyingGlass, faPenToSquare, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import Pagination from '~/src/components/Pagination';
import useAxiosPrivate from '~/src/hook/useAxiosPrivate';
import { removeFormLicenseReq, selectUser, setFormLicenseReq } from '~/src/store/reducers';
import { calculateDaysBetweenDates, notiSuccess } from '~/src/utils/support';
import classes from './ManageAd.module.scss';
import BoardModalAdd from './components/BoardModalAdd';
import BoardModalUpdate from './components/BoardModalUpdate';
import BoardDetails from './components/DetailsAd';

const listType = [
  { title: 'Cổ động chính trị', value: 1 },
  { title: 'Quảng cáo thương mại', value: 2 },
  { title: 'Xã hội hoá', value: 3 },
];

const listBoardType = [
  { title: 'Bảng hiflex ốp tường', value: 1 },
  { title: 'Màn hình điện tử ốp tường', value: 2 },
  { title: 'Trung tâm thương mại', value: 3 },
];

const ManageAd = () => {
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [isOpenDetails, setIsOpenDetails] = useState(false);

  const [selected, setSelected] = useState(null);

  const user = useSelector(selectUser);
  const tokenAuth = 'Bearer ' + user?.token.split('"').join('');
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

  const handleOpenModalAdd = () => {
    setIsOpenAdd(true);
  };

  const handleCloseModalAdd = (isSubmit = false) => {
    setIsOpenAdd(false);
    dispatch(removeFormLicenseReq());

    if (isSubmit === true) notiSuccess('Tạo mới bảng quảng cáo thành công');
  };

  const handleOpenModalUpdate = (e, data) => {
    e.stopPropagation();
    console.log(data);
    setIsOpenUpdate(true);
    dispatch(
      setFormLicenseReq({
        ...data,
        type: listType[data.advertisement_type_id - 1],
        point: { title: data.address },
        board_type_id: listBoardType[data.board_type_id - 1],
      })
    );
  };

  const handleCloseModalUpdate = (isSubmit = false) => {
    setIsOpenUpdate(false);
    dispatch(removeFormLicenseReq());

    if (isSubmit === true) notiSuccess('Cập nhật bảng quảng cáo thành công');
  };

  const fetchDataAdsBoard = async () => {
    try {
      const res = await axiosPrivate.get('/board');
      setData(res.data.boards);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataDeleteBoard = async (id) => {
    try {
      await axiosPrivate.delete(`/board/${id}`);
      Swal.fire({
        icon: 'success',
        title: 'Xóa thành công!',
        text: 'Đã xóa thành công.',
      });
      fetchDataAdsBoard();
    } catch (error) {}
  };

  const handleDeleteBoard = (e, data) => {
    e.stopPropagation();

    Swal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc muốn xóa?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then((confirmResult) => {
      if (confirmResult.isConfirmed) {
        fetchDataDeleteBoard(data.board_id);
      }
    });
  };

  useEffect(() => {
    fetchDataAdsBoard();
  }, []);

  return (
    <div className={classes.container__wrap}>
      <div className={classes.header}>
        <p className={classes.header__title}>Danh sách các quảng cáo</p>
        <button className={classes.header__buttonAdd} onClick={handleOpenModalAdd}>
          <FontAwesomeIcon icon={faPlus} />
          <p className={classes.add}>Thêm</p>
        </button>
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
                <th style={{ width: '10%' }}>Thời hạn đăng ký (ngày) </th>
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
                  <td style={{ width: '10%' }}>{calculateDaysBetweenDates(row.start_date, row.end_date)}</td>
                  <td style={{ width: '15%' }}>
                    <button className={classes.btn_trash} onClick={(e) => handleDeleteBoard(e, row)}>
                      <FontAwesomeIcon icon={faTrashCan} className={classes.icon} />
                    </button>
                    <button className={classes.btn_pen} onClick={(e) => handleOpenModalUpdate(e, row)}>
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
      {isOpenAdd && <BoardModalAdd handleCloseModal={handleCloseModalAdd} handleReLoadData={fetchDataAdsBoard} />}
      {isOpenUpdate && (
        <BoardModalUpdate handleCloseModal={handleCloseModalUpdate} handleReLoadData={fetchDataAdsBoard} />
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
