import React, { useState } from 'react';
import chroma from 'chroma-js';
import ColoursSlider from './ColoursSlider';
import ColourPickers from './ColourPickers';
import './styles/NickGenerator.css';
import CodedNick from './CodedNick';

function NickGenerator() {
    const [colours, setColours] = useState(['#ff00ff', '#00ff00']);
    const [numberOfColours, setNumberOfColours] = useState(2);
    const [name, setName] = useState('Nickname');
    const maxColours = 4;

    let gradient = chroma.scale(colours).mode('lab');

    let characters = name.split('').map((c, i) => {
        const offset = (1.0 / (name.length - 1)) * i;
        return (<span key={i} className="Char" style={{ color: `${gradient(offset)}` }}><b>{c}</b></span>);
    });

    const updateNumberOfColours = (e) => {
        setNumberOfColours(e);
        const newColours = [...colours].concat(['#ffffff', '#ffffff']).splice(0, e);
        setColours(newColours);
    };

    const updateColour = (index, newColour) => {
        const newColours = [...colours];
        newColours[index] = newColour;
        setColours(newColours);
    }

    const handleNickChange = (e) => {
        const newName = e.target.value;
        if (newName.length <= 16)
            setName(e.target.value);
    }

    return (
        <div className="NickGenerator">
            <div className="nameInput">
                <div><label for="name">Enter your nick:</label></div>
                <input
                    maxLength="16"
                    type="text"
                    id="name" 
                    placeholder="nick" 
                    onChange={handleNickChange}/>
            </div>
            <div className="Colours">
                {characters}
            </div>
            <ColoursSlider
                numberOfColours={numberOfColours}
                maxNumOfColours={maxColours}
                handleSliderChange={updateNumberOfColours} />
            <div>
                <ColourPickers colours={colours} numberOfPickers={numberOfColours} updateColour={updateColour} />
            </div>
            <CodedNick nick={name} gradient={gradient} />
        </div>
    );
}

export default NickGenerator;