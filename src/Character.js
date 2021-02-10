import React from 'react';
import './styles/Character.css';

function Character(props) {

const { colour, value, bold, strikethrough, italic, underline } = props;

    const fontWeight = bold ? 700 : 400;
    const textDec = `${strikethrough?'line-through ':''}${underline?'underline ':''}`;
    const fontStyle = `${italic?'italic':'normal'}`;
    return (
        // <div className="CharacterContainer">
        <span className="Character" 
              style={{ 
                    color: colour, 
                    fontWeight: fontWeight,
                    fontStyle: fontStyle,
                    textDecoration: textDec }}
        >{value}</span>
        // <input type="radio" />
        // </div>
    );
}

export default Character;