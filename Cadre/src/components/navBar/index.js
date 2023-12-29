import classes from './styles.module.scss';
import { logo, user } from '~assets/imgs/Imgs';
import NavBarItem from './navBarItem';
import { useLocation } from 'react-router-dom';
import AccountDropdown from '../Dropdown/AccountDropdown';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';
import DropdownWard from '../Dropdown/DropdownWard';

export default function NavBar(props) {
  const location = useLocation();
  const currentPath = '/' + location.pathname.split('/')[1];
  const [activeAccountDropdown, setActiveAccountDropdown] = useState(false);
  const [filterWardActive, setFilterWardActive] = useState(false);
  const [checkUserDistrict, setCheckUserDistrict] = useState(false);
  const { categories } = props;
  const navigate = useNavigate();
  useEffect(() => {
    const type = localStorage.getItem('user_type')
    if (type === 'district') {
      setCheckUserDistrict(true)
    }
  }, [])
  return (
    <div className={classes.main_container}>
      <div className={classes.logo_container}>
        <img src={logo} className={classes.logo} onClick={() => navigate('/')} />

        {categories?.map((item, index) => (
          <NavBarItem
            key={index}
            name={item.name}
            icon={item.icon}
            path={item.path}
            active={currentPath === item.path}
          />
        ))}


      </div>


      <div className={classes.wrapper}>
        {checkUserDistrict && (
          <div className={classes.filter}>
            <div
              className={[classes.filter__ic, filterWardActive && classes['filter__ic--active']].join(' ')}
              onClick={() => setFilterWardActive(!filterWardActive)}
            >
              <FontAwesomeIcon icon={faList} />
            </div>
            {filterWardActive && (
              <DropdownWard
              />
            )}
          </div>
        )}
        <div className={classes.avatar_container}>
          <img
            src={user}
            className={`${classes['avatar']} ${activeAccountDropdown ? classes['avatar--active'] : ''}`}
            onClick={() => setActiveAccountDropdown(!activeAccountDropdown)}
          />
          {activeAccountDropdown && (
            <div className={classes.accountDropdown_container}>
              <AccountDropdown className={classes.accountDropdown_container} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
