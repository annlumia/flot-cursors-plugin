/* global $, describe, it, xit, after, beforeEach, afterEach, expect, jasmine */
/* jshint browser: true*/

describe("Touch cursors interaction", function () {
    'use strict';

    var sampledata = [[0, 1], [1, 1.1], [2, 1.2]];
    var plot;
    var placeholder;

    beforeEach(function () {
        var fixture = setFixtures('<div id="demo-container" style="width: 800px;height: 600px">').find('#demo-container').get(0);

        placeholder = $('<div id="placeholder" style="width: 100%;height: 100%">');
        placeholder.appendTo(fixture);

        jasmine.addMatchers({
            toBeAnyOf: function (util, customEqualityTesters) {
                return {
                    compare: function (actual, expected) {
                        var res = false;
                        for (var i = 0, l = expected.length; i < l; i++) {
                            if (actual === expected[i]) {
                                res = true;
                                break;
                            }
                        }
                        return {
                            pass: res
                        };
                    }
                };
            }
        });

        jasmine.clock().install();
    });

    afterEach(function () {
        plot.shutdown();
        $('#placeholder').empty();
        jasmine.clock().uninstall();
    });

    it('should become selected on panstart on cursor manipulator and unselected on panend', function () {
        plot = $.plot("#placeholder", [sampledata], {
            cursors: [
                {
                    name: 'Blue cursor',
                    color: 'blue',
                    position: {
                        relativeX: 0.5,
                        relativeY: 0.6
                    }
                }
            ]
        });

        var cursorX = plot.offset().left + plot.width() * 0.5;
        var cursorY = plot.offset().top + plot.height() * 0.6;

        jasmine.clock().tick(20);

        var eventHolder = $('#placeholder').find('.flot-overlay');
        var e = { touches: [{ pageX: cursorX, pageY: cursorY }] };

        eventHolder[0].dispatchEvent(new CustomEvent('panstart', { detail: e }));

        var cursor = plot.getCursors()[0];
        expect(cursor.selected).toBe(true);

        eventHolder[0].dispatchEvent(new CustomEvent('panend', { detail: e }));

        expect(cursor.selected).toBe(false);
    });

    it('should not become selected on panstart if not visible', function () {
        plot = $.plot("#placeholder", [sampledata], {
            cursors: [
                {
                    name: 'Blue cursor',
                    color: 'blue',
                    position: {
                        relativeX: 0.5,
                        relativeY: 0.6
                    },
                    show: false
                }
            ]
        });

        var cursorX = plot.offset().left + plot.width() * 0.5;
        var cursorY = plot.offset().top + plot.height() * 0.6;

        jasmine.clock().tick(20);

        var eventHolder = $('#placeholder').find('.flot-overlay');
        var e = { touches: [{ pageX: cursorX, pageY: cursorY }] };
        eventHolder[0].dispatchEvent(new CustomEvent('panstart', { detail: e }));

        var cursor = plot.getCursors()[0];
        expect(cursor.selected).not.toBe(true);
    });

    it('should become selected on panstart on cursor vertical line and unselected on panend', function () {
        plot = $.plot("#placeholder", [sampledata], {
            cursors: [
                {
                    name: 'Blue cursor',
                    color: 'blue',
                    position: {
                        relativeX: 0.5,
                        relativeY: 0.6
                    }
                }
            ]
        });

        var cursorX = plot.offset().left + plot.width() * 0.5;
        var cursorY = plot.offset().top + plot.height() * 0.2;

        jasmine.clock().tick(20);

        var eventHolder = $('#placeholder').find('.flot-overlay');
        var e = { touches: [{ pageX: cursorX, pageY: cursorY }] };
        eventHolder[0].dispatchEvent(new CustomEvent('panstart', { detail: e }));

        var cursor = plot.getCursors()[0];
        expect(cursor.selected).toBe(true);

        eventHolder[0].dispatchEvent(new CustomEvent('panend', { detail: e }));

        expect(cursor.selected).toBe(false);
    });

    it('should become selected on panstart on cursor horizontal line and unselected on panend', function () {
        plot = $.plot("#placeholder", [sampledata], {
            cursors: [
                {
                    name: 'Blue cursor',
                    color: 'blue',
                    position: {
                        relativeX: 0.5,
                        relativeY: 0.6
                    }
                }
            ]
        });

        var cursorX = plot.offset().left + plot.width() * 0.3;
        var cursorY = plot.offset().top + plot.height() * 0.6;

        jasmine.clock().tick(20);

        var eventHolder = $('#placeholder').find('.flot-overlay');
        var e = { touches: [{ pageX: cursorX, pageY: cursorY }] };
        eventHolder[0].dispatchEvent(new CustomEvent('panstart', { detail: e }));

        var cursor = plot.getCursors()[0];
        expect(cursor.selected).toBe(true);

        eventHolder[0].dispatchEvent(new CustomEvent('panend', { detail: e }));

        expect(cursor.selected).toBe(false);
    });

    it('should be possible to pan cursors from the cursor manipulator', function () {
        plot = $.plot("#placeholder", [sampledata], {
            cursors: [
                {
                    name: 'Blue cursor',
                    color: 'blue',
                    position: {
                        relativeX: 0.5,
                        relativeY: 0.6
                    }
                }
            ]
        });

        var cursorX = plot.offset().left + plot.width() * 0.5;
        var cursorY = plot.offset().top + plot.height() * 0.6;

        jasmine.clock().tick(20);

        var eventHolder = $('#placeholder').find('.flot-overlay');

        var e = { touches: [{ pageX: cursorX, pageY: cursorY }] };
        eventHolder[0].dispatchEvent(new CustomEvent('panstart', { detail: e }));

        cursorX += 13;
        cursorY += 5;

        e = { touches: [{ pageX: cursorX, pageY: cursorY }] };
        eventHolder[0].dispatchEvent(new CustomEvent('pandrag', { detail: e }));

        eventHolder[0].dispatchEvent(new CustomEvent('panend', { detail: e }));

        var cursor = plot.getCursors()[0];
        expect(cursor.x).toBe(plot.width() * 0.5 + 13);
        expect(cursor.y).toBe(plot.height() * 0.6 + 5);
    });

    it('should not be possible to touch drag a cursor with movable set to false', function () {
        plot = $.plot("#placeholder", [sampledata], {
            cursors: [
                {
                    name: 'Blue cursor',
                    color: 'blue',
                    position: {
                        relativeX: 0.5,
                        relativeY: 0.6
                    },
                    movable: false
                }
            ]
        });

        var cursorX = plot.offset().left + plot.width() * 0.5;
        var cursorY = plot.offset().top + plot.height() * 0.6;

        jasmine.clock().tick(20);

        var eventHolder = $('#placeholder').find('.flot-overlay');
        var e = { touches: [{ pageX: cursorX, pageY: cursorY }] };
        eventHolder[0].dispatchEvent(new CustomEvent('panstart', { detail: e }));

        cursorX += 13;
        cursorY += 5;

        e = { touches: [{ pageX: cursorX, pageY: cursorY }] };
        eventHolder[0].dispatchEvent(new CustomEvent('pandrag', { detail: e }));

        eventHolder[0].dispatchEvent(new CustomEvent('panend', { detail: e }));

        var cursor = plot.getCursors()[0];
        expect(cursor.x).toBe(plot.width() * 0.5);
        expect(cursor.y).toBe(plot.height() * 0.6);
    });

    it('should not be possible to touch drag a cursor that is not visible', function () {
        plot = $.plot("#placeholder", [sampledata], {
            cursors: [
                {
                    name: 'Blue cursor',
                    color: 'blue',
                    position: {
                        relativeX: 0.5,
                        relativeY: 0.6
                    },
                    show: false
                }
            ]
        });

        var cursorX = plot.offset().left + plot.width() * 0.5;
        var cursorY = plot.offset().top + plot.height() * 0.6;

        jasmine.clock().tick(20);

        var eventHolder = $('#placeholder').find('.flot-overlay');

        var e = { touches: [{ pageX: cursorX, pageY: cursorY }] };
        eventHolder[0].dispatchEvent(new CustomEvent('panstart', { detail: e }));

        cursorX += 13;
        cursorY += 5;

        e = { touches: [{ pageX: cursorX, pageY: cursorY }] };
        eventHolder[0].dispatchEvent(new CustomEvent('pandrag', { detail: e }));

        eventHolder[0].dispatchEvent(new CustomEvent('panend', { detail: e }));

        var cursor = plot.getCursors()[0];
        expect(cursor.x).toBe(plot.width() * 0.5);
        expect(cursor.y).toBe(plot.height() * 0.6);
    });

    it('should be constrained on the right side by the chart margin when touch dragging', function () {
        plot = $.plot("#placeholder", [sampledata], {
            cursors: [
                {
                    name: 'Blue cursor',
                    color: 'blue',
                    position: {
                        relativeX: 0.5,
                        relativeY: 0.6
                    }
                }
            ],
            yaxes: [
                {
                    position: 'right'
                }]
        });

        var cursorX = plot.offset().left + plot.width() * 0.5;
        var cursorY = plot.offset().top + plot.height() * 0.6;

        jasmine.clock().tick(20);

        var eventHolder = $('#placeholder').find('.flot-overlay');
        var e = { touches: [{ pageX: cursorX, pageY: cursorY }] };
        eventHolder[0].dispatchEvent(new CustomEvent('panstart', { detail: e }));

        cursorX = plot.offset().left + plot.width() + 5;

        e = { touches: [{ pageX: cursorX, pageY: cursorY }] };
        eventHolder[0].dispatchEvent(new CustomEvent('pandrag', { detail: e }));

        eventHolder[0].dispatchEvent(new CustomEvent('panend', { detail: e }));

        jasmine.clock().tick(20);

        var cursor = plot.getCursors()[0];
        expect(cursor.x).toBe(plot.width());
        expect(cursor.y).toBe(plot.height() * 0.6);
    });

    it('should be constrained on the top side by the chart margin when touch dragging', function () {
        plot = $.plot("#placeholder", [sampledata], {
            cursors: [
                {
                    name: 'Blue cursor',
                    color: 'blue',
                    position: {
                        relativeX: 0.5,
                        relativeY: 0.6
                    }
                }
            ],
            xaxes: [
                {
                    position: 'top'
                }]
        });

        var cursorX = plot.offset().left + plot.width() * 0.5;
        var cursorY = plot.offset().top + plot.height() * 0.6;

        jasmine.clock().tick(20);

        var eventHolder = $('#placeholder').find('.flot-overlay');
        var e = { touches: [{ pageX: cursorX, pageY: cursorY }] };
        eventHolder[0].dispatchEvent(new CustomEvent('panstart', { detail: e }));

        cursorY = plot.offset().top - 5;

        e = { touches: [{ pageX: cursorX, pageY: cursorY }] };
        eventHolder[0].dispatchEvent(new CustomEvent('pandrag', { detail: e }));

        eventHolder[0].dispatchEvent(new CustomEvent('panend', { detail: e }));

        jasmine.clock().tick(20);

        var cursor = plot.getCursors()[0];
        expect(cursor.x).toBe(plot.width() * 0.5);
        expect(cursor.y).toBe(0);
    });

    it('should be constrained on the bottom side by the chart margin when touch dragging', function () {
        plot = $.plot("#placeholder", [sampledata], {
            cursors: [
                {
                    name: 'Blue cursor',
                    color: 'blue',
                    position: {
                        relativeX: 0.5,
                        relativeY: 0.6
                    }
                }
            ]
        });

        var cursorX = plot.offset().left + plot.width() * 0.5;
        var cursorY = plot.offset().top + plot.height() * 0.6;

        jasmine.clock().tick(20);

        var eventHolder = $('#placeholder').find('.flot-overlay');
        var e = { touches: [{ pageX: cursorX, pageY: cursorY }] };
        eventHolder[0].dispatchEvent(new CustomEvent('panstart', { detail: e }));

        cursorY = plot.offset().top + plot.height() + 5;

        e = { touches: [{ pageX: cursorX, pageY: cursorY }] };
        eventHolder[0].dispatchEvent(new CustomEvent('pandrag', { detail: e }));

        eventHolder[0].dispatchEvent(new CustomEvent('panend', { detail: e }));

        jasmine.clock().tick(20);

        var cursor = plot.getCursors()[0];
        expect(cursor.x).toBe(plot.width() * 0.5);
        expect(cursor.y).toBe(plot.height());
    });

    it('should be possible to touch drag the cursors from the cursor manipulator while the chart updates', function () {
        plot = $.plot("#placeholder", [sampledata], {
            cursors: [
                {
                    name: 'Blue cursor',
                    color: 'blue',
                    position: {
                        relativeX: 0.5,
                        relativeY: 0.6
                    }
                }
            ]
        });

        var cursorX = plot.offset().left + plot.width() * 0.5;
        var cursorY = plot.offset().top + plot.height() * 0.6;

        var updateChart = function () {
            plot.setData([[[0, 1.2], [1, 1.1], [2, 1]]]);
            plot.setupGrid();
            plot.draw();
        };

        jasmine.clock().tick(20);

        var eventHolder = $('#placeholder').find('.flot-overlay');
        var e = { touches: [{ pageX: cursorX, pageY: cursorY }] };
        eventHolder[0].dispatchEvent(new CustomEvent('panstart', { detail: e }));

        cursorX += 13;
        cursorY += 5;

        updateChart();
        jasmine.clock().tick(20);

        e = { touches: [{ pageX: cursorX, pageY: cursorY }] };
        eventHolder[0].dispatchEvent(new CustomEvent('pandrag', { detail: e }));

        eventHolder[0].dispatchEvent(new CustomEvent('panend', { detail: e }));

        var cursor = plot.getCursors()[0];
        expect(cursor.x).toBe(plot.width() * 0.5 + 13);
        expect(cursor.y).toBe(plot.height() * 0.6 + 5);
    });

    it('should be highlighted on touch drag of the cursor manipulator', function () {
        plot = $.plot("#placeholder", [sampledata], {
            cursors: [
                {
                    name: 'Blue cursor',
                    color: 'blue',
                    position: {
                        relativeX: 0.5,
                        relativeY: 0.6
                    }
                }
            ]
        });

        var cursorX = plot.offset().left + plot.width() * 0.5;
        var cursorY = plot.offset().top + plot.height() * 0.6;

        jasmine.clock().tick(20);

        var eventHolder = $('#placeholder').find('.flot-overlay');
        var e = { touches: [{ pageX: cursorX, pageY: cursorY }] };
        eventHolder[0].dispatchEvent(new CustomEvent('pandrag', { detail: e }));

        var cursor = plot.getCursors()[0];
        expect(cursor.highlighted).toBe(true);
    });

    it('should not be highlighted on touch drag of the cursor manipulator if not visible', function () {
        plot = $.plot("#placeholder", [sampledata], {
            cursors: [
                {
                    name: 'Blue cursor',
                    color: 'blue',
                    position: {
                        relativeX: 0.5,
                        relativeY: 0.6
                    },
                    show: false
                }
            ]
        });

        var cursorX = plot.offset().left + plot.width() * 0.5;
        var cursorY = plot.offset().top + plot.height() * 0.6;

        jasmine.clock().tick(20);

        var eventHolder = $('#placeholder').find('.flot-overlay');
        var e = { touches: [{ pageX: cursorX, pageY: cursorY }] };
        eventHolder[0].dispatchEvent(new CustomEvent('pandrag', { detail: e }));

        var cursor = plot.getCursors()[0];
        expect(cursor.highlighted).not.toBe(true);
    });

    it('should not pan the plot behind the cursors on cursor drag', function () {
        plot = $.plot("#placeholder", [sampledata], {
            cursors: [
                {
                    name: 'Blue cursor',
                    color: 'blue',
                    position: {
                        relativeX: 0.5,
                        relativeY: 0.6
                    }
                }
            ],
            pan: {
                interactive: true,
                enableTouch: true
            }
        });

        var xmin = plot.getXAxes()[0].min,
            ymin = plot.getYAxes()[0].min,
            xmax = plot.getXAxes()[0].max,
            ymax = plot.getYAxes()[0].max,
            cursorX = plot.offset().left + plot.width() * 0.5,
            cursorY = plot.offset().top + plot.height() * 0.6;

        jasmine.clock().tick(20);

        var eventHolder = $('#placeholder').find('.flot-overlay');

        var e = { touches: [{ pageX: cursorX, pageY: cursorY }] };
        eventHolder[0].dispatchEvent(new CustomEvent('panstart', { detail: e }));

        cursorX += 20;
        cursorY += 100;

        e = { touches: [{ pageX: cursorX, pageY: cursorY }] };
        eventHolder[0].dispatchEvent(new CustomEvent('pandrag', { detail: e }));

        eventHolder[0].dispatchEvent(new CustomEvent('panend', { detail: e }));

        expect(plot.getXAxes()[0].min).toBe(xmin);
        expect(plot.getXAxes()[0].max).toBe(xmax);
        expect(plot.getYAxes()[0].min).toBe(ymin);
        expect(plot.getYAxes()[0].max).toBe(ymax);
    });

    it('should not zoom the plot behind the cursors when first touch of the pinch is on a cursor', function () {
        plot = $.plot("#placeholder", [sampledata], {
            cursors: [
                {
                    name: 'Blue cursor',
                    color: 'blue',
                    position: {
                        relativeX: 0.5,
                        relativeY: 0.6
                    }
                }
            ],
            pan: {
                interactive: true,
                enableTouch: true
            },
            zoom: {
                interactive: true,
                enableTouch: true
            }
        });

        var xmin = plot.getXAxes()[0].min,
            ymin = plot.getYAxes()[0].min,
            xmax = plot.getXAxes()[0].max,
            ymax = plot.getYAxes()[0].max,
            cursorX = plot.offset().left + plot.width() * 0.5,
            cursorY = plot.offset().top + plot.height() * 0.6;

        jasmine.clock().tick(20);

        var eventHolder = $('#placeholder').find('.flot-overlay');

        var e = { touches: [{ pageX: cursorX, pageY: cursorY }, { pageX: 100, pageY: 200 }] };
        eventHolder[0].dispatchEvent(new CustomEvent('panstart', { detail: e }));
        eventHolder[0].dispatchEvent(new CustomEvent('pinchstart', { detail: e }));

        cursorX += 300;
        cursorY += 50;

        e = { touches: [{ pageX: cursorX, pageY: cursorY }, { pageX: 600, pageY: 700 }] };
        eventHolder[0].dispatchEvent(new CustomEvent('pinchdrag', { detail: e }));

        eventHolder[0].dispatchEvent(new CustomEvent('pinchend', { detail: e }));

        expect(plot.getXAxes()[0].min).toBe(xmin);
        expect(plot.getXAxes()[0].max).toBe(xmax);
        expect(plot.getYAxes()[0].min).toBe(ymin);
        expect(plot.getYAxes()[0].max).toBe(ymax);
    });

    it('should pan the plot behind the cursors if cursor is not visible', function () {
        plot = $.plot("#placeholder", [sampledata], {
            cursors: [
                {
                    name: 'Green cursor',
                    color: 'green',
                    position: {
                        relativeX: 0.5,
                        relativeY: 0.6
                    },
                    show: false
                }
            ],
            pan: {
                interactive: true,
                enableTouch: true
            }
        });

        var xmin = plot.getXAxes()[0].min,
            ymin = plot.getYAxes()[0].min,
            xmax = plot.getXAxes()[0].max,
            ymax = plot.getYAxes()[0].max,
            cursorX = plot.offset().left + plot.width() * 0.5,
            cursorY = plot.offset().top + plot.height() * 0.6;

        jasmine.clock().tick(20);

        var eventHolder = $('#placeholder').find('.flot-overlay');
        var e = { touches: [{ pageX: cursorX, pageY: cursorY }] };
        eventHolder[0].dispatchEvent(new CustomEvent('panstart', { detail: e }));

        cursorX += 20;
        cursorY += 100;

        e = { touches: [{ pageX: cursorX, pageY: cursorY }] };
        eventHolder[0].dispatchEvent(new CustomEvent('pandrag', { detail: e }));

        eventHolder[0].dispatchEvent(new CustomEvent('panend', { detail: e }));

        expect(plot.getXAxes()[0].min).not.toBe(xmin);
        expect(plot.getXAxes()[0].max).not.toBe(xmax);
        expect(plot.getYAxes()[0].min).not.toBe(ymin);
        expect(plot.getYAxes()[0].max).not.toBe(ymax);
    });

    it('should zoom the plot behind the cursors when first touch of the pinch is on an invisible cursor', function () {
        plot = $.plot("#placeholder", [sampledata], {
            cursors: [
                {
                    name: 'Blue cursor',
                    color: 'blue',
                    position: {
                        relativeX: 0.5,
                        relativeY: 0.6
                    },
                    show: false
                }
            ],
            pan: {
                interactive: true,
                enableTouch: true
            },
            zoom: {
                interactive: true,
                enableTouch: true
            }
        });

        var xmin = plot.getXAxes()[0].min,
            ymin = plot.getYAxes()[0].min,
            xmax = plot.getXAxes()[0].max,
            ymax = plot.getYAxes()[0].max,
            cursorX = plot.offset().left + plot.width() * 0.5,
            cursorY = plot.offset().top + plot.height() * 0.6;

        jasmine.clock().tick(20);

        var eventHolder = $('#placeholder').find('.flot-overlay');

        var e = { touches: [{ pageX: cursorX, pageY: cursorY }, { pageX: 100, pageY: 200 }] };
        eventHolder[0].dispatchEvent(new CustomEvent('panstart', { detail: e }));
        eventHolder[0].dispatchEvent(new CustomEvent('pinchstart', { detail: e }));

        cursorX += 300;
        cursorY += 50;

        e = { touches: [{ pageX: cursorX, pageY: cursorY }, { pageX: 600, pageY: 700 }] };
        eventHolder[0].dispatchEvent(new CustomEvent('pinchdrag', { detail: e }));

        eventHolder[0].dispatchEvent(new CustomEvent('pinchend', { detail: e }));

        expect(plot.getXAxes()[0].min).not.toBe(xmin);
        expect(plot.getXAxes()[0].max).not.toBe(xmax);
        expect(plot.getYAxes()[0].min).not.toBe(ymin);
        expect(plot.getYAxes()[0].max).not.toBe(ymax);
    });
});
