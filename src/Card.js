import React from 'react';
import './Card.css';

export class Card extends React.Component {
    handleClick = () => {
        this.props.cardClickHandler(this.props.index);
    };

    render() {
        // if card should be open
        if (this.props.open) {
            // show card value
            this.symbolToShow = this.props.value;
        }
        else { // otherwise
            // show backside
            this.symbolToShow = '?';
        }
        return (<button className="card" style={{ backgroundColor: this.props.color }} onClick={() => this.handleClick()}>
            {this.symbolToShow}
        </button>);
    }
}
