document.addEventListener("DOMContentLoaded", () => {
	const typeDropdown = document.getElementById("type");
	const attributesDropdown = document.getElementById("attribute");

	// Parse selectableFields passed as a prop to the script tag
	const selectableFields = JSON.parse(document.querySelector('script[src="/js/configurable-presentation.js"]').dataset.fields);

	const updateAttributesDropdown = (type) => {
		// Clear existing options in the attributes dropdown
		attributesDropdown.innerHTML = "";

		// Clear the selected attributes list
		const selectedAttributesList = document.querySelector("#selectedAttributes");
		selectedAttributesList.innerHTML = `<li class="empty-placeholder">No attributes added yet.</li>`;

		// Filter selectableFields based on the selected type
		const filteredFields =
			type === "mdoc"
				? selectableFields.filter(([label, value]) => value.includes("eu.europa.ec.eudi"))
				: selectableFields.filter(([label, value]) => !value.includes("eu.europa.ec.eudi"));

		// Populate the attributes dropdown with filtered fields
		filteredFields.forEach(([label, value]) => {
			const option = document.createElement("option");
			option.value = value;
			option.textContent = `${label}`;
			attributesDropdown.appendChild(option);
		});
	};

	// Initial population based on the default type
	updateAttributesDropdown(typeDropdown.value);

	// Update attributes dropdown and clear selected attributes when type changes
	typeDropdown.addEventListener("change", (event) => {
		updateAttributesDropdown(event.target.value);
	});

});


document.addEventListener("DOMContentLoaded", () => {
	const attributeDropdown = document.querySelector("#attribute");
	const selectedAttributesList = document.querySelector("#selectedAttributes");

	attributeDropdown.addEventListener("change", () => {
		const selectedOptions = Array.from(attributeDropdown.selectedOptions);

		selectedOptions.forEach((option) => {
			const attributeValue = option.value;
			const attributeText = option.textContent;

			// Check if attribute is already added
			if (!selectedAttributesList.querySelector(`[data-attribute="${attributeValue}"]`)) {
				const attributeContainer = document.createElement("li");
				attributeContainer.classList.add("attribute-item");
				attributeContainer.setAttribute("data-attribute", attributeValue);

				attributeContainer.innerHTML = `
          <span class="attribute-name">${attributeText}</span>
          <input type="hidden" name="attributes[]" value="${attributeValue}">
					<input type="hidden" name="optional[]" value="false" class="optional-field">	
					<div class="container-switch">
					<span class="toggle-label">Required</span>
					<label class="switch">
						<input type="checkbox" checked disabled>
						<span class="slider round"></span>
					</label>
					</div>
					<button class="btn-delete" type="button" data-attribute="${attributeValue}" onclick="removeAttributeField(this)">
						<i class="fa fa-trash"></i> Delete
					</button>
        `;

				selectedAttributesList.appendChild(attributeContainer);
			}

			// Remove from dropdown
			option.remove();
		});

		// Hide placeholder if attributes are added
		const placeholder = selectedAttributesList.querySelector(".empty-placeholder");
		if (placeholder) placeholder.style.display = "none";
	});
});

// Remove attribute field and add it back to the dropdown
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

	// Show placeholder if no attributes remain
	const selectedAttributesList = document.querySelector("#selectedAttributes");
	if (!selectedAttributesList.querySelector(".attribute-item")) {
		const placeholder = selectedAttributesList.querySelector(".empty-placeholder");
		if (placeholder) placeholder.style.display = "block";
	}
}
