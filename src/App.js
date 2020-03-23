import React from 'react';
import { Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Card } from './Card';

const cardsAmount = 8

class CorrectnessLabel extends React.Component {
    render() {
        if (this.props.correct === true) {
            this.correctLabel = 'Correct!'
            this.correctLabelColor = 'green'
        } else {
            this.correctLabel = 'Wrong!'
            this.correctLabelColor = 'red'
        }
        return (
            <strong>
                <font color={this.correctLabelColor}>
                    {this.correctLabel}
                </font>
            </strong>)
    }
}

const MainStates = {
    MEMORIZING: 'memorizing',
    ROUND_START: 'roundStart',
    ROUND_ONGOING: 'roundOngoing',
    ROUND_END: 'roundEnd',
}

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mainState: MainStates.MEMORIZING,
            firstCardOfPairPicked: undefined,
            pairPickedCorrect: undefined
        };
        this.cardContentsArray = Array(cardsAmount)
        this.totalPairsCount = 0
        this.correctCount = 0
        this.totalBoardsCount = 0
        this.boardsCompletedCount = 0
        this.correctValue = ''
        this.correctLabel = ''
        this.correctLabelColor = ''
        this.pairsOpenAmout = 0

        this.getRandomCardPairs()
    }

    handleChange = (event) => {
        this.inputValue = event.target.value
    }

    handleContinueClick = (event) => {
        if (this.state.mainState === MainStates.ROUND_END) {
            this.getRandomCardPairs()
            this.setState({ mainState: MainStates.MEMORIZING })
        } else {
            //this.totalPairsCount = this.totalPairsCount + 4
            this.setState({ mainState: MainStates.ROUND_START })
        }
    }

    getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getRandomCardPairs = () => {
        // * set array of indexes of empty cards
        let emptyCardIndexArray = Array(cardsAmount)
        for (let index = 0; index < emptyCardIndexArray.length; index++) {
            emptyCardIndexArray[index] = index
        }

        // start value, which is set anywhere in cards array
        let value = 0

        // while we have empty cards
        while (emptyCardIndexArray.length > 0) {
            // get random value within empty cards amount
            const randomIndex = this.getRandomInt(0, emptyCardIndexArray.length - 1)
            // get card index from empty cards array
            const cardIndex = emptyCardIndexArray[randomIndex]
            // set value in cards array
            this.cardContentsArray[cardIndex] = {}
            this.cardContentsArray[cardIndex].value = value
            this.cardContentsArray[cardIndex].open = false
            // remove corresponding empty cards array element
            emptyCardIndexArray.splice(randomIndex, 1)
            // if we have an even amount of empty cards
            if (emptyCardIndexArray.length % 2 === 0) {
                // increment card value
                value++
            }
        }
    }

    handleCardClick = (i) => {
        if (this.state.mainState === MainStates.MEMORIZING ||
            this.state.mainState === MainStates.ROUND_END) {
            return
        }

        console.log("card click: " + i)

        this.cardContentsArray[i].open = true

        // if first card of a pair has been picked already
        if (this.state.firstCardOfPairPicked) {
            this.totalPairsCount++
            this.pairsOpenAmout++
            // if card value is same previous value
            if (this.firstCardOfPair === this.cardContentsArray[i].value) {
                // we do not have now first card of pair
                this.firstCardOfPair = undefined
                this.cardContentsArray[i].color = 'green'
                this.correctCount++
                // if 3 pairs have been opened correctly
                if (this.pairsOpenAmout === 3) {
                    this.correctCount++
                    this.totalPairsCount++
                    this.boardsCompletedCount++
                    this.totalBoardsCount++
                    this.pairsOpenAmout = 0
                    this.setState({ mainState: MainStates.ROUND_END, pairPickedCorrect: true, firstCardOfPairPicked: false })
                } else {
                    // show CORRECT text
                    this.setState({ mainState: MainStates.ROUND_ONGOING, pairPickedCorrect: true, firstCardOfPairPicked: false })
                }
            } else {
                // show WRONG text
                this.cardContentsArray[i].color = 'red'
                this.totalPairsCount = this.totalPairsCount + this.pairsOpenAmout
                this.pairsOpenAmout = 0
                this.totalBoardsCount++
                this.setState({ mainState: MainStates.ROUND_END, pairPickedCorrect: false, firstCardOfPairPicked: false })
            }
        } else { // do show anything, if no previous card (1st card of pair has been picked)
            // this card is now first card of pair
            this.firstCardOfPair = this.cardContentsArray[i].value
            this.cardContentsArray[i].color = 'green'
            this.setState({ mainState: MainStates.ROUND_ONGOING, firstCardOfPairPicked: true })
        }
    }

    cardBoardLayout = (cardsOpen) => {
        let table = []

        // Outer loop to create parent
        for (let i = 0; i < 2; i++) {
            let children = []
            //Inner loop to create children
            for (let j = 0; j < 4; j++) {
                const elementNumber = i * 4 + j
                let open
                // if user is memorizing
                if (this.state.mainState === MainStates.MEMORIZING ||
                    this.state.mainState === MainStates.ROUND_END) {
                    // card must be open
                    open = true
                } else { // if user is not memorizing
                    // check card openess individually
                    open = this.cardContentsArray[elementNumber].open
                }
                children.push(<td>
                    <Card
                        value={this.cardContentsArray[elementNumber].value}
                        index={elementNumber}
                        color={this.cardContentsArray[elementNumber].color}
                        open={open}
                        enableClick={this.state.mainState === MainStates.ROUND_START}
                        cardClickHandler={(elementNumber) => this.handleCardClick(elementNumber)}
                    />
                </td>)
            }
            //Create the parent and add the children
            table.push(<tr>{children}</tr>)
        }
        return table
    }


    render() {
        let cardsOpen = true
        let gameTotalsLayout = ''
        let instructionText = ''
        // show continue button and correct labels only, if user has given input
        let correctLabelLayout = ''
        let correctResultLayout = ''
        let continueButtonLayout = ''

        if (this.totalPairsCount > 0) {
            gameTotalsLayout =
                <div>
                    <p className="Boards-completed">
                        {this.boardsCompletedCount} of {this.totalBoardsCount} boards completed!
                    </p>
                    <p className="Pairs-correct">
                        {this.correctCount} of {this.totalPairsCount} pairs correct!
                    </p>
                </div>
        }

        if (this.state.mainState === MainStates.MEMORIZING) {
            instructionText = 'Try to memorize the card pairs!'
        } else if (this.state.mainState === MainStates.ROUND_START ||
            this.state.mainState === MainStates.ROUND_ONGOING) {
            instructionText = 'Pick Card Pairs!'
        }
        // show correctness text when round is ongoing AND 2nd card of pair is picked
        if ((this.state.mainState === MainStates.ROUND_ONGOING &&
            this.state.firstCardOfPairPicked === false) ||
            this.state.mainState === MainStates.ROUND_END) {
            let correct
            if (this.state.pairPickedCorrect) {
                correct = true
            } else {
                correct = false
            }
            correctLabelLayout =
                <div style={{ lineHeight: 4 }}>
                    <CorrectnessLabel correct={correct} />
                </div>
        }
        // show continue button when user is memorizing or round ended
        if (this.state.mainState === MainStates.MEMORIZING ||
            this.state.mainState === MainStates.ROUND_END) {
            let buttonText = 'Continue'
            if (this.state.mainState === MainStates.MEMORIZING) {
                buttonText = 'Start'
            }
            continueButtonLayout =
                <div style={{ lineHeight: 2 }}>
                    <Button
                        style={{ margin: "10px" }}
                        variant="primary"
                        onClick={this.handleContinueClick}>
                        {buttonText}
                    </Button>{' '}
                </div>
        }
        return (
            <div>
                <header className="App-header">
                    <div className="Rectangle">
                        {gameTotalsLayout}
                    </div>
                    <div className="Instructions">
                        {instructionText}
                    </div>
                </header>
                <body className="App-body">
                    <table>
                        <tbody>
                            {this.cardBoardLayout(cardsOpen)}
                        </tbody>
                    </table>
                    {correctLabelLayout}
                    {correctResultLayout}
                    {continueButtonLayout}
                </body>
            </div>
        );
    }
}

export default App;
