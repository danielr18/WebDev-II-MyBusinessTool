export default function (url) {
  return __DEV__ ? url : `/MyBusinessTool${url}`
}
