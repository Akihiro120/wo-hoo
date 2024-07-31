from pyray import *

def graphical(console_log, roboto):
    # graphical
    begin_drawing();
    # write console log
    i = 0
    for (log, color) in console_log:
        draw_text_ex(roboto, log, Vector2(10, 10 + (28 * i)), roboto.baseSize, 2, color);
        i += 1

    end_drawing();
