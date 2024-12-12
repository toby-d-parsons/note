console.log("Hello Toby!");

// console.log(document.getElementById("testing"));

function testFunction() {
    console.log("event listener works, woohoo!");
    MarkdownRenderer.render(page.content)
}

document.getElementById("testing").addEventListener("click", testFunction);