import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader, InfoWindow } from '@react-google-maps/api';
import classes from './Home.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faFilter } from '@fortawesome/free-solid-svg-icons';
import SearchBar from '~/src/components/SearchBar';
import CardInfor from './CardInfor';
import InforTable from './InforTable';
import DetailReport from './DetailReport';
import Checklist from '~/src/components/CheckList/CheckList';
import ModalReport from '~/src/components/ModalReport/ModalReport';
import axios from 'axios';
import { useSocketSubscribe } from '~/src/hook/useSocketSubscribe';
import {
    AdSpotPlanned,
    AdSpotNotPlan,
    AdSpotBeReported,
    AdSpotSolvedReport,
    SpotBeReported,
    SpotSolvedReport,
} from '~assets/markers/index';

const infoAds = {
    PANEL: 'Panel',
    TABLE: 'Table;',
};

const containerStyle = {
    width: '100%',
    height: '100%',
};

const iconSize = 25;

const coordinatesList = [
    { id: 1, lat: 10.7769, lng: 106.7009, state: 0 },
    { id: 2, lat: 10.7797, lng: 106.6994, state: 1 },
    { id: 3, lat: 10.7764, lng: 106.699, state: 0 },
    { id: 4, lat: 10.7766, lng: 106.7001, state: 1 },
];

