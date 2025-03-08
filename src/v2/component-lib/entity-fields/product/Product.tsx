import { trackError } from 'common/utils/experience/utils/track-error';
import { useEffect, useState } from 'react';
import { getProductNames, productValueHandler } from 'common/utils/helpers/product-names';
import { CallerSource } from 'common/utils/rest-client';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import { isValidGUID, classNames as cn } from 'common/utils/helpers/helpers';
import commonStyle from '../common-style.module.css';

export interface IProduct {
  value: string;
  className?: string;
  callerSource: CallerSource;
}

const Product = ({ value = '', callerSource, className }: IProduct): JSX.Element => {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState<string>(value);

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        if (isValidGUID(value.split(',')[0])) {
          await productValueHandler().getApiPromise();

          const response = await getProductNames([...value.split(',')], callerSource);
          if (response) {
            setName(Object.values(response).join(','));
          }
        } else {
          setName(value);
        }
      } catch (err) {
        trackError(err);
      }
      setLoading(false);
    })();
  }, [value]);

  return (
    <>
      {loading ? (
        <Shimmer width="160px" height="20px" />
      ) : (
        <span className={cn(className, commonStyle.ellipsis)} title={name}>
          {name}
        </span>
      )}
    </>
  );
};

Product.defaultProps = {
  className: ''
};

export default Product;
