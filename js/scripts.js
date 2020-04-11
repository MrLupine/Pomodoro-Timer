document.querySelectorAll(".container__button").forEach(button => {
	button.addEventListener("click", (e) => {
		timerButtonsMap[`${e.target.id}`]();
	})
})

const timerButtonsMap = {
	"pomodoro": () => {
		timerFunctions.pomodoroCount += 1;
		timerFunctions.timerType = "pomodoro";
		document.getElementById("container__clock--timer").innerHTML = "25:00";
		startStop(minToMil(0.1));
	},
	"short": () => {
		timerFunctions.timerType = "short";
		document.getElementById("container__clock--timer").innerHTML = "05:00";
		startStop(minToMil(0.05));
	},
	"long": () => {
		timerFunctions.pomodoroCount = 0;
		timerFunctions.timerType = "long";
		document.getElementById("container__clock--timer").innerHTML = "10:00";
		startStop(minToMil(0.2));
	},
	"start": () => {
		startStop(timerFunctions.milliseconds);
	},
	"stop": () => {
		stopIfStarted();
		timerFunctions.timeReset();
		document.getElementById("container__clock--timer").innerHTML = "00:00";
	},
	"pause": () => {
		stopIfStarted();
	},
}

const stopIfStarted = () => {
	if (timerFunctions.timerType) {
		clearInterval(countdownTimer)
	}
}

/*
* Holds time left for countdown, allowing pause and stop functions.
*/
const timerFunctions = {
	milliseconds: 0,
	timerType: "",
	pomodoroCount: 0,
	timeReset: () => timerFunctions.milliseconds = 0
}

function minToMil(minutes) {
	return minutes * 1000 * 60;
}

/*
* On start or stop, calculate new future time to count up to.
*/
const startStop = milliseconds => {
	const currentTime = new Date().getTime();
	const futureTime = currentTime + milliseconds;
	countdownTimer = setInterval(timerOutput, 1000, futureTime);
}

let timerOutput = (futureTime) => {
	const timerType = (timerFunctions.timerType === "pomodoro") ? true : false
	const clockTimer = document.getElementById("container__clock--timer");
	let currentTime = new Date().getTime();
	let countdownMilliseconds = futureTime - currentTime
	const doubleDigitCheck = digit => digit < 10 ? `0${digit}` : digit < 0 ? "00" : `${digit}`; // if digit doesn't have a tenths place, place a zero before digit
	let minutes = Math.floor((countdownMilliseconds + 1000) / 60000); // add one second locally to minutes so that minutes change at correct time
	let seconds = ((countdownMilliseconds % 60000) / 1000).toFixed(0);
	const secondsCheck = (x) => (x === "60") ? 00 : Number(x); // on 60 seconds left, display "00" instead
	clockTimer.innerHTML = `${doubleDigitCheck(minutes)}:${doubleDigitCheck(secondsCheck(seconds))}`;
	timerFunctions.milliseconds = countdownMilliseconds;
	if (countdownMilliseconds < 0 && timerType) {
	 	clearInterval(countdownTimer)
	 	
	 	if (timerFunctions.pomodoroCount < 5) {
	 		timerButtonsMap["short"]()
	 	} else {
		timerButtonsMap["long"]()
		}
	 } else if (countdownMilliseconds < 0 && !timerType){
	 	clearInterval(countdownTimer)
	 	
		timerButtonsMap["pomodoro"]()
	 }
};