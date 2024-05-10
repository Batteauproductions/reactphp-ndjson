// JavaScript function to shift letters in the input field, remove spaces, and insert a space after each 5th character
function shiftLetters() {
	// Get the input element by its ID
	var inputField = document.getElementById("input-text");
  
	// Get the value from the input field
	var inputValue = inputField.value.toUpperCase();
  
	// Define the amount by which the letters should be shifted (e.g., 3 for shifting A to D)
	var shiftAmount = document.getElementById("shift-amount");
	var shiftCodex 	= shiftAmount.options[shiftAmount.selectedIndex].text;
	var shiftValue 	= parseInt(shiftAmount.value);
	
	// Convert the input value to an array of characters
	var inputChars = inputValue.split('');
  
	// Iterate over each character and shift it
	for (var i = 0; i < inputChars.length; i++) {
		var char = inputChars[i];
		// Check if the character is an uppercase letter (A-Z)
		if (char >= 'A' && char <= 'Z') {
			// Shift the letter by the shiftValue while keeping it within the alphabet range (A-Z)
			var shiftedCharCode = ((char.charCodeAt(0) - 65 + shiftValue) % 26) + 65;
			var shiftedChar = String.fromCharCode(shiftedCharCode);
			inputChars[i] = shiftedChar;
		} else {
			inputChars[i] = '';
		}
	}
  
	// Join the array back to a string
	var shiftedValue = inputChars.join('');

	// Remove all spaces from the shifted result
	var resultWithoutSpaces = shiftedValue.replace(/\s/g, '');

	// Insert a space after each 5th character
	var resultWithSpaces = resultWithoutSpaces.replace(/(.{4})/g, "$1 ");
	
	if (resultWithoutSpaces.length > 1) {
		$('#copy-letters').attr('disabled',false);
		// Update the "result-codex" div with the shifted result with spaces after each 5th character
		document.getElementById("result-codex").textContent = shiftCodex+' '+resultWithSpaces;

	} else {
		$('#copy-letters').attr('disabled',true);
	}

}

function copyToClipboard() {
	// Get the "result-codex" div element
	var resultCodex = document.getElementById("result-codex");

	// Create a range to select the text
	var range = document.createRange();
	range.selectNode(resultCodex);

	// Select the text inside the range
	var selection = window.getSelection();
	selection.removeAllRanges();
	selection.addRange(range);

	// Execute the "copy" command to copy the selected text to the clipboard
	document.execCommand("copy");

	// Remove the selection to avoid any visual changes
	selection.removeAllRanges();

}