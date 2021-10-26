import FlatAdd from '../views/FlatAdd.vue'
import Flat from '../views/Flat.vue'
import FlatEdit from '../views/FlatEdit.vue'
import Balances from '../views/Balances.vue'

export default [
  { path: '/flat/new', name: 'Flat Add', component: FlatAdd },
  { path: '/flat/:flatId', name: 'Flat', props: true, component: Flat },
  {
    path: '/flat/:flatId/edit',
    name: 'Flat Edit',
    props: true,
    component: FlatEdit
  },
  {
    path: '/flat/:flatId/balances',
    name: 'Balances',
    props: true,
    component: Balances
  }
]
