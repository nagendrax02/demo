var lsqMarvinExternalAppIntegrator;
(() => {
  'use strict';
  var e = {
      d: (a, t) => {
        for (var o in t)
          e.o(t, o) && !e.o(a, o) && Object.defineProperty(a, o, { enumerable: !0, get: t[o] });
      },
      o: (e, a) => Object.prototype.hasOwnProperty.call(e, a)
    },
    a = {};
  (() => {
    e.d(a, { default: () => s });
    const t = (e, a) => {
        try {
          (window.self !== window.top ? window.parent : window).postMessage(a, '*', [e.port2]);
        } catch (e) {
          console.log('Error in postMessage :', e);
        }
      },
      o = (e, a) => {
        const o = new MessageChannel();
        t(o, a);
        const n = (e) => {
          o.port1.postMessage(e);
        };
        o.port1.onmessage = (a) => {
          e.callBackFn(a.data, n);
        };
      },
      n = (e) => {
        const a = new MessageChannel();
        t(a, e);
      },
      s = {
        actionDispatcher: {
          openEntityDetails: (e) => {
            n({ type: 'OPEN_ENTITY_DETAILS', payload: e });
          },
          openForm: (e, a) => {
            a && a.onSuccess && (a.onSuccess = void 0), o(e, { type: 'OPEN_FORM', payload: a });
          },
          showAlert: (e) => {
            n({ type: 'SHOW_ALERT', payload: e });
          },
          showTour: (e) => {
            n({ type: 'SHOW_TOUR', payload: e });
          },
          getProcessForms: (e, a, t) => {
            o(e, { type: 'GET_PROCESS_FORMS', payload: { events: a, opportunityCode: t } });
          },
          reload: () => {
            n({ type: 'RELOAD' });
          },
          signOut: () => {
            n({ type: 'SIGN_OUT' });
          },
          reIssueTokens: (e) => {
            o(e, { type: 'RE_ISSUE_TOKENS' });
          },
          broadcastMessage: (e) => {
            n({ type: 'BROADCAST_MESSAGE', payload: e });
          },
          updateUrl: (e) => {
            n({ type: 'UPDATE_URL', payload: e });
          },
          closeEntityDetails: (e) => {
            n({ type: 'CLOSE_ENTITY_DETAILS', payload: e });
          },
          registerActions: (e, a) => {
            ((e, a) => {
              const o = new MessageChannel();
              t(o, a),
                (o.port1.onmessage = async (t) => {
                  const o = await e.callBackFn(t.data, void 0);
                  o &&
                    ((e) => {
                      const { action: a } = e;
                      n({ type: `${a.type}_RESPONSE`, payload: e });
                    })({ callbackResponse: o, action: a });
                });
            })(e, { type: 'ACTION_REGISTRATION', payload: a });
          },
          invokeClick2Call: (e) => {
            n({ type: 'TRIGGER_CALL', payload: e });
          },
          openInNewTab: (e) => {
            n({ type: 'OPEN_IN_NEW_TAB', payload: e });
          }
        },
        context: {
          get: (e) => {
            o(e, { type: 'GET_CONTEXT' });
          }
        },
        eventSubscriber: {
          onThemeChange: (e) => {
            o(e, { type: 'ON_THEME_CHANGE' });
          },
          onLanguageChange: (e) => {
            o(e, { type: 'ON_LANGUAGE_CHANGE' });
          },
          onSignOut: (e) => {
            o(e, { type: 'ON_SIGN_OUT' });
          },
          onClick2Call: (e) => {
            o(e, { type: 'ON_CLICK_2_CALL' });
          },
          onBroadCastMessageReceived: (e, a) => {
            o(e, { type: 'ON_BROADCAST_MESSAGE_RECEIVED', payload: a });
          },
          subscribeToActionBroadcast: (e) => {
            o(e, { type: 'SUBSCRIBE_TO_BROADCAST' });
          },
          onExternalAppLoad: (e) => {
            o(e, { type: 'SUBSCRIBE_TO_EXTERNAL_APP_LOAD' });
          }
        }
      };
  })(),
    (lsqMarvinExternalAppIntegrator = a.default);
})();
