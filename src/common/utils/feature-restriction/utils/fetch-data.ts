import { trackError } from 'common/utils/experience/utils/track-error';
import { API_ROUTES } from '../../../constants';
import { CallerSource, httpGet, Module } from '../../rest-client';
import { PROMISE_KEY } from '../constants';
import {
  IRestrictionData,
  IRawUserAction,
  UserActions,
  UserRestrictions
} from '../feature-restriction.types';
import {
  getCachedUserActions,
  getCachedUserRestrictions,
  setUserActionsInCache,
  setUserRestrictionsInCache
} from './cache-data';

export const getUserRestrictions = async (
  callerSource: CallerSource
): Promise<UserRestrictions> => {
  try {
    const cachedData = await getCachedUserRestrictions();
    if (cachedData) return cachedData;

    const existingPromise = window[PROMISE_KEY.USER_RESTRICTION] as
      | Promise<UserRestrictions>
      | undefined;

    if (existingPromise) {
      const response = await existingPromise;
      const augmentedResponse = new Map(Object.entries(response));
      setUserRestrictionsInCache(augmentedResponse);
      return augmentedResponse;
    } else {
      const promise = httpGet({
        path: `${API_ROUTES.featureRestrictionGroupValue}?forceFail=true`,
        module: Module.Permission,
        callerSource: callerSource
      }) as Promise<UserRestrictions>;
      window[PROMISE_KEY.USER_RESTRICTION] = promise;

      try {
        const response = await promise;
        const augmentedResponse = new Map(Object.entries(response));
        setUserRestrictionsInCache(augmentedResponse);
        return augmentedResponse;
      } catch (error) {
        trackError(error);
        delete window[PROMISE_KEY.USER_RESTRICTION];
      }
    }
  } catch (err) {
    trackError(err);
  }
  return new Map();
};

export const getUserActions = async (callerSource: CallerSource): Promise<UserActions> => {
  try {
    const cachedData = await getCachedUserActions();
    if (cachedData) return cachedData;

    const existingPromise = window[PROMISE_KEY.USER_ACTION] as
      | Promise<IRawUserAction[]>
      | undefined;
    if (existingPromise) {
      const response = await existingPromise;
      const augmentedResponse = new Map(
        response.map((i: IRawUserAction) => [`${i.GroupName}-${i.Name}`, i.ExpValue])
      );
      setUserActionsInCache(augmentedResponse);
      return augmentedResponse;
    } else {
      const promise = httpGet({
        path: `${API_ROUTES.featureRestrictionActionGet}?useCache=true&forceFail=true`,
        module: Module.Permission,
        callerSource: callerSource
      }) as Promise<IRawUserAction[]>;

      window[PROMISE_KEY.USER_ACTION] = promise;

      try {
        const response = await promise;
        const augmentedResponse = new Map(
          response.map((i: IRawUserAction) => [`${i.GroupName}-${i.Name}`, i.ExpValue])
        );
        setUserActionsInCache(augmentedResponse);
        return augmentedResponse;
      } catch (error) {
        trackError(error);
        delete window[PROMISE_KEY.USER_ACTION];
      }
    }
  } catch (err) {
    trackError(err);
  }
  return new Map();
};

export const getFeatureRestrictionData = async (
  callerSource: CallerSource
): Promise<IRestrictionData> => {
  const [userRestrictions, userActions] = await Promise.all([
    getUserRestrictions(callerSource),
    getUserActions(callerSource)
  ]);

  return {
    userRestrictions,
    userActions
  };
};
