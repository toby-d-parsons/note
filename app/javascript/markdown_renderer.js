function updateText(contentEle) {
    const converted = convertMarkdownToSpan(contentEle);
    contentEle.innerHTML = converted;
}

function convertMarkdownToSpan(contentEle) {
    const boldItalicRegex = /\*\*\*(.*?)\*\*\*/g;
    const boldRegex = /\*\*(.*?)\*\*/g;
    const italicRegex = /\*([^*><]+)\*/g;
    const spanRegex = /<\/?span[^>]*>/g;

    let textNoNewline = contentEle.innerHTML;

    convertedText = textNoNewline
        .replace(spanRegex, "") // Removes spans to then rerun the below, keeps divs to go into innerHTML
        .replace(boldItalicRegex, (match, p1) => {
            return `<span class="mc bold italic"><span class="mc bold italic start">***</span>${p1}<span class="mc bold italic end">***</span></span>`;
    })
        .replace(boldRegex, (match, p1) => {
               return `<span class="mc bold"><span class="mc bold start">**</span>${p1}<span class="mc bold end">**</span></span>`;
    });
       .replace(italicRegex, (match, p1) => {
           return `<span class="mc italic"><span class="mc italic start">*</span>${p1}<span class="mc italic end">*</span></span>`;
   });
    return convertedText;
}

function getPos(contentEle) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const clonedRange = range.cloneRange();
    clonedRange.selectNodeContents(contentEle);
    clonedRange.setEnd(range.endContainer, range.endOffset);
    // currentPosEle.innerHTML = clonedRange.toString().length;
    return clonedRange.toString().length;
}

function setPosition(targetPosition, contentEle) {
    const range = createRange(contentEle, targetPosition);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
};

function createRange(node, targetPosition) {
    let range = document.createRange();
    range.selectNode(node);
    range.setStart(node, 0);

    let pos = 0;
    const stack = [node];
    while (stack.length > 0) {
        const current = stack.pop();

        if (current.nodeType === Node.TEXT_NODE) {
            const len = current.textContent.length;
            if (pos + len >= targetPosition) {
                range.setStart(current, targetPosition - pos); //
                range.setEnd(current, targetPosition - pos);
                return range;
            }
            pos += len;
        } else if (current.childNodes && current.childNodes.length > 0) {
            for (let i = current.childNodes.length - 1; i >= 0; i--) {
                stack.push(current.childNodes[i]);
            }
        }
    }

    range.setEnd(node, node.childNodes.length);
    return range;
};

function moveCursorToNextLine(contentEle, selection) {
    const range = selection.getRangeAt(0);

    const newLine = document.createElement('div');
    range.insertNode(newLine);

    range.setStart(newLine, 0);
    range.setEnd(newLine, 0);

    selection.removeAllRanges();
    selection.addRange(range);
}

document.getElementById("content2").addEventListener("DOMContentLoaded", (e) => {
    const contentEle = document.getElementById('content2');
    updateText(contentEle);
});

document.getElementById("content2").addEventListener("input", (e) => {
    const contentEle = document.getElementById('content2');
    const selection = window.getSelection();
    let currentPos = getPos(contentEle);
    updateText(contentEle);
    setPosition(currentPos, contentEle);

    if (e.inputType === "insertParagraph") {
        moveCursorToNextLine(contentEle, selection);
    }
});