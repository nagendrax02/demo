const VERTICAL_DIR = {
  below: 'below',
  above: 'above'
};
const getVerticalDirection = (
  rect: DOMRect,
  popupDimension: { height: number; width: number }
): string => {
  let dir = VERTICAL_DIR.below;
  if (
    window.innerHeight - rect.bottom <= popupDimension.height &&
    rect.top > popupDimension.height
  ) {
    dir = VERTICAL_DIR.above;
  } else {
    dir = VERTICAL_DIR.below;
  }
  return dir;
};

const getOpenDirection = (
  rect: DOMRect,
  popupDimension: { height: number; width: number },
  doNotSelfPosition: boolean
): Record<string, string> => {
  const checkRightWidth = window.innerWidth - rect.left;
  return {
    horizontalDir: checkRightWidth <= popupDimension.width ? 'left' : 'right',
    verticalDir: doNotSelfPosition ? VERTICAL_DIR.below : getVerticalDirection(rect, popupDimension)
  };
};

const getHorizontalPosition = (
  { width }: DOMRect,
  popupDimension: { height: number; width: number }
): Record<string, React.CSSProperties> => ({
  left: {
    left: `-${popupDimension.width - width}px`
  }
});

const getMenuVerticalPosition = (menuHeight: number): Record<string, React.CSSProperties> => ({
  above: {
    top: `-${menuHeight + 6}px`
  }
});

const getMaxHeight = ({
  popupDimension,
  rect,
  verticalDir,
  doNotSelfPosition
}: {
  verticalDir: string;
  rect: DOMRect;
  popupDimension: { height: number; width: number };
  doNotSelfPosition: boolean;
}): React.CSSProperties => {
  if (
    verticalDir === VERTICAL_DIR.below &&
    window.innerHeight - rect.bottom <= popupDimension.height
  ) {
    const bottomSpace = window.innerHeight - rect.bottom - 10;
    const topSpace = rect.top;

    if (!doNotSelfPosition && topSpace > bottomSpace) {
      const position: { maxHeight: number; top?: string } = {
        maxHeight: topSpace - 10
      };

      position.top = `-${topSpace - 10}px`;

      return position;
    }
    const maxHeight = window.innerHeight - rect.bottom - 10;
    return { maxHeight: maxHeight > 10 ? maxHeight : popupDimension?.height };
  }

  return {};
};
const getPopupStyle = ({
  sourceElement,
  popupDimension,
  doNotSelfPosition = false,
  adjustHeight = false,
  renderOnBody = false
}: {
  sourceElement: HTMLDivElement | null;
  popupDimension: { height: number; width: number };
  doNotSelfPosition?: boolean;
  adjustHeight?: boolean;
  renderOnBody?: boolean;
}): React.CSSProperties => {
  const rect = sourceElement?.getBoundingClientRect();
  if (!rect) return {};

  const { horizontalDir, verticalDir } = getOpenDirection(rect, popupDimension, doNotSelfPosition);
  return {
    ...getHorizontalPosition(rect, popupDimension)?.[horizontalDir],
    ...(doNotSelfPosition ? {} : getMenuVerticalPosition(popupDimension.height)?.[verticalDir]),
    maxHeight:
      renderOnBody && popupDimension.height
        ? `${popupDimension.height}px`
        : popupDimension?.height || '300px',
    ...(adjustHeight ? getMaxHeight({ verticalDir, rect, popupDimension, doNotSelfPosition }) : {})
  };
};

export { getPopupStyle };
