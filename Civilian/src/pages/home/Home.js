import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import classes from './Home.module.scss';
import SearchBar from '~/src/components/SearchBar';
import CardInfor from './CardInfor';
import InforTable from './InforTable';

const infoAds = {
    PANEL: 'Panel',
    TABLE: 'Table;',
};

const Home = () => {
    const [listInforPosition, setListInforPosition] = useState([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
    const [showInfo, setShowInfo] = useState({ show: true, info: infoAds.TABLE });

    // When table have the infomation
    const isHaveInfor = false;

    return (
        <div className={classes.container__home}>
            <div className={classes['container__home-map']}>{/* Map */}</div>
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
