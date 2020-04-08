let timer = 0
let currentTime = new Date().getTime()
let futureTime = setTimer(25)
let timeLeft = (futureTime - currentTime) / 1000
let minutesLeft = 25
let secondsLeft = 00

/* What we're counting up to.*/
function setTimer(x) {
	const minutes = 1000 * 60
	return currentTime + (minutes * x)
}

document.querySelectorAll(".container__button").forEach(button => {
	button.addEventListener("click", (e) => {
		functions[e.target.id]();
	})
})

const functions = {
	"pomodoro": function() {
		alert("don't poke me!")
	},
	"short": function() {
		alert("don't poke me!")
	},
	"long": function() {
		alert("don't poke me!")
	},
	"start": function() {
		alert("don't poke me!")
	},
	"stop": function() {
		alert("don't poke me!")
	},
	"pause": function() {
		alert("don't poke me!")
	},
}