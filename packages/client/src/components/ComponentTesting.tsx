import './styles/ComponentTesting.scss'

import { Button, ButtonTypes } from './common/Button'
import { TextField, TextFieldStyles, Colors } from './common/TextField'
import { useState } from 'react'
import { IconTypes } from './common/Icon'

export const ComponentTesting = () => {
  let [input1, setInput1] = useState<string>('')
  let [input2, setInput2] = useState<string>('')
  let [input3, setInput3] = useState<string>('')
  let [input4, setInput4] = useState<string>('')

  return (
    <>
      <div>
        <div>BUTTONS</div>
        <Button
          type={ButtonTypes.elevated}
          text="Elevated"
          onClick={() => {}}
        />
        <Button type={ButtonTypes.filled} text="Filled" onClick={() => {}} />
        <Button type={ButtonTypes.tonal} text="Tonal" onClick={() => {}} />
        <Button
          type={ButtonTypes.outlined}
          text="Outlined"
          onClick={() => {}}
        />
        <Button type={ButtonTypes.text} text="Text" onClick={() => {}} />
        <Button
          type={ButtonTypes.text}
          text="Text"
          onClick={() => {}}
          disabled={true}
        />
      </div>
      <div>
        <div>INPUTS</div>
        <div className="field-container">
          <TextField
            id="input1"
            value={input1}
            inputStyle={TextFieldStyles.filled}
            onInput={setInput1}
            placeholder="input1"
          />
        </div>
        <div className="field-container">
          <TextField
            id="input2"
            value={input2}
            inputStyle={TextFieldStyles.outlined}
            onInput={setInput2}
            placeholder="input2"
          />
        </div>
        <div className="field-container">
          <TextField
            id="input3"
            value={input3}
            inputStyle={TextFieldStyles.outlined}
            icon={IconTypes.search}
            background={Colors.tintedSurface}
            onInput={setInput3}
            placeholder="input3"
          />
        </div>
        <div className="field-container ts">
          <TextField
            id="input4"
            value={input4}
            inputStyle={TextFieldStyles.outlined}
            onInput={setInput4}
            placeholder="input4"
          />
        </div>
      </div>
    </>
  )
}
