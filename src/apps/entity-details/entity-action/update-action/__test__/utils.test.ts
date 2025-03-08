import { waitFor } from '@testing-library/react';
import { getBody, getFieldsValues } from '../utils';

//Arrange
const selectedOption = [
  {
    label: 'testing',
    value: 'testing'
  }
];
const comments = 'Cleanoshi testing';
const schemaNameStage = 'ProspectStage';
const schemaNameOwner = 'OwnerId';

const resultStage = [
  {
    Key: 'ProspectStage',
    Value: selectedOption?.[0]?.value
  },
  {
    Key: `mxcomments_ProspectStage`,
    Value: comments
  }
];

const resultOwner = [
  {
    Key: 'OwnerId',
    Value: selectedOption?.[0]?.value
  }
];

const leadId = ['qwerty'];

describe('getFieldsValues', () => {
  it('Should return proper data when schemaName is ProspectStage', async () => {
    //Assert

    expect(
      await getFieldsValues({
        selectedOption: selectedOption,
        comments: comments,
        schemaName: schemaNameStage
      })
    ).toStrictEqual(resultStage);
  });

  it('Should return proper data when schemaName is ProspectStage', async () => {
    //Assert

    expect(
      await getFieldsValues({
        selectedOption: selectedOption,
        comments: comments,
        schemaName: schemaNameOwner
      })
    ).toStrictEqual(resultOwner);
  });
});

//Arrange
const resultBody = {
  LeadFields: resultStage,
  LeadIds: leadId,
  LeadRetrieveCriteria: null,
  Nleads: 0,
  UpdateAll: false
};

describe('getBody', () => {
  it('Should return proper data when default props passed', async () => {
    //Assert

    expect(
      await getBody({
        selectedOption: selectedOption,
        comments: comments,
        schemaName: schemaNameStage,
        leadId: leadId
      })
    ).toStrictEqual(resultBody);
  });
});
