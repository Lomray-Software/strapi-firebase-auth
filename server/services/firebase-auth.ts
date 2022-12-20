import { Strapi } from '@strapi/strapi';
const utils = require('@strapi/utils');
import firebase, { auth } from 'firebase-admin';
import CONFIG from '../constants';

const { ApplicationError, ValidationError } = utils.errors;

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel('plugin::users-permissions.user');

  return utils.sanitize.contentAPI.output(user, userSchema, { auth });
};


export default ({ strapi }: { strapi: Strapi }) => ({
  getCredentials: () => {
    return strapi.db.query(CONFIG.dbUID).findOne({});
  },
  initFirebase: async (newCredentials?: string) => {
    const credential = newCredentials || (await strapi.plugin(CONFIG.pluginUID).service(CONFIG.serviceUID).getCredentials())?.credentials

    if (credential) {
      const credentials = JSON.parse(credential);

      firebase.initializeApp({
        credential: firebase.credential.cert(credentials),
      });
    }
  },
  saveCredentials: async (data, userId: number) => {
    const credentials = await strapi.plugin(CONFIG.pluginUID).service(CONFIG.serviceUID).getCredentials();

    if (!credentials) {
      await strapi.db.query(CONFIG.dbUID).create({ data: { ...data, created_by_id: userId } });
    } else {
      await strapi.db.query(CONFIG.dbUID).update({
        where: { id: credentials.id },
        data: { ...data, updated_by_id: userId }
      });
    }

    await strapi.plugin(CONFIG.pluginUID).service(CONFIG.serviceUID).initFirebase(data.credentials);
  },
  makeRandomPassword(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }

    return result;
  },
  getUserPhoto: (firebaseUser: auth.UserRecord): string | undefined => {
    for (const { providerId, photoURL } of firebaseUser.providerData) {
      if (providerId.includes('google')) {
        return photoURL?.replace('s96-c', 's400-c');
      } else if (providerId.includes('facebook')) {
        return `${photoURL}?type=large`;
      }
    }

    return firebaseUser.photoURL;
  },
  login: async (ctx) => {
    try {
      const token = ctx.request.body.token;

      if (!token) {
        throw new ValidationError('Token not found.');
      }

      const validToken = await firebase.auth().verifyIdToken(token);
      const firebaseUser = await firebase.auth().getUser(validToken.sub);
      const identifier = firebaseUser.uid;

      // Check if the user exists.
      let user = await strapi.query('plugin::users-permissions.user').findOne({
        where: {
          provider: 'firebase',
          username: identifier,
        },
      });

      if (user?.blocked === true || firebaseUser.disabled) {
        throw new ApplicationError('Your account has been blocked by an administrator');
      }

      // Create user if not exist
      if (!user) {
        const pluginStore = await strapi.store({ type: 'plugin', name: 'users-permissions' });
        const settings = await pluginStore.get({ key: 'advanced' });
        const role = await strapi
          .query('plugin::users-permissions.role')
          .findOne({ where: { type: settings.default_role } });

        if (!role) {
          throw new ApplicationError('Impossible to find the default role');
        }

        const password = await strapi.service("admin::auth").hashPassword(
          strapi.plugin(CONFIG.pluginUID).service(CONFIG.serviceUID).makeRandomPassword(10)
        );
        const userAttributes = strapi.contentType('plugin::users-permissions.user').attributes;

        user = await strapi.plugin('users-permissions').service('user').add({
          username: identifier,
          provider: 'firebase',
          email: firebaseUser.email || `${identifier}@unknown.email`,
          password,
          confirmed: true,
          blocked: false,
          role: role.id,
          ...(userAttributes.name ? {
            name: firebaseUser.displayName,
          } : {}),
          ...(userAttributes.phone ? {
            phone: firebaseUser.phoneNumber
          } : {}),
          ...(userAttributes.photoUrl ? {
            photoUrl: strapi.plugin(CONFIG.pluginUID).service(CONFIG.serviceUID).getUserPhoto(firebaseUser),
          } : {})
        });

        delete user.role;
      }

      return {
        user: await sanitizeUser(user, ctx),
        jwt: strapi.plugin('users-permissions').service('jwt').issue({ id: user.id }),
      };
    } catch (e) {
      throw new ApplicationError(`Failed auth: ${e.message}`);
    }
  }
});
