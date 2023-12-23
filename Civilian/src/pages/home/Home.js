import React, { useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader, InfoWindow } from '@react-google-maps/api';
import classes from './Home.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faFilter, faListUl } from '@fortawesome/free-solid-svg-icons';
import SearchBar from '~/src/components/SearchBar';
import ic_position from '../../assets/svg/address.svg';
import ic_ad from '../../assets/imgs/ad.png';
import ic_no_ad from '../../assets/imgs/noad.png';
import CardInfor from './CardInfor';
import InforTable from './InforTable';
import Checklist from '~/src/components/CheckList/CheckList';

const infoAds = {
    PANEL: 'Panel',
    TABLE: 'Table;',
};

const containerStyle = {
    width: '100%',
    height: '100%',
};

const coordinatesList = [
    { id: 1, lat: 10.7769, lng: 106.7009, state: 0 },
    { id: 2, lat: 10.7797, lng: 106.6994, state: 1 },
    { id: 3, lat: 10.7764, lng: 106.699, state: 0 },
    { id: 4, lat: 10.7766, lng: 106.7001, state: 1 },
];

const locationAdList = [
    { id: 1, lat: 10.7722, lng: 106.6989 },
    { id: 2, lat: 10.7728, lng: 106.6983 },
    { id: 3, lat: 10.7736, lng: 106.6914 },
    { id: 4, lat: 10.7782, lng: 106.6945 },
];

const Home = () => {
    const [listInforPosition, setListInforPosition] = useState([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
    const [showInfo, setShowInfo] = useState({ id: -1, show: false, info: '' });
    const [showAdDetail, setShowAdDetail] = useState({ id: -1, show: false });
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [isShowFilter, setIsShowFilter] = useState(false);
    const [AdRender, setAdRender] = useState(coordinatesList);

    // When table have the infomation
    const isHaveInfor = true;

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

    const showInfoAd = (marker) => {
        setSelectedMarker(marker);
    };

    const closeInfoWindow = () => {
        setSelectedMarker(null);
        setShowInfo({ id: -1, show: false, infoAds: '' });
    };

    const handleCheckboxChange = (data) => {
        if (data[0].checked && !data[1].checked) {
            setAdRender(coordinatesList.filter((item) => item.state !== 0));
        } else if (!data[0].checked && data[1].checked) {
            setAdRender(coordinatesList.filter((item) => item.state !== 1));
        } else if (data[0].checked && data[1].checked) {
            setAdRender(coordinatesList);
        } else {
            setAdRender([]);
        }
    };

    const handleShowDetail = (index) => {
        setShowAdDetail({ id: index, show: true });
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
                                {AdRender.map((coordinate, index) => (
                                    <Marker
                                        key={coordinate.id}
                                        position={{ lat: coordinate.lat, lng: coordinate.lng }}
                                        onClick={() => {
                                            showInfoAd(coordinate);
                                            coordinate.state === 1
                                                ? setShowInfo({
                                                      id: index,
                                                      show: true,
                                                      info: infoAds.PANEL,
                                                  })
                                                : setShowInfo({
                                                      id: index,
                                                      show: false,
                                                      info: infoAds.TABLE,
                                                  });
                                        }}
                                        icon={coordinate.state === 1 ? ic_ad : ic_no_ad}
                                    >
                                        {selectedMarker === coordinate && (
                                            <InfoWindow onCloseClick={closeInfoWindow}>
                                                <div className={classes.info}>
                                                    <p>{coordinate.id}</p>
                                                    <h2 className={classes.info__title}>Cổ động chính trị</h2>
                                                    <p className={classes.info__type}>
                                                        Đất công/Công viên/Hành lang an toàn giao thông
                                                    </p>
                                                    <p className={classes.info__location}>
                                                        Đồng khởi - Nguyễn Du (Sở văn hóa và Thể thao), Phường Bến Nghé,
                                                        Quận 1
                                                    </p>
                                                    <div>
                                                        <p className={classes.info__state}>
                                                            {coordinate.state === 1 ? 'ĐÃ QUY HOẠCH' : 'CHƯA QUY HOẠCH'}
                                                        </p>
                                                        <p className={classes.info__report} onClick={() => {}}>
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
                                setShowInfo({ show: false, infoAds: '' });
                                setSelectedMarker(null);
                            }}
                        />

                        {showInfo.info === infoAds.TABLE && isHaveInfor && (
                            <div className={classes['container__home-inf-imgAds']}>
                                <img src="https://s.pro.vn/018b" alt="none" />
                            </div>
                        )}
                        <div className={classes['container__home-inf-content']}>
                            {showInfo.info === infoAds.PANEL ? (
                                <div className={classes['container__home-inf-content-items']}>
                                    {listInforPosition.map((item, index) => (
                                        <CardInfor
                                            key={item.id}
                                            title={locationAdList[showInfo.id].id}
                                            onClickShowDetail={() => handleShowDetail(index)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div
                                    className={
                                        classes[
                                            `container__home-inf-content-table${
                                                isHaveInfor ? '-show-img' : '-hidden-img'
                                            }`
                                        ]
                                    }
                                >
                                    <InforTable title={locationAdList[showInfo.id].id} />
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
                            setShowAdDetail({ id: -1, show: false });
                        }}
                    />

                    <div className={classes['container__home-inf-imgAds']}>
                        <img src="https://s.pro.vn/018b" alt="none" />
                    </div>
                    <div className={classes['container__home-inf-content']}>
                        <div
                            className={
                                classes[`container__home-inf-content-table${isHaveInfor ? '-show-img' : '-hidden-img'}`]
                            }
                        >
                            <InforTable title={listInforPosition[showAdDetail.id].id} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
