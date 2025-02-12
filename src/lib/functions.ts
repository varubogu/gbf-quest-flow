import useFlowStore from "@/stores/flowStore";

export function setTitle(title: string) {
    const titleBase = "グラブル行動表";
    let newTitle;
    if (title) {
        newTitle = `${titleBase} - ${title}`;
    } else {
        newTitle = titleBase;
    }
    document.title = newTitle;
}


export async function loadSlugData(slug: string) {
    const res = await fetch(`/content/flows/${slug}.json`);
    const data = await res.json();
    console.log(data);

    useFlowStore.getState().setFlowData(data);
}
