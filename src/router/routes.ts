/** Роуты приложения */
export const routes = {
    MAIN_PAGE: '/',
    CONVERTER_PAGE: '/convert'
} as const;

/** Вся информация о роуте приложения */
export const routesData: Record<keyof Routes, RouteData> = {
    MAIN_PAGE: {
        title: 'Главная',
        name: 'main-page',
        path: routes.MAIN_PAGE
    },
    CONVERTER_PAGE: {
        title: 'Конвертация',
        name: 'convert-page',
        path: routes.CONVERTER_PAGE
    }
};

type Routes = typeof routes;

interface RouteData {
    title: string;
    name: string;
    path: string;
}
