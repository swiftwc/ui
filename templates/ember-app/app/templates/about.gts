import { pageTitle } from 'ember-page-title';
import { startViewTransition } from '@swiftwc/ui/client';
import { type Registry as Services, service } from '@ember/service';
import { on } from '@ember/modifier';
import Component from '@glimmer/component';

const greetings = [
  'Hello',
  'Hola',
  'Bonjour',
  'Ciao',
  'Γειά σου',
  'こんにちは',
];
let next = 0;

interface S {
  Args: Record<string, never>;
}

export default class extends Component<S> {
  @service declare router: Services['router'];

  greeting = greetings[next++ % greetings.length];

  handleClick = async ({ target }: Event) => {
    if (!(target instanceof HTMLElement)) return;

    await startViewTransition(target, 'backwards', async () => {
      await this.router.transitionTo('/');
    });
  };

  <template>
    {{pageTitle "About"}}

    <content-view>
      <scroll-view>
        <v-stack>
          <label-view
            title={{this.greeting}}
            font="title"
            class="font-semibold"
          ></label-view>
        </v-stack>
      </scroll-view>
      {{outlet}}
      <tool-bar>
        <tool-bar-item slot="top-bar-leading">
          <button
            type="button"
            tabindex="0"
            help="Back"
            {{on "click" this.handleClick}}
          >
            <label-view system-image="caret-left"></label-view>
          </button>
        </tool-bar-item>
      </tool-bar>
    </content-view>
  </template>
}
