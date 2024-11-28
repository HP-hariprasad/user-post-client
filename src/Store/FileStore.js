import { reactive } from 'vue'

export const FileStore = reactive({
  files: [],
  modalVisible : false,
  nestedModalVisible: false
})