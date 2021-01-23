import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './styles/ColoursSlider.css';

function ColoursSlider(props) {
    const { numberOfColours, maxNumOfColours, handleSliderChange } = props;

    return (
        <div className="slider">
            <p>Number of main colours</p>
            <Slider 
                min={2}
                max={maxNumOfColours}
                dots={true}
                value={numberOfColours}
                onChange={handleSliderChange}/>
            <span>{numberOfColours}</span>
        </div>
    );
}

export default ColoursSlider;