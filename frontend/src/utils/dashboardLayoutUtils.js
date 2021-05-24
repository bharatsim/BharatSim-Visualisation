export function getNewWidgetLayout(numberOfWidgetAdded, cols, count) {
  return createLayout({
    id: createWidgetId(count),
    xPosition: (numberOfWidgetAdded * 6) % cols,
    yPosition: Infinity, // puts it at the bottom
    width: 6,
    height: 2,
  });
}

export function createWidgetId(count) {
  return `widget-${count}`;
}

export function createLayout({ id, xPosition, yPosition, width, height }) {
  return {
    i: id,
    x: xPosition,
    y: yPosition,
    w: width,
    h: height,
  };
}
