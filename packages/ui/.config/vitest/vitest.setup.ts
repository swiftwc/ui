import 'virtual:swiftwc-css' //import './generated/css/index.css'
import { vi } from 'vitest'

// import 'element-internals-polyfill'

vi.spyOn(console, 'debug').mockImplementation(() => {})
