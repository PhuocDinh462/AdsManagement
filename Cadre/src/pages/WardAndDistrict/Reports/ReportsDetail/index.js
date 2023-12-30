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
import { useState, useEffect } from 'react';
import { IconTextBtn } from '~components/button';
import { Backdrop } from '@mui/material';
import ProcessModal from './Modals/ProcessModal';
import StatusModal from './Modals/StatusModal';
import { useParams } from 'react-router-dom';
import { axiosRequest } from '~/src/api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { setReportIndex, selectReportIndex, setReportCoord, selectUser, setBoardId } from '~/src/store/reducers';
import { useNavigate } from 'react-router';

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
            item.fullname_rp.toLowerCase().includes(keywordLc) ||
            item.phone_rp.toLowerCase().includes(keywordLc) ||
            item.email_rp.toLowerCase().includes(keywordLc) ||
            item.report_type_name.toLowerCase().includes(keywordLc) ||
            item.reportedObject.toLowerCase().includes(keywordLc) ||
            item.status.toLowerCase().includes(keywordLc)
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

  return (
    <div className={classes.main_container}>
      <div className={classes.sideBar_container}>
        <div className={classes.searchBar_container}>
          <div className={[classes.back_btn, classes.btn].join(' ')} onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>
          <SearchBar placeholder="Tìm kiếm..." width="20rem" onChange={(keyword) => handleFilter(keyword)} />
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
              dispatch(setReportIndex(currentReportIndex + 1));
            }}
          >
            <FontAwesomeIcon icon={faAngleDown} />
          </div>
        </div>

        <dir className={classes.reports_container}>
          {filteredData?.map((item, index) => (
            <div
              className={classes.report_item}
              key={item.report_id}
              onClick={() => {
                setCurrentReportIndex(index);
                dispatch(setReportIndex(index));
              }}
            >
              <dir className={classes.divider} />
              <div className={classes.username}>
                <div
                  className={[
                    classes.username__text,
                    currentReportIndex === index && classes['username__text--active'],
                  ].join(' ')}
                >
                  {index + 1 + '. ' + item.fullname_rp}
                </div>
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
        </dir>
      </div>

      {!loading && (
        <div className={classes.content_container}>
          <div className={classes.title}>Chi tiết báo cáo tại {data.address}</div>

          {filteredData?.length > 0 ? (
            <>
              <div className={classes.userInfo_container}>
                <table style={{ width: '100%' }}>
                  <tbody>
                    <tr>
                      <td className={classes.userInfo_col}>
                        <div className={classes.itemInfo}>
                          <FontAwesomeIcon icon={faUser} />
                          <dir className={classes.itemInfo__text}>
                            {'Người báo cáo: ' + filteredData[currentReportIndex]?.fullname_rp}
                          </dir>
                        </div>
                      </td>
                      <td className={classes.userInfo_col}>
                        <div className={classes.itemInfo}>
                          <FontAwesomeIcon icon={faFlag} />
                          <dir className={classes.itemInfo__text}>
                            {'Đối tượng bị báo cáo: ' + filteredData[currentReportIndex]?.reportedObject}
                          </dir>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className={classes.userInfo_col}>
                        <div className={classes.itemInfo}>
                          <FontAwesomeIcon icon={faPhone} />
                          <dir className={classes.itemInfo__text}>
                            {'Số điện thoại: ' + filteredData[currentReportIndex]?.phone_rp}
                          </dir>
                        </div>
                      </td>
                      <td className={classes.userInfo_col}>
                        <div className={classes.itemInfo}>
                          <FontAwesomeIcon icon={faFile} />
                          <dir className={classes.itemInfo__text}>
                            {'Hình thức báo cáo: ' + filteredData[currentReportIndex]?.report_type_name}
                          </dir>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className={classes.userInfo_col}>
                        <div className={classes.itemInfo}>
                          <FontAwesomeIcon icon={faEnvelope} />
                          <dir className={classes.itemInfo__text}>
                            {'Email: ' + filteredData[currentReportIndex]?.email_rp}
                          </dir>
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
                                  backgroundColor:
                                    filteredData[currentReportIndex]?.status === 'Chờ xử lý'
                                      ? '#ff3a3a'
                                      : filteredData[currentReportIndex]?.status === 'Đang xử lý'
                                      ? '#0095d5'
                                      : '#00AE46',
                                }}
                              >
                                {filteredData[currentReportIndex]?.status}
                                <div className={classes.reportStatus__ic}>
                                  <FontAwesomeIcon
                                    icon={
                                      filteredData[currentReportIndex]?.status === 'Chờ xử lý'
                                        ? faXmark
                                        : filteredData[currentReportIndex]?.status === 'Đang xử lý'
                                        ? faClockRotateLeft
                                        : faCheck
                                    }
                                  />
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
            reportList={data.reports}
          />
        </Backdrop>
      )}
    </div>
  );
}
