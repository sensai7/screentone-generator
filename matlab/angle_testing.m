close all;
clear;
clc;
w = 200;
h = 200;
frequency = 0.08;

load('flower_2_wave_coef.mat', 'coef');

% Create the mesh grid for plotting
[X, Y] = meshgrid(1:w, 1:h);
fig = figure;
view(3); % 3D view
colormap(fig, 'jet');

while isvalid(fig)
    for angle = 0:1:90
        % Initialize the pattern matrix
        pattern = zeros(h, w);
        % Generate the pattern
        for y = 1:h
            for x = 1:w
                xFreq = (x - 1) * frequency;
                yFreq = (y - 1) * frequency;
        
                value = coef_to_harmonic_series(xFreq, yFreq, coef, angle);
        
                pattern(y, x) = value;
            end
        end
        
        max_val = max(max(pattern));
        min_val = min(min(pattern));
        
        pattern = (pattern - min_val) / (max_val - min_val) * 255;
        
        surf(X, Y, pattern, 'EdgeColor', 'none');
        title(['Angle=' num2str(angle)]);
        pause(0.1);

        if ~isvalid(fig)
            break;
        end
        clf;
    end
end



