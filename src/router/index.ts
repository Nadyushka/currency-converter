import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import {CurrenciesConverter, CurrenciesMain} from "@/pages";
import {routesData} from "@/router/routes";



const routes: Array<RouteRecordRaw> = [
    {
        path: routesData.MAIN_PAGE.path,
        name:  routesData.MAIN_PAGE.name,
        components: {
            default: CurrenciesMain,
        },
    },
    {
        path: routesData.CONVERTER_PAGE.path,
        name: routesData.CONVERTER_PAGE.name,
        components: {
            default: CurrenciesConverter,
        },
    },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})
