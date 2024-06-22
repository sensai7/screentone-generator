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

function saveImage() { //fixme
    var img = document.getElementById('imgWrapper').getElementsByTagName('img')[0];
    if (img) {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(function(blob) {
            var url = URL.createObjectURL(blob);

            // Create a temporary <a> element and trigger download
            var a = document.createElement('a');
            a.href = url;
            a.download = 'image.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 'image/png');
    } else {
        alert('No image to save.');
    }
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
    const colorPicker2Container = document.getElementById('colorPicker2Container');
    const colorSwapButtonContainer = document.getElementById('colorSwapButton');
    const gradientDirContainer = document.getElementById("gradient-direction-container");
    colorPicker2Container.style.display = 'none';
    colorSwapButtonContainer.style.display = 'none';
    gradientDirContainer.style.display = 'none';

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
    const colorPicker2Container = document.getElementById('colorPicker2Container');
    const colorSwapButtonContainer = document.getElementById('colorSwapButton');
    const gradientDirContainer = document.getElementById("gradient-direction-container");
    colorPicker2Container.style.display = 'block';
    colorSwapButtonContainer.style.display = 'block';
    gradientDirContainer.style.display = 'flex';
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

    return selectedShape;
}