import { render, screen } from '@testing-library/react';
import VCard from '../Vcard';
import { IVCardConfig, IconContentType } from '../../../types';
import { Body, Footer, Primary, Secondary, Tertiary } from '../sections';
import { MOCK_ENTITY_DETAILS_CORE_DATA } from 'common/constants';

const mockConfig: IVCardConfig = {
  body: {
    icon: {
      contentType: IconContentType.Text,
      content: 'test-content'
    },
    primarySection: { components: [], customStyleClass: '' },
    secondarySection: { components: [], customStyleClass: '' },
    tertiarySection: { components: [], customStyleClass: '' }
  },
  footer: {
    components: [],
    customStyleClass: ''
  }
};

describe('VCard', () => {
  it('Should render vcard container', async () => {
    // Act
    render(
      <VCard isLoading={false} config={mockConfig} coreData={MOCK_ENTITY_DETAILS_CORE_DATA} />
    );

    // Assert
    const vcard = await screen.findByTestId('vcard-container');
    expect(vcard).toBeInTheDocument();
  });
});

describe('Body', () => {
  it('Should render vcard body', async () => {
    // Act
    render(
      <Body isLoading={false} config={mockConfig.body} coreData={MOCK_ENTITY_DETAILS_CORE_DATA} />
    );

    // Assert
    const body = await screen.findByTestId('vcard-body');
    expect(body).toBeInTheDocument();
  });
});

describe('Primary', () => {
  it('Should render primary section', async () => {
    // Act
    render(
      <Primary
        isLoading={false}
        config={mockConfig.body.primarySection}
        coreData={MOCK_ENTITY_DETAILS_CORE_DATA}
      />
    );

    // Assert
    const primarySection = await screen.findByTestId('vcard-primary-section');
    expect(primarySection).toBeInTheDocument();
  });
});

describe('Secondary', () => {
  it('Should render secondary section', async () => {
    // Act
    render(
      <Secondary
        isLoading={false}
        config={mockConfig.body.secondarySection}
        coreData={MOCK_ENTITY_DETAILS_CORE_DATA}
      />
    );

    // Assert
    const secondarySection = await screen.findByTestId('vcard-secondary-section');
    expect(secondarySection).toBeInTheDocument();
  });
});

describe('Tertiary', () => {
  it('Should render tertiary section', async () => {
    // Act
    render(
      <Tertiary
        isLoading={false}
        config={mockConfig.body.tertiarySection}
        coreData={MOCK_ENTITY_DETAILS_CORE_DATA}
      />
    );

    // Assert
    const tertiarySection = await screen.findByTestId('vcard-tertiary-section');
    expect(tertiarySection).toBeInTheDocument();
  });
});

describe('Footer', () => {
  it('Should render vcard body', async () => {
    // Act
    render(
      <Footer
        isLoading={false}
        config={mockConfig.footer}
        coreData={MOCK_ENTITY_DETAILS_CORE_DATA}
      />
    );

    // Assert
    const footer = await screen.findByTestId('vcard-footer');
    expect(footer).toBeInTheDocument();
  });
});
