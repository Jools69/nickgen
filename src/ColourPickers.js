import './styles/ColourPickers.css';

function ColourPickers(props) {
    const { colours, updateColour } = props;

    const pickers = colours.map((c, i) => {
        return (
            <input 
                key={i} 
                id={i} 
                type="color"
                value={c}
                className="colourPicker"
                onChange={(e) => updateColour(i, e.target.value)}/>
        );
    });

    return (
        <div className="pickerContainer">
            <form>
                {pickers}
            </form>
        </div>
    );
}

export default ColourPickers;
