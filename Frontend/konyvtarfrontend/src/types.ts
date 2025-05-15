export interface Book extends CreateBook {
    id: number,

}
export interface CreateBook  {
    title: string,
    author: string,
    publish_year: number,
    page_count: number,
}