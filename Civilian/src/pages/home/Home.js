import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import classes from './Home.module.scss';
import SearchBar from '~/src/components/SearchBar';
import CardInfor from './CardInfor';
import InforTable from './InforTable';
import ic_position from '../../assets/svg/address.svg';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const infoAds = {
    PANEL: 'Panel',
    TABLE: 'Table;',
};

const containerStyle = {
    width: '100%',
    height: '100%',
};

const coordinatesList = [
    { id: 1, lat: 37.7749, lng: -122.4194 },
    { id: 2, lat: 34.0522, lng: -118.2437 },
];

const Home = () => {
    const [listInforPosition, setListInforPosition] = useState([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
    const [showInfo, setShowInfo] = useState({ show: true, info: infoAds.TABLE });

    // When table have the infomation
    const isHaveInfor = false;

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyBxWEpG38Jm2lo2OEe3RDjjVBgGRxwF_ow',
        id: 'google-map-script',
        language: 'vi',
        region: 'vn',
    });

    const customMarkerIcon = {
        url: ic_position,
        scaledSize: isLoaded ? new window.google.maps.Size(36, 36) : null,
    };

    const [geocode, setGeocode] = useState({ lat: 37.7749, lng: -122.4194 });

    const onLoad = React.useCallback(function callback(mapInstance) {
        setGeocode(mapInstance.center.toJSON());
    }, []);

    const handleMapClickPosition = (event) => {
        setGeocode({
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        });
    };

    useEffect(() => {
        // Additional logic if needed when the geocode changes
    }, [geocode]);

    const onMarkerLoad = (marker) => {
        // handle marker load event
    };

    const onMarkerClick = (id) => {
        // handle marker click event based on ID or other identifier
        console.log(`Marker ${id} clicked!`);
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
                                zoom={10}
                                onLoad={onLoad}
                                onClick={handleMapClickPosition}
                            >
                                <Marker position={geocode} icon={customMarkerIcon} />

                                {coordinatesList.map((coordinate) => (
                                    <Marker
                                        key={coordinate.id}
                                        position={{ lat: coordinate.lat, lng: coordinate.lng }}
                                        onLoad={onMarkerLoad}
                                        onClick={() => onMarkerClick(coordinate.id)}
                                    />
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

            {showInfo.show && (
                <>
                    {(showInfo.info === infoAds.PANEL || !isHaveInfor) && (
                        <div className={classes['container__home-block']}></div>
                    )}
                    <div className={classes['container__home-inf']}>
                        {/* Xem chi tiết của một trụ, cột*/}

                        {showInfo.info === infoAds.TABLE && isHaveInfor && (
                            <div className={classes['container__home-inf-imgAds']}>
                                <img src="https://s.pro.vn/018b" alt="none" />
                            </div>
                        )}
                        <div className={classes['container__home-inf-content']}>
                            {showInfo.info === infoAds.PANEL ? (
                                <div className={classes['container__home-inf-content-items']}>
                                    {listInforPosition.map((item) => (
                                        <CardInfor key={item.id} />
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
                                    <InforTable />
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Home;
