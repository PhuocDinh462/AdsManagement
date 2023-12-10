import classes from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const IconTextBtn = (props) => {
  const { label, leftIc, rightIc, disabled, onClick, textColor, bgColor } = props;

  return (
    <div
      className={[classes.iconTextBtn, disabled && classes['iconTextBtn--disabled']].join(' ')}
      style={{ color: textColor && textColor, backgroundColor: bgColor && bgColor }}
      onClick={onClick}
    >
      {leftIc && <FontAwesomeIcon icon={leftIc} />}
      <div style={{ marginLeft: leftIc && '10px', marginRight: rightIc && '10px' }}>{label}</div>
      {rightIc && <FontAwesomeIcon icon={rightIc} />}
    </div>
  );
};

export { IconTextBtn };
