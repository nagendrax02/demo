class SWLiteLoader {
  static enabled = false;
  static platformUrl = window.location.origin;

  static Events = class {
    static PageInit = 'swlite-platform-page-init';
    static PageLoaded = 'swlite-platform-page-loaded';
    static PageLoading = 'swlite-platform-page-loading';
    static PageNavigate = 'swlite-platform-page-navigate';
  };

  start() {
    this.sendMessage({ type: SWLiteLoader.Events.PageInit });
    this.subscribe();
  }

  subscribe() {
    //Wait for message from SWLite
    window.addEventListener('message', (event) => {
      if (event.data?.type == SWLiteLoader.Events.PageInit && event.data?.enabled) {
        SWLiteLoader.enabled = true;
      }
    });

    //Apply when DOM is ready
    document.addEventListener('readystatechange', (event) => {
      if (event.target.readyState === 'complete') {
        if (SWLiteLoader.enabled) {
          this.apply(event);
        }
      }
    });
  }

  apply() {
    try {
      this.handleUIElements();
      this.handlePageLoading();
      this.handlePageClicks();

      this.sendMessage({
        title: document.title,
        type: SWLiteLoader.Events.PageLoaded,
        path: document.location.pathname.concat(document.location.search)
      });
    } catch (e) {
      console.error('Error while applying swlite changes', e);
    }
  }

  handlePageClicks() {
    window.addEventListener('click', (event) => {
      const target = event.target;
      //Navigate using SWLite if within same platform origin.
      if (
        target.tagName == 'A' &&
        target.href?.startsWith(SWLiteLoader.platformUrl) &&
        target.closest('#AccountGrid') //Account Management Page
      ) {
        event.preventDefault();
        event.stopPropagation();
        const url = target.pathname.concat(target.search);
        //Send message to SWLite to navigate to the new page
        this.sendMessage({ type: SWLiteLoader.Events.PageNavigate, path: url });
      }
    });
  }

  handleUIElements() {
    //Hide UI Elements
    $('#marvin_bootstrap_frame').remove(); //For stopping Marvin Bootstrap SSO token request
    $('#mx-site-header').addClass('hide-menu');
    $('#mx-site-footer').css('display', 'none');
    $('#cico-container').css('display', 'none'); //Remove checkin/out container
  }

  handlePageLoading() {
    window.addEventListener('beforeunload', () => {
      this.sendMessage({ type: SWLiteLoader.Events.PageLoading });
    });
  }

  sendMessage(message) {
    //Send message to swlite
    window.parent.postMessage(message, '*');
  }
}

const swLiteLoader = new SWLiteLoader();
swLiteLoader.start();
