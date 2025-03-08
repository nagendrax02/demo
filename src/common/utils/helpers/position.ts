export const DEFAULT_MENU_DIMENSION = { height: 200, width: 200 };
const DEFAULT_TOP_OFFSET = {
  menu: 20,
  subMenu: 13
};

const scrollOffset = 8;

export const getMenuOpenDirection = (
  rect: DOMRect,
  menuDimension?: Record<string, number>,
  swapOrientation?: boolean
): Record<string, string> => {
  return {
    horizontalDir:
      window.innerWidth - rect.right <= (menuDimension?.width || DEFAULT_MENU_DIMENSION.width) &&
      swapOrientation
        ? 'left'
        : 'right',
    verticalDir:
      window.innerHeight - rect.bottom <=
        (menuDimension?.height || DEFAULT_MENU_DIMENSION.height) + 32 && swapOrientation
        ? 'above'
        : 'below'
  };
};

export const getMenuHorizontalPosition = (
  { left, top, width }: DOMRect,
  customMenuDimension?: Record<string, number>,
  menuLength = 0
): Record<string, Record<string, React.CSSProperties>> => ({
  right: {
    menu: {
      left: left + 'px'
    },
    subMenu: {
      left: left + width + (menuLength > 8 ? scrollOffset : 1) + 'px',
      top: top - DEFAULT_TOP_OFFSET.subMenu + 'px'
    }
  },
  left: {
    menu: {
      left:
        left -
        (customMenuDimension ? customMenuDimension?.width : DEFAULT_MENU_DIMENSION.width) +
        width +
        'px'
    },
    subMenu: {
      left: left - scrollOffset - width + 'px',
      top: top - DEFAULT_TOP_OFFSET.subMenu + 'px'
    }
  }
});

export const getMenuVerticalPosition = (
  { top }: DOMRect,
  menuHeight: number,
  topOffest?: number
): Record<string, React.CSSProperties> => ({
  above: {
    top: top - (topOffest || DEFAULT_TOP_OFFSET.menu) - menuHeight + 'px'
  },
  below: {
    top: top + (topOffest || DEFAULT_TOP_OFFSET.menu) + 'px'
  }
});
