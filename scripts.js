let timer = 0

document.querySelectorAll('container__button').forEach(button, => {
    button.addEventListener('click', () => alert('Ouch! Stop poking me!'));
})