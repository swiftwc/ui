export default function (el: Element, ranks: [string, number][]) {
  for (const [selector, rank] of ranks) if (el.matches(selector)) return rank

  return 99 // default if no match

  // return el.matches('navigation-split-view:has(>[is=sidebar-view]) > body-view > scroll-view')
  //   ? 1
  //   : el.matches('navigation-split-view > scroll-view, navigation-split-view:has(>[is=sidebar-view]) > [is=sidebar-view] > scroll-view')
  //     ? 2
  //     : 99

  // .sort((el) =>
  //   el.matches(
  //     `navigation-split-view > scroll-view,navigation-split-view:has(>[is=sidebar-view]) > [is=sidebar-view] > scroll-view,navigation-split-view:has(>[is=sidebar-view]) > body-view > scroll-view`
  //   )
  //     ? -1
  //     : 1
  // )
}
