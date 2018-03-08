var five = require('johnny-five');

five.Board().on('ready', function() {
  console.log('ready');

  // Initialize the RGB LED
  var led = new five.Led.RGB({
    pins: {
      red: 6,
      green: 5,
      blue: 3
    }
  });

  led.on();
  led.color({red: 0, blue: 0, green: 0});

  var pubnub = require('pubnub').init({
    publish_key: 'pub-c-e6b800c0-5c28-4b3d-bdfa-8976cc531a45',
    subscribe_key: 'sub-c-c07e3554-22ee-11e8-9bf4-060db84035e6'
  });

  var channel = 'hue-clone';

  pubnub.subscribe({
    channel: channel,
    callback: setLedColor,
    connect: initLedColor,
    error: function(err) {console.log(err);}
  });

  function setLedColor(m) {
    led.color({red: m.r, blue: m.b, green: m.g});
    console.log( 'color change to...' );
    console.log( led.color() );
  }

  function initLedColor() {
    pubnub.history({
      channel: channel,
      count: 1,
      callback: function(messages) {
        messages[0].forEach(function(m) {
          setLedColor(m);
        });
      }
    });
  }

});
