import React from 'react';
import './styles/CheckBox.css';

function CheckBox(props) {

    const { label, name, handleChange, checked } = props;

    return (
            <div className="CheckBox">
                <input type="checkbox" id={name} name={name} onChange={handleChange} checked={checked ? 'checked' : ''}/>
                <label htmlFor={name}>{label}</label>
            </div>
    );
}

export default CheckBox;