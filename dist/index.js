'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ATTACHMENT_TYPE = exports.TAGS = exports.NOTIFICATION_TYPE = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NOTIFICATION_TYPE = exports.NOTIFICATION_TYPE = {
  regular: 'REGULAR',
  silent: 'SILENT_PUSH',
  none: 'NO_PUSH'
};

var TAGS = exports.TAGS = {
  accountUpdate: 'ACCOUNT_UPDATE',
  paymentUpdate: 'PAYMENT_UPDATE',
  personalFinanceUpdate: 'PERSONAL_FINANCE_UPDATE',
  shippingUpdate: 'SHIPPING_UPDATE',
  reservationUpdate: 'RESERVATION_UPDATE',
  issueResolution: 'ISSUE_RESOLUTION',
  appointmentUpdate: 'APPOINTMENT_UPDATE',
  gameEvent: 'GAME_EVENT',
  transportationUpdate: 'TRANSPORTATION_UPDATE',
  featureFunctionalityUpdate: 'FEATURE_FUNCTIONALITY_UPDATE',
  ticketUpdate: 'TICKET_UPDATE'
};

var ATTACHMENT_TYPE = exports.ATTACHMENT_TYPE = {
  audio: 'audio',
  image: 'image',
  video: 'video',
  file: 'file'
};

var host = 'https://graph.facebook.com/v2.10';

