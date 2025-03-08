import { INavItem } from 'apps/header/header.types';
import NavItem from './NavItem';

interface INavItems {
  navItems: INavItem[];
}

const NavItems = ({ navItems }: INavItems): JSX.Element => {
  return (
    <>
      {navItems?.map((navItem) => {
        return <NavItem key={navItem.Id} navItem={navItem} />;
      })}
    </>
  );
};

export default NavItems;
