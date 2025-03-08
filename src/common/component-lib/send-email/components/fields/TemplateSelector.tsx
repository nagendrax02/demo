import { lazy, useRef, useState } from 'react';
import styles from './email-fields.module.css';
import Icon from '@lsq/nextgen-preact/icon';
import { fetchTemplateData, getTemplateContent } from '../../utils/template';
import { ITemplateResponse } from '../../send-email.types';
import { IOption } from 'common/component-lib/send-email/send-email.types';
import TemplateSelectMenu from '../template-select-menu';
import useSendEmailStore from '../../send-email.store';
import withSuspense from '@lsq/nextgen-preact/suspense';

const DropdownRenderer = withSuspense(lazy(() => import('@lsq/nextgen-preact/dropdown-renderer')));

const TemplateSelector = (): JSX.Element => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setFields, fields } = useSendEmailStore();

  const handleClick = (): void => {
    setShowMenu((c) => !c);
  };

  const fetchOptions = async (searchText: string): Promise<IOption[]> => {
    const response = (await fetchTemplateData({
      lookupName: 'StatusCode',
      lookupValue: '1',
      rowCount: 1000,
      includeCSV: 'ContentTemplateId,Name',
      searchText: searchText
    })) as ITemplateResponse;
    let templates: IOption[] = [];
    if (response && response.List && response.List.length > 0) {
      templates =
        response &&
        response.List &&
        response.List.map((option) => {
          return {
            value: option?.ContentTemplateId,
            label: option?.Name
          };
        });
    }
    return templates;
  };

  const handleOptionSelect = async (opt: IOption): Promise<void> => {
    const response = (await fetchTemplateData({
      lookupName: 'ContentTemplateId',
      lookupValue: opt.value,
      rowCount: 1,
      includeCSV:
        'ContentTemplateId,Name,Total,Content_Html_Published,Content_Text_Published,Subject_Published,Layout_Published,ContentSetting,ContentFooter,Category, Total'
    })) as ITemplateResponse;
    const templateSubject = response?.List?.[0]?.Subject_Published;
    if (templateSubject) {
      setFields({ subject: templateSubject });
    }
    const templateContent = getTemplateContent(response);
    if (templateContent) {
      setFields({ contentHTML: templateContent });
    }
    setFields({ template: opt });
    setShowMenu(false);
  };

  return (
    <>
      <div className={styles.template_selector_container} ref={containerRef} onClick={handleClick}>
        <div className={styles.template_selector_label}>Templates</div>
        <Icon
          name="arrow_drop_down"
          customStyleClass={`${styles.template_selector_arrow} ${showMenu ? styles.open : ''}`}
        />
      </div>
      {containerRef?.current && showMenu ? (
        <DropdownRenderer
          parent={containerRef?.current}
          customMenuDimension={{ height: 200, width: 300 }}
          swapOrientation
          onOutsideClick={() => {
            setShowMenu(false);
          }}>
          <TemplateSelectMenu
            fetchOptions={fetchOptions}
            onOptionSelect={handleOptionSelect}
            selectedOption={fields.template}
          />
        </DropdownRenderer>
      ) : null}
    </>
  );
};

export default TemplateSelector;
