import { useRef, useState } from 'react';
import {
  DropdownContent,
  DropdownItem,
  DropdownRoot,
  DropdownTrigger
} from '@lsq/nextgen-preact/v2/dropdown/base-dropdown';
import UserCurrentStatus from './UserCurrentStatus';
import { useMenuHover } from '@lsq/nextgen-preact/v2/hooks';
import { OptionsContainer } from './utils';

const UserStatusOptions = ({ children }: { children: JSX.Element }): JSX.Element => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);

  const {
    triggerProps: { onMouseEnter, onMouseLeave }
  } = useMenuHover(setDropdownOpen, 500);

  return (
    <DropdownRoot open={dropdownOpen} onOpenChange={setDropdownOpen} modal={false}>
      <DropdownTrigger onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} ref={triggerRef}>
        {children}
      </DropdownTrigger>
      <DropdownContent
        side="left"
        style={OptionsContainer}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}>
        <DropdownItem>
          <UserCurrentStatus />
        </DropdownItem>
        <DropdownItem>
          <UserCurrentStatus />
        </DropdownItem>
      </DropdownContent>
    </DropdownRoot>
  );
};

export default UserStatusOptions;
