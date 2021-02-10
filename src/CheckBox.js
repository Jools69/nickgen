import React from 'react';
import './styles/CheckBox.css';

function CheckBox(props) {

    const { label, name, handleChange, checked } = props;

    return (
            <div className="CheckBox">
                <label for={name}>{label}</label>
                <input type="checkbox" id={name} name={name} onChange={handleChange} checked={checked ? 'checked' : ''}/>
            </div>
    );
}

export default CheckBox;