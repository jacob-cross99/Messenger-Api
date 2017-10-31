import { EventEmitter } from 'events';

import axios from 'axios';

export const NOTIFICATION_TYPE = {
  regular: 'REGULAR',
  silent: 'SILENT_PUSH',
  none: 'NO_PUSH'
};

export const TAGS = {
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

export const ATTACHMENT_TYPE = {
  audio: 'audio',
  image: 'image',
  video: 'video',
  file: 'file'
};

const host = 'https://graph.facebook.com/v2.10';

export default class MessengerApi extends EventEmitter {
  constructor(config) {
    super()

    if(!config.accessToken)
      throw new Error('Missing page access token. Please configurate accessToken to be the access token of the page you would like the bot to connect with');

    this.id = config.id;
    this.secret = config.secret;
    this.accessToken = config.accessToken;
    this.verifyToken = config.verifyToken;

    // Bindings
    this.middleware = this.middleware.bind(this);
  }

  sendText(recipientId, text, quickReplies, notificationType, tag) {
    return new Promise((resolve, reject) => {
      axios.post(`${ host }/me/messages?access_token=${ this.accessToken }`, {
        recipient: {
          id: recipientId
        },
        message: {
          text,
          quick_replies: quickReplies,
        },
        notification_type: notificationType,
        tag
      }).then(res => {
        const { data } = res;
        if(data.error) return reject(data.error);
        resolve(data);
      }).catch(err => {
        reject(err);
      });
    });
  }

  sendAttachment(recipientId, attachmentType, attachmentUrl, attachmentId,  quickReplies, notificationType, tag) {
    return new Promise((resolve, reject) => {
      axios.post(`${ host }/me/messages?access_token=${ this.accessToken }`, {
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
          quick_replies: quickReplies,
        },
        notification_type: notificationType,
        tag
      }).then(res => {
        const { data } = res;
        if(data.error) return reject(data.error);
        resolve(data);
      }).catch(err => {
        reject(err);
      });
    });
  }

  sendTemplate(recipientId, payload, notificationType, tag) {
    return new Promise((resolve, reject) => {
      axios.post(`${ host }/me/messages?access_token=${ this.accessToken }`, {
        recipient: {
          id: recipientId
        },
        message: {
          attachment: {
            type: 'template',
            payload
          }
        },
        notification_type: notificationType,
        tag
      }).then(res => {
        const { data } = res;
        if(data.error) return reject(data.error);
        resolve(data);
      }).catch(err => {
        reject(err);
      });
    });
  }

  markSeen(recipientId) {
    return new Promise((resolve, reject) => {
      axios.post(`${ host }/me/messages?access_token=${ this.accessToken }`, {
        recipient: {
          id: recipientId
        },
        sender_action: 'mark_seen'
      }).then(res => {
        const { data } = res;
        if(data.error) return reject(data.error);
        resolve(data);
      }).catch(err => {
        reject(err);
      });
    });
  }

  setTyping(recipientId, typing = false) {
    return new Promise((resolve, reject) => {
      axios.post(`${ host }/me/messages?access_token=${ this.accessToken }`, {
        recipient: {
          id: recipientId
        },
        sender_action: (typing ? 'typing_on':'typing_off')
      }).then(res => {
        const { data } = res;
        if(data.error) return reject(data.error);
        resolve(data);
      }).catch(err => {
        reject(err);
      });
    });
  }

  getProfile(recipientId) {
    return new Promise((resolve, reject) => {
      axios.get(`${ host }/${ recipientId }`, {
        params: {
          fields: 'first_name,last_name,profile_pic,gender,locale',
          access_token: this.accessToken
        }
      }).then(res => {
        const { data } = res;
        if(data.error) return reject(data.error);
        resolve(data);
      }).catch(err => {
        reject(err);
      });
    });
  }

  setPersistentMenu(persistentMenu) {
    return this.setMessengerProfile({
      persistent_menu: persistentMenu
    });
  }

  removePersistentMenu() {
    return this.deleteMessengerProfile([
      'persistent_menu'
    ]);
  }

  setGetStartedButton(payload) {
    return this.setMessengerProfile({
      get_started: {
        payload
      }
    });
  }

  removeGetStartedButton() {
    return this.deleteMessengerProfile([
      'get_started'
    ]);
  }

  setGreetingText(greeting) {
    return this.setMessengerProfile({
      greeting
    });
  }

  removeGreetingText() {
    return this.deleteMessengerProfile([
      'greeting'
    ]);
  }

  setWhitelistedDomains(domains) {
    return this.setMessengerProfile({
      whitelisted_domains: domains
    });
  }

  removeWhitelistedDomains() {
    return this.deleteMessengerProfile([
      'whitelisted_domains'
    ]);
  }

  setChatExtensionHomeURL(url, sharable = false, inTest = false) {
    return this.setMessengerProfile({
      home_url: {
        url,
        webview_height_ratio: 'tall',
        webview_share_button: (sharable ? 'show':'hide'),
        in_test
      }
    })
  }

  removeChatExtensionHomeURL() {
    return this.deleteMessengerProfile([
      'home_url'
    ]);
  }

  setMessengerProfile(fields) {
    return new Promise((resolve, reject) => {
      axios.post(`${ host }/me/messenger_profile?access_token=${ this.accessToken }`, fields).then(res => {
        const { data } = res;
        if(data.error) return reject(data.error);
        resolve(data);
      }).catch(err => {
        reject(err);
      });
    });
  }

  deleteMessengerProfile(fields) {
    return new Promise((resolve, reject) => {
      axios.delete(`${ host }/me/messenger_profile?access_token=${ this.accessToken }`, {
        fields
      }).then(res => {
        const { data } = res;
        if(data.error) return reject(data.error);
        resolve(data);
      }).catch(err => {
        reject(err);
      });
    });
  }

  subscribe() {
    return new Promise((resolve, reject) => {
      axios.post(`${ host }/me/subscribed_apps?access_token=${ this.accessToken }`, {
      }).then(res => {
        const { data } = res;
        if(data.error) return reject(data.error);
        if(!data.success) return reject(data);
        resolve(data);
      }).catch(err => {
        reject(err);
      });
    });
  }

  updateNLP(enabled, token) {
    return new Promise((resolve, reject) => {
      axios.post(`${ host }/me/nlp_configs?nlp_enabled=${ enabled }&custom_token=${ token }`, {
        access_token: this.accessToken
      }).then(res => {
        const { data } = res;
        if(data.error) return reject(data.error);
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }

  middleware(req, res) {
    if(req.method === 'GET')
      return this._handleVerify(req, res);

    if(req.method !== 'POST') return;

    const data = req.body;

    if(data.object !== 'page') return;

    data.entry.map(entry => {
      const pageId = entry.id;
      const time = entry.time;

      if(!entry.messaging) return;

      entry.messaging.map(event => {
        const { sender, postback, message, referral } = event;

        if(postback)
          return this._handlePostback(sender.id, pageId, postback);

        if(message && !message.is_echo)
          return this._handleMessage(sender.id, pageId, message);

        if(referral)
          return this._handleReferral(sender.id, pageId, referral);
      });
    });

    res.sendStatus(200);
  }

  /**
    .on('postback', (senderId, pageId, payload, { referral: { ref, source } }))
  */
  _handlePostback(senderId, pageId, postback) {
    const { payload, referral } = postback;
    this.emit('postback', senderId, pageId, payload, referral);
  }

  /**
    .on('attachments', (senderId, pageId, attachments: [ { type, payload: { url } } ] ))
    .on('message', (senderId, pageId, text, nlp: { entities: { } } ))
  */
  _handleMessage(senderId, pageId, message) {
    const { attachments, text, nlp, quick_reply } = message;

    if(attachments && attachments.length !== 0)
      return this.emit('attachments', senderId, pageId, attachments);

    if(quick_reply && quick_reply.payload)
      return this.emit('postback', senderId, pageId, quick_reply.payload);

    this.emit('message', senderId, pageId, text, nlp);
  }

  /**
    .on('referral', (senderId, pageId, referral: { ref, ad_id, source, type } ))
  */
  _handleReferral(senderId, pageId, referral) {
    this.emit('referral', senderId, pageId, referral);
  }

  _handleVerify(req, res) {
    if(req.query['hub.verify_token'] === this.verifyToken)
      return res.send(req.query['hub.challenge']);

    res.end('Error, wrong validation token');
  }
}