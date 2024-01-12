import { faCaretLeft, faCircleQuestion, faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GoogleMap, InfoWindow, Marker, MarkerClusterer, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ic_warning } from '~/src/assets';
import Checklist from '~/src/components/CheckList/CheckList';
import ModalReport from '~/src/components/ModalReport/ModalReport';
import ButtonCT from '~/src/components/button/ButtonCT';
import { useSocketSubscribe } from '~/src/hook/useSocketSubscribe';
import {
    AdSpotBeReported,
    AdSpotNotPlan,
    AdSpotPlanned,
    AdSpotSolvedReport,
    SpotBeReported,
    SpotSolvedReport,
} from '~assets/markers/index';
import GoongAutoComplete from '~components/GoongAutoComplete/index';
import AnnotationDropdown from './AnnotationDropdown/index';
import CardInfor from './CardInfor';
import DetailReport from './DetailReport';
import classes from './Home.module.scss';
import InforTable from './InforTable';
import InfoCardNotPlanning from './InfoCardNotPlanning';

const infoAds = {
    PANEL: 'Panel',
    TABLE: 'Table;',
};

const containerStyle = {
    width: '100%',
    height: '100%',
};

const iconSize = 25;

const Home = () => {
    const [showInfo, setShowInfo] = useState({ id: -1, show: false, info: '', data: {}, planning: true });
    const [showAdDetail, setShowAdDetail] = useState({ id: -1, show: false, data: {} });
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [isShowFilter, setIsShowFilter] = useState(false);
    const [isShowNote, setIsShowNote] = useState(false);
    const [isShowReport, setIsShowReport] = useState({ id: '', show: false, type: '' });
    const [AdRender, setAdRender] = useState([]);
    const [AdRenderSave, setAdRenderSave] = useState([]);
    const [adsBoard, setAdsBoard] = useState([]);
    const [listReport, setListReport] = useState([]);
    const [showDetailReport, setShowDetailReport] = useState({
        location: { lat: 0, lng: 0 },
        show: false,
        type: '',
        data: {},
    });
    const [showMarkerIcon, setShowMarkerIcon] = useState(false);
    const [geocode, setGeocode] = useState({ lat: 10.7764, lng: 106.699 });
    const [center, setCenter] = useState({ lat: 10.7764, lng: 106.699 });
    const [showInforPointAny, setShowInforPointAny] = useState({ show: false, type: '', data: {} });
    const [listAdReportAny, setListAdReportAny] = useState([]);
    const [listAdReportAnyRender, setListAdReportAnyRender] = useState([]);
    const [autoCompleteValue, setAutoCompleteValue] = useState();

    const [noReportStatus, setNoReportStatus] = useState(true);
    const [beReportedStatus, setBeReportedStatus] = useState(true);
    const [plannedStatus, setPlannedStatus] = useState(true);
    const [notPlanStatus, setNotPlanStatus] = useState(true);

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
                    console.log(data);
                })
                .catch((error) => {
                    console.log('Get tasks error: ', error);
                });
        })();
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setShowMarkerIcon(true);
                    setGeocode({ lat: latitude, lng: longitude });
                    setCenter({ lat: latitude, lng: longitude });
                },
                (error) => {
                    console.error('Error getting geolocation:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by your browser');
        }
    }, []);

    useSocketSubscribe('changeReport', fetchData);
    useSocketSubscribe('createdAdsPoint', fetchData);

    const removeDuplicates = (array) => {
        const uniqueArray = [];
        const seenLocations = {};

        array.forEach((item) => {
            const key = `${item.lat}_${item.lng}`;

            if (!seenLocations[key]) {
                seenLocations[key] = true;
                uniqueArray.push(item);
            }
        });

        return uniqueArray;
    };

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

            const matchingReportAny = listReport.filter(
                (report) => report.board_id === null && report.point_id === null
            );

            setAdRender(AdRender);
            setAdRenderSave(AdRender);
            setListAdReportAny(matchingReportAny);
            setListAdReportAnyRender([...removeDuplicates(matchingReportAny)]);
        }
    }, [listReport]);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_API_GG_MAP,
        id: 'google-map-script',
        language: 'vi',
        region: 'vn',
    });

    const mapOptions = {
        disableDefaultUI: true, // Tắt tất cả các công cụ mặc định của Google Maps
        zoomControl: false, // Bật hoặc tắt nút zoom
        mapTypeControl: false, // Tắt công cụ chọn kiểu bản đồ (địa hình, satellite, ...)
        streetViewControl: false, // Tắt công cụ xem đường phố
        fullscreenControl: false, // Tắt nút màn hình đầy đủ
        // Thêm các tùy chọn khác nếu cần
    };

    const fetchInfoLocation = async (lat, lng) => {
        try {
            const url = `https://rsapi.goong.io/Geocode?latlng=${lat},%20${lng}&api_key=vPYt4GFCSFhetF2VAe6xIKKo0qmMaTrPqvPGzO7K`;

            const response = await fetch(url);
            const data = await response.json();

            setShowInforPointAny({ show: true, type: 'Any', data: data.results[0] });
        } catch (error) {
            console.error('Goong auto complete error:', error);
            throw error;
        }
    };

    const fetchInfoReportAnyLocation = async (lat, lng) => {
        try {
            const url = `https://rsapi.goong.io/Geocode?latlng=${lat},%20${lng}&api_key=vPYt4GFCSFhetF2VAe6xIKKo0qmMaTrPqvPGzO7K`;

            const response = await fetch(url);
            const data = await response.json();

            setShowDetailReport({ location: { lat, lng }, show: true, type: 'Any', data: data && data.results[0] });
        } catch (error) {
            console.error('Goong auto complete error:', error);
            throw error;
        }
    };

    const handleMapClickPosition = (event) => {
        setShowMarkerIcon(true);
        fetchInfoLocation(event.latLng.lat(), event.latLng.lng());
        setGeocode({
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        });
        setSelectedMarker(null);
        setShowInfo({ id: -1, show: false, infoAds: '', data: {} });
        setShowAdDetail({ id: -1, show: false, infoAds: '', data: {} });
        setShowDetailReport({ show: false, type: '', data: {} });
    };

    const selectIcon = (spot) => {
        if (spot.list_report) {
            if (spot.list_report.length === 0) {
                if (spot.is_planning) return AdSpotPlanned;

                return AdSpotNotPlan;
            } else {
                if (spot.list_report.some((item) => item.status === 'pending')) return AdSpotBeReported;

                return AdSpotSolvedReport;
            }
        }
    };

    const selectIconAny = (spot) => {
        if (spot.status === 'processed') {
            return SpotSolvedReport;
        }
        return SpotBeReported;
    };

    const showInfoAd = (marker) => {
        setSelectedMarker(marker);
    };

    const closeInfoWindow = () => {
        setSelectedMarker(null);
        setShowInfo({ id: -1, show: false, infoAds: '', data: {} });
        setShowAdDetail({ id: -1, show: false, infoAds: '', data: {} });
        setShowDetailReport({ show: false, type: '', data: {} });
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

    const handleSendReportSuccess = (data) => {
        if (data) {
            fetchData();
            setShowInfo({ id: -1, show: false, info: '', data: {} });
            setShowAdDetail({
                id: -1,
                show: false,
                info: '',
                data: {},
            });
            setShowDetailReport({ show: false, type: '', data: {} });
            setShowMarkerIcon(false);
            setShowInforPointAny({ show: false, type: '', data: {} });
        }
    };

    const handleSearch = async (place_id) => {
        await axios
            .get(`https://rsapi.goong.io/geocode?place_id=${place_id}&api_key=vPYt4GFCSFhetF2VAe6xIKKo0qmMaTrPqvPGzO7K`)
            .then((res) => {
                const coord = res.data.results[0].geometry.location;
                setShowMarkerIcon(true);
                setGeocode(coord);
                setCenter(coord);
                fetchInfoLocation(coord.lat, coord.lng);
            })
            .catch((error) => {
                console.log('Get place detail error: ', error);
            });
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
                                center={center}
                                zoom={15}
                                onClick={handleMapClickPosition}
                                options={mapOptions}
                            >
                                {showMarkerIcon && (
                                    <Marker
                                        position={geocode}
                                        animation={showMarkerIcon && window.google.maps.Animation.BOUNCE}
                                    ></Marker>
                                )}

                                <MarkerClusterer
                                    options={{
                                        imagePath:
                                            'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
                                    }}
                                >
                                    {(clusterer) => {
                                        return (
                                            <>
                                                {AdRender.filter(
                                                    (spot) =>
                                                        (!noReportStatus ? spot.list_report.length !== 0 : true) &&
                                                        (!beReportedStatus ? spot.list_report.length === 0 : true) &&
                                                        (!plannedStatus ? !spot.is_planning : true) &&
                                                        (!notPlanStatus ? spot.is_planning : true)
                                                ).map((item, index) => (
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
                                                                      planning: true,
                                                                  })
                                                                : setShowInfo({
                                                                      id: index,
                                                                      show: true,
                                                                      info: infoAds.PANEL,
                                                                      data: item,
                                                                      planning: false,
                                                                  });
                                                            setShowAdDetail({
                                                                id: -1,
                                                                show: false,
                                                                info: '',
                                                                data: {},
                                                            });

                                                            item.is_planning === 1
                                                                ? setShowDetailReport({
                                                                      show: false,
                                                                      type: '',
                                                                      data: {},
                                                                  })
                                                                : setShowDetailReport({
                                                                      show: false,
                                                                      type: '',
                                                                      data: {},
                                                                  });
                                                            setShowMarkerIcon(false);
                                                            setShowInforPointAny({ show: false, type: '', data: {} });
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
                                                        clusterer={clusterer}
                                                    >
                                                        {selectedMarker === item && (
                                                            <InfoWindow onCloseClick={closeInfoWindow}>
                                                                <div className={classes.info}>
                                                                    <h2 className={classes.info__title}>
                                                                        {item.advertisement_type_name}
                                                                    </h2>
                                                                    <p className={classes.info__type}>
                                                                        {item.location_type}
                                                                    </p>
                                                                    <p className={classes.info__location}>
                                                                        {item.ward_name}, {item.district_name}
                                                                    </p>
                                                                    <div>
                                                                        <p className={classes.info__state}>
                                                                            {item.is_planning === 1
                                                                                ? 'ĐÃ QUY HOẠCH'
                                                                                : 'CHƯA QUY HOẠCH'}
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
                                                {beReportedStatus &&
                                                    (beReportedStatus || noReportStatus) &&
                                                    listAdReportAnyRender.map((item, index) => (
                                                        <Marker
                                                            key={+index}
                                                            position={{ lat: item.lat, lng: item.lng }}
                                                            onClick={() => {
                                                                showInfoAd(item);
                                                                fetchInfoReportAnyLocation(item.lat, item.lng, index);
                                                                setShowAdDetail({
                                                                    id: -1,
                                                                    show: false,
                                                                    info: '',
                                                                    data: {},
                                                                });

                                                                setShowMarkerIcon(false);
                                                                setShowInforPointAny({
                                                                    show: false,
                                                                    type: '',
                                                                    data: {},
                                                                });
                                                            }}
                                                            icon={{
                                                                url: selectIconAny(item),
                                                                scaledSize: isLoaded
                                                                    ? new window.google.maps.Size(iconSize, iconSize)
                                                                    : null,
                                                                anchor: new google.maps.Point(
                                                                    iconSize / 2,
                                                                    iconSize / 2
                                                                ),
                                                                origin: new google.maps.Point(0, 0),
                                                            }}
                                                            zIndex={0}
                                                            clusterer={clusterer}
                                                        >
                                                            {selectedMarker === item && (
                                                                <InfoWindow onCloseClick={closeInfoWindow}>
                                                                    <div className={classes.info}>
                                                                        <p className={classes.info__type}>
                                                                            {showDetailReport.data.address}
                                                                        </p>
                                                                        <p className={classes.info__location}>
                                                                            {showDetailReport.data.formatted_address}
                                                                        </p>
                                                                        <div style={{ justifyContent: 'flex-end' }}>
                                                                            <p
                                                                                className={classes.info__report}
                                                                                style={{ justifyContent: 'flex-end' }}
                                                                                onClick={() => {
                                                                                    setIsShowReport({
                                                                                        id: index + '',
                                                                                        show: true,
                                                                                        type: 'Any',
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
                                            </>
                                        );
                                    }}
                                </MarkerClusterer>
                            </GoogleMap>
                        ) : (
                            <>Loading...</>
                        )}
                    </div>
                </div>
            </div>
            <div className={classes['container__home-head']}>
                <GoongAutoComplete
                    className={classes.search}
                    apiKey="vPYt4GFCSFhetF2VAe6xIKKo0qmMaTrPqvPGzO7K"
                    placeholder="Tìm kiếm theo địa chỉ"
                    value={autoCompleteValue}
                    setValue={setAutoCompleteValue}
                    onChange={(place_id) => handleSearch(place_id)}
                />
            </div>

            <div className={classes['container__home-filter']}>
                <FontAwesomeIcon
                    icon={faFilter}
                    className={classes.ic}
                    onClick={() => setIsShowFilter(!isShowFilter)}
                />
                {isShowFilter && (
                    <Checklist
                        setNoReportStatus={setNoReportStatus}
                        setBeReportedStatus={setBeReportedStatus}
                        setPlannedStatus={setPlannedStatus}
                        setNotPlanStatus={setNotPlanStatus}
                    />
                )}
            </div>

            <div className={classes['container__home-note']}>
                <FontAwesomeIcon
                    icon={faCircleQuestion}
                    className={classes.ic}
                    onClick={() => setIsShowNote(!isShowNote)}
                />
                {isShowNote && <AnnotationDropdown onCheckboxChange={handleCheckboxChange} />}
            </div>

            <div
                className={classes['container__home-inf']}
                style={{ width: showInfo.show && showInfo.planning ? '40rem' : 0 }}
            >
                <FontAwesomeIcon
                    icon={faCaretLeft}
                    className={classes.icon}
                    style={{
                        color: showInfo.info === infoAds.TABLE ? '#fff' : '#000',
                        display: showInfo.show && showInfo.planning ? 'block' : 'none',
                    }}
                    onClick={() => {
                        setShowInfo({ show: false, infoAds: '', data: {} });
                        setSelectedMarker(null);
                    }}
                />

                <div
                    className={classes['container__home-inf-content']}
                    style={{ padding: showInfo.show && showInfo.planning ? '0 3rem' : 0 }}
                >
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
                                <p style={{ textAlign: 'center' }}>Chưa có bảng quảng cáo</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div
                className={classes['container__home-inf']}
                style={{ width: showInfo.show && !showInfo.planning ? '40rem' : 0 }}
            >
                {/* Xem chi tiết của một trụ, cột*/}
                <FontAwesomeIcon
                    icon={faCaretLeft}
                    className={classes.icon}
                    style={{ color: '#000', display: showInfo.show && !showInfo.planning ? 'block' : 'none' }}
                    onClick={() => {
                        setShowInfo({ show: false, infoAds: '', data: {} });
                        setSelectedMarker(null);
                    }}
                />
                {showInfo.show && !showInfo.planning && (
                    <div className={classes['container__home-inf-imgAds']}>
                        <img src={showInfo.data.image_url} alt="none" />
                    </div>
                )}
                <div
                    className={classes['container__home-inf-content']}
                    style={{ padding: showInfo.show && !showInfo.planning ? '0 3rem' : 0 }}
                >
                    <div
                        className={classes[`container__home-inf-content-table-show-img`]}
                        style={{ marginTop: '30rem' }}
                    >
                        <InfoCardNotPlanning
                            info={showInfo.data}
                            onClickShowDetailReportPoint={() => {
                                setShowDetailReport({ show: true, type: 'Point', data: {} });
                            }}
                            onClickShowReport={() => {
                                setIsShowReport({ show: true, type: 'Point' });
                            }}
                        />
                    </div>
                </div>
            </div>

            {showAdDetail.show && (
                <div className={classes['container__home-inf']} style={{ width: showAdDetail.show ? '40rem' : 0 }}>
                    {/* Xem chi tiết của một trụ, cột*/}
                    <FontAwesomeIcon
                        icon={faCaretLeft}
                        className={classes.icon}
                        style={{ color: '#000', display: showAdDetail.show ? 'block' : 'none' }}
                        onClick={() => {
                            setShowAdDetail({ id: -1, show: false, data: {} });
                        }}
                    />

                    <div className={classes['container__home-inf-imgAds']}>
                        <img src={showAdDetail.data.advertisement_image_url} alt="none" />
                    </div>
                    <div
                        className={classes['container__home-inf-content']}
                        style={{ padding: showAdDetail.show ? '0 3rem' : 0 }}
                    >
                        <div className={classes[`container__home-inf-content-table-show-img`]}>
                            <InforTable
                                info={{ infoBoard: showAdDetail.data, infoPoint: showInfo.data }}
                                onClickShowDetailReportPoint={() => {
                                    setShowDetailReport({ show: true, type: 'Point', data: {} });
                                }}
                                onClickShowDetailReportBoard={() => {
                                    setShowDetailReport({ show: true, type: 'Board', data: {} });
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className={classes['container__home-inf']} style={{ width: showDetailReport.show ? '40rem' : 0 }}>
                {/* Xem chi tiết của một trụ, cột*/}
                <FontAwesomeIcon
                    icon={faCaretLeft}
                    className={classes.icon}
                    style={{ color: '#000', display: showDetailReport.show ? 'block' : 'none' }}
                    onClick={() => {
                        setShowDetailReport({ show: false, type: '', data: {} });
                        setSelectedMarker(null);
                    }}
                />

                {showDetailReport.show && (
                    <div
                        className={classes['container__home-inf-content']}
                        style={{ padding: showDetailReport.show ? '0 3rem' : 0 }}
                    >
                        <div
                            className={classes[`container__home-inf-content-table-show-img`]}
                            style={{ marginTop: '8rem' }}
                        >
                            <DetailReport
                                info={
                                    showDetailReport.type === 'Point'
                                        ? showInfo.data.list_report
                                        : showDetailReport.type === 'Board'
                                        ? showAdDetail.data.list_report_board
                                        : listAdReportAny.filter(
                                              (report) =>
                                                  report.lat === showDetailReport.location.lat &&
                                                  report.lng === showDetailReport.location.lng
                                          )
                                }
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className={classes['container__home-inf']} style={{ width: showInforPointAny.show ? '40rem' : 0 }}>
                {/* Xem chi tiết của một trụ, cột*/}
                <FontAwesomeIcon
                    icon={faCaretLeft}
                    className={classes.icon}
                    style={{ color: '#000', display: showInforPointAny.show ? 'block' : 'none' }}
                    onClick={() => {
                        setShowInforPointAny({ show: false, type: '', data: {} });
                        setShowMarkerIcon(false);
                    }}
                />

                <div
                    className={classes['container__home-inf-content']}
                    style={{ padding: showInforPointAny.show ? '0 3rem' : 0 }}
                >
                    <ul style={{ marginTop: '8rem' }} className={classes.list}>
                        <li>
                            <label>Địa điểm:</label>
                            <p>{showInforPointAny.data.formatted_address}</p>
                        </li>
                        <li>
                            <label>Địa chỉ:</label>
                            <p>{showInforPointAny.data.address}</p>
                        </li>

                        <ButtonCT
                            style={{ marginTop: '3rem' }}
                            content="Báo cáo vi phạm"
                            className={'borderRadius7 uppercase'}
                            iconLeft={ic_warning}
                            outlineBtn={true}
                            borderRadius={true}
                            redWarning={true}
                            onClick={() => setIsShowReport({ show: true, type: 'Any' })}
                        />
                    </ul>
                </div>
            </div>

            {isShowReport.show && (
                <ModalReport
                    type={isShowReport.type}
                    location={
                        isShowReport.type !== 'Any'
                            ? { lat: showInfo.data.lat, lng: showInfo.data.lng }
                            : { lat: geocode.lat, lng: geocode.lng }
                    }
                    info={
                        isShowReport.type === 'Point'
                            ? showInfo.data
                            : isShowReport.type === 'Board'
                            ? showAdDetail.data
                            : { lat: geocode.lat, lng: geocode.lng }
                    }
                    success={handleSendReportSuccess}
                    onClose={() => setIsShowReport({ id: '', show: false, type: '' })}
                />
            )}
        </div>
    );
};

export default Home;
