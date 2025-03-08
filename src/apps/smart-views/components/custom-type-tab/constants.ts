const ACTIONS = {
  INCOMING: {
    OPEN_POPUP: 'openPopup',
    CLOSE_POPUP: 'closePopup',
    SET_RECORD_COUNT: 'setRecordCount',
    SET_ADVANCED_SEARCH: 'setAdvancedSearch',
    INITIAL_DATA_REQUEST: 'initialDataRequest',
    CLOSE_ADVANCED_SEARCH: 'closeAdvancedSearch',
    POST_TO_GRID: 'postToGrid'
  },
  OUTGOING: {
    SET_INITIAL_CUSTOM_TAB_DATA: 'setInitialCustomTabData',
    CUSTOM_TAB_POPUP_MESSAGE: 'customTabPopupMessage'
  }
};

const TYPES = {
  INCOMING: {
    SMARTVIEWS_GRID_MESSAGE: 'SmartViewsGridMessage',
    SMARTVIEWS_POPUP_MESSAGE: 'SmartViewsPopupMessage'
  },
  OUTGOING: {
    SMARTVIEWS_CONTAINER_MESSAGE: 'SmartViewsContainerMessage'
  }
};

export { ACTIONS, TYPES };
