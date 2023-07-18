import { defineComponent, inject, h } from 'vue';
import { Router, routerKey } from '../types/index';

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
    const clickHandle = () => {
      router.push(props.to);
    };
    const children = slots.default && slots.default();
    return () => {
      return h(
        'a',
        {
          onClick: clickHandle,
          style: { cursor: 'pointer' }
        },
        children
      );
    };
  }
});
