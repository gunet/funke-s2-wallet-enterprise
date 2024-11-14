function addAttributeField() {
	const attributeDropdown = document.querySelector("#attribute");
	const attribute = attributeDropdown.value;
	const attributeText = attributeDropdown.options[attributeDropdown.selectedIndex].text;

	if (attribute) {
		const attributeContainer = document.createElement("div");
		attributeContainer.classList.add("attribute-item");
		attributeContainer.setAttribute("data-attribute", attribute);

		attributeContainer.innerHTML = `
					<span class="attribute-name">${attributeText}</span>
					<input type="hidden" name="attributes[]" value="${attribute}">
					<input type="hidden" name="optional[]" value="false" class="optional-field">
					
					<label class="switch">
						<input type="checkbox" checked disabled>
						<span class="slider round"></span>
					</label>
					<span class="toggle-label">Required</span>
					<button type="button" data-attribute="${attribute}" onclick="removeAttributeField(this)">Delete</button>
				`;

		document.querySelector("#selectedAttributes").appendChild(attributeContainer);
		attributeDropdown.remove(attributeDropdown.selectedIndex);
		attributeDropdown.value = "";
	}
}

function removeAttributeField(button) {
	const attributeContainer = button.parentElement;
	const attributeDropdown = document.querySelector("#attribute");

	const attributeValue = button.getAttribute("data-attribute");
	const attributeText = attributeContainer.querySelector(".attribute-name").textContent;

	// Re-add the option to the dropdown with the correct value and text
	const option = document.createElement("option");
	option.value = attributeValue;
	option.textContent = attributeText;
	attributeDropdown.appendChild(option);

	attributeContainer.remove();
}