import { Strapi } from '@strapi/strapi';
import CONFIG from './constants';

export default async ({ strapi }: { strapi: Strapi }) => {
  try {
    await strapi.plugin(CONFIG.pluginUID).service(CONFIG.serviceUID).initFirebase();
  } catch (e) {
    console.error('Failed initialize firebase: ', e)
  }
};
