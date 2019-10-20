$(() => {
  const socket = io();
  const history = window.history.length;
  const _url = window.location.href;
  const cutUrl = `/${_url.split('/')[4]}`;
  let socketHost;
  function getHiddenProp() {
    const prefixes = ['webkit', 'moz', 'ms', 'o'];
    // test for native support
    if ('hidden' in document) return 'hidden';
    // find prefixes
    for (let i = 0; i < prefixes.length; i += 1) {
      if ((`${prefixes[i]}Hidden`) in document) { return `${prefixes[i]}Hidden`; }
    }
    // otherwise it's not supported
    return null;
  }

  const visProp = getHiddenProp();
  if (visProp) {
    const evtname = `${visProp.replace(/[H|h]idden/, '')}visibilitychange`;
    document.addEventListener(evtname, changeEventListener, false);
  } else {
    console.log('Page Visibility API doesnt support !');
  }

  function changeEventListener() {
    if (!document[visProp]) {
      socket.emit('pageActive handler', [cutUrl, 1]);
      socket.emit('pageActive', _url);
      activeState = 1;
    } else {
      socket.emit('pageActive handler', [cutUrl, 0]);
      $('#imgMessage').empty();
      activeState = 0;
    }
    return activeState;
  }

  socket.emit('new client', [_url, history]);

  socket.on('host pass', (SOCKET_HOST) => {
    socketHost = SOCKET_HOST;
  });

  socket.on('redirect warn', (destination) => {
    window.location.href = destination;
  });

  socket.on('browser warning', (destination) => {
    window.location.href = destination;
  });

  socket.on('img receive', (msg) => {
    if ($('#imgMessage').find('#showBanner').length === 1) {
      console.log($('#showBanner').attr('name').split(',') === msg[1]);
      if ($('#showBanner').attr('name').split(',') !== msg[1]) {
        $('#showBanner').fadeOut(1000, () => {
          $('#imgMessage').empty().append(`<img src= ${msg[0]} id='showBanner' name= ${msg[1]} width = '100%' height = '100%'>`);
        }).fadeIn(1000);
      }
    } else {
      $('#imgMessage').empty().append(`<img src= ${msg[0]} id='showBanner' name= ${msg[1]} width = '100%' height = '100%'>`);
    }
  });

  socket.on('response banner data to server', () => {
    if ($('#showBanner').attr('name')) {
      const cutBannerName = $('#showBanner').attr('name').split(',');
      socket.emit('write to db', cutBannerName);
    }
  });

  socket.on('reRender at client', () => {
    const bannerName = $('#showBanner').attr('name');
    socket.emit('reRender', [_url, bannerName]);
  });

  socket.on('img clear', () => {
    $('#imgMessage').empty();
  });

  socket.on('error page', () => {
    const destination = `${socketHost}/error`;
    window.location.href = destination;
  });
});
