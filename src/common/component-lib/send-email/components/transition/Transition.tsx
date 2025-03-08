import { ReactNode, useEffect, useState } from 'react';

interface ITransition {
  children: ReactNode;
  fadeInStyleClass: string;
  fadeOutStyleClass: string;
}

const Transition = ({
  children,
  fadeInStyleClass,
  fadeOutStyleClass
}: ITransition): JSX.Element => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    return (): void => {
      setVisible(false);
    };
  }, []);

  const styleClass = visible ? fadeInStyleClass : fadeOutStyleClass;

  return <div className={styleClass}>{children}</div>;
};

export default Transition;
