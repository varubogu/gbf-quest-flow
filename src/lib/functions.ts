function setTitle(title: string) {
    const titleBase = "グラブル行動表";
    let newTitle;
    if (title) {
        newTitle = `${titleBase} - ${title}`;
    } else {
        newTitle = titleBase;
    }
    document.title = newTitle;
}

export { setTitle };
