import { useEffect, useState } from 'react';
import { useEntityAttributeDetailsStore } from '../../store/entity-attribute-details-store';
import Section from './Section';
import styles from './sections.module.css';
import { IAugmentedAttributes } from 'apps/entity-details/types/entity-data.types';
import { getFilteredAttributes, highlightFields } from '../utils/general';

const getCount = (attributes: IAugmentedAttributes[]): number => {
  let count = 0;
  attributes?.forEach((item) => {
    count += item?.fields?.length || 0;
  });
  return count;
};

const Sections = (): JSX.Element => {
  const { augmentedAttributes, hideFields, setCount, searchValue, setMatchedHighlightCount } =
    useEntityAttributeDetailsStore();
  const [attributes, setAttributes] = useState<IAugmentedAttributes[]>();

  useEffect(() => {
    const attributesConfig = hideFields
      ? getFilteredAttributes(augmentedAttributes)
      : augmentedAttributes;
    const highlightedAttributes = highlightFields(attributesConfig || [], searchValue);
    setAttributes(attributesConfig);
    setCount(getCount(attributesConfig));
    setAttributes(highlightedAttributes?.attributes);
    setMatchedHighlightCount(highlightedAttributes?.matchedCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [augmentedAttributes, hideFields, searchValue]);

  return (
    <div data-testid="ead-sections" className={styles.sections}>
      {attributes?.map((section) => {
        return <>{section?.fields?.length ? <Section key={section?.id} data={section} /> : null}</>;
      })}
    </div>
  );
};

export default Sections;
