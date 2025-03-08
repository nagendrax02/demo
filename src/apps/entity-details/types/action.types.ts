enum ActionRenderType {
  Button = 'Button',
  Dropdown = 'Dropdown'
}

interface IDisplayProperty {
  DisplayName: string;
}
interface IEntity {
  DisplayProperty: IDisplayProperty | null;
}

export interface IAddActivityForms {
  Entity: IEntity;
}

export { ActionRenderType };
