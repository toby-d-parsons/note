import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  // Define the targets for Stimulus
  static targets = ["editable", "hidden"];

  connect() {
    console.log("Content Controller Connected");
  }

  // Sync contenteditable div's value with the hidden field
  syncContent() {
    // this.editableTarget references the contenteditable div
    const content = this.editableTarget.innerHTML;
    
    // this.hiddenTarget references the hidden field
    this.hiddenTarget.value = content;
  }
}