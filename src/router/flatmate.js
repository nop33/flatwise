import FlatmateAdd from '../views/FlatmateAdd.vue'
import FlatmateEdit from '../views/FlatmateEdit.vue'
import FlatmateItems from '../views/FlatmateItems.vue'
import FlatmateMoveOut from '../views/FlatmateMoveOut.vue'
import FlatmateMoveIn from '../views/FlatmateMoveIn.vue'

export default [
  { path: '/flat/:flatId/flatmate/new', name: 'Flatmate Add', props: true, component: FlatmateAdd },
  { path: '/flat/:flatId/flatmate/:flatmateId/edit', name: 'Flatmate Edit', props: true, component: FlatmateEdit },
  { path: '/flat/:flatId/flatmate/:flatmateId/items', name: 'Flatmate Items', props: true, component: FlatmateItems },
  { path: '/flat/:flatId/flatmate/:flatmateId/moveOut', name: 'Flatmate Move Out', props: true, component: FlatmateMoveOut },
  { path: '/flat/:flatId/flatmate/:flatmateId/moveIn', name: 'Flatmate Move In', props: true, component: FlatmateMoveIn }
]
