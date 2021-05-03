
function defaultCompare(left, right){
    if(left < right)
        return -1;
    else if(left === right)
        return 0;
    else if(left > right)
        return 1;
}

function defaultEq(left, right) {
    return left === right;
}

//默认升序
function binary_search(array, element, compare = defaultCompare, eq = defaultEq) {
    let left = 0, right = array.length - 1;
    let mid;
    while (left <= right){
        mid = Math.floor((left + right) / 2);
        const result = compare(element, array[mid]);
        if(eq(element, array[mid]))
            return mid;
        if(result === -1){
            right = mid - 1;    
        }
        else if(result === 1){
            left = mid + 1;
        }
        else if(result === 0){
            return mid;
        }
    }
    return -1;
}

module.exports = binary_search;
