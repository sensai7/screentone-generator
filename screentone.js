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
    const pattern = [];

    if (shape != "random"){
        // Corrections
        var angleCorrection = 0;
        switch (shape) {
        	case 'sine-cosine':
            	angleCorrection = 90;
                break;
        	case 'circles':
            	angleCorrection = 45;
            	frequency = frequency / Math.sqrt(2);
                break;
        	case 'lines':
            	angleCorrection = 45;
            	frequency = frequency / Math.sqrt(2);
                break;
        	case 'rounded-squares':
            	angleCorrection = 135;
            	frequency = frequency / Math.sqrt(2);
                break;
            case 'squiggly-lines':	
            	angleCorrection = 135;
            	frequency = frequency / Math.sqrt(2);
            	break;
            case 'lemons':	
            	frequency = frequency / Math.sqrt(2);
            	angleCorrection = 135;
            	break;
            }

        const radians = (angle + angleCorrection) * Math.PI / 180;
        const sin = Math.sin(radians);
        const cos = Math.cos(radians);

        for (let y = 0; y < height; y++) {
            pattern[y] = [];
            for (let x = 0; x < width; x++) {
                let value;
                const xFreq = x * frequency;
                const yFreq = y * frequency;

                switch (shape) {
                    case 'sine-cosine':
                        value = Math.sin(xFreq * cos - yFreq * sin) * Math.cos(xFreq * sin + yFreq * cos + Math.PI/2);
                        break;
                    case 'circles':
                        value = Math.abs(Math.sin(xFreq * cos - yFreq * sin + Math.PI/2)) + Math.abs(Math.cos(xFreq * sin + yFreq * cos + Math.PI/2 ));
                        break;
                    case 'lines':
                        value = Math.sin(xFreq * cos - yFreq * sin);
                        break;
                    case 'rounded-squares':
                        value = Math.abs(Math.sin(xFreq * cos - yFreq * sin)) * Math.abs(Math.cos(xFreq * sin + yFreq * cos)) *2;
                        break;
                    case 'cross':
                        value = Math.abs(Math.sin(xFreq * cos - yFreq * sin)) + Math.cos(xFreq * sin + yFreq * cos);
                        break;
                    case 'lemons':
                        value = Math.abs(Math.sin(xFreq * cos - yFreq * sin )) - Math.abs(Math.cos(xFreq * sin + yFreq * cos + Math.PI/2 ));
                        break;
                    case 'squiggly-lines':
                        value = Math.abs(Math.sin(xFreq * cos - yFreq * sin)) + Math.cos(xFreq * sin + yFreq * cos + Math.PI/2 );
                        break;

                }
                pattern[y][x] = (value+1) * 128;
            }
        }

     	var minValue = pattern[0][0];
     	var maxValue = pattern[0][0];
     	for (let i = 0; i < pattern.length; i++) {
     	  for (let j = 0; j < pattern[i].length; j++) {
     	    const value = pattern[i][j];
     	    minValue = Math.min(minValue, value);
     	    maxValue = Math.max(maxValue, value);
     	  }
     	}

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
            	pattern[y][x] = pattern[y][x] - minValue;
            	//pattern[y][x] = pattern[y][x] * 255 / maxValue; // 🤔 whats going on here?
            }
        }
    }else{
    	for (let y = 0; y < height; y++) {
    		pattern[y] = [];
    		for (let x = 0; x < width; x++) {
            	pattern[y][x] = getRandomIntInclusive(0, 255);
        	}
        }
    }
	
    return pattern;
}