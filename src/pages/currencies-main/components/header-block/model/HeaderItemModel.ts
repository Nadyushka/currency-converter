/**
 * Модель описывающая элемент меню хедера
 */

export class HeaderItemModel {
    /** Заголовок */
    Title: string
    /** Путь */
    Path: string
    /** Имя страницы */
    Name: string

    constructor(obj: Partial<HeaderItemModel>) {
        Object.assign(this, obj)
    }
}
