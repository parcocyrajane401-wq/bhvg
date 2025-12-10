//rc/router/index.js 
import { route } from 'quasar/wrappers'
import { createRouter, createWebHistory, createWebHashHistory, createMemoryHistory} from 'vue-router'
import routes from'./routes'
import { useAuthStore } from 'stores/auth'

export default route(function ({store}) {
    const creatHistory = process.env.SERVER

    ?createMemoryHistory
    :(process.env.VUE_ROUTER_MODE === 'history'
    ?createWebHistory
    :createWebHashHistory)

    const Router = createRouter({
        scrollBehavior: () => ({ left: 0, top: 0}),
        routes,
        history:creatHistory(process.env.VUE_ROUTER_BASE)
    })

    Router.beforeEach(async (to, from, next) => {
        const authStore = useAuthStore()

        if(authStore.user === null) {
            await authStore.fetchUser()

        }

        const isLoggedIn = !!authStore.user
        if(to.meta.requiresAuth && !isLoggedIn) {

            return next('/')
        }

        next()
    })

    return Router

})
    
