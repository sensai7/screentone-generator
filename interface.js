function syncSliderText(whichOne) {
	var sliderName = whichOne + "Slider";
	var textName = whichOne + "Text";
	const slider = document.getElementById(sliderName);
	const text = document.getElementById(textName);
	text.value = slider.value;
}

function syncTextSlider(whichOne) {
	var sliderName = whichOne + "Slider";
	var textName = whichOne + "Text";
	const slider = document.getElementById(sliderName);
	const text = document.getElementById(textName);
	if ((text.value < 2) && (whichOne == "size")) text.value = 2;
	if (text.value > 100) text.value = 100;
	slider.value = text.value;
}

function handleColorChange(picker) {
	const grayscaleColor = toGrayscale(picker.value);
	picker.value = grayscaleColor;
	refresh();
}

function toGrayscale(hex) {
	const r = parseInt(hex.substr(1, 2), 16);
	const g = parseInt(hex.substr(3, 2), 16);
	const b = parseInt(hex.substr(5, 2), 16);
	const avg = Math.round((r + g + b) / 3);
	const grayHex = avg.toString(16).padStart(2, '0');
	return `#${grayHex}${grayHex}${grayHex}`;
}

function copyToClipboard() {
	var img = document.getElementById('imgWrapper').getElementsByTagName('img')[0];
	if (img) {
		var canvas = document.createElement('canvas');
		canvas.width = img.width;
		canvas.height = img.height;
		var ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0);

		canvas.toBlob(function(blob) {
			var item = new ClipboardItem({ 'image/png': blob });
			navigator.clipboard.write([item]).then(function() {
				console.log('Image copied to clipboard.');
				//alert('Image copied to clipboard.');
			}, function(error) {
				console.error('Unable to copy image: ', error);
				alert('Unable to copy image.');
			});
		}, 'image/png');
	} else {
		alert('No image to copy.');
	}
}

function saveImage() {
	const image = document.getElementById("imgWrapper").querySelector("img");

	if (!image) {
	console.error("No image found in #imgWrapper");
	return;
	}

	const dataURL = image.src.replace(/^data:image\/[a-z]+;base64,/, "");
	const formattedDataURL = `data:image/png;base64,${dataURL}`;

	const link = document.createElement("a");
	link.href = formattedDataURL;
	link.download = "screentone.png"; 

	link.dispatchEvent(new MouseEvent("click"));
}


function swapColors() {
	const colorPicker1 = document.getElementById('colorPicker1');
	const colorPicker2 = document.getElementById('colorPicker2');
	const tempColor = colorPicker1.value;
	colorPicker1.value = colorPicker2.value;
	colorPicker2.value = tempColor;
	refresh();
}

function createFlatImageData(canvas){
	const colorPickers = document.getElementById('colorPickers');
	const imageUpload = document.getElementById('imageUpload');
	const colorPicker2Container = document.getElementById('colorPicker2Container');
	const colorSwapButtonContainer = document.getElementById('colorSwapButton');
	const gradientDirContainer = document.getElementById("gradient-direction-container");
	const imageSizeContainer = document.getElementById("imageSizeContainer");
	colorPicker2Container.style.display = 'none';
	colorSwapButtonContainer.style.display = 'none';
	gradientDirContainer.style.display = 'none';
	imageUpload.style.display = 'none';
	colorPickers.style.display = 'flex';
	imageSizeContainer.style.display = 'flex';

	// solidcolor
	var colorPicker = document.getElementById('colorPicker1');
	var selectedColor = colorPicker.value;
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = selectedColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	return imageData;
}


function createGradientImageData(canvas){
	const colorPickers = document.getElementById('colorPickers');
	const imageUpload = document.getElementById('imageUpload');
	const colorPicker2Container = document.getElementById('colorPicker2Container');
	const colorSwapButtonContainer = document.getElementById('colorSwapButton');
	const gradientDirContainer = document.getElementById("gradient-direction-container");
	const imageSizeContainer = document.getElementById("imageSizeContainer");
	colorPicker2Container.style.display = 'block';
	colorSwapButtonContainer.style.display = 'block';
	gradientDirContainer.style.display = 'flex';
	imageUpload.style.display = 'none';
	colorPickers.style.display = 'flex';
	imageSizeContainer.style.display = 'flex';

	// gradient
	var colorPicker1 = document.getElementById('colorPicker1');
	var colorPicker2 = document.getElementById('colorPicker2');
	var color1 = colorPicker1.value;
	var color2 = colorPicker2.value;
	var ctx = canvas.getContext('2d');

	const radioButtons = document.querySelectorAll('input[name="gradient-direction"]');

	let selectedValue;
	for (const radioButton of radioButtons) {
	  if (radioButton.checked) {
		selectedValue = radioButton.value;
		break; // Exit the loop once a checked button is found
	  }
	}
	if (selectedValue == 1){ // vertical
		var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
	}else if (selectedValue == 2){ //horizontal
		var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
	}
	
	gradient.addColorStop(0, color1);
	gradient.addColorStop(1, color2);
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

	return imageData;
}

function createUploadedImageDataInterface(){
	const imageSizeContainer = document.getElementById("imageSizeContainer");
	const colorPickers = document.getElementById('colorPickers');
	const imageUpload = document.getElementById('imageUpload');
	const gradientDirContainer = document.getElementById("gradient-direction-container");
	imageUpload.style.display = 'flex';
	colorPickers.style.display = 'none';
	gradientDirContainer.style.display = 'none';
	imageSizeContainer.style.display = 'none';

	//todo
}

function getSelectedShape(){
	const shapes = document.getElementsByName('shape');
	let selectedShape = null;

	// Iterate through the radio buttons to find the checked one
	for (let i = 0; i < shapes.length; i++) {
		if (shapes[i].checked) {
			selectedShape = shapes[i].value;
			break;
		}
	}

	showCoefContainer(selectedShape);

	return selectedShape;
}

function showCoefContainer(selectedShape) {
  const coefContainer = document.getElementById("coef-container");
  if (selectedShape === "harmonic") {
    coefContainer.style.display = "block";
  } else {
    coefContainer.style.display = "none";
  }
}

function generateCoefficients() {
	for (let i = 1; i <= 8; i++) {
		const denominator = i; // Use i as the denominator for decreasing range
		const lowerBound = -1 / denominator;
		const upperBound = 1 / denominator;
		const randomValue = (Math.random() * (upperBound - lowerBound)) + lowerBound;
		document.getElementById(`coef${i}`).value = randomValue.toFixed(2);
	}
	refresh();
}

function createUploadedImageData() {
    return new Promise((resolve, reject) => {
        const fileInput = document.getElementById('upload');
        const file = fileInput.files[0];

        if (!file) {
            reject('No file selected');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.getElementById('canvas');
                const context = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0, img.width, img.height);
                const imageData = context.getImageData(0, 0, img.width, img.height);
                resolve(imageData);
            };
            img.onerror = function() {
                reject('Error loading image');
            };
            img.src = event.target.result;
        };
        reader.onerror = function() {
            reject('Error reading file');
        };
        reader.readAsDataURL(file);
    });
}