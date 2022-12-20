import { Strapi } from '@strapi/strapi';
import CONFIG from '../constants';

export default ({ strapi }: { strapi: Strapi }) => ({
  getCredentials: async (ctx) => {
    ctx.body = await strapi
      .plugin(CONFIG.pluginUID)
      .service(CONFIG.serviceUID)
      .getCredentials();
  },
  save: async (ctx) => {
    await strapi
      .plugin(CONFIG.pluginUID)
      .service(CONFIG.serviceUID)
      .saveCredentials(ctx.request.body, ctx.state.user.id);

    ctx.body = { status: true };
  },
  login: async (ctx) => {
    return strapi
      .plugin(CONFIG.pluginUID)
      .service(CONFIG.serviceUID)
      .login(ctx);
  }
});
