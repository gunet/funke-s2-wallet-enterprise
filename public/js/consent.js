setTimeout(() => {
	const spinnerContainer = document.getElementById('spinner-container');
	const mainContainer = document.getElementsByClassName('layout')[0];

	if (spinnerContainer && mainContainer) {
		spinnerContainer.style.display = 'none'; // Hide the spinner
		mainContainer.style.display = 'block'; // Show the main content
	}
}, 1500); // Hide the spinner after 2000 milliseconds (2 seconds)

const layout = document.querySelector('.layout');

const cards = document.querySelectorAll('.credential-card');
const selectCard = document.querySelectorAll('.toggle-card');
const toggleButtons = document.querySelectorAll('.toggle-details');

const form = document.querySelector('#DiplomaSelection');
const submitMultiButton = document.querySelector('.GetMultiBtn');
const barBtnContainer = document.querySelector('.BarBtnContainer');

function deselectAllCards() {
	deselectAllInputs();
	document.querySelectorAll('.credential').forEach(credential => {
		credential.classList.remove('selected');
	});
}

function hideAllDropdowns() {
	deselectAllInputs();
	cards.forEach(card => hideDropdown(card));
}

function hideDropdown(card) {

	const details = card.querySelector('.details');
	const arrowDown = card.querySelector('.arrowDown');
	card.classList.remove('expanded');

	details.style.maxHeight = '0';
	arrowDown.style.display = 'none';
}

function showDropdown(card) {

	hideAllDropdowns();

	const details = card.querySelector('.details');
	const arrowDown = card.querySelector('.arrowDown');

	details.style.maxHeight = `${details.scrollHeight}px`;
	arrowDown.style.display = 'block';

	card.classList.add('expanded');
}

selectCard.forEach(selectCard => {
	selectCard.addEventListener('click', (e) => {

		const button = e.target.closest('.toggle-card');
		const thisId = button.id;
		const card = document.getElementById(thisId).parentElement;

		if (layout.classList.contains('multi')) {
			e.target.classList.toggle('selected');
			toggleInput(thisId);
		}
	});
});

toggleButtons.forEach(toggleButton => {
	toggleButton.addEventListener('click', (e) => {

		const button = e.target.closest('.toggle-details');
		const thisId = button.id;
		const card = document.getElementById(thisId).parentElement;
		const showText = card.querySelector('.show-text');
		const hideText = card.querySelector('.hide-text');




			if (card.classList.contains('expanded')) {
				hideDropdown(card);
				// deselectInput(thisId);
				showText.style.display = 'inline';
				hideText.style.display = 'none';
			} else {
				showDropdown(card);
				// selectInput(thisId);
				showText.style.display = 'none';
				hideText.style.display = 'inline';
			}
	});
});


const selectMultiButton = document.querySelector('.SelectMultiBtn');
const consentDescription = document.querySelector('.consent-description');
const isSelectedCircle = document.querySelector('.is-selected');
const barBtn = document.querySelector('#BarBtn');


	selectMultiButton.classList.toggle('toggled');
	barBtnContainer.classList.toggle('multi');
	layout.classList.toggle('multi');

		// selectMultiButton.innerHTML = "Cancel";
		consentDescription.innerHTML = "Select your credentials by clicking on them and authorize the sharing of all selected credentials with the client";
		hideAllDropdowns();

function deselectInput(value) {
	const inputs = document.querySelectorAll('input');

	inputs.forEach(input => {
		if (input.value === value)
			input.disabled = true;
	});

	if (!isOneInputEnabled())
		disableSubmitButtons();

}

function selectInput(value) {
	const inputs = document.querySelectorAll('input');

	inputs.forEach(input => {
		if (input.value === value)
			input.disabled = false;
	});

	enableSubmitButtons();
}

function toggleInput(value) {
	const inputs = document.querySelectorAll('input');

	inputs.forEach(input => {
		if (input.value === value) {
			input.disabled = !input.disabled;
		}

		if (isOneInputEnabled()) {
			enableSubmitButtons();
		}
		else {
			disableSubmitButtons();
		}
	});
}

function deselectAllInputs() {
	const inputs = document.querySelectorAll('input:not([type=checkbox])');
	inputs.forEach(input => input.disabled = true);
	disableSubmitButtons();
}

submitMultiButton.addEventListener('click', (e) => {
	e.preventDefault();

	let enabledInputFlag = isOneInputEnabled();
	if (enabledInputFlag)
		form.submit();
	else
		noCredentialsError();
});

function noCredentialsError(timeout = 3000) {

	const errorText = document.querySelector('#NoCredentialSelectedError');

	errorText.classList.remove('Hidden');

	setTimeout(() => {
		errorText.classList.add('Hidden');
	}, timeout);
}

function isOneInputEnabled() {
	let enabledInputFlag = false;
	const inputs = document.querySelectorAll('input');
	for (const input of inputs) {
		if (input.disabled === false) {
			enabledInputFlag = true;
			break;
		}
	};

	return enabledInputFlag;
}

barBtn.addEventListener('click', (e) => {
	let enabledInputFlag = isOneInputEnabled();
	if (enabledInputFlag)
		form.submit();
	else
		noCredentialsError();
})

function disableSubmitButtons() {
	submitMultiButton.disabled = true;
	barBtn.disabled = true;
}

function enableSubmitButtons() {
	submitMultiButton.disabled = false;
	barBtn.disabled = false;
}