const Home = () => {
    const [showInfo, setShowInfo] = useState({ id: -1, show: false, info: '', data: {} });
    const [showAdDetail, setShowAdDetail] = useState({ id: -1, show: false, data: {} });
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [isShowFilter, setIsShowFilter] = useState(false);
    const [isShowReport, setIsShowReport] = useState({ id: '', show: false, type: '' });
    const [AdRender, setAdRender] = useState([]);
    const [AdRenderSave, setAdRenderSave] = useState([]);
    const [adsBoard, setAdsBoard] = useState([]);
    const [listReport, setListReport] = useState([]);
    const [showDetailReport, setShowDetailReport] = useState({ show: false, type: '' });

    const fetchData = () => {
        (async () => {
            await axios
                .get(process.env.REACT_APP_API_ENDPOINT + '/civilian', {})
                .then((res) => {
                    const data = res.data;
                    setAdRender(data);
                })
                .catch((error) => {
                    console.log('Get tasks error: ', error);
                });
        })();

        (async () => {
            await axios
                .get(process.env.REACT_APP_API_ENDPOINT + '/civilian/adsBoard', {})
                .then((res) => {
                    const data = res.data;
                    setAdsBoard(data);
                })
                .catch((error) => {
                    console.log('Get tasks error: ', error);
                });
        })();

        (async () => {
            await axios
                .get(process.env.REACT_APP_API_ENDPOINT + '/civilian/getReport', {})
                .then((res) => {
                    const data = res.data;
                    setListReport(data);
                })
                .catch((error) => {
                    console.log('Get tasks error: ', error);
                });
        })();
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateReport = (eventData) => {
        fetchData();
    };

    // useSocketSubscribe('createReport', handleCreateReport);

    useEffect(() => {
        if (adsBoard.length !== 0 && AdRender.length !== 0 && listReport.length !== 0) {
            AdRender.forEach((point) => {
                const matchingBoards = adsBoard.filter((board) => board.point_id === point.point_id);
                const matchingPointReport = listReport.filter((report) => report.point_id === point.point_id);

                matchingBoards.forEach((board) => {
                    const matchingBoardReport = listReport.filter((report) => report.board_id === board.board_id);

                    board.list_report_board = matchingBoardReport;
                });

                point.list_board_ads = matchingBoards;
                point.list_report = matchingPointReport;
            });
        }

        console.log(AdRender);

        setAdRender(AdRender);
        setAdRenderSave(AdRender);
    }, [listReport]);

    // When table have the infomation
    const isHaveInfor = false;

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyBxWEpG38Jm2lo2OEe3RDjjVBgGRxwF_ow',
        id: 'google-map-script',
        language: 'vi',
        region: 'vn',
    });

    const [geocode, setGeocode] = useState({ lat: 10.7764, lng: 106.699 });

    const handleMapClickPosition = (event) => {
        setGeocode({
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        });
    };

    const selectIcon = (spot) => {
        if (spot.point_id) {
            if (spot.is_planning) return AdSpotPlanned;

            return AdSpotNotPlan;
            // else if (spot.reportStatus === 'noProcess') return AdSpotBeReported;
            // else if (spot.reportStatus === 'processed') return AdSpotSolvedReport;
        }
        //  else {
        //     if (spot.reportStatus === 'noProcess') return SpotBeReported;
        //     else return SpotSolvedReport;
        // }
    };

    const showInfoAd = (marker) => {
        setSelectedMarker(marker);
    };

    const closeInfoWindow = () => {
        setSelectedMarker(null);
        setShowInfo({ id: -1, show: false, infoAds: '', data: {} });
        setShowAdDetail({ id: -1, show: false, infoAds: '', data: {} });
        setShowDetailReport({ show: false, type: '' });
    };

    const handleCheckboxChange = (data) => {
        if (showInfo.show || showAdDetail.show) {
            setShowInfo({
                id: -1,
                show: false,
                info: '',
                data: {},
            });
            setShowAdDetail({ id: -1, show: false, info: '', data: {} });
            setSelectedMarker(null);
        }
        if (data[0].checked && !data[1].checked) {
            setAdRender(AdRenderSave.filter((item) => item.is_planning !== 0));
        } else if (!data[0].checked && data[1].checked) {
            setAdRender(AdRenderSave.filter((item) => item.is_planning !== 1));
        } else if (data[0].checked && data[1].checked) {
            setAdRender(AdRenderSave);
        } else {
            setAdRender([]);
        }
    };

    return (
        <div className={classes.container__home}>
            <div className={classes['container__home-map']}>
                <div className={classes.geo}>
                    <div className={classes.geo__map}>
                        {isLoaded ? (
                            <GoogleMap
                                style={{ cursor: 'default !important' }}
                                mapContainerStyle={containerStyle}
                                center={geocode}
                                zoom={15}
                                onClick={handleMapClickPosition}
                            >
                                {AdRender.map((item, index) => (
                                    <Marker
                                        key={+index}
                                        position={{ lat: item.lat, lng: item.lng }}
                                        onClick={() => {
                                            showInfoAd(item);
                                            item.is_planning === 1
                                                ? setShowInfo({
                                                      id: index,
                                                      show: true,
                                                      info: infoAds.PANEL,
                                                      data: item,
                                                  })
                                                : setShowInfo({
                                                      id: -1,
                                                      show: false,
                                                      info: infoAds.TABLE,
                                                      data: item,
                                                  });
                                            setShowAdDetail({ id: -1, show: false, info: '', data: {} });
                                            setShowDetailReport({ show: false, type: '' });
                                        }}
                                        icon={{
                                            url: selectIcon(item),
                                            scaledSize: isLoaded
                                                ? new window.google.maps.Size(iconSize, iconSize)
                                                : null,
                                            anchor: new google.maps.Point(iconSize / 2, iconSize / 2),
                                            origin: new google.maps.Point(0, 0),
                                        }}
                                        zIndex={0}
                                    >
                                        {selectedMarker === item && (
                                            <InfoWindow onCloseClick={closeInfoWindow}>
                                                <div className={classes.info}>
                                                    <h2 className={classes.info__title}>
                                                        {item.advertisement_type_name}
                                                    </h2>
                                                    <p className={classes.info__type}>{item.location_type}</p>
                                                    <p className={classes.info__location}>
                                                        {item.ward_name}, {item.district_name}
                                                    </p>
                                                    <div>
                                                        <p className={classes.info__state}>
                                                            {item.is_planning === 1 ? 'ĐÃ QUY HOẠCH' : 'CHƯA QUY HOẠCH'}
                                                        </p>
                                                        <p
                                                            className={classes.info__report}
                                                            onClick={() => {
                                                                setIsShowReport({
                                                                    id: index + '',
                                                                    show: true,
                                                                    type: 'Point',
                                                                });
                                                            }}
                                                        >
                                                            Báo cáo
                                                        </p>
                                                    </div>
                                                </div>
                                            </InfoWindow>
                                        )}
                                    </Marker>
                                ))}
                            </GoogleMap>
                        ) : (
                            <>Loading...</>
                        )}
                    </div>
                </div>
            </div>
            <div className={classes['container__home-head']}>
                <SearchBar />
            </div>

            <div className={classes['container__home-filter']}>
                <FontAwesomeIcon
                    icon={faFilter}
                    className={classes.ic}
                    onClick={() => setIsShowFilter(!isShowFilter)}
                />
                {isShowFilter && <Checklist onCheckboxChange={handleCheckboxChange} />}
            </div>

            {showInfo.show && (
                <>
                    <div className={classes['container__home-inf']}>
                        {/* Xem chi tiết của một trụ, cột*/}
                        <FontAwesomeIcon
                            icon={faClose}
                            className={classes.icon}
                            style={{ color: showInfo.info === infoAds.TABLE ? '#fff' : '#000' }}
                            onClick={() => {
                                setShowInfo({ show: false, infoAds: '', data: {} });
                                setSelectedMarker(null);
                            }}
                        />

                        <div className={classes['container__home-inf-content']}>
                            {showInfo.info === infoAds.PANEL && (
                                <div className={classes['container__home-inf-content-items']}>
                                    {showInfo.data &&
                                        showInfo.data.list_board_ads.map((item, index) => (
                                            <CardInfor
                                                key={+index}
                                                info={{ infoBoard: item, infoPoint: showInfo.data }}
                                                onClickShowDetail={() => {
                                                    setShowAdDetail({ id: index, show: true, data: item });
                                                }}
                                                onClickShowReport={() => {
                                                    setIsShowReport({ id: index + '', show: true, type: 'Board' });
                                                    setShowAdDetail({ id: -1, show: false, data: item });
                                                }}
                                            />
                                        ))}
                                    {showInfo.data && showInfo.data.list_board_ads.length === 0 && (
                                        <p style={{ textAlign: 'center' }}>Không có dữ liệu</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {showAdDetail.show && (
                <div className={classes['container__home-inf']}>
                    {/* Xem chi tiết của một trụ, cột*/}
                    <FontAwesomeIcon
                        icon={faClose}
                        className={classes.icon}
                        style={{ color: '#fff' }}
                        onClick={() => {
                            setShowAdDetail({ id: -1, show: false, data: {} });
                        }}
                    />

                    <div className={classes['container__home-inf-imgAds']}>
                        <img src={showAdDetail.data.advertisement_image_url} alt="none" />
                    </div>
                    <div className={classes['container__home-inf-content']}>
                        <div className={classes[`container__home-inf-content-table-show-img`]}>
                            <InforTable
                                info={{ infoBoard: showAdDetail.data, infoPoint: showInfo.data }}
                                onClickShowDetailReportPoint={() => {
                                    setShowDetailReport({ show: true, type: 'Point' });
                                }}
                                onClickShowDetailReportBoard={() => {
                                    setShowDetailReport({ show: true, type: 'Board' });
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {showDetailReport.show && (
                <div className={classes['container__home-inf']}>
                    {/* Xem chi tiết của một trụ, cột*/}
                    <FontAwesomeIcon
                        icon={faClose}
                        className={classes.icon}
                        style={{ color: '#000' }}
                        onClick={() => {
                            setShowDetailReport({ show: false, type: '' });
                        }}
                    />

                    <div className={classes['container__home-inf-content']}>
                        <div
                            className={classes[`container__home-inf-content-table-show-img`]}
                            style={{ marginTop: '8rem' }}
                        >
                            <DetailReport
                                info={
                                    showDetailReport.type === 'Point'
                                        ? showInfo.data.list_report
                                        : showAdDetail.data.list_report_board
                                }
                            />
                        </div>
                    </div>
                </div>
            )}

            {isShowReport.show && (
                <ModalReport
                    type={isShowReport.type}
                    location={{ lat: showInfo.data.lat, lng: showInfo.data.lng }}
                    info={isShowReport.type === 'Point' ? showInfo.data : showAdDetail.data}
                    onClose={() => setIsShowReport({ id: '', show: false, type: '' })}
                />
            )}
        </div>
    );
};

export default Home;
