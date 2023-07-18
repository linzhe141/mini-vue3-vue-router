import type { App, Component } from 'vue';
export type Route = {
  name: string;
  path: string;
  component: Component;
  children?: Route[];
};
export type Record = {
  name: string;
  path: string;
  component: Component;
  children: Record[];
};
export interface History {
  location: {
    value: string;
  };
  listen: (...args: any) => any;
  push: (to: string) => void;
}
export interface RouterOptions {
  history: History;
  routes: Route[];
}
export interface Router {
  install: (app: App) => any;
  push: (to: string) => void;
}
// export let routerKey = 'router' as const;
export const routerKey = 'router';
export const routeKey = 'route';

export type LocationValue = {
  value: string;
};
export type LocationPath = {
  path: string;
};

export type CurrentRoute = {
  path: string;
  matched: Record[];
};
