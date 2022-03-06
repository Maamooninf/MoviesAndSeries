interface Movie{
    id:string,
    _id:string,
    title: string,
    desc: string,
    img: string,
    imgTitle: string,
    imgSm: string,
    trailer: string,
    video: string,
    year: string,
    limit: number,
    genre: string,
    isSeries: boolean,
    likes:Array<string>,
    comments:Array<string>

}
export {Movie}