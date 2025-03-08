import { classNames } from 'common/utils/helpers';
import styles from './modules.module.css';
import { PRODUCT_BADGE_TEXT_MAP } from '../../constants';

interface IProductTagProps {
  type?: string;
}

/**
 * Displays a product tag badge for a certain modules. eg: Ace, Casa.
 */

const ProductTag = ({ type }: IProductTagProps): JSX.Element | null => {
  if (type && PRODUCT_BADGE_TEXT_MAP?.[type]) {
    return (
      <div className={styles.product_tag}>
        <div className={classNames(styles.product_tag_label, 'ng_p_2_b', 'ng_v2_style')}>
          {PRODUCT_BADGE_TEXT_MAP?.[type]}
        </div>
      </div>
    );
  }
  return null;
};

ProductTag.defaultProps = {
  type: undefined
};

export default ProductTag;
