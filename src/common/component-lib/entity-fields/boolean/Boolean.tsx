const ONE = '1';
const ZERO = '0';
const BOOLEAN_CONFIG = {
  [ONE]: 'Yes',
  [ZERO]: 'No'
};

export interface IBoolean {
  value: string;
  schemaName?: string;
}

const Boolean = (props: IBoolean): JSX.Element => {
  const { value, schemaName } = props;
  return (
    <div data-testid={schemaName ? `boolean-component-${schemaName}` : 'boolean-component'}>
      {BOOLEAN_CONFIG[value] ? BOOLEAN_CONFIG[value] : value}
    </div>
  );
};

Boolean.defaultProps = {
  schemaName: ''
};

export default Boolean;
