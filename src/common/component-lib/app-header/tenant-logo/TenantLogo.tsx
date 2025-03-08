import LeadsquaredLogo from 'assets/core/LeadsquaredLogo';

/**
 * This component displays the tenant logo. If the tenant logo is not available, it displays the leadsquared logo.
 */

const TenantLogo = (): JSX.Element => {
  // TODO: Use tenant logo data from api data - https://leadsquared.atlassian.net/browse/SW-6747
  return (
    <div role="img" aria-label="LeadSquared">
      <LeadsquaredLogo />
    </div>
  );
};

export default TenantLogo;
