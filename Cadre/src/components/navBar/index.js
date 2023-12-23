import classes from './styles.module.scss';
import { logo, user } from '~assets/imgs/Imgs';
import NavBarItem from './navBarItem';
import { useLocation } from 'react-router-dom';
import AccountDropdown from '../Dropdown/AccountDropdown';
import { useState } from 'react';

export default function NavBar(props) {
  const location = useLocation();
  const currentPath = '/' + location.pathname.split('/')[1];
  const [activeAccountDropdown, setActiveAccountDropdown] = useState(false);
  const { categories } = props;

  return (
    <div className={classes.main_container}>
      <div className={classes.logo_container}>
        <a href="/">
          <img src={logo} className={classes.logo} />
        </a>

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
  );
}
