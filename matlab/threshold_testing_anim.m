close all;
clear;
clc;

w = 200;
h = 200;
frequency = 0.08;

% load a saved coefficient vector
load('saved coefficients\flower_2_wave_coef.mat', 'coef');

% ...or define the vector yourself
% coef = [1, 0, 0, 0, 0];

% Initialize the pattern matrix
pattern = zeros(h, w);

% Generate the pattern
for y = 1:h
    for x = 1:w
        xFreq = (x - 1) * frequency;
        yFreq = (y - 1) * frequency;

        value = coef_to_harmonic_series(xFreq, yFreq, coef, 45);

        pattern(y, x) = value;
    end
end

% normalize 0~255
max_val = max(max(pattern));
min_val = min(min(pattern));
pattern = (pattern - min_val) / (max_val - min_val) * 255;

% Create the mesh grid for plotting
[X, Y] = meshgrid(1:w, 1:h);

fig = figure;

while isvalid(fig)
    for z = 0:0.05:1
        % Plot the 3D threshold surface
        subplot(1,2,1);
        colormap(subplot(1, 2, 1), 'jet');
        surf(X, Y, pattern, 'EdgeColor', 'none');
        hold on;
        % Plot the flat surface at z
        cut = round(z * 255);
        Z0 = ones(h, w) * cut;
        mesh(X, Y, Z0, 'FaceAlpha', 0.5);
        title('3D threshold pattern');
        xlabel('X');
        ylabel('Y');
        zlabel('Z');
        hold off;
    
        % Plot the intersection (cut) between the pattern and the flat surface
        subplot(1,2,2);
        colormap(subplot(1, 2, 2), 'gray');
        imshow(255 * (pattern > cut));
        title(['Intersection of 3D Pattern with z=' num2str(cut) ' plane']);
        xlabel('X');
        ylabel('Y');
        pause(0.1);

        if ~isvalid(fig)
            break;
        end
        clf;
    end
end



