import FroalaEditor from 'froala-editor';
import Tribute from 'tributejs';
import { TRIBUTEJS_OPTIONS } from '../constants';
import { IMailMergeOption } from '../../send-email/send-email.types';

const handleTribute = ({
  event,
  tribute,
  tributePosition,
  menuTitle
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event: any;
  tribute: Tribute<never>;
  tributePosition: number[];
  menuTitle?: string;
}): boolean => {
  if (event.which === FroalaEditor.KEYCODE.ENTER && tribute.isActive) {
    return false;
  }
  if (event.which === 50) {
    setTimeout(() => {
      const tributeContainer = document.getElementsByClassName(TRIBUTEJS_OPTIONS.containerClass)[0];
      if (tributePosition?.length) {
        tributePosition?.forEach((pos) => {
          const el = tributeContainer?.querySelector(`[data-index="${pos}"]`);
          if (el) {
            el.classList.add('mail-merge-menu-title');
            if (menuTitle) {
              (el as HTMLLIElement).title = menuTitle as string;
            }
            (el as HTMLLIElement).style.pointerEvents = 'unset';
          }
        });
      }
    }, 1);
  }
  return true;
};

const initializeTribute = (
  mailMergeOptions: IMailMergeOption[],
  tribute: Tribute<never>,
  setTributeHeadingPos: React.Dispatch<React.SetStateAction<number[]>>
): void => {
  const tributeHeadingCurrentPos: number[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let last: any = -1;
  const options = mailMergeOptions?.flatMap((obj) => {
    tributeHeadingCurrentPos.push(
      last === -1
        ? 0
        : tributeHeadingCurrentPos[tributeHeadingCurrentPos.length - 1] + last.options.length + 1
    );
    last = obj;
    return [
      {
        key: obj.label,
        value: '-1'
      },
      ...obj.options.map(({ value: valueOfObj, label }) => ({
        key: label,
        value: valueOfObj
      }))
    ];
  });
  setTributeHeadingPos(tributeHeadingCurrentPos);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
  const tributeObj = tribute as any;
  tributeObj.collection[0].values = options ?? [];
};

export { handleTribute, initializeTribute };
