export default (title: string) => {
    const the = title.substring(title.length-3)
    return the + " " + title.substring(0, title.length-5);
}