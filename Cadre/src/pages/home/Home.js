import React, { useEffect, useState } from 'react';
import classes from './Home.module.scss';
import SideBars from '~components/sidebar/SideBars';
import ManageDistrictWard from '../ManageDistrictWard/ManageDistrictWard';
import ManageForm from '../ManageForm/ManageForm';
import Maptiles from '~/src/components/maptiles/Maptiles';
import ManageLicensing from '../ManageLicensing';

const Home = () => {
  const [selectedPage, setSelectedPage] = useState(1);
  const handlePageChange = (pageId) => {
    setSelectedPage(pageId);
  };

  return (
    <div className={classes.dashboard}>
      <div className={classes.dashboard__container}>
        <div className={classes['dashboard__container--table']}>
          {selectedPage === 1 && <ManageDistrictWard />}
          {selectedPage === 2 && <ManageForm />}
          {selectedPage === 6 && <ManageLicensing />}
          {/* ... render other components based on selectedPage */}
        </div>
      </div>
    </div>
  );
};

export default Home;

