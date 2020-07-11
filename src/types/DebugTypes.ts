export type Menu = {
  title: string
  type?: number
  desc: string
}
export type ENV = {
  env: string
  name: string
}
export type SystemInfoItem = {
  name: string
  value: string | number
  type?: string
}
export type TransTypeItem = {
  type: number
  name: string
}
export type AddrInfo = {
  key: string,
  value: string,
  title: string,
  disabled: boolean
}
export type StorageModifyItem = {
  key: string
  value: string
  isModify: boolean
  ischecked: boolean
}