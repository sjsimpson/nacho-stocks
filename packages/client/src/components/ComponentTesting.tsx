import { useState } from 'react'

import {
  Button,
  ButtonVariants,
  TextInput,
  TextInputVariants,
  IconVariants,
} from 'm3-react'

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
          type={ButtonVariants.ButtonStyles.elevated}
          text="Elevated"
          onClick={() => {}}
        />
        <Button
          type={ButtonVariants.ButtonStyles.filled}
          text="Filled"
          onClick={() => {}}
        />
        <Button
          type={ButtonVariants.ButtonStyles.tonal}
          text="Tonal"
          onClick={() => {}}
        />
        <Button
          type={ButtonVariants.ButtonStyles.outlined}
          text="Outlined"
          onClick={() => {}}
        />
        <Button
          type={ButtonVariants.ButtonStyles.text}
          text="Text"
          onClick={() => {}}
        />
        <Button
          type={ButtonVariants.ButtonStyles.text}
          text="Text"
          onClick={() => {}}
          disabled={true}
        />
      </div>
      <div>
        <div>INPUTS</div>
        <div className="field-container">
          <TextInput
            id="input1"
            value={input1}
            inputStyle={TextInputVariants.TextInputStyles.filled}
            background={TextInputVariants.TextInputColors.tintedSurface}
            onInput={setInput1}
            placeholder="input1"
          />
        </div>
        <div className="field-container">
          <TextInput
            id="input2"
            value={input2}
            inputStyle={TextInputVariants.TextInputStyles.outlined}
            background={TextInputVariants.TextInputColors.tintedSurface}
            onInput={setInput2}
            placeholder="input2"
          />
        </div>
        <div className="field-container">
          <TextInput
            id="input3"
            value={input3}
            inputStyle={TextInputVariants.TextInputStyles.outlined}
            icon={IconVariants.IconStyles.search}
            background={TextInputVariants.TextInputColors.tintedSurface}
            onInput={setInput3}
            placeholder="input3"
          />
        </div>
        <div className="field-container ts">
          <TextInput
            id="input4"
            value={input4}
            inputStyle={TextInputVariants.TextInputStyles.outlined}
            background={TextInputVariants.TextInputColors.tintedSurface}
            onInput={setInput4}
            placeholder="input4"
          />
        </div>
      </div>
    </>
  )
}
