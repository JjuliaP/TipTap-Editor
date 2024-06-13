<template>
  <div class="editor">
    <editor-content
      :editor="editor"
      v-model="content"
      class="editor__content"
    />

    <div class="editor__slider" v-if="showSlider">
      <label for="editor__slider-input" class="editor__slider-label"
        >Font Weight:
        <span>{{ fontWeight }}</span>
      </label>
      <input
        type="range"
        id="editor__slider-input"
        class="editor__slider-input"
        min="1"
        max="100"
        v-model="fontWeight"
        @input="updatefontWeight()"
        ref="sliderInput"
      />
    </div>

    <button class="editor__button" @click="exportText">
      <span class="editor__button-label">Export Text</span>
      <span class="editor__button-icon">⬇️</span>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import { Range } from "@tiptap/core";
import { FontWeight } from "@/FontWeightExtension";

const editor = ref<Editor | null>(null);
const content = ref<string | null>(null);
const showSlider = ref<boolean>(false);
const fontWeight = ref<number>(40);
const selectedRange = ref<Range | null>(null);

const fontWeightDefault = 40;
const sliderInput = ref(null);

onMounted(() => {
  editor.value = new Editor({
    content: `Hello World`,
    extensions: [TextStyle, StarterKit, FontWeight],
    onSelectionUpdate({ editor }) {
      const { state } = editor;
      const { from, to, empty } = editor.state.selection;
      const text = state.doc.textBetween(from, to, " ");

      if (empty) {
        showSlider.value = false;
      }

      if (text) {
        showSlider.value = true;
        onMouseUp();
      }
    },
    onBlur({ editor, event }) {
      const { empty } = editor.state.selection;

      if (!empty && sliderInput.value !== event.relatedTarget) {
        showSlider.value = false;
        editor.commands.setTextSelection(0);
      }
    },
  });
});

const onMouseUp = () => {
  if (editor.value) {
    const { state } = editor.value;
    const { from, to } = state.selection;
    const selectedText = state.doc.textBetween(from, to).trim();

    if (selectedText) {
      showSlider.value = true;
      selectedRange.value = { from, to };

      let node = state.doc.nodeAt(from);
      let weight = fontWeightDefault;

      if (node && node.marks) {
        const fontWeightMark = node.marks.find(
          (mark) => mark.type.name === "textStyle" && mark.attrs.fontWeight
        );
        if (fontWeightMark) {
          weight = parseInt(fontWeightMark.attrs.fontWeight) / 10;
        }
      }
      fontWeight.value = weight;
    } else {
      showSlider.value = false;
      selectedRange.value = null;
    }
  }
};

const updatefontWeight = () => {
  if (editor.value && selectedRange.value) {
    editor.value
      .chain()
      .focus()
      .setFontWeight((fontWeight.value * 10).toString())
      .run();
  }
};

const exportText = () => {
  if (editor.value) {
    const result: { [key: string]: string } = {};

    editor.value.state.doc.content.toJSON().forEach((element) => {
      if(element.content){
        element.content.forEach((node: any) => {
        if (node.marks) {
          const fontWeightMark = node.marks.find(
            (mark: any) => mark.type === "textStyle" && mark.attrs.fontWeight
          );
          if (fontWeightMark) {
            result[node.text.trim()] = (
              fontWeightMark.attrs.fontWeight / 10
            ).toString();
          }
        } else if (node.text) {
          result[node.text.trim()] = fontWeightDefault.toString();
        }
      });
      }
      
    });
    download(JSON.stringify(result), "json.txt", "text/plain");
  }
};

function download(
  content: string,
  fileName: string,
  contentType = "text/plain"
): void {
  var a = document.createElement("a");
  var file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

$color-gradient-primary: #ff6ec4;
$color-gradient-secondary: #7873f5;
$color-border: #ccc;
$color-font: #fff;

@function toRem($value) {
  $remValue: calc($value / 16) + rem;
  @return $remValue;
}

.tiptap p {
  margin: 0;
}

body {
  font-family: "Poppins", sans-serif;
}

.editor {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.editor__content > div {
  width: toRem(500);
  height: toRem(400);
  border: 1px solid $color-border;
  padding: toRem(10) toRem(10);
  box-sizing: border-box;
  overflow-y: auto;
}

.editor__button {
  display: flex;
  gap: 8px;
  margin: toRem(20) auto 0 auto;
  align-items: center;
  padding: toRem(10) toRem(20);
  border: 2px solid;
  font-size: toRem(16);
  border-radius: 30px;
  font-weight: bold;
  text-transform: uppercase;
  color: $color-font;
  cursor: pointer;
  background: linear-gradient(
    145deg,
    $color-gradient-primary,
    $color-gradient-secondary
  );

  &:hover {
    background: linear-gradient(
      145deg,
      $color-gradient-secondary,
      $color-gradient-primary
    );
  }
}

.editor__slider {
  margin-top: toRem(20);
  width: toRem(500);
  text-align: center;
  color: $color-font;

  &-label {
    color: black;
  }

  &-input {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: toRem(12);
    border-radius: 6px;
    background: linear-gradient(
      145deg,
      $color-gradient-primary,
      $color-gradient-secondary
    );
    outline: none;
    opacity: 0.7;
    transition: opacity 0.2s;
    margin-top: toRem(10);

    &:hover {
      opacity: 1;
    }

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: toRem(25);
      height: toRem(25);
      border-radius: 50%;
      background: $color-font;
      cursor: pointer;
      box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.5);
    }

    &::-moz-range-thumb {
      width: toRem(25);
      height: toRem(25);
      border-radius: 50%;
      background: $color-font;
      cursor: pointer;
      box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.5);
    }
  }
}
</style>
