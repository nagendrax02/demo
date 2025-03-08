import commonStyle from '../common-style.module.css';

const MultiSelect = ({ value }: { value: string }): JSX.Element => {
  const text = value?.replaceAll(';', '; ');
  return (
    <div data-testid="multiselect-component" className={commonStyle.ellipsis} title={text}>
      {text}
    </div>
  );
};

export default MultiSelect;
