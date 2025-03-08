import { trackError } from 'common/utils/experience/utils/track-error';
import { useEffect, useState } from 'react';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import Shimmer from '@lsq/nextgen-preact/shimmer';

interface IFromUser {
  id: string;
}

interface IUserDetails {
  Options: { category: string; isDefault: boolean; label: string; text: string; value: string }[];
}

const FromUser = ({ id }: IFromUser): JSX.Element => {
  const [fromUserEmail, setFromUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getUserEmailId = async (): Promise<void> => {
      if (!fromUserEmail) {
        try {
          setIsLoading(true);
          const response: IUserDetails = await httpPost({
            path: '/UserDetails/GetByIds',
            module: Module.Marvin,
            body: [id],
            callerSource: CallerSource.ActivityHistoryEmailActivity
          });
          const emailId = response?.Options?.[0]?.text || '';
          setFromUserEmail(emailId);
          setIsLoading(false);
        } catch (error) {
          trackError(error);
          setIsLoading(false);
        }
      }
    };
    getUserEmailId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return <>{isLoading ? <Shimmer height="18px" width="150px" /> : `(${fromUserEmail})`}</>;
};

export default FromUser;
