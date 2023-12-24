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
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import { IconTextBtn } from '~components/button';
import { Backdrop } from '@mui/material';
import ImageModal from './Modals/ImageModal';
import ProcessModal from './Modals/ProcessModal';
import StatusModal from './Modals/StatusModal';
import { useParams } from 'react-router-dom';
import { axiosRequest } from '~/src/api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { setReportIndex, selectReportIndex, setReportPointId } from '~/src/store/reducers';
import { useNavigate } from 'react-router';

export default function ReportsDetail() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const reportIndexStorage = useSelector(selectReportIndex);
  const navigate = useNavigate();

  const [currentReportIndex, setCurrentReportIndex] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageModalUrl, setImageModalUrl] = useState();
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    (async () => {
      await axiosRequest
        .get(`ward/getReportDetailsByPointId/${id}`)
        .then((res) => {
          const data = res.data.data;
          setData(data);
          setFilteredData(data.reports);
          if (reportIndexStorage < data.reports.length) setCurrentReportIndex(reportIndexStorage);
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

  return (
    <div className={classes.main_container}>
      <div className={classes.sideBar_container}>
        <div className={classes.searchBar_container}>
          <a href="/reports" className={[classes.back_btn, classes.btn].join(' ')}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </a>
          <SearchBar placeholder="Tìm kiếm..." width="20rem" onChange={(keyword) => handleFilter(keyword)} />
        </div>

        <div className={classes.nav_btn_container}>
          <div
            className={[classes.nav_btn, classes.btn].join(' ')}
            onClick={() => {
              dispatch(setReportPointId(id));
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
              key={index}
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

          {filteredData.length > 0 ? (
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
                          <dir className={classes.itemInfo__text}>
                            {'Trạng thái: ' + filteredData[currentReportIndex]?.status}
                          </dir>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className={classes.reportContent_container}>
                <div>{filteredData[currentReportIndex]?.report_content}</div>

                {filteredData[currentReportIndex]?.image_urls.length > 0 && (
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

      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showImageModal}>
        <ImageModal setActive={setShowImageModal} image_url={imageModalUrl} />
      </Backdrop>

      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showProcessModal}>
        <ProcessModal setActive={setShowProcessModal} email={filteredData[currentReportIndex]?.email_rp} />
      </Backdrop>

      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showStatusModal}>
        <StatusModal setActive={setShowStatusModal} report_id={filteredData[currentReportIndex]?.report_id} />
      </Backdrop>
    </div>
  );
}
