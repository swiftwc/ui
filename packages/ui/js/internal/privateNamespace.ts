import type * as Components from '../components'

/**
Node
 ├─ Host          (required) → the container of the node
 ├─ Body          (required) → main content of the node
 ├─ Navbar?       (optional) → navigation area
 └─ Slot?         (optional) → placeholder for another branch/subtree
      └─ Child Node(s)
======================================================================
Root Node
 ├─ Host
 │   ├─ Navbar?
 │   ├─ Body
 │   └─ Slot
 │       ├─ Child Node 1
 │       │   ├─ Host
 │       │   ├─ Body
 │       │   └─ Slot
 │       │       └─ Grandchild Node
 │       └─ Child Node 2
 │           ├─ Host
 │           ├─ Body
 │           └─ Slot (empty)
 */
export type NavigationViewController = Components.NavigationStack | Components.NavigationSplitView

export type NavigationHost = Components.BodyView | Components.SheetView | Components.NavigationStack | Components.NavigationSplitView

export type NavigationToolbarConfiguration = Components.ToolBarItem | Components.ToolBarItemGroup

export type NavigationPage = Components.SidebarView | Components.ScrollView // this is a body wrapper!

export type NavigationItem = {
  host?: NavigationHost
  page?: NavigationPage // slot of body or sidebar
  body?: Components.ScrollView // this is what actually gets animated
  toolBarConfig?: Array<NavigationToolbarConfiguration>
  slot?: NavigationHost
}