var MessengerApi = function (_EventEmitter) {
  _inherits(MessengerApi, _EventEmitter);

  function MessengerApi(config) {
    _classCallCheck(this, MessengerApi);

    var _this = _possibleConstructorReturn(this, (MessengerApi.__proto__ || Object.getPrototypeOf(MessengerApi)).call(this));

    if (!config.accessToken) throw new Error('Missing page access token. Please configurate accessToken to be the access token of the page you would like the bot to connect with');

    _this.id = config.id;
    _this.secret = config.secret;
    _this.accessToken = config.accessToken;
    _this.verifyToken = config.verifyToken;

    // Bindings
    _this.middleware = _this.middleware.bind(_this);
    return _this;
  }

  _createClass(MessengerApi, [{
    key: 'sendText',
    value: function sendText(recipientId, text, quickReplies, notificationType, tag) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _axios2.default.post(host + '/me/messages?access_token=' + _this2.accessToken, {
          recipient: {
            id: recipientId
          },
          message: {
            text: text,
            quick_replies: quickReplies
          },
          notification_type: notificationType,
          tag: tag
        }).then(function (res) {
          var data = res.data;

          if (data.error) return reject(data.error);
          resolve(data);
        }).catch(function (err) {
          reject(err);
        });
      });
    }
  }, {
    key: 'sendAttachment',
    value: function sendAttachment(recipientId, attachmentType, attachmentUrl, attachmentId, quickReplies, notificationType, tag) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _axios2.default.post(host + '/me/messages?access_token=' + _this3.accessToken, {
          recipient: {
            id: recipientId
          },
          message: {
            attachment: {
              type: attachmentType,
              payload: {
                url: attachmentUrl,
                attachment_id: attachmentId
              }
            },
            quick_replies: quickReplies
          },
          notification_type: notificationType,
          tag: tag
        }).then(function (res) {
          var data = res.data;

          if (data.error) return reject(data.error);
          resolve(data);
        }).catch(function (err) {
          reject(err);
        });
      });
    }
  }, {
    key: 'sendTemplate',
    value: function sendTemplate(recipientId, payload, notificationType, tag) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        _axios2.default.post(host + '/me/messages?access_token=' + _this4.accessToken, {
          recipient: {
            id: recipientId
          },
          message: {
            attachment: {
              type: 'template',
              payload: payload
            }
          },
          notification_type: notificationType,
          tag: tag
        }).then(function (res) {
          var data = res.data;

          if (data.error) return reject(data.error);
          resolve(data);
        }).catch(function (err) {
          reject(err);
        });
      });
    }
  }, {
    key: 'markSeen',
    value: function markSeen(recipientId) {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        _axios2.default.post(host + '/me/messages?access_token=' + _this5.accessToken, {
          recipient: {
            id: recipientId
          },
          sender_action: 'mark_seen'
        }).then(function (res) {
          var data = res.data;

          if (data.error) return reject(data.error);
          resolve(data);
        }).catch(function (err) {
          reject(err);
        });
      });
    }
  }, {
    key: 'setTyping',
    value: function setTyping(recipientId) {
      var _this6 = this;

      var typing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      return new Promise(function (resolve, reject) {
        _axios2.default.post(host + '/me/messages?access_token=' + _this6.accessToken, {
          recipient: {
            id: recipientId
          },
          sender_action: typing ? 'typing_on' : 'typing_off'
        }).then(function (res) {
          var data = res.data;

          if (data.error) return reject(data.error);
          resolve(data);
        }).catch(function (err) {
          reject(err);
        });
      });
    }
  }, {
    key: 'getProfile',
    value: function getProfile(recipientId) {
      var _this7 = this;

      return new Promise(function (resolve, reject) {
        _axios2.default.get(host + '/' + recipientId, {
          params: {
            fields: 'first_name,last_name,profile_pic,gender,locale',
            access_token: _this7.accessToken
          }
        }).then(function (res) {
          var data = res.data;

          if (data.error) return reject(data.error);
          resolve(data);
        }).catch(function (err) {
          reject(err);
        });
      });
    }
  }, {
    key: 'setPersistentMenu',
    value: function setPersistentMenu(persistentMenu) {
      return this.setMessengerProfile({
        persistent_menu: persistentMenu
      });
    }
  }, {
    key: 'removePersistentMenu',
    value: function removePersistentMenu() {
      return this.deleteMessengerProfile(['persistent_menu']);
    }
  }, {
    key: 'setGetStartedButton',
    value: function setGetStartedButton(payload) {
      return this.setMessengerProfile({
        get_started: {
          payload: payload
        }
      });
    }
  }, {
    key: 'removeGetStartedButton',
    value: function removeGetStartedButton() {
      return this.deleteMessengerProfile(['get_started']);
    }
  }, {
    key: 'setGreetingText',
    value: function setGreetingText(greeting) {
      return this.setMessengerProfile({
        greeting: greeting
      });
    }
  }, {
    key: 'removeGreetingText',
    value: function removeGreetingText() {
      return this.deleteMessengerProfile(['greeting']);
    }
  }, {
    key: 'setWhitelistedDomains',
    value: function setWhitelistedDomains(domains) {
      return this.setMessengerProfile({
        whitelisted_domains: domains
      });
    }
  }, {
    key: 'removeWhitelistedDomains',
    value: function removeWhitelistedDomains() {
      return this.deleteMessengerProfile(['whitelisted_domains']);
    }
  }, {
    key: 'setChatExtensionHomeURL',
    value: function setChatExtensionHomeURL(url) {
      var sharable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var inTest = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      return this.setMessengerProfile({
        home_url: {
          url: url,
          webview_height_ratio: 'tall',
          webview_share_button: sharable ? 'show' : 'hide',
          in_test: in_test
        }
      });
    }
  }, {
    key: 'removeChatExtensionHomeURL',
    value: function removeChatExtensionHomeURL() {
      return this.deleteMessengerProfile(['home_url']);
    }
  }, {
    key: 'setMessengerProfile',
    value: function setMessengerProfile(fields) {
      var _this8 = this;

      return new Promise(function (resolve, reject) {
        _axios2.default.post(host + '/me/messenger_profile?access_token=' + _this8.accessToken, fields).then(function (res) {
          var data = res.data;

          if (data.error) return reject(data.error);
          resolve(data);
        }).catch(function (err) {
          reject(err);
        });
      });
    }
  }, {
    key: 'deleteMessengerProfile',
    value: function deleteMessengerProfile(fields) {
      var _this9 = this;

      return new Promise(function (resolve, reject) {
        _axios2.default.delete(host + '/me/messenger_profile?access_token=' + _this9.accessToken, {
          fields: fields
        }).then(function (res) {
          var data = res.data;

          if (data.error) return reject(data.error);
          resolve(data);
        }).catch(function (err) {
          reject(err);
        });
      });
    }
  }, {
    key: 'subscribe',
    value: function subscribe() {
      var _this10 = this;

      return new Promise(function (resolve, reject) {
        _axios2.default.post(host + '/me/subscribed_apps?access_token=' + _this10.accessToken, {}).then(function (res) {
          var data = res.data;

          if (data.error) return reject(data.error);
          if (!data.success) return reject(data);
          resolve(data);
        }).catch(function (err) {
          reject(err);
        });
      });
    }
  }, {
    key: 'updateNLP',
    value: function updateNLP(enabled, token) {
      var _this11 = this;

      return new Promise(function (resolve, reject) {
        _axios2.default.post(host + '/me/nlp_configs?nlp_enabled=' + enabled + '&custom_token=' + token, {
          access_token: _this11.accessToken
        }).then(function (res) {
          var data = res.data;

          if (data.error) return reject(data.error);
          resolve();
        }).catch(function (err) {
          reject(err);
        });
      });
    }
  }, {
    key: 'middleware',
    value: function middleware(req, res) {
      var _this12 = this;

      if (req.method === 'GET') return this._handleVerify(req, res);

      if (req.method !== 'POST') return;

      var data = req.body;

      if (data.object !== 'page') return;

      data.entry.map(function (entry) {
        var pageId = entry.id;
        var time = entry.time;

        if (!entry.messaging) return;

        entry.messaging.map(function (event) {
          var sender = event.sender,
              postback = event.postback,
              message = event.message,
              referral = event.referral;


          if (postback) return _this12._handlePostback(sender.id, pageId, postback);

          if (message && !message.is_echo) return _this12._handleMessage(sender.id, pageId, message);

          if (referral) return _this12._handleReferral(sender.id, pageId, referral);
        });
      });

      res.sendStatus(200);
    }

    /**
      .on('postback', (senderId, pageId, payload, { referral: { ref, source } }))
    */

  }, {
    key: '_handlePostback',
    value: function _handlePostback(senderId, pageId, postback) {
      var payload = postback.payload,
          referral = postback.referral;

      this.emit('postback', senderId, pageId, payload, referral);
    }

    /**
      .on('attachments', (senderId, pageId, attachments: [ { type, payload: { url } } ] ))
      .on('message', (senderId, pageId, text, nlp: { entities: { } } ))
    */

  }, {
    key: '_handleMessage',
    value: function _handleMessage(senderId, pageId, message) {
      var attachments = message.attachments,
          text = message.text,
          nlp = message.nlp,
          quick_reply = message.quick_reply;


      if (attachments && attachments.length !== 0) return this.emit('attachments', senderId, pageId, attachments);

      if (quick_reply && quick_reply.payload) return this.emit('postback', senderId, pageId, quick_reply.payload);

      this.emit('message', senderId, pageId, text, nlp);
    }

    /**
      .on('referral', (senderId, pageId, referral: { ref, ad_id, source, type } ))
    */

  }, {
    key: '_handleReferral',
    value: function _handleReferral(senderId, pageId, referral) {
      this.emit('referral', senderId, pageId, referral);
    }
  }, {
    key: '_handleVerify',
    value: function _handleVerify(req, res) {
      if (req.query['hub.verify_token'] === this.verifyToken) return res.send(req.query['hub.challenge']);

      res.end('Error, wrong validation token');
    }
  }]);

  return MessengerApi;
}(_events.EventEmitter);

exports.default = MessengerApi;