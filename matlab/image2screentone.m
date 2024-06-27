close all;
clear;
clc;

% tweakeable parameters
load('saved coefficients\sine_wave_coef.mat', 'coef');
image = imread('test images\monarch.png');
image = rgb2gray(image);
pixel_radius = 16;
angle = 45;
frequency = pi * 2 / pixel_radius;
[height, width] = size(image);


%% Direct algorithm time estimation

tic;
% periodic pattern creation
pattern = zeros(height, width);
for y = 1:height
    for x = 1:width
        xFreq = (x - 1) * frequency;
        yFreq = (y - 1) * frequency;
        value = coef_to_harmonic_series(xFreq, yFreq, coef, angle);
        pattern(y, x) = value;
    end
end

% normalize 0~255
max_val = max(max(pattern));
min_val = min(min(pattern));
pattern = (pattern - min_val) / (max_val - min_val) * 255;

% compute screentone
screentone_image_1 = pattern < image;

time_direct = toc;
disp(['Direct approach  Time elapsed = ' num2str(time_direct) 's']);


%% fast45 algorithm time estimation
% the generated pattern has periodicity of pixel_radius if the angle is 45 degrees

tic;
% periodic pattern creation
pattern = zeros(pixel_radius);
for y = 1:pixel_radius
    for x = 1:pixel_radius
        xFreq = (x - 1) * frequency;
        yFreq = (y - 1) * frequency;
        value = coef_to_harmonic_series(xFreq, yFreq, coef, angle);
        pattern(y, x) = value;
    end
end

% normalize 0~255
max_val = max(max(pattern));
min_val = min(min(pattern));
pattern = (pattern - min_val) / (max_val - min_val) * 255;

% compute screentone
screentone_image_2 = zeros(height, width);
for y = 1:height
    for x = 1:width
        x_get = mod(x, pixel_radius);
        y_get = mod(y, pixel_radius);
        if x_get == 0
            x_get = pixel_radius;
        end
        if y_get == 0
            y_get = pixel_radius;
        end
        screentone_image_2(y, x) = pattern(y_get, x_get) < image(y, x);
    end
end


time_direct = toc;
disp(['Fast45.          Time elapsed = ' num2str(time_direct) 's']);



%% plot
% figure('Position', [1750, 100, 700, 1000]);
% title(['Direct approach  Time elapsed = ' num2str(time_direct) 's']);
% subplot(3, 1, 1);
% imshow(image);
% subplot(3, 1, 2);
% imshow(screentone_image_1);
% subplot(3, 1, 3);
% imshow(screentone_image_2);
