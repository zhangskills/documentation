import plugin from './firstPlugin'

export default ({
  router,
  Vue,
}) => {
  Vue.use(plugin)
  router.addRoutes([
    { path: '/errors', redirect: '/guides' },
    { path: '/errors/*', redirect: '/guides' },
  ])
}
