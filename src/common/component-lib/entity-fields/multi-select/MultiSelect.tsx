const MultiSelect = ({ value }: { value: string }): JSX.Element => {
  return <div data-testid="multiselect-component">{value?.replaceAll(';', '; ')}</div>;
};

export default MultiSelect;
