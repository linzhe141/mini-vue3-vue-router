import { defineComponent, inject, h, watch, ref } from 'vue';
import { Router, routerKey, CurrentRoute, routeKey } from '../types/index';

export const RouterLink = defineComponent({
  name: 'RouterLink',
  props: {
    to: {
      type: String,
      required: true
    }
  },
  setup(props, { slots }) {
    const router = inject(routerKey) as Router;
    const route = inject(routeKey) as CurrentRoute;

    const clickHandle = () => {
      router.push(props.to);
    };
    const children = slots.default && slots.default();
    const active = ref(false);
    watch(
      () => route.path,
      value => {
        active.value = value === props.to;
      },
      { immediate: true }
    );
    return () => {
      return h(
        'a',
        {
          onClick: clickHandle,
          style: { cursor: 'pointer', 'text-decoration': 'underline' },
          class: { 'router-link-exact-active': active.value }
        },
        children
      );
    };
  }
});
