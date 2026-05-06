import type * as Components from '../components'

export type NavigationHost = Components.BodyView | Components.SheetView | Components.NavigationStack | Components.NavigationSplitView

export type NavigationToolbarConfiguration = Components.ToolBarItem | Components.ToolBarItemGroup

export type NavigationPage = Components.SidebarView | Components.ScrollView // this is a body wrapper!
