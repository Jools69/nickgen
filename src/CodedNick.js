import './styles/CodedNick.css';

function CodedNick(props) {

    const { nick } = props;

    const codedString = '/nick ' + nick.map((c) => {
        return `&${c.colour}${c.bold ? '&l' : ''}${c.strikethrough ? '&m' : ''}${c.underline ? '&n' : ''}${c.italic ? '&o' : ''}${c.char}`
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