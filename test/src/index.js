const input = document.querySelector('#input');
const container = document.querySelector('#container');
console.log(input);

const changeContainerSize = (value) => {
	container.style.width = `${value}%`;
}
input.addEventListener('input', (e) => {
	console.log(e.currentTarget.value);
	changeContainerSize(e.currentTarget.value);
})


(changeContainerSize(input.value))();