import React from 'react';
import textFile from './textFile.json';

class TypingTest extends React.Component {
    state = {
        text: '',
        inputValue: '',
        lastLetter: '',
        words: [],
        completedWords: [],
        completed: false,
        startTime: 0,
        timeElapsed: 0,
        wpm: 0,
        started: false,
        progress: 0
    };

    setText = () => {
        const texts = textFile;
        const text = texts[Math.floor(Math.random() * texts.length)];
        const words = text.split(' ');

        this.setState({
            text,
            words,
            completeWords: []
        });
    };

    startGame = () => {
		this.setText();

		this.setState({
			started: true,
			startTime: Date.now(),
			completed: false,
			progress: 0
		});
    };

    quitGame = () => {
        this.setState({
            started: false
        });
    };
    
    handleChange = e => {
		const { words, completedWords } = this.state;
		const inputValue = e.target.value;
		const lastLetter = inputValue[inputValue.length - 1];

		const currentWord = words[0];

		// if space or '.', check the word
		if (lastLetter === ' ' || lastLetter === '.') {
			// check to see if it matches to the currentWord
			// trim because it has the space
			if (inputValue.trim() === currentWord) {
				// remove the word from the wordsArray
				// cleanUp the input
				const newWords = [...words.slice(1)];
				const newCompletedWords = [...completedWords, currentWord];

				// Get the total progress by checking how much words are left
				const progress =
					(newCompletedWords.length /
						(newWords.length + newCompletedWords.length)) *
					100;
				this.setState({
					words: newWords,
					completedWords: newCompletedWords,
					inputValue: '',
					completed: newWords.length === 0,
					progress
				});
			}
		} else {
			this.setState({
				inputValue,
				lastLetter
			});
		}

		this.calculateWPM();
    };
    
    calculateWPM = () => {
		const { startTime, completedWords } = this.state;
		const now = Date.now();
		const diff = (now - startTime) / 1000 / 60; // 1000 ms / 60 s

		// every word is considered to have 5 letters
		// so here we are getting all the letters in the words and divide them by 5
		// "my" shouldn't be counted as same as "deinstitutionalization"
		const wordsTyped = Math.ceil(
			completedWords.reduce((acc, word) => (acc += word.length), 0) / 5
		);

		// calculating the wpm
		const wpm = Math.ceil(wordsTyped / diff);

		this.setState({
			wpm,
			timeElapsed: diff
		});
	};

    render() {
        const { text, inputValue, completedWords, wpm, timeElapsed, started, completed, progress } = this.state;

        if(!started) {
            return (
                <div className='container'>
                    <h2>Welcome to the Typing Test</h2>
                    <p>
                        <strong>Rules:</strong> <br />
                        Type the highlighted word in the input field. <br />
                        The correct words will turn <span className='green'>green</span>.
                        <br />
                        Incorrect letters will turn <span className='red'>red</span>.
                        <br />
                        <br />
                        Have fun! 😃
                    </p>
                    <button className='start-btn' onClick={this.startGame}>
                        Start game
                    </button>
                </div>
            )
        }

        if(!text) {
            return (
                <p>Loading...</p>
            );
        }

        if(completed) {
            return (
                <div className='container'>
					<h2>
						Your WPM is <strong>{wpm}</strong>
					</h2>
					<button className='start-btn' onClick={this.startGame}>
						Play again
					</button>
                    <p>or</p>
					<p>
                    <button className='quit-btn' onClick={this.quitGame}>
						Go to main menu
					</button>
					</p>
				</div>
            )
        }

        return (
            <div>
				<div className='wpm'>
					<strong>WPM: </strong>
					{wpm}
					<br />
					<strong>Time: </strong>
					{Math.floor(timeElapsed * 60)}s
				</div>
				<div className='container'>
					<h4>Type the text below</h4>
					<progress value={progress} max='100'></progress>
					<p className='text'>
						{text.split(' ').map((word, w_idx) => {
							let highlight = false;
							let currentWord = false;

							// this means that the word is completed, so turn it green
							if (completedWords.length > w_idx) {
								highlight = true;
							}

							if (completedWords.length === w_idx) {
								currentWord = true;
							}

							return (
								<span
									className={`word 
                                ${highlight && 'green'} 
                                ${currentWord && 'underline'}`}
									key={w_idx}>
									{word.split('').map((letter, l_idx) => {
										const isCurrentWord = w_idx === completedWords.length;
										const isWronglyTyped = letter !== inputValue[l_idx];
										const shouldBeHighlighted = l_idx < inputValue.length;

										return (
											<span
												className={`letter ${
													isCurrentWord && shouldBeHighlighted
														? isWronglyTyped
															? 'red'
															: 'green'
														: ''
												}`}
												key={l_idx}>
												{letter}
											</span>
										);
									})}
								</span>
							);
						})}
					</p>
					<input
						type='text'
						onChange={this.handleChange}
						value={inputValue}
						autofocus={started ? 'true' : 'false'}
					/>
				</div>
			</div>
        );
    }
}

export default TypingTest;