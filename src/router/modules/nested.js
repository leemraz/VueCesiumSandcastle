/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const nestedRouter = {
  path: '/nested',
  component: Layout,
  redirect: 'noRedirect',
  alwaysShow: true,
  name: 'Nested',
  breadcrumb: false,
  meta: {
    title: '官方示例',
    icon: 'nested'
  },
  children: [
    {
      path: 'beginner',
      component: () => import('@/views/nested/beginner/index'),
      name: 'beginner',
      redirect: 'noRedirect',
      meta: { title: 'Beginner' },
      children: [
        {
          path: 'arcgisMapServer',
          component: () => import('@/views/nested/beginner/arcgisMapServer'),
          name: 'ArcgisMapServer',
          meta: { title: 'ArcgisMapServer' }
        },
        {
          path: 'callbackProperty',
          component: () => import('@/views/nested/beginner/callbackProperty'),
          name: 'CallbackProperty属性回调',
          meta: { title: 'CallbackProperty' }
        },
        {
          path: 'billboards',
          component: () => import('@/views/nested/beginner/billboards'),
          name: 'billboards广告牌',
          meta: { title: 'Billboard' }
        }
      ]
    },
    {
      path: '3DTiles',
      component: () => import('@/views/nested/3DTiles/index'), // Parent router-view
      name: '3DTiles',
      redirect: 'noRedirect',
      meta: { title: '3D Tiles', breadcrumb: true },
      children: [
        {
          path: 'featurepicking',
          component: () => import('@/views/nested/3DTiles/featurepicking'),
          name: 'featurepicking',
          meta: { title: 'Feature Picking' }
        },
        {
          path: 'Inspector',
          component: () => import('@/views/nested/3DTiles/Inspector'),
          name: 'Inspector',
          meta: { title: '3D Tiles Inspector' }
        },
        {
          path: 'spaceerror',
          component: () => import('@/views/nested/3DTiles/spaceerror'),
          name: 'spaceerror',
          meta: { title: '3D Tiles spaceerror' }
        },
        {
          path: 'terrianClassification',
          component: () =>
            import('@/views/nested/3DTiles/terrianClassification'),
          name: 'terrianClassification',
          meta: { title: 'Terrain Classification' }
        },
        {
          path: 'sampleHeight',
          component: () => import('@/views/nested/3DTiles/sampleHeight'),
          name: 'sampleHeight',
          meta: { title: 'Sample Height' }
        },
        {
          path: 'adjustHeight',
          component: () => import('@/views/nested/3DTiles/adjustHeight'),
          name: 'adjustHeight',
          meta: { title: 'Adjust Height' }
        },
        {
          path: 'batchTableHierarchy',
          component: () => import('@/views/nested/3DTiles/batchTableHierarchy'),
          name: 'batchTableHierarchy',
          meta: { title: 'Batch Table Hierarchy' }
        },
        {
          path: 'featureStyling',
          component: () => import('@/views/nested/3DTiles/featureStyling'),
          name: 'featureStyling',
          meta: { title: 'Feature Styling' }
        },
        {
          path: 'clippingPlanes',
          component: () => import('@/views/nested/3DTiles/clippingPlanes'),
          name: 'clippingPlanes',
          meta: { title: 'Clipping Planes' }
        },
        {
          path: 'initerior',
          component: () => import('@/views/nested/3DTiles/interior'),
          name: 'initerior',
          meta: { title: 'Initerior' }
        },
        {
          path: 'clampTo3DTiles',
          component: () => import('@/views/nested/3DTiles/clampTo3DTiles'),
          name: 'clampTo3DTiles',
          meta: { title: 'Clamp To 3DTiles' }
        },
        {
          path: 'polylinesOn3DTiles',
          component: () => import('@/views/nested/3DTiles/polylinesOn3DTiles'),
          name: 'polylinesOn3DTiles',
          meta: { title: 'Polylines On 3D Tiles' }
        }
      ]
    },
    {
      path: 'dataSources',
      component: () => import('@/views/nested/dataSources/index'),
      name: 'dataSources',
      redirect: 'noRedirect',
      meta: { title: 'dataSources' },
      children: [
        {
          path: 'orderingDataSource',
          component: () =>
            import('@/views/nested/dataSources/orderingDataSource'),
          name: 'OrderingDataSource',
          meta: { title: 'OrderingDataSource' }
        }
      ]
    },
    {
      path: 'geometry',
      component: () => import('@/views/nested/geometry/index'),
      name: 'geometry',
      redirect: 'noRedirect',
      meta: { title: 'Geometry' },
      children: [
        {
          path: 'box',
          component: () => import('@/views/nested/geometry/box'),
          name: 'Box',
          meta: { title: 'Box' }
        },
        {
          path: 'circles',
          component: () => import('@/views/nested/geometry/circles'),
          name: 'Circles',
          meta: { title: 'Circles' }
        },
        {
          path: 'corridor',
          component: () => import('@/views/nested/geometry/corridor'),
          name: 'Corridor',
          meta: { title: 'Corridor' }
        }
      ]
    },
    {
      path: 'postprocess',
      component: () => import('@/views/nested/postprocess/index'),
      name: 'postprocess',
      redirect: 'noRedirect',
      meta: { title: 'Post Process' },
      children: [
        {
          path: 'ambientocclusion',
          component: () =>
            import('@/views/nested/postprocess/ambientocclusion'),
          name: 'AmbientOcclusion',
          meta: { title: 'AmbientOcclusion' }
        },
        {
          path: 'custompostprocess',
          component: () =>
            import('@/views/nested/postprocess/custompostprocess'),
          name: 'CustomPostProcess',
          meta: { title: 'CustomPostProcess' }
        },
        {
          path: 'pointcloudshading',
          component: () =>
            import('@/views/nested/postprocess/pointcloudshading'),
          name: 'pointcloudshading',
          meta: { title: 'pointcloudshading' }
        }
      ]
    }
  ]
}
export default nestedRouter
