import { pageTitle } from 'ember-page-title';
import Component from '@glimmer/component';
import { startViewTransition } from '@swiftwc/ui/client';
import { type Registry as Services, service } from '@ember/service';
import { on } from '@ember/modifier';
import { scheduleOnce } from '@ember/runloop';

interface S {
  Args: Record<string, never>;
}

export default class extends Component<S> {
  @service declare router: Services['router'];

  handleClick = async ({ target }: Event) => {
    if (!(target instanceof HTMLElement)) return;

    await startViewTransition(target, 'forwards', async () => {
      await this.router.transitionTo('about');

      const { promise, resolve } = Promise.withResolvers<void>();

      // eslint-disable-next-line
      scheduleOnce('afterRender', resolve);

      await promise;
    });
  };

  <template>
    {{pageTitle "EmberApp"}}

    <v-keyboard system-font="Inter"></v-keyboard>

    <navigation-stack>
      <scroll-view>
        <v-stack>
          <button
            is="borderless-button"
            type="button"
            tabindex="0"
            {{on "click" this.handleClick}}
          >
            <label-view
              title="Say hello"
              system-image="hand-waving"
            ></label-view>
          </button>
        </v-stack>
      </scroll-view>

      {{outlet}}
    </navigation-stack>
  </template>
}
