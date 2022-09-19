import React from 'react';
import './styles/FooterStyles.css';

function Footer(props) {

    return (
        <div>
            <div className="footer">
                    <div className="logo">
                        <p className="copyright">
                            NickGen - Site design © 2021 <span id="jools">Jools<img id="cooky" src="Cooky.svg" height="50"></img></span>. All rights reserved.
                        </p>
                    </div>
            </div>
        </div>
    );
}

export default Footer;