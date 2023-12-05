import classes from './styles.module.scss';
import { logo, user } from '~assets/imgs/Imgs';
import { faHouse, faLocationDot, faFlag, faFileContract } from '@fortawesome/free-solid-svg-icons';
import NavBarItem from './navBarItem';
import { useLocation } from 'react-router-dom';

const categories = [
  {
    name: 'Trang chủ',
    icon: faHouse,
    path: '/',
  },
  {
    name: 'Điểm đặt',
    icon: faLocationDot,
    path: '/advertising-spots',
  },
  {
    name: 'Báo cáo',
    icon: faFlag,
    path: '/reports',
  },
  {
    name: 'Cấp phép',
    icon: faFileContract,
    path: '/licenses',
  },
];

export default function NavBar(props) {
  const location = useLocation();
  const currentPath = '/' + location.pathname.split('/')[1];

  return (
    <div className={classes.main_container}>
      <div className={classes.logo_container}>
        <a href="/">
          <img src={logo} className={classes.logo} />
        </a>

        {categories.map((item, index) => (
          <NavBarItem
            key={index}
            name={item.name}
            icon={item.icon}
            path={item.path}
            active={currentPath === item.path}
          />
        ))}
      </div>

      <img src={user} className={classes.avatar} />
    </div>
  );
}
