import classes from './styles.module.scss';
import SearchBar from '~components/SearchBar';
import {
  faArrowLeft,
  faLocationDot,
  faAngleUp,
  faAngleDown,
  faAngleLeft,
  faUser,
  faPhone,
  faEnvelope,
  faFlag,
  faFile,
  faDiagramProject,
  faBan,
  faPaperclip,
  faPaperPlane,
  faCheck,
  faXmark,
  faClockRotateLeft,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect, useRef } from 'react';
import { IconTextBtn } from '~components/button';
import { Backdrop } from '@mui/material';
import ProcessModal from './Modals/ProcessModal';
import StatusModal from './Modals/StatusModal';
import { useParams } from 'react-router-dom';
import { axiosRequest } from '~/src/api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { setReportIndex, selectReportIndex, setReportCoord, selectUser, setBoardId } from '~/src/store/reducers';
import { useNavigate } from 'react-router';
import { text } from '~styles/colors';
import { sidebarBg } from '~assets/imgs/Imgs';
import { useSocketSubscribe } from '~/src/hook/useSocketSubscribe';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ReportsDetail() {
  const { id } = useParams();
  const lat = id.split(',')[0];
  const lng = id.split(',')[1];
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const reportIndexStorage = useSelector(selectReportIndex);
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const tokenAuth = 'Bearer ' + user.token.split('"').join('');
  const headers = {
    Authorization: tokenAuth,
  };

  const [currentReportIndex, setCurrentReportIndex] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageModalUrl, setImageModalUrl] = useState();
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const info = (msg) =>
    toast.info(msg, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      draggable: false,
    });

  useEffect(() => {
    setLoading(true);
    if (lat && lng)
      (async () => {
        await axiosRequest
          .post(`ward/getReportDetailsByLatLng`, { lat: lat, lng: lng }, { headers: headers })
          .then((res) => {
            const data = res.data.data;
            setData(data);
            setFilteredData(data.reports);
            if (reportIndexStorage < data.reports?.length) setCurrentReportIndex(reportIndexStorage);
          })
          .catch((error) => {
            console.log('Get spots error: ', error);
          })
          .finally(() => {
            setLoading(false);
          });
      })();
    else
      (async () => {
        await axiosRequest
          .get(`ward/getReportDetailsByPointId/${id}`, { headers: headers })
          .then((res) => {
            const data = res.data.data;
            setData(data);
            setFilteredData(data.reports);
            if (reportIndexStorage < data.reports?.length) setCurrentReportIndex(reportIndexStorage);
          })
          .catch((error) => {
            console.log('Get spots error: ', error);
          })
          .finally(() => {
            setLoading(false);
          });
      })();
  }, []);

  const handleFilter = (keyword) => {
    if (!keyword) setFilteredData(data.reports);
    else
      setFilteredData(
        data.reports.filter((item) => {
          const keywordLc = keyword.toLowerCase();

          return (
            item.fullname_rp?.toLowerCase().includes(keywordLc) ||
            item.phone_rp?.toLowerCase().includes(keywordLc) ||
            item.email_rp?.toLowerCase().includes(keywordLc) ||
            item.report_type_name?.toLowerCase().includes(keywordLc) ||
            item.reportedObject?.toLowerCase().includes(keywordLc) ||
            item.status?.toLowerCase().includes(keywordLc)
          );
        })
      );
    setCurrentReportIndex(0);
  };

  const changeStatusByReportId = (id, newStatus) => {
    setData({
      ...data,
      reports: data.reports.map((item) => (item.report_id === id ? { ...item, status: newStatus } : { ...item })),
    });
    setFilteredData(filteredData.map((item) => (item.report_id === id ? { ...item, status: newStatus } : { ...item })));
  };

  const addReport = (report) => {
    if (data.reports.length === filteredData.length) setFilteredData([...filteredData, report]);
    setData({ ...data, reports: [...data.reports, report] });
  };

  const handleSocketEvent = async (eventData) => {
    if (lat && lng) {
      if (+lat === eventData.lat && +lng === eventData.lng) {
        info('Một báo cáo vừa được gửi đến cho bạn');
        addReport(eventData);
      }
    } else {
      if (eventData.point_id) {
        if (+id === eventData.point_id) {
          info('Một báo cáo vừa được gửi đến cho bạn');
          addReport(eventData);
        }
      } else if (eventData.board_id) {
        await axiosRequest
          .get(`ward/getAdBoardByBoardId/${eventData.board_id}`, { headers: headers })
          .then(async (res) => {
            if (+id === res.data.data.point_id) {
              info('Một báo cáo vừa được gửi đến cho bạn');
              addReport(eventData);
            }
          })
          .catch((error) => {
            console.log('Get AdBoard error: ', error);
          });
      }
    }
  };

  // Subscribe to the socket events when the component mounts
  useSocketSubscribe('createReport', handleSocketEvent);

  const chooseStatusColor = (status) => {
    if (status === 'Đã xử lý' || status === 'processed') return '#00AE46';
    else if (status === 'Đang xử lý' || status === 'processing') return '#0095d5';
    else return '#ff3a3a';
  };

  const chooseStatusText = (status) => {
    if (status === 'Đã xử lý' || status === 'processed') return 'Đã xử lý';
    else if (status === 'Đang xử lý' || status === 'processing') return 'Đang xử lý';
    else return 'Chờ xử lý';
  };

  const chooseStatusIc = (status) => {
    if (status === 'Đã xử lý' || status === 'processed') return faXmark;
    else if (status === 'Đang xử lý' || status === 'processing') return faClockRotateLeft;
    else return faCheck;
  };

  const scrollOffset = 3;
  const [scrollMode, setScrollMode] = useState(0);
  const selectedRef = useRef(null);

  const scrollToSelected = () => {
    if (selectedRef.current && scrollMode !== 0) {
      selectedRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  };

  return (
    <div className={classes.main_container}>
      <img className={classes.bg_img} src={sidebarBg} />
      <div className={classes.sideBar_container}>
        <div className={classes.searchBar_container}>
          <div className={[classes.back_btn, classes.btn].join(' ')} onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>
          <SearchBar
            placeholder="Tìm kiếm..."
            width="20rem"
            bgColor={text.color_50}
            onChange={(keyword) => handleFilter(keyword)}
          />
        </div>

        <div className={classes.nav_btn_container}>
          <div
            className={[classes.nav_btn, classes.btn].join(' ')}
            onClick={() => {
              dispatch(setReportCoord({ lat: data.lat, lng: data.lng }));
              if (filteredData[currentReportIndex]?.reportedObject === 'Bảng quảng cáo')
                dispatch(setBoardId(filteredData[currentReportIndex]?.board_id));
              navigate('/home');
            }}
          >
            <FontAwesomeIcon icon={faLocationDot} />
          </div>
          <div
            className={[classes.nav_btn, classes.btn, currentReportIndex <= 0 && classes['btn--disabled']].join(' ')}
            onClick={() => {
              setCurrentReportIndex(currentReportIndex - 1);
              setScrollMode(scrollMode === -scrollOffset ? 0 : -scrollOffset);
              scrollToSelected();
              dispatch(setReportIndex(currentReportIndex - 1));
            }}
          >
            <FontAwesomeIcon icon={faAngleUp} />
          </div>
          <div
            className={[
              classes.nav_btn,
              classes.btn,
              currentReportIndex >= filteredData?.length - 1 && classes['btn--disabled'],
            ].join(' ')}
            onClick={() => {
              setCurrentReportIndex(currentReportIndex + 1);
              setScrollMode(scrollMode === scrollOffset ? 0 : scrollOffset);
              scrollToSelected();
              dispatch(setReportIndex(currentReportIndex + 1));
            }}
          >
            <FontAwesomeIcon icon={faAngleDown} />
          </div>
        </div>

        <div className={classes.divider} />

        <div className={classes.reports_container}>
          {filteredData?.map((item, index) => (
            <div
              className={[classes.report_item, currentReportIndex === index && classes['report_item--active']].join(
                ' '
              )}
              key={item.report_id}
              ref={index === currentReportIndex + scrollMode ? selectedRef : null}
              onClick={() => {
                setCurrentReportIndex(index);
                dispatch(setReportIndex(index));
              }}
            >
              <div className={classes.username}>
                <div className={classes.username__text}>{index + 1 + '. ' + item.fullname_rp}</div>
                <div
                  className={[
                    classes.username__ic,
                    currentReportIndex === index && classes['username__ic--active'],
                  ].join(' ')}
                >
                  <FontAwesomeIcon icon={faAngleLeft} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!loading && (
        <div className={classes.content_container}>
          {data.address && <div className={classes.title}>Chi tiết báo cáo tại {data.address}</div>}

          {filteredData?.length > 0 ? (
            <>
              <div className={classes.userInfo_container}>
                <table style={{ width: '100%' }}>
                  <tbody>
                    <tr>
                      <td className={classes.userInfo_col}>
                        <div className={classes.itemInfo}>
                          <FontAwesomeIcon icon={faUser} />
                          <div className={classes.itemInfo__text}>
                            {'Người báo cáo: ' + filteredData[currentReportIndex]?.fullname_rp}
                          </div>
                        </div>
                      </td>
                      <td className={classes.userInfo_col}>
                        <div className={classes.itemInfo}>
                          <FontAwesomeIcon icon={faFlag} />
                          <div className={classes.itemInfo__text}>
                            {'Đối tượng bị báo cáo: ' + filteredData[currentReportIndex]?.reportedObject}
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className={classes.userInfo_col}>
                        <div className={classes.itemInfo}>
                          <FontAwesomeIcon icon={faPhone} />
                          <div className={classes.itemInfo__text}>
                            {'Số điện thoại: ' + filteredData[currentReportIndex]?.phone_rp}
                          </div>
                        </div>
                      </td>
                      <td className={classes.userInfo_col}>
                        <div className={classes.itemInfo}>
                          <FontAwesomeIcon icon={faFile} />
                          <div className={classes.itemInfo__text}>
                            {'Hình thức báo cáo: ' + filteredData[currentReportIndex]?.report_type_name}
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className={classes.userInfo_col}>
                        <div className={classes.itemInfo}>
                          <FontAwesomeIcon icon={faEnvelope} />
                          <div className={classes.itemInfo__text}>
                            {'Email: ' + filteredData[currentReportIndex]?.email_rp}
                          </div>
                        </div>
                      </td>
                      <td className={classes.userInfo_col}>
                        <div className={classes.itemInfo}>
                          <FontAwesomeIcon icon={faDiagramProject} />
                          <div className={classes.itemInfo__text}>
                            <div className={classes.reportStatus_container}>
                              Trạng thái:&nbsp;
                              <div
                                className={classes.reportStatus}
                                style={{
                                  backgroundColor: chooseStatusColor(filteredData[currentReportIndex]?.status),
                                }}
                              >
                                {chooseStatusText(filteredData[currentReportIndex]?.status)}
                                <div className={classes.reportStatus__ic}>
                                  <FontAwesomeIcon icon={chooseStatusIc(filteredData[currentReportIndex]?.status)} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className={classes.reportContent_container}>
                <div>{filteredData[currentReportIndex]?.report_content}</div>

                {filteredData[currentReportIndex]?.image_urls?.length > 0 && (
                  <div className={classes.attach_container}>
                    <div className={classes.attach}>
                      <div className={classes.attach__ic}>
                        <FontAwesomeIcon icon={faPaperclip} />
                      </div>
                      <div className={classes.attach__title}>Đính kèm:</div>
                    </div>
                    <div className={classes.img_container}>
                      {filteredData[currentReportIndex]?.image_urls.map((image_url, index) => (
                        <img
                          className={classes.img}
                          key={index}
                          src={image_url}
                          onClick={() => {
                            setImageModalUrl(image_url);
                            setShowImageModal(true);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className={classes.btn}>
                <div className={classes.btn__item}>
                  <IconTextBtn
                    label="Trạng thái"
                    width={150}
                    rightIc={faDiagramProject}
                    onClick={() => setShowStatusModal(true)}
                  />
                </div>
                <div className={classes.btn__item}>
                  <IconTextBtn
                    label="Gửi mail"
                    width={150}
                    rightIc={faPaperPlane}
                    onClick={() => setShowProcessModal(true)}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className={classes.noData}>
              <div className={classes.noData__ic}>
                <FontAwesomeIcon icon={faBan} />
              </div>
              <h1 className={classes.noData__text}>Không có dữ liệu</h1>
            </div>
          )}
        </div>
      )}

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showImageModal}
        onClick={() => setShowImageModal(false)}
      >
        <img className={classes.imageModal} src={imageModalUrl} />
      </Backdrop>

      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showProcessModal}>
        <ProcessModal setActive={setShowProcessModal} email={filteredData[currentReportIndex]?.email_rp} />
      </Backdrop>

      {showStatusModal && (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showStatusModal}>
          <StatusModal
            setActive={setShowStatusModal}
            report_id={filteredData[currentReportIndex]?.report_id}
            changeStatusByReportId={changeStatusByReportId}
            currentReport={data.reports?.find((item) => item.report_id === filteredData[currentReportIndex]?.report_id)}
          />
        </Backdrop>
      )}

      <div onClick={() => setCurrentReportIndex(filteredData.length - 1)}>
        <ToastContainer />
      </div>
    </div>
  );
}
