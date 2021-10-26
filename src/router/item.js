import ItemAdd from '../views/ItemAdd.vue'
import Item from '../views/Item.vue'
import ItemEdit from '../views/ItemEdit.vue'

export default [
  {
    path: '/flat/:flatId/item/new',
    name: 'Item Add',
    props: true,
    component: ItemAdd
  },
  {
    path: '/flat/:flatId/item/:itemId',
    name: 'Item',
    props: true,
    component: Item
  },
  {
    path: '/flat/:flatId/item/:itemId/edit',
    name: 'Item Edit',
    props: true,
    component: ItemEdit
  }
]
