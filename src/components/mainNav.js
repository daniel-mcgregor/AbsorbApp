import React from 'react';
import './mainNav.css';


class MainNav extends React.Component {

    render(){
        return(
            <div class="mainNav">
                <ul>
                    <li>Absorb</li>
                    <li>Manage</li>
                    <li>Test</li>
                </ul>
            </div>
        )
    }
}

export default MainNav;