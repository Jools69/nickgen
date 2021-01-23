import './styles/CodedNick.css';

function CodedNick(props) {

    const { nick, gradient } = props;

    const codedString = '/nick ' + nick.split('').map((c, i) => {
        const offset = (1.0 / (nick.length - 1)) * i;
        return `&${gradient(offset)}&l${c}`
    }).join('');

    return (
        <div className="codedNick">
            <div className="commandString">
                <p>
                    {codedString}
                </p>
            </div>
            <button
                className="copyButton"
                onClick={(e) => { navigator.clipboard.writeText(codedString);
                                }}>
                Copy text
            </button>
        </div>
    );
}

export default CodedNick;