import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  container,
  header,
  aside,
  main,
  menu,
  submenu,
  menuItem,
  breadcrumb,
  breadcrumbItem,
  card,
  input,
  row,
  col,
  table,
  tableColumn,
  Switch,
  tooltip,
  pagination,
  Dialog,
  MessageBox
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message
Vue.use(container)
Vue.use(header)
Vue.use(aside)
Vue.use(main)
Vue.use(menu)
Vue.use(submenu)
Vue.use(menuItem)
Vue.use(breadcrumb)
Vue.use(breadcrumbItem)
Vue.use(card)
Vue.use(input)
Vue.use(row)
Vue.use(col)
Vue.use(table)
Vue.use(tableColumn)
Vue.use(Switch)
Vue.use(tooltip)
Vue.use(pagination)
Vue.use(Dialog)
Vue.prototype.$confirm = MessageBox.confirm
