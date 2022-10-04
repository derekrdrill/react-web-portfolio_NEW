import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { shallow } from 'enzyme';

import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import {
  FormInput,
  StyledSelect,
  StyledSelectLabel,
  StyledTextField,
} from '../components/FormInput';

import { getMaxRows, getMinRows, getTextFieldType, getVariant } from '../components/FormInput';

configure({ adapter: new Adapter() });

const renderer = new ShallowRenderer();

describe('FormInput tests', () => {
  let realUseContext;
  let useContextMock;

  beforeEach(() => {
    realUseContext = React.useContext;
    useContextMock = React.useContext = jest.fn();
  });

  afterEach(() => {
    React.useContext = realUseContext;
  });

  it('renders correctly', () => {
    useContextMock.mockReturnValue({ darkMode: true });

    renderer.render(
      <FormInput
        form={{ firstName: '', lastName: '', email: '', phone: '' }}
        input={{
          id: 'firstName',
          label: 'First Name',
          xs: 12,
        }}
        setForm={jest.fn()}
        value='firstName'
      />,
    );
    const result = renderer.getRenderOutput();
    expect(result).toMatchSnapshot();
  });

  it('renders FormInput as select', () => {
    useContextMock.mockReturnValue({ darkMode: true });

    const formInput = shallow(
      <FormInput
        form={{ fullOrPart: '' }}
        input={{
          id: 'fullOrPart',
          label: 'Full or part time?',
          select: true,
          selectOptions: [
            {
              id: 1,
              value: 'Full time',
            },
            {
              id: 2,
              value: 'Part time',
            },
          ],
          xs: 12,
          sm: 6,
          md: 6,
        }}
        setForm={jest.fn()}
        value='fullOrPart'
      />,
    );

    expect(formInput.exists('.select')).toEqual(true);
    expect(formInput.exists('.text')).toEqual(false);
  });

  it('renders FormInput as text', () => {
    useContextMock.mockReturnValue({ darkMode: true });

    const formInput = shallow(
      <FormInput
        form={{ fullOrPart: '' }}
        input={{
          id: 'firstName',
          label: 'First Name',
          xs: 12,
          sm: 6,
          md: 6,
        }}
        setForm={jest.fn()}
        value='firstName'
      />,
    );

    expect(formInput.exists('.text')).toEqual(true);
    expect(formInput.exists('.select')).toEqual(false);
  });

  it('renders StyledSelect styled component correctly', () => {
    const styledSelect = shallow(<StyledSelect />);
    const styledSelectDark = shallow(<StyledSelect darkMode />);
    const styledSelectCustom = shallow(
      <StyledSelect
        inputbackgroundcolor='white'
        inputborderradius={10}
        inputpaddingbottom={5}
        inputfontfamily='Arial, Helvetica, sans-serif'
        labelfontfamily='Arial, Helvetica, sans-serif'
        labelcolor='black'
      />,
    );

    const styledSelectCustomDark = shallow(
      <StyledSelect
        darkMode
        inputbackgroundcolor='white'
        inputborderradius={10}
        inputpaddingbottom={5}
        inputfontfamily='Arial, Helvetica, sans-serif'
        labelfontfamily='Arial, Helvetica, sans-serif'
        labelcolor='black'
      />,
    );

    expect(styledSelect.props().className).toEqual('sc-hKMtZM dOZhYI');
    expect(styledSelectDark.props().className).toEqual('sc-hKMtZM eBAHZq');
    expect(styledSelectCustom.props().className).toEqual('sc-hKMtZM kkkIBR');
    expect(styledSelectCustomDark.props().className).toEqual('sc-hKMtZM ghrOEk');
  });

  it('renders StyledSelectLabel styled component correctly', () => {
    const styledSelectLabel = shallow(<StyledSelectLabel />);
    const styledSelectLabelDark = shallow(<StyledSelectLabel darkMode />);

    expect(styledSelectLabel.props().className).toEqual('sc-dkzDqf');
    expect(styledSelectLabelDark.props().className).toEqual('sc-dkzDqf bpCSpA');
  });

  it('renders StyledTextField styled component correctly', () => {
    const styledTextField = shallow(<StyledTextField />);
    const styledTextFieldDark = shallow(<StyledTextField darkMode />);
    const styledTextFieldCustom = shallow(
      <StyledTextField
        inputbackgroundcolor='white'
        inputborderradius={10}
        inputpaddingbottom={5}
        inputfontfamily='Arial, Helvetica, sans-serif'
        labelfontfamily='Arial, Helvetica, sans-serif'
        labelcolor='black'
      />,
    );

    const styledTextFieldCustomDark = shallow(
      <StyledTextField
        darkMode
        inputbackgroundcolor='white'
        inputborderradius={10}
        inputpaddingbottom={5}
        inputfontfamily='Arial, Helvetica, sans-serif'
        labelfontfamily='Arial, Helvetica, sans-serif'
        labelcolor='black'
      />,
    );

    expect(styledTextField.props().className).toEqual('sc-gsnTZi bIOuqm');
    expect(styledTextFieldDark.props().className).toEqual('sc-gsnTZi woZmH');
    expect(styledTextFieldCustom.props().className).toEqual('sc-gsnTZi hscKFL');
    expect(styledTextFieldCustomDark.props().className).toEqual('sc-gsnTZi dnKaVZ');
  });

  it('runs getVariant', () => {
    expect(getVariant(true, 'contained')).toEqual('filled');
    expect(getVariant(true, 'filled')).toEqual('filled');
    expect(getVariant(false, 'filled')).toEqual('filled');
    expect(getVariant(false, 'outlined')).toEqual('outlined');
  });

  it('runs getMinRows', () => {
    expect(getMinRows(5, true)).toEqual(5);
    expect(getMinRows(5, false)).toEqual(false);
  });

  it('runs getMaxRows', () => {
    expect(getMaxRows(5, true)).toEqual(5);
    expect(getMaxRows(5, false)).toEqual(false);
  });

  it('runs getTextFieldType', () => {
    expect(getTextFieldType(false, 'text')).toEqual('text');
    expect(getTextFieldType(false, 'password')).toEqual('text');
    expect(getTextFieldType(true, 'password')).toEqual('password');
  });
});
