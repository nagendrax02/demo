import React, { ReactNode } from 'react';
import { IHeader } from './header.types';
import { isMiP } from 'common/utils/helpers';
import LoginMenu from './components/LoginSection';
import Profile from '../header/components/profile';

interface IPostLogin {
  postLoginMenu: IHeader[];
}

const PostLogin = ({ postLoginMenu }: IPostLogin): ReactNode => {
  if (isMiP() && postLoginMenu) {
    return <LoginMenu loginItems={postLoginMenu} />;
  }

  if (!isMiP() && postLoginMenu) {
    return <Profile loginItems={postLoginMenu} />;
  }

  return null;
};

export default PostLogin;
