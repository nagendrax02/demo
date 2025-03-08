import { render, waitFor, screen, fireEvent, cleanup } from '@testing-library/react';
import translationFiles from './locales';
import hindiKey from './locales/hi.json';
import englishKey from './locales/en.json';
import { useLanguageStore } from '../store/language.store';
import { LocaleProvider } from '../LocaleProvider';
import useLocale from '../use-locale';

const languageCode = { en: 'en', hi: 'hi' };
const testDataId = 'test-component';
const localKey = 'no-records-found';
const replacementLocalKey = 'replacement-checks';

const TestComponent = (props: {
  localKey: string;
  replacementKeys?: Record<string, string>;
  updatedLanguage?: string;
}) => {
  const { localKey, replacementKeys, updatedLanguage } = props;
  const { translate } = useLocale();
  const { setLanguage, language } = useLanguageStore();

  const handleLanguageUpdate = () => {
    setLanguage(updatedLanguage || '');
  };

  return (
    <div data-testid={testDataId} onClick={handleLanguageUpdate}>
      {translate(localKey, replacementKeys)}
    </div>
  );
};

describe('Localization', () => {
  it('Should return English text when translation key is present and language is en', async () => {
    //Act
    render(
      <LocaleProvider translationFile={translationFiles}>
        <TestComponent localKey={localKey} />
      </LocaleProvider>
    );

    //Assert
    await waitFor(() => {
      expect(screen.getByTestId(testDataId)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId(testDataId).textContent).toEqual(englishKey[localKey]);
    });
  });

  it('Should return provided text when translation key is not present', async () => {
    //Arrange
    const noKeyFound = 'no-key-found';

    //Act
    render(
      <LocaleProvider translationFile={translationFiles}>
        <TestComponent localKey={noKeyFound} />
      </LocaleProvider>
    );

    //Assert
    await waitFor(() => {
      expect(screen.getByTestId(testDataId)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId(testDataId).textContent).toEqual(noKeyFound);
    });
  });

  it('Should return translated text replacing all keywords when replacement keys are provided', async () => {
    //Arrange
    const replacementKeys = {
      leadName: 'Marvin',
      leadPhone: '9876'
    };
    const expectedValue = 'replacement checks Marvin, Marvin, name, 9876';

    //Act
    render(
      <LocaleProvider translationFile={translationFiles}>
        <TestComponent localKey={replacementLocalKey} replacementKeys={replacementKeys} />
      </LocaleProvider>
    );

    //Assert
    await waitFor(() => {
      expect(screen.getByTestId(testDataId)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId(testDataId).textContent).toEqual(expectedValue);
    });
  });

  it('Should return text removing curly brackets when replacement keys are not provided', async () => {
    //Arrange
    const expectedValue = 'replacement checks leadName, leadName, name, leadPhone';

    //Act
    render(
      <LocaleProvider translationFile={translationFiles}>
        <TestComponent localKey={replacementLocalKey} />
      </LocaleProvider>
    );

    //Assert
    await waitFor(() => {
      expect(screen.getByTestId(testDataId)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId(testDataId).textContent).toEqual(expectedValue);
    });
  });

  it('Should return updated translated text when language is updated', async () => {
    //Act
    render(
      <LocaleProvider translationFile={translationFiles}>
        <TestComponent localKey={localKey} updatedLanguage={languageCode.hi} />
      </LocaleProvider>
    );

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId(testDataId).textContent).toEqual(englishKey[localKey]);
    });
    await waitFor(() => {
      const element = screen.getByTestId(testDataId);
      fireEvent.click(element);
      expect(screen.getByTestId(testDataId).textContent).toEqual(hindiKey[localKey]);
    });
  });
});
