/* eslint-disable jest/no-commented-out-tests */
// import { render, fireEvent, screen, waitFor, renderHook } from '@testing-library/react';
// import * as restClient from 'common/utils/rest-client';
// import Documents from '../Documents';
// import { EntityType } from 'src/common/types';
// import * as fileUtils from 'common/utils/files';
// import { mockData, testFileData } from './constants';
// import useDocumentStore, { deleteDocument } from '../documents.store';

// global.fetch = jest.fn();

// jest.mock('common/utils/rest-client', () => ({
//   httpGet: jest.fn(),
//   httpPost: jest.fn(),
//   httpRequest: jest.fn(),
//   Module: {
//     Marvin: 'MARVIN'
//   }
// }));

// jest.mock('common/utils/files', () => ({
//   downloadFiles: jest.fn()
// }));

// const renderDocument = () => {
//   jest.spyOn(restClient, 'httpGet').mockResolvedValue(mockData);
//   return <Documents />;
// };

// const mockHoverEvent = (testId) => {
//   fireEvent.mouseEnter(screen.getByTestId(testId));
// };

// const mockClickEvent = (testId) => {
//   fireEvent.click(screen.getByTestId(testId));
// };

// const selectOption = async (testId, queryByTestId) => {
//   await waitFor(() => expect(queryByTestId(testId)).toBeInTheDocument());
//   mockClickEvent(testId);
// };

// describe('Documents', () => {
//   it('Should open preview modal when attachment name is clicked.', async () => {
//     const { queryByTestId, queryByText } = render(renderDocument());
//     await waitFor(() => expect(queryByTestId('name-1')).toBeInTheDocument(), { interval: 1000 });
//     jest.spyOn(restClient, 'httpPost').mockResolvedValue(testFileData);
//     mockClickEvent('name-1');

//     await waitFor(() => expect(queryByText('file-description')).toBeInTheDocument());
//   });

//   it('Should open delete modal when delete attachment icon is clicked.', async () => {
//     const { queryByTestId } = render(renderDocument());
//     await waitFor(() => expect(queryByTestId('name-0')).toBeInTheDocument());

//     mockHoverEvent('modified-by-1');
//     mockClickEvent('delete-1');

//     await waitFor(() => expect(queryByTestId('modal-header')).toBeInTheDocument());
//   });

//   it('Should trigger download attachment when download icon is clicked.', async () => {
//     const { queryByTestId } = render(renderDocument());
//     await waitFor(() => expect(queryByTestId('name-0')).toBeInTheDocument());
//     jest.spyOn(restClient, 'httpPost').mockResolvedValue(testFileData);

//     mockHoverEvent('modified-by-1');
//     mockClickEvent('download-1');

//     await waitFor(() => expect(fileUtils.downloadFiles).toHaveBeenCalled());
//   });

//   it('Should cfs change source when cfs is selected from source filter.', async () => {
//     // Arrange
//     const { result } = renderHook(() => useDocumentStore());
//     const { queryByTestId } = render(renderDocument());
//     await waitFor(() => expect(queryByTestId('name-1')).toBeInTheDocument());
//     // Act
//     mockClickEvent('dropdown-toggle');
//     await selectOption('dropdown-option-customfieldset', queryByTestId);
//     // Assert

//     expect(result.current.source.value).toBe('customfieldset');
//   });

//   it('Should load CFS attachments when activity row with CFS is clicked.', async () => {
//     const { queryByTestId } = render(renderDocument());
//     await waitFor(() => expect(queryByTestId('name-1')).toBeInTheDocument());

//     mockClickEvent('row-0');

//     await waitFor(() => expect(queryByTestId('preview-cfs1-0')).toBeInTheDocument());
//   });

//   it('Should preview CFS attachments when CFS file name is clicked.', async () => {
//     const { queryByTestId } = render(renderDocument());
//     await waitFor(() => expect(queryByTestId('name-1')).toBeInTheDocument());
//     mockClickEvent('row-0');
//     await waitFor(() => expect(queryByTestId('preview-cfs1-0')).toBeInTheDocument());
//     jest.spyOn(restClient, 'httpPost').mockResolvedValue(testFileData);
//     mockClickEvent('preview-cfs1-0');
//     await waitFor(() => expect(queryByTestId('image-preview')).toBeInTheDocument());
//     const image = screen.getByTestId('image-preview') as HTMLImageElement;

//     await waitFor(() => expect(image.src).toContain('01590463.jpeg'));
//   });

//   it('Should trigger download CFS files when CFS download icon is clicked.', async () => {
//     const { queryByTestId } = render(renderDocument());
//     await waitFor(() => expect(queryByTestId('name-1')).toBeInTheDocument());
//     mockClickEvent('row-0');
//     await waitFor(() => expect(queryByTestId('preview-cfs1-0')).toBeInTheDocument());
//     jest.spyOn(restClient, 'httpPost').mockResolvedValue(testFileData);
//     mockClickEvent('download-cfs1-0');

//     await waitFor(() => expect(fileUtils.downloadFiles).toHaveBeenCalled());
//   });

//   it('Should select expanded content when child item checkbox is clicked.', async () => {
//     const { queryByTestId } = render(renderDocument());
//     await waitFor(() => expect(queryByTestId('preview-cfs1-0')).toBeInTheDocument());
//     mockClickEvent('checkbox-cfs1');

//     expect(queryByTestId('checkbox-cfs1')).toHaveClass('checked');

//     mockClickEvent('checkbox-cfs1');

//     expect(queryByTestId('checkbox-cfs1')).not.toHaveClass('checked');
//   });

//   it('Should cfs change source when cfs is selected from source filter.', async () => {
//     // Arrange
//     const { result } = renderHook(() => useDocumentStore());
//     const { queryByTestId } = render(renderDocument());
//     await waitFor(() => expect(queryByTestId('name-1')).toBeInTheDocument());
//     // Act
//     mockClickEvent('dropdown-toggle');
//     await selectOption('dropdown-option-customfieldset', queryByTestId);
//     // Assert

//     expect(result.current.source.value).toBe('customfieldset');
//   });

//   it('Should search among documents when search is entered.', async () => {
//     const { queryByTestId } = render(renderDocument());
//     await waitFor(() => expect(queryByTestId('name-1')).toBeInTheDocument());

//     fireEvent.change(screen.getByTestId('docs-search'), { target: { value: 'ank: File' } });

//     await waitFor(() => expect(queryByTestId('preview-cfs1-0')).toBeInTheDocument());
//     await waitFor(() => expect(queryByTestId('name-1')).not.toBeInTheDocument());

//     fireEvent.change(screen.getByTestId('docs-search'), { target: { value: '' } });
//   });

//   it('Should delete the document when delete button is clicked in delete modal.', async () => {
//     const { queryByTestId } = render(renderDocument());
//     const { result } = renderHook(() => useDocumentStore());
//     await waitFor(() => expect(queryByTestId('name-1')).toBeInTheDocument());

//     jest.spyOn(restClient, 'httpPost').mockResolvedValue({ Status: 'Success' });
//     expect(result.current.records.length).toBe(3);
//     deleteDocument(mockData[1]);

//     await waitFor(() => expect(result.current.records.length).toBe(2));
//   });
// });
