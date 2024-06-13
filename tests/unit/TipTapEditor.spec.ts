import { mount } from '@vue/test-utils';
import TipTapEditor  from '@/components/TipTapEditor.vue';

declare let global: any;

jest.mock('@tiptap/vue-3', () => ({
  Editor: jest.fn().mockImplementation(() => ({
    setOptions: jest.fn(),
    chain: jest.fn().mockReturnThis(),
    focus: jest.fn().mockReturnThis(),
    setFontWeight: jest.fn().mockReturnThis(),
    run: jest.fn(),
    state: {
      doc: {
        textBetween: jest.fn().mockReturnValue('Hello'),
        nodeAt: jest.fn().mockReturnValue({
          text: 'Hello', marks: [{ type: 'textStyle', attrs: { fontWeight: '80' } }] 
        }),
        content: {
          toJSON: jest.fn().mockReturnValue([{
            content: [
              { text: 'Hello', marks: [{ type: 'textStyle', attrs: { fontWeight: '80' } }] },
              { text: 'World' },
            ],
          }]),
        },
      },
      selection: { from: 1, to: 5 },
    },
    destroy: jest.fn(),
  })),
  EditorContent: {
    template: '<div></div>',
  },
}));

global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

describe('EditorComponent', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(TipTapEditor);
  });

  it('should render the editor content', () => {
    expect(wrapper.find('.editor__content').exists()).toBe(true);
  });

  it('should show slider when text is selected', async () => {
    wrapper.vm.editor.state.selection = { from: 0, to: 5 };
    wrapper.vm.editor.state.doc.textBetween.mockReturnValue('Hello');

    await wrapper.vm.onMouseUp();

    expect(wrapper.vm.showSlider).toBe(true);
    expect(wrapper.find('.editor__slider').exists()).toBe(true);
  });

  it('should hide slider when no text is selected', async () => {
    wrapper.vm.editor.state.selection = { from: 0, to: 0 };
    wrapper.vm.editor.state.doc.textBetween.mockReturnValue('');

    await wrapper.vm.onMouseUp();

    expect(wrapper.vm.showSlider).toBe(false);
    expect(wrapper.find('.editor__slider').exists()).toBe(false);
  });

  it('should update font weight on slider input', async () => {
    wrapper.vm.editor.state.selection = { from: 0, to: 5 };
    wrapper.vm.editor.state.doc.textBetween.mockReturnValue('Hello');

    await wrapper.vm.onMouseUp();

    const slider = wrapper.find('.editor__slider-input');
    await slider.setValue(50);

    expect(wrapper.vm.fontWeight).toBe('50');
    expect(wrapper.vm.editor.chain().focus().setFontWeight).toHaveBeenCalledWith('500');
  });

  it('should export text with correct font weights', async () => {
    wrapper.vm.exportText();

    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });
});
