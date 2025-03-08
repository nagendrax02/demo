import Opportunity from 'assets/custom-icon/Opportunity';

interface IOpportunityIcon {
  className?: string;
}

const OpportunityIcon = ({ className }: IOpportunityIcon): JSX.Element => {
  return <Opportunity className={className} />;
};

OpportunityIcon.defaultProps = {
  className: ''
};

export default OpportunityIcon;
