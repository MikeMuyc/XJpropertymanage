


export function addFeature(
    state: any,
    data: any,
) {
    state.clickFeatureList = state.clickFeatureList.concat(data);
}

export function saveFeature(
    state: any,
    data: any,
) {
    state.clickFeatureList = data;
}
