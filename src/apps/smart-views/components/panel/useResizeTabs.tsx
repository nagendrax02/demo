import { useCallback, useEffect, useState } from 'react';
import useSmartViewStore from '../../smartviews-store';
import { PanelOrientation } from '../../constants/constants';
import { useQuickView } from 'src/store/quick-view';

function useResizeTabs(
  containerRef: React.RefObject<HTMLDivElement>,
  orientation: PanelOrientation
): { visibleTabs: string[]; overflowTabs: string[] } {
  const { allTabIds, rawTabData } = useSmartViewStore();
  const component = useQuickView((store) => store.component);

  const [visibleTabs, setVisibleTabs] = useState(allTabIds);
  const [overflowTabs, setOverflowTabs] = useState<string[]>([]);

  const handleResize = useCallback((): void => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      let totalWidth = 0;
      const newVisibleTabs: string[] = [];
      const newOverflowTabs: string[] = [];

      allTabIds.forEach((id) => {
        const tab = document.getElementById(rawTabData[id]?.Id);
        if (tab) {
          const computedStyle = getComputedStyle(tab);
          const tabMinWidth = parseFloat(computedStyle.minWidth);
          const tabMaxWidth = parseFloat(computedStyle.maxWidth);
          const tabActualWidth = tab.getBoundingClientRect().width;

          // Ensure the actual width is between min and max width
          const tabWidth = Math.max(tabMinWidth, Math.min(tabActualWidth, tabMaxWidth));
          totalWidth += tabWidth;

          if (totalWidth <= containerWidth) {
            newVisibleTabs.push(id);
          } else {
            newOverflowTabs.push(id);
          }
        } else if (rawTabData[id]) {
          newOverflowTabs.push(id);
        }
      });

      setVisibleTabs(newVisibleTabs);
      setOverflowTabs(newOverflowTabs);
    }
  }, [allTabIds, containerRef, rawTabData]);

  useEffect(() => {
    // Delay the resize calculation to ensure the DOM has updated
    setVisibleTabs(allTabIds);
    if (orientation === PanelOrientation.Top) {
      const timeoutId = setTimeout(handleResize, 0);
      return (): void => {
        clearTimeout(timeoutId);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allTabIds, rawTabData, orientation, component]);

  return { visibleTabs, overflowTabs };
}

export default useResizeTabs;
