import {
  DropdownSeparator,
  DropdownSectionHeader
} from '@lsq/nextgen-preact/v2/dropdown/base-dropdown';

const getSectionHeader = ({
  title,
  addSeparator
}: {
  title: string;
  addSeparator?: boolean;
}): JSX.Element => {
  return (
    <>
      {addSeparator ? <DropdownSeparator /> : null}
      <DropdownSectionHeader>{title}</DropdownSectionHeader>
    </>
  );
};

export default getSectionHeader;
