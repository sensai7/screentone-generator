function getRandomIntInclusive(min, max) {
  	min = Math.ceil(min);
  	max = Math.floor(max);
  	return Math.floor(Math.random() * (max - min + 1)) + min;
}


function applyScreentone(imageData, width, height, frequency, angle, shape) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    const outputData = ctx.createImageData(width, height);

    const thresholdPattern = createThresholdPattern(width, height, frequency, angle, shape);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const gray = (imageData[index] + imageData[index + 1] + imageData[index + 2]) / 3;
            const threshold = thresholdPattern[y % thresholdPattern.length][x % thresholdPattern[0].length];
            const color = gray < threshold ? 0 : 255;

            outputData.data[index] = color;
            outputData.data[index + 1] = color;
            outputData.data[index + 2] = color;
            outputData.data[index + 3] = 255; // Alpha channel
        }
    }

    return outputData;
}

function createThresholdPattern(width, height, frequency, angle, shape) {

	var coef;
	// corrections:
    switch (shape) {
	    case 'sine-cosine':
	    	angle = angle - 45;
	        break;
	    case 'circles':
	    	frequency = frequency / Math.sqrt(2);
	        break;
	    case 'lines':
	    	break;
	    case 'squares':
	    	angle = angle - 45;
	    	break;
	    case 'sparkles':
			angle = angle - 45;
	    	break;
	    case 'inception':
			angle = angle - 45;
	    	break;
	    case 'flowers':
			angle = angle - 45;
	    	break;
	    case 'harmonic':
			angle = angle - 45;
			coef = getHarmonicCoef();
	    	break;
    }

    // angle things
	angle = angle * Math.PI / 180;
	cosAngle = Math.cos(angle);
	sinAngle = Math.sin(angle);

    var pattern = [];
    if (shape != "random"){
       for (let y = 0; y < height; y++) {
            pattern[y] = [];
            for (let x = 0; x < width; x++) {
                let value;
		        switch (shape) {
                    case 'sine-cosine':
                    	transformX = x * frequency * Math.cos(angle) - y * frequency * Math.sin(angle);
    					transformY = x * frequency * Math.sin(angle) + y * frequency * Math.cos(angle);
                        value = Math.cos(transformX) * Math.cos(transformY);
                        break;
	                case 'circles':
                    	transformX = x * frequency * Math.cos(angle) - y * frequency * Math.sin(angle);
    					transformY = x * frequency * Math.sin(angle) + y * frequency * Math.cos(angle);
                        value = Math.abs(Math.sin(transformX)) + Math.abs(Math.cos(transformY));
                        break;
                    case 'lines':
                    	transformX = x * frequency * Math.cos(angle) - y * frequency * Math.sin(angle);
                    	value = Math.cos(transformX);
                    	break;
                    case 'squares':
                    	value = coef2HarmonicSeries(x, y, frequency, [1, 0, 0.11111, 0, 0.04, 0, 0.02041, 0, 0.01234, 0, 0.00826], angle);
                    	break;
                    case 'sparkles':
                    	value = coef2HarmonicSeries(x, y, frequency, [1, 0, 0.22222, 0, 0.12, 0, 0.0816, 0, 0.0617], angle);
                    	break;
                    case 'inception':
                    	value = coef2HarmonicSeries(x, y, frequency, [1, 0, 0, 0, 1], angle);
                    	break;
                    case 'flowers':
                    	value = coef2HarmonicSeries(x, y, frequency, [1, 0.5, 1.25, 1/6, 1/8, 0.1], angle);
                    	break;
                    case 'harmonic':
						value = coef2HarmonicSeries(x, y, frequency, coef, angle);
	    				break;
	            }
                pattern[y][x] = value;
          	}
    	}

    	minVal = minValue(pattern);
    	maxVal = maxValue(pattern);
    	pattern = normalize2D(pattern, minVal, maxVal);

    }else{ // random pixels
    	for (let y = 0; y < height; y++) {
    		pattern[y] = [];
    		for (let x = 0; x < width; x++) {
            	pattern[y][x] = getRandomIntInclusive(0, 255);
        	}
        }
    }

    return pattern;
}

function maxValue(arr){
	let maxVal = -Infinity;
	for (let i = 0; i < arr.length; i++) {
  		for (let j = 0; j < arr[i].length; j++) {
    		if (arr[i][j] > maxVal) {
      			maxVal = arr[i][j];
    		}
  		}
	}
	return maxVal;
}

function minValue(arr){
	let minVal = Infinity;
	for (let i = 0; i < arr.length; i++) {
  		for (let j = 0; j < arr[i].length; j++) {
    		if (arr[i][j] < minVal) {
      			minVal = arr[i][j];
    		}
  		}
	}
	return minVal;
}

function normalize2D(arr, min, max){
	for (let i = 0; i < arr.length; i++) {
  		for (let j = 0; j < arr[i].length; j++) {
    		arr[i][j] = (arr[i][j] - min) / (max - min) * 255;
    	}
    }
    return arr;
}

function coef2HarmonicSeries(x, y,  frequency, coefTable, angle){
    var xFreq = (x - 1) * frequency;
	var yFreq = (y - 1) * frequency;

    var transform_x = xFreq * Math.cos(angle) - yFreq * Math.sin(angle);
    var transform_y = xFreq * Math.sin(angle) + yFreq * Math.cos(angle);

    var result = 0;
    for (var i = 0; i < coefTable.length; i++) {
    	result +=  coefTable[i] * Math.cos((i+1) * transform_x) * Math.cos((i+1) * transform_y);
    }

    return result;
}

function getHarmonicCoef() {
  const coefficients = [
    document.getElementById('coef1').value,
    document.getElementById('coef2').value,
    document.getElementById('coef3').value,
    document.getElementById('coef4').value,
    document.getElementById('coef5').value,
    document.getElementById('coef6').value,
    document.getElementById('coef7').value,
    document.getElementById('coef8').value,
  ];
  return coefficients;
}