import { IEntityProperty } from 'common/types/entity/lead/metadata.types';
import Badge from '@lsq/nextgen-preact/v2/badge';
import { BadgeStatus } from '@lsq/nextgen-preact/v2/badge/badge.types';

export interface IOppStatusHighlighted {
  property: IEntityProperty;
}

const OppStatusHighlighted = ({ property }: IOppStatusHighlighted): JSX.Element => {
  return (
    <Badge size="sm" status={String(property?.value ?? '')?.toLowerCase() as BadgeStatus}>
      <span title={property?.value}>{property?.value}</span>
    </Badge>
  );
};

export default OppStatusHighlighted;
