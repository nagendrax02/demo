import { useEffect } from 'react';
import { IHeader } from '../header.types';
import { useLocation } from 'wouter';

const Default = {
  RouteCaption: 'home'
};

function useDefaultRouting({ menu }: { menu: IHeader[] }): void {
  const [location, setLocation] = useLocation();
  const homePage = menu?.find(
    (menuItem) => menuItem?.Caption?.toLowerCase() === Default.RouteCaption
  )?.ControllerName;

  useEffect(() => {
    if (location === '/' && homePage) {
      setLocation(`/${homePage}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homePage, location]);
}

export default useDefaultRouting;
