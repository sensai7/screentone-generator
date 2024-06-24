function [result] = coef_to_harmonic_series(x, y, coef_table, angle)
    % Receives a vector with the amplitude of harmonics. Output is the
    % harmonic series for those amplitudes
    % e.g [6,7,8] ->  6cos(3x)cos(3y) + 7cos(2x)cos(2y) + 8cos(3x)(3y)
 
    % % DEBUG %%%%%%%%%%%%%
    % clear;
    % x = 20;
    % y = 10;
    % coef_table = [6,7,8];
    % %%%%%%%%%%%%%%%%%%%%

    angle = (angle - 45) * pi / 180;

    SIZE = size(coef_table);
    if numel(SIZE) > 2
        error('The coefficient table must be a single dimension vector');
    end
    if SIZE(2) == 1 % Vector is a column
        coef_table = transpose(coef_table);
        SIZE = size(coef_table);
    end

    L = SIZE(2);
    harmonic_range = 1:L;

    transform_x = x * cos(angle) - y * sin(angle);
    transform_y = x * sin(angle) + y * cos(angle);

    harmonics = coef_table .* cos(harmonic_range * transform_x) .* cos(harmonic_range * transform_y);
    result = sum(harmonics);

end