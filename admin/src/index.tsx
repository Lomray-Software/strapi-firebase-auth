// @ts-ignore
import React from 'react';
import { prefixPluginTranslations } from '@strapi/helper-plugin';
// @ts-ignore
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import pluginPermissions from './permissions';
import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';

const name = pluginPkg.strapi.name;

export default {
  register(app) {
    app.createSettingSection(
      {
        id: pluginId,
        intlLabel: {
          id: `${pluginId}.plugin.name`,
          defaultMessage: 'Firebase Credentials',
        },
      },
      [{
      to: `/settings/${pluginId}`,
      icon: PluginIcon,
      id: 'firebase-credentials-page',
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: 'Credentials',
      },
      Component: async () => {
        const component = await import(/* webpackChunkName: "firebase-auth-settings-page" */ './pages/App');

        return component;
      },
      permissions: pluginPermissions,
    }]);
    const plugin = {
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    };

    app.registerPlugin(plugin);
  },

  bootstrap(app) {},
  async registerTrads(app) {
    const { locales } = app;

    const importedTrads = await Promise.all(
      locales.map(locale => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
