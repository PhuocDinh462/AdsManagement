import React, { useState } from 'react';
import classes from './CheckList.module.scss';

const Checklist = (props) => {
    const [isChecked, setIsChecked] = useState([
        { label: 'Đã quy hoạch', checked: true },
        { label: 'Chưa quy hoạch', checked: true },
    ]);

    const handleChange = (type) => {
        const updatedStatuses = isChecked.map((status) => {
            if (status.label === type) {
                return { ...status, checked: !status.checked }; // Toggle the checked state
            }
            return status;
        });

        setIsChecked(updatedStatuses);
        props.onCheckboxChange(updatedStatuses);
    };

    return (
        <div className={classes.checklist}>
            {isChecked.map((status, index) => (
                <div className={classes['checklist-item']} key={+index}>
                    <input
                        type="checkbox"
                        checked={status.checked}
                        onChange={() => handleChange(status.label)}
                        value={status.value}
                    />
                    <label className={classes['checklist-item-label']}>{status.label}</label>
                </div>
            ))}
        </div>
    );
};

export default Checklist;
