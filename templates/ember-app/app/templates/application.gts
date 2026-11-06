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

  handleClick = async (event: Event) => {
    await startViewTransition(event.target, 'forwards', async () => {
      await this.router.transitionTo('about');

      const { promise, resolve } = Promise.withResolvers<void>();

      // eslint-disable-next-line
      scheduleOnce('afterRender', resolve);

      await promise;
    });
  };

  <template>
    {{pageTitle "EmberApp"}}

    <v-keyboard></v-keyboard>

    <navigation-stack>
      <scroll-view>
        <v-stack>
          <button
            is="borderless-button"
            type="button"
            {{on "click" this.handleClick}}
          >About</button>
        </v-stack>
      </scroll-view>

      {{outlet}}
    </navigation-stack>
  </template>
}